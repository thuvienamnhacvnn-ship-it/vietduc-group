import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { can, getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { leads, programs, LEAD_STATES } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { deleteLead, updateLead } from "../actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const STATE_LABEL: Record<string, string> = {
  new: "mới",
  contacting: "đang liên hệ",
  qualified: "đã tư vấn",
  enrolled: "đã nhập học",
  closed: "đóng",
};

const GOAL_LABEL: Record<string, string> = {
  job: "đi làm sớm",
  upgrade: "nâng cao tay nghề",
  abroad: "học/làm tại Đức & EU",
  transfer: "liên thông",
  undecided: "chưa xác định",
};

const LEVEL_LABEL: Record<string, string> = {
  thcs: "tốt nghiệp THCS",
  thpt: "tốt nghiệp THPT",
  trung_cap: "đã có trung cấp",
  cao_dang: "đã có cao đẳng+",
  working: "đang đi làm",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ trang_thai?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/dang-nhap");
  if (!can(user.role, "leads.read")) redirect("/admin");

  const { trang_thai: filter } = await searchParams;
  const db = await getDb();

  const rows = await db
    .select({
      lead: leads,
      programTitle: programs.title,
      programSlug: programs.slug,
    })
    .from(leads)
    .leftJoin(programs, eq(programs.id, leads.programId))
    .orderBy(desc(leads.createdAt))
    .limit(200);

  const visible = filter ? rows.filter((row) => row.lead.state === filter) : rows;
  const editable = can(user.role, "leads.write");

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Đăng ký tư vấn</h1>
        <p>
          Thông tin do người học tự để lại kèm đồng ý chính sách bảo mật. Chỉ dùng cho mục đích tư
          vấn tuyển sinh; xoá khi người học yêu cầu hoặc sau 24 tháng kể từ lần liên hệ cuối.
        </p>
      </header>

      <nav className={styles.inlineForm} style={{ marginBottom: "var(--s-4)" }}>
        <Link href="/admin/leads" className={styles.buttonGhost}>
          Tất cả ({rows.length})
        </Link>
        {LEAD_STATES.map((state) => {
          const n = rows.filter((row) => row.lead.state === state).length;
          return (
            <Link
              key={state}
              href={`/admin/leads?trang_thai=${state}`}
              className={styles.buttonGhost}
            >
              {STATE_LABEL[state]} ({n})
            </Link>
          );
        })}
      </nav>

      <section className={styles.panel}>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã / thời gian</th>
                <th>Người đăng ký</th>
                <th>Liên hệ</th>
                <th>Nhu cầu</th>
                <th>Xử lý</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map(({ lead, programTitle, programSlug }) => (
                <tr key={lead.id}>
                  <td>
                    <strong>VDG-{lead.id}</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>
                      {formatDate(lead.createdAt, "vi")}
                      <br />
                      nguồn: {lead.source}
                      <br />
                      ngôn ngữ: {lead.locale}
                    </small>
                  </td>
                  <td>
                    <strong>{lead.fullName}</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>
                      {LEVEL_LABEL[lead.currentLevel ?? ""] ?? lead.currentLevel ?? "—"}
                    </small>
                  </td>
                  <td>
                    {lead.phone ? (
                      <>
                        <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>{lead.phone}</a>
                        <br />
                      </>
                    ) : null}
                    {lead.email ? (
                      <>
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        <br />
                      </>
                    ) : null}
                    {lead.whatsapp ? <small>WhatsApp: {lead.whatsapp}</small> : null}
                  </td>
                  <td style={{ maxWidth: "34ch" }}>
                    {programTitle ? (
                      <>
                        <a href={`/vi/chuong-trinh/${programSlug}`} target="_blank" rel="noreferrer">
                          {programTitle.vi}
                        </a>
                        <br />
                      </>
                    ) : null}
                    <small style={{ color: "var(--muted)" }}>
                      {[
                        lead.interestCategory,
                        GOAL_LABEL[lead.goal ?? ""] ?? lead.goal,
                        lead.preferredMode,
                        lead.startWindow,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                    {lead.question ? (
                      <p style={{ margin: "0.4rem 0 0", fontSize: "0.82rem" }}>“{lead.question}”</p>
                    ) : null}
                  </td>
                  <td>
                    {editable ? (
                      <form action={updateLead}>
                        <input type="hidden" name="id" value={lead.id} />
                        <select name="state" defaultValue={lead.state} className={styles.select}>
                          {LEAD_STATES.map((state) => (
                            <option key={state} value={state}>
                              {STATE_LABEL[state]}
                            </option>
                          ))}
                        </select>
                        <textarea
                          name="note"
                          defaultValue={lead.note ?? ""}
                          rows={2}
                          placeholder="ghi chú chăm sóc"
                          className={styles.textarea}
                          style={{ marginTop: "0.35rem", minWidth: "14rem" }}
                        />
                        <button
                          type="submit"
                          className={styles.buttonGhost}
                          style={{ marginTop: "0.35rem" }}
                        >
                          Lưu
                        </button>
                      </form>
                    ) : (
                      <span className={styles.tag}>{STATE_LABEL[lead.state]}</span>
                    )}
                  </td>
                  <td>
                    {editable ? (
                      <form action={deleteLead}>
                        <input type="hidden" name="id" value={lead.id} />
                        <button type="submit" className={styles.buttonDanger}>
                          Xoá
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!visible.length ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    Chưa có đăng ký nào.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
