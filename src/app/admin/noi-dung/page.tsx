import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { can, getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  activities,
  faqs,
  pages,
  partners,
  posts,
  programs,
  schools,
} from "@/lib/db/schema";
import { levelLabel } from "@/lib/format";
import { truncate } from "@/lib/text";
import { setEditorNote, setStatus } from "../actions";
import { FieldEditor } from "./FieldEditor";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "program", label: "Ngành nghề" },
  { key: "school", label: "Trường" },
  { key: "page", label: "Trang tĩnh" },
  { key: "faq", label: "FAQ" },
  { key: "partner", label: "Đối tác" },
  { key: "activity", label: "Hoạt động" },
  { key: "post", label: "Bài viết" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function StatusForm({
  entity,
  id,
  status,
  disabled,
}: {
  entity: string;
  id: number;
  status: string;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <span
        className={`${styles.tag} ${
          status === "approved"
            ? styles.tagApproved
            : status === "rejected"
              ? styles.tagRejected
              : styles.tagDraft
        }`}
      >
        {status}
      </span>
    );
  }
  return (
    <form action={setStatus} className={styles.inlineForm}>
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className={styles.select}>
        <option value="draft">nháp</option>
        <option value="pending">chờ duyệt</option>
        <option value="approved">đã duyệt</option>
        <option value="rejected">từ chối</option>
        <option value="archived">lưu trữ</option>
      </select>
      <button type="submit" className={styles.buttonGhost}>
        Lưu
      </button>
    </form>
  );
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ loai?: string; sua?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/dang-nhap");
  if (!can(user.role, "content.read")) redirect("/admin");

  const { loai, sua } = await searchParams;
  const tab: TabKey = (TABS.find((t) => t.key === loai)?.key ?? "program") as TabKey;
  const canPublish = can(user.role, "content.publish");
  const canWrite = can(user.role, "content.write");

  const db = await getDb();

  const [programRows, schoolRows, pageRows, faqRows, partnerRows, activityRows, postRows] =
    await Promise.all([
      db.select().from(programs).orderBy(asc(programs.slug)),
      db.select().from(schools).orderBy(asc(schools.order)),
      db.select().from(pages).orderBy(asc(pages.slug)),
      db.select().from(faqs).orderBy(asc(faqs.order)),
      db.select().from(partners).orderBy(asc(partners.order)),
      db.select().from(activities).orderBy(asc(activities.order)),
      db.select().from(posts).orderBy(asc(posts.slug)),
    ]);

  const schoolName = new Map(schoolRows.map((s) => [s.id, s.shortName?.vi ?? s.name.vi]));
  const editing = sua ?? null;

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Nội dung</h1>
        <p>
          Chỉ nội dung ở trạng thái <strong>đã duyệt</strong> mới hiển thị trên website và mới được
          trợ lý AI sử dụng. Sau khi đổi trạng thái, hãy cập nhật lại Knowledge Base ở trang Tổng
          quan.
        </p>
      </header>

      <nav className={styles.inlineForm} style={{ marginBottom: "var(--s-4)" }}>
        {TABS.map((item) => (
          <a
            key={item.key}
            href={`/admin/noi-dung?loai=${item.key}`}
            className={item.key === tab ? styles.button : styles.buttonGhost}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {tab === "program" ? (
        <section className={styles.panel}>
          <h2>Ngành nghề ({programRows.length})</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Ngành có mã ngành/nghề là ngành đã trích từ giấy chứng nhận đăng ký hoạt động giáo dục
            nghề nghiệp. Ngành không có mã là định hướng đào tạo nêu trong hồ sơ – giữ ở trạng thái
            nháp cho đến khi trường bổ sung giấy phép.
          </p>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ngành</th>
                  <th>Trường</th>
                  <th>Trình độ</th>
                  <th>Mã · chỉ tiêu</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú biên tập</th>
                </tr>
              </thead>
              <tbody>
                {programRows.map((program) => (
                  <tr key={program.id}>
                    <td>
                      <strong>{program.title.vi}</strong>
                      <br />
                      <small style={{ color: "var(--muted)" }}>{program.slug}</small>
                      {canWrite ? (
                        <>
                          <br />
                          <a href={`/admin/noi-dung?loai=program&sua=${program.id}`}>sửa nội dung</a>
                        </>
                      ) : null}
                    </td>
                    <td>{program.schoolId ? schoolName.get(program.schoolId) : "—"}</td>
                    <td>{levelLabel(program.level, "vi")}</td>
                    <td>
                      {program.officialCode ? (
                        <>
                          {program.officialCode}
                          <br />
                          <small>{program.intakeQuota ?? "—"}/năm</small>
                        </>
                      ) : (
                        <span className={`${styles.tag} ${styles.tagDraft}`}>chưa có mã</span>
                      )}
                    </td>
                    <td>
                      <StatusForm
                        entity="program"
                        id={program.id}
                        status={program.status}
                        disabled={!canPublish}
                      />
                    </td>
                    <td style={{ maxWidth: "30ch" }}>
                      {canWrite ? (
                        <form action={setEditorNote}>
                          <input type="hidden" name="entity" value="program" />
                          <input type="hidden" name="id" value={program.id} />
                          <textarea
                            name="note"
                            rows={2}
                            defaultValue={program.editorNote ?? ""}
                            className={styles.textarea}
                          />
                          <button type="submit" className={styles.buttonGhost}>
                            Lưu ghi chú
                          </button>
                        </form>
                      ) : (
                        <small>{truncate(program.editorNote ?? "—", 160)}</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editing ? (
            <FieldEditor
              entity="program"
              id={Number(editing)}
              rows={(() => {
                const program = programRows.find((p) => p.id === Number(editing));
                if (!program) return [];
                return [
                  { field: "title", label: "Tên ngành", value: program.title },
                  { field: "overview", label: "Tổng quan", value: program.overview, long: true },
                  { field: "tuition", label: "Học phí", value: program.tuition },
                  { field: "intakeSchedule", label: "Lịch khai giảng", value: program.intakeSchedule },
                  { field: "certificate", label: "Chứng nhận", value: program.certificate },
                  { field: "durationLabel", label: "Thời lượng", value: program.durationLabel },
                ];
              })()}
            />
          ) : null}
        </section>
      ) : null}

      {tab === "school" ? (
        <section className={styles.panel}>
          <h2>Trường thành viên ({schoolRows.length})</h2>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Trường</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú biên tập</th>
                </tr>
              </thead>
              <tbody>
                {schoolRows.map((school) => (
                  <tr key={school.id}>
                    <td>
                      <strong>{school.name.vi}</strong>
                      <br />
                      <small style={{ color: "var(--muted)" }}>{school.slug}</small>
                      {canWrite ? (
                        <>
                          <br />
                          <a href={`/admin/noi-dung?loai=school&sua=${school.id}`}>sửa nội dung</a>
                        </>
                      ) : null}
                    </td>
                    <td style={{ maxWidth: "28ch" }}>
                      <small>{school.address ?? "—"}</small>
                    </td>
                    <td>
                      <StatusForm
                        entity="school"
                        id={school.id}
                        status={school.status}
                        disabled={!canPublish}
                      />
                    </td>
                    <td style={{ maxWidth: "34ch" }}>
                      {canWrite ? (
                        <form action={setEditorNote}>
                          <input type="hidden" name="entity" value="school" />
                          <input type="hidden" name="id" value={school.id} />
                          <textarea
                            name="note"
                            rows={3}
                            defaultValue={school.editorNote ?? ""}
                            className={styles.textarea}
                          />
                          <button type="submit" className={styles.buttonGhost}>
                            Lưu ghi chú
                          </button>
                        </form>
                      ) : (
                        <small>{truncate(school.editorNote ?? "—", 220)}</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editing ? (
            <FieldEditor
              entity="school"
              id={Number(editing)}
              rows={(() => {
                const school = schoolRows.find((s) => s.id === Number(editing));
                if (!school) return [];
                return [
                  { field: "name", label: "Tên trường", value: school.name },
                  { field: "shortName", label: "Tên rút gọn", value: school.shortName },
                  { field: "tagline", label: "Khẩu hiệu", value: school.tagline },
                  { field: "summary", label: "Giới thiệu", value: school.summary, long: true },
                ];
              })()}
            />
          ) : null}
        </section>
      ) : null}

      {tab === "page" ? (
        <SimpleList
          title="Trang tĩnh"
          entity="page"
          canPublish={canPublish}
          canWrite={canWrite}
          editing={editing}
          rows={pageRows.map((page) => ({
            id: page.id,
            primary: page.title.vi,
            secondary: page.slug,
            status: page.status,
            fields: [
              { field: "title", label: "Tiêu đề", value: page.title },
              { field: "body", label: "Nội dung (Markdown rút gọn)", value: page.body, long: true },
              { field: "seoDescription", label: "Mô tả SEO", value: page.seoDescription, long: true },
            ],
          }))}
        />
      ) : null}

      {tab === "faq" ? (
        <SimpleList
          title="Câu hỏi thường gặp"
          entity="faq"
          canPublish={canPublish}
          canWrite={canWrite}
          editing={editing}
          rows={faqRows.map((faq) => ({
            id: faq.id,
            primary: faq.question.vi,
            secondary: faq.topic,
            status: faq.status,
            fields: [
              { field: "question", label: "Câu hỏi", value: faq.question },
              { field: "answer", label: "Câu trả lời", value: faq.answer, long: true },
            ],
          }))}
        />
      ) : null}

      {tab === "partner" ? (
        <SimpleList
          title="Đối tác"
          entity="partner"
          canPublish={canPublish}
          canWrite={canWrite}
          editing={editing}
          rows={partnerRows.map((partner) => ({
            id: partner.id,
            primary: partner.name,
            secondary: [partner.country, partner.region].filter(Boolean).join(" · "),
            status: partner.status,
            fields: [{ field: "note", label: "Ghi chú", value: partner.note, long: true }],
          }))}
        />
      ) : null}

      {tab === "activity" ? (
        <SimpleList
          title="Hoạt động"
          entity="activity"
          canPublish={canPublish}
          canWrite={canWrite}
          editing={editing}
          rows={activityRows.map((activity) => ({
            id: activity.id,
            primary: activity.title.vi,
            secondary: activity.kind,
            status: activity.status,
            fields: [
              { field: "title", label: "Tiêu đề", value: activity.title },
              { field: "description", label: "Mô tả", value: activity.description, long: true },
            ],
          }))}
        />
      ) : null}

      {tab === "post" ? (
        <SimpleList
          title="Bài viết"
          entity="post"
          canPublish={canPublish}
          canWrite={canWrite}
          editing={editing}
          emptyHint="Chưa có bài viết nào. Website không hiển thị tin mẫu, vì vậy mục Tin tức sẽ trống cho tới khi có bài thật."
          rows={postRows.map((post) => ({
            id: post.id,
            primary: post.title.vi,
            secondary: post.slug,
            status: post.status,
            fields: [
              { field: "title", label: "Tiêu đề", value: post.title },
              { field: "excerpt", label: "Tóm tắt", value: post.excerpt, long: true },
              { field: "body", label: "Nội dung", value: post.body, long: true },
            ],
          }))}
        />
      ) : null}
    </>
  );
}

type SimpleRow = {
  id: number;
  primary: string;
  secondary?: string;
  status: string;
  fields: { field: string; label: string; value: unknown; long?: boolean }[];
};

function SimpleList({
  title,
  entity,
  rows,
  canPublish,
  canWrite,
  editing,
  emptyHint,
}: {
  title: string;
  entity: string;
  rows: SimpleRow[];
  canPublish: boolean;
  canWrite: boolean;
  editing: string | null;
  emptyHint?: string;
}) {
  const active = rows.find((row) => row.id === Number(editing));
  return (
    <section className={styles.panel}>
      <h2>
        {title} ({rows.length})
      </h2>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mục</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.primary}</strong>
                  {row.secondary ? (
                    <>
                      <br />
                      <small style={{ color: "var(--muted)" }}>{row.secondary}</small>
                    </>
                  ) : null}
                  {canWrite && row.fields.length ? (
                    <>
                      <br />
                      <a href={`/admin/noi-dung?loai=${entity}&sua=${row.id}`}>sửa nội dung</a>
                    </>
                  ) : null}
                </td>
                <td>
                  <StatusForm
                    entity={entity}
                    id={row.id}
                    status={row.status}
                    disabled={!canPublish}
                  />
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={2} className={styles.empty}>
                  {emptyHint ?? "Chưa có mục nào."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {active ? (
        <FieldEditor
          entity={entity}
          id={active.id}
          rows={active.fields as never}
        />
      ) : null}
    </section>
  );
}
