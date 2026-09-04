import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { getSessionUser, can } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  contentBlocks,
  conversations,
  documents,
  kbChunks,
  leads,
  programs,
  schools,
  searchLog,
  unanswered,
} from "@/lib/db/schema";
import { describeAiConfig } from "@/lib/ai";
import { emailConfigured } from "@/lib/notify";
import { getSiteSettings } from "@/lib/settings";
import { SOCIAL_KEYS, socialHref } from "@/lib/site-config";
import { RebuildButton } from "./RebuildButton";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/dang-nhap");

  const db = await getDb();

  const [
    programRows,
    draftPrograms,
    schoolRows,
    leadRows,
    newLeads,
    documentRows,
    pendingBlocks,
    chunkRows,
    conversationRows,
    openQuestions,
    topPrograms,
    topSearches,
    settings,
  ] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(programs),
    db.select({ n: sql<number>`count(*)::int` }).from(programs).where(eq(programs.status, "draft")),
    db.select({ n: sql<number>`count(*)::int` }).from(schools),
    db.select({ n: sql<number>`count(*)::int` }).from(leads),
    db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.state, "new")),
    db.select({ n: sql<number>`count(*)::int` }).from(documents),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(contentBlocks)
      .where(eq(contentBlocks.status, "draft")),
    db.select({ n: sql<number>`count(*)::int` }).from(kbChunks),
    db.select({ n: sql<number>`count(*)::int` }).from(conversations),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(unanswered)
      .where(eq(unanswered.resolved, false)),
    db
      .select({ slug: programs.slug, title: programs.title, views: programs.views })
      .from(programs)
      .orderBy(desc(programs.views))
      .limit(8),
    db
      .select({
        query: searchLog.query,
        n: sql<number>`count(*)::int`,
        results: sql<number>`max(${searchLog.results})::int`,
      })
      .from(searchLog)
      .groupBy(searchLog.query)
      .orderBy(desc(sql`count(*)`))
      .limit(10),
    getSiteSettings(),
  ]);

  const ai = describeAiConfig();
  const configuredSocial = SOCIAL_KEYS.filter((key) => socialHref(key, settings.social[key] ?? ""));

  const cards = [
    { value: programRows[0]?.n ?? 0, label: "Ngành nghề đã đăng ký", href: "/admin/noi-dung" },
    { value: draftPrograms[0]?.n ?? 0, label: "Ngành ở trạng thái nháp", href: "/admin/noi-dung", alert: true },
    { value: schoolRows[0]?.n ?? 0, label: "Trường thành viên", href: "/admin/noi-dung" },
    { value: newLeads[0]?.n ?? 0, label: "Đăng ký chưa xử lý", href: "/admin/leads", alert: true },
    { value: leadRows[0]?.n ?? 0, label: "Tổng số đăng ký", href: "/admin/leads" },
    { value: pendingBlocks[0]?.n ?? 0, label: "Đoạn nội dung chờ duyệt", href: "/admin/tai-lieu", alert: true },
    { value: documentRows[0]?.n ?? 0, label: "Tài liệu nguồn", href: "/admin/tai-lieu" },
    { value: openQuestions[0]?.n ?? 0, label: "Câu hỏi AI chưa trả lời được", href: "/admin/tro-ly", alert: true },
  ];

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Tổng quan</h1>
        <p>
          Xin chào {user.name}. Đây là tình trạng nội dung, tuyển sinh và trợ lý AI của website.
        </p>
      </header>

      <div className={styles.cards}>
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`${styles.card} ${card.alert && card.value > 0 ? styles.cardAlert : ""}`}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <span className={styles.cardValue}>{card.value}</span>
            <span className={styles.cardLabel}>{card.label}</span>
          </Link>
        ))}
      </div>

      <section className={styles.panel}>
        <h2>Trợ lý AI &amp; Knowledge Base</h2>
        <div className={styles.fieldGrid}>
          <div>
            <p style={{ margin: 0, fontSize: "0.88rem" }}>
              <strong>Mô hình trả lời:</strong>{" "}
              {ai.chat ? `${ai.chat.provider} · ${ai.chat.model}` : "chưa cấu hình"}
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.88rem" }}>
              <strong>Embedding:</strong>{" "}
              {ai.embeddings
                ? `${ai.embeddings.provider} · ${ai.embeddings.model} (${ai.embeddings.dimensions}d)`
                : "chưa cấu hình"}
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.88rem" }}>
              <strong>Cách truy xuất:</strong> {ai.retrieval}
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.88rem" }}>
              <strong>Số đoạn trong Knowledge Base:</strong> {chunkRows[0]?.n ?? 0}
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.88rem" }}>
              <strong>Hội thoại đã ghi nhận:</strong> {conversationRows[0]?.n ?? 0}
            </p>
          </div>

          <div>
            {can(user.role, "kb.rebuild") ? <RebuildButton /> : null}
            <p style={{ marginTop: "var(--s-3)", fontSize: "0.8rem", color: "var(--muted)" }}>
              Cập nhật lại Knowledge Base sau khi duyệt nội dung mới. Trợ lý chỉ dùng nội dung ở
              trạng thái <em>đã duyệt</em>.
            </p>
          </div>
        </div>

        {!ai.chat ? (
          <div className={styles.note} style={{ marginTop: "var(--s-5)" }}>
            <strong>Trợ lý AI chưa được bật.</strong>
            Website vẫn tra cứu và trích dẫn tài liệu bằng bộ tìm kiếm nội bộ, nhưng chưa sinh câu
            trả lời. Đặt <code>AI_PROVIDER</code> và khoá API tương ứng trong biến môi trường máy
            chủ để bật (xem README).
          </div>
        ) : null}
      </section>

      <section className={styles.panel}>
        <h2>Trạng thái cấu hình</h2>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td style={{ width: "40%" }}>Liên kết mạng xã hội</td>
              <td>
                {configuredSocial.length ? (
                  <span className={`${styles.tag} ${styles.tagApproved}`}>
                    {configuredSocial.length} kênh đã cấu hình
                  </span>
                ) : (
                  <span className={`${styles.tag} ${styles.tagDraft}`}>
                    chưa có kênh nào – icon sẽ không hiển thị
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>Gửi email (xác nhận newsletter, báo lead mới)</td>
              <td>
                {emailConfigured() ? (
                  <span className={`${styles.tag} ${styles.tagApproved}`}>đã cấu hình</span>
                ) : (
                  <span className={`${styles.tag} ${styles.tagDraft}`}>chưa cấu hình</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Địa chỉ website công khai (dùng cho canonical, sitemap, QR)</td>
              <td>
                {settings.seo.siteUrl ? (
                  <span className={`${styles.tag} ${styles.tagApproved}`}>{settings.seo.siteUrl}</span>
                ) : (
                  <span className={`${styles.tag} ${styles.tagDraft}`}>chưa đặt</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className={styles.fieldGrid}>
        <section className={styles.panel}>
          <h2>Chương trình được xem nhiều</h2>
          {!topPrograms.some((p) => p.views > 0) ? (
            <p className={styles.empty}>Chưa có lượt xem nào được ghi nhận.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Chương trình</th>
                  <th style={{ textAlign: "end" }}>Lượt xem</th>
                </tr>
              </thead>
              <tbody>
                {topPrograms
                  .filter((p) => p.views > 0)
                  .map((program) => (
                    <tr key={program.slug}>
                      <td>{program.title.vi}</td>
                      <td style={{ textAlign: "end" }}>{program.views}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.panel}>
          <h2>Từ khoá được tìm nhiều</h2>
          {!topSearches.length ? (
            <p className={styles.empty}>Chưa có lượt tìm kiếm nào.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Từ khoá</th>
                  <th style={{ textAlign: "end" }}>Số lần</th>
                  <th style={{ textAlign: "end" }}>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {topSearches.map((row) => (
                  <tr key={row.query}>
                    <td>{row.query}</td>
                    <td style={{ textAlign: "end" }}>{row.n}</td>
                    <td style={{ textAlign: "end" }}>
                      {row.results === 0 ? (
                        <span className={`${styles.tag} ${styles.tagDraft}`}>0</span>
                      ) : (
                        row.results
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}
