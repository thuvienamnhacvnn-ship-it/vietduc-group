import { redirect } from "next/navigation";
import { asc, desc, eq, sql } from "drizzle-orm";
import { can, getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { contentBlocks, documents } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { truncate } from "@/lib/text";
import {
  deleteDocument,
  reviewAllBlocks,
  reviewBlock,
  setDocumentFlags,
} from "../actions";
import { UploadForm } from "./UploadForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const STATE_LABEL: Record<string, string> = {
  queued: "chờ xử lý",
  extracting: "đang bóc tách",
  ocr: "đang OCR",
  ready: "đã xử lý",
  failed: "lỗi",
};

const CATEGORY_LABEL: Record<string, string> = {
  organisation: "Giới thiệu tổ chức",
  program: "Chương trình đào tạo",
  course: "Khóa học",
  people: "Đội ngũ",
  partner: "Đối tác",
  certificate: "Chứng nhận / pháp lý",
  news: "Tin tức",
  activity: "Hoạt động",
  faq: "FAQ",
  policy: "Chính sách",
  download: "Tài liệu tải xuống",
  other: "Khác",
};

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/dang-nhap");
  if (!can(user.role, "content.read")) redirect("/admin");

  const { doc } = await searchParams;
  const db = await getDb();

  const docs = await db.select().from(documents).orderBy(asc(documents.slug));
  const blockCounts = await db
    .select({
      documentId: contentBlocks.documentId,
      status: contentBlocks.status,
      n: sql<number>`count(*)::int`,
    })
    .from(contentBlocks)
    .groupBy(contentBlocks.documentId, contentBlocks.status);

  const countFor = (id: number, status: string) =>
    blockCounts.find((row) => row.documentId === id && row.status === status)?.n ?? 0;

  const selectedId = doc ? Number(doc) : (docs.find((d) => countFor(d.id, "draft") > 0)?.id ?? null);
  const blocks = selectedId
    ? await db
        .select()
        .from(contentBlocks)
        .where(eq(contentBlocks.documentId, selectedId))
        .orderBy(asc(contentBlocks.pageNumber), desc(contentBlocks.id))
        .limit(120)
    : [];
  const selectedDoc = docs.find((d) => d.id === selectedId) ?? null;

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Tài liệu &amp; PDF</h1>
        <p>
          Tải lên hồ sơ PDF để hệ thống bóc tách chữ (OCR khi trang không có text layer), phân loại
          và tách thành từng đoạn nội dung. Mọi đoạn đều ở trạng thái <strong>nháp</strong> cho đến
          khi được duyệt; chỉ nội dung đã duyệt mới vào Knowledge Base của trợ lý.
        </p>
      </header>

      {can(user.role, "documents.upload") ? <UploadForm /> : null}

      <section className={styles.panel}>
        <h2>Tài liệu trong hệ thống</h2>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tài liệu</th>
                <th>Xử lý</th>
                <th>Trang</th>
                <th>Đoạn nội dung</th>
                <th>Trạng thái &amp; tải xuống</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {docs.map((document) => (
                <tr key={document.id}>
                  <td>
                    <strong>{document.title.vi}</strong>
                    <br />
                    <small style={{ color: "var(--muted)" }}>
                      {document.originalName} · {document.language.toUpperCase()}
                      {document.documentDate ? ` · ${formatDate(document.documentDate, "vi")}` : ""}
                    </small>
                    {document.processingError ? (
                      <>
                        <br />
                        <small style={{ color: "var(--danger)" }}>{document.processingError}</small>
                      </>
                    ) : null}
                  </td>
                  <td>
                    <span
                      className={`${styles.tag} ${
                        document.processingState === "ready"
                          ? styles.tagApproved
                          : document.processingState === "failed"
                            ? styles.tagRejected
                            : styles.tagDraft
                      }`}
                    >
                      {STATE_LABEL[document.processingState] ?? document.processingState}
                    </span>
                    {document.ocrUsed ? (
                      <>
                        <br />
                        <small style={{ color: "var(--gold-deep)" }}>đã dùng OCR</small>
                      </>
                    ) : null}
                  </td>
                  <td>{document.pageCount}</td>
                  <td>
                    <a href={`/admin/tai-lieu?doc=${document.id}`}>
                      {countFor(document.id, "draft")} nháp
                    </a>
                    <br />
                    <small style={{ color: "var(--muted)" }}>
                      {countFor(document.id, "approved")} duyệt ·{" "}
                      {countFor(document.id, "rejected")} từ chối
                    </small>
                  </td>
                  <td>
                    {can(user.role, "content.publish") ? (
                      <form action={setDocumentFlags} className={styles.inlineForm}>
                        <input type="hidden" name="id" value={document.id} />
                        <select name="status" defaultValue={document.status} className={styles.select}>
                          <option value="draft">nháp</option>
                          <option value="approved">đã duyệt</option>
                          <option value="archived">lưu trữ</option>
                        </select>
                        <label style={{ fontSize: "0.78rem" }}>
                          <input
                            type="checkbox"
                            name="downloadable"
                            defaultChecked={document.downloadable}
                          />{" "}
                          cho tải
                        </label>
                        <button type="submit" className={styles.buttonGhost}>
                          Lưu
                        </button>
                      </form>
                    ) : (
                      <span className={styles.tag}>{document.status}</span>
                    )}
                  </td>
                  <td>
                    {can(user.role, "documents.delete") ? (
                      <form action={deleteDocument}>
                        <input type="hidden" name="id" value={document.id} />
                        <button type="submit" className={styles.buttonDanger}>
                          Gỡ
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!docs.length ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    Chưa có tài liệu nào.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selectedDoc ? (
        <section className={styles.panel}>
          <h2>Duyệt nội dung: {selectedDoc.title.vi}</h2>

          {can(user.role, "content.publish") ? (
            <div className={styles.inlineForm} style={{ marginBottom: "var(--s-4)" }}>
              <form action={reviewAllBlocks} className={styles.inlineForm}>
                <input type="hidden" name="documentId" value={selectedDoc.id} />
                <input type="hidden" name="status" value="approved" />
                <button type="submit" className={styles.button}>
                  Duyệt tất cả đoạn nháp
                </button>
              </form>
              <form action={reviewAllBlocks} className={styles.inlineForm}>
                <input type="hidden" name="documentId" value={selectedDoc.id} />
                <input type="hidden" name="status" value="rejected" />
                <button type="submit" className={styles.buttonDanger}>
                  Từ chối tất cả đoạn nháp
                </button>
              </form>
            </div>
          ) : null}

          {blocks.some((block) => block.injectionFlag) ? (
            <div className={styles.note} style={{ marginBottom: "var(--s-4)" }}>
              <strong>Cảnh báo: có đoạn chứa câu lệnh giống chỉ thị cho AI.</strong>
              Những đoạn được đánh dấu bên dưới chứa văn bản trông như đang ra lệnh cho mô hình. Hệ
              thống không bao giờ coi nội dung PDF là chỉ thị, và các đoạn này bị loại khỏi Knowledge
              Base ngay cả khi được duyệt. Hãy kiểm tra kỹ nguồn tài liệu.
            </div>
          ) : null}

          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Trang</th>
                  <th>Phân loại</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.id}>
                    <td>{block.pageNumber ?? "—"}</td>
                    <td>
                      {CATEGORY_LABEL[block.category] ?? block.category}
                      {block.injectionFlag ? (
                        <>
                          <br />
                          <span className={`${styles.tag} ${styles.tagRejected}`}>nghi ngờ</span>
                        </>
                      ) : null}
                    </td>
                    <td style={{ maxWidth: "48ch" }}>
                      {block.heading ? (
                        <>
                          <strong>{block.heading}</strong>
                          <br />
                        </>
                      ) : null}
                      <span style={{ color: "var(--muted)" }}>{truncate(block.body, 320)}</span>
                    </td>
                    <td>
                      {can(user.role, "content.publish") ? (
                        <form action={reviewBlock} className={styles.inlineForm}>
                          <input type="hidden" name="id" value={block.id} />
                          <select name="status" defaultValue={block.status} className={styles.select}>
                            <option value="draft">nháp</option>
                            <option value="approved">duyệt</option>
                            <option value="rejected">từ chối</option>
                          </select>
                          <input
                            type="text"
                            name="assignedTo"
                            defaultValue={block.assignedTo ?? ""}
                            placeholder="gán vào, vd program:12"
                            className={styles.input}
                            style={{ width: "11rem" }}
                          />
                          <button type="submit" className={styles.buttonGhost}>
                            Lưu
                          </button>
                        </form>
                      ) : (
                        <span
                          className={`${styles.tag} ${
                            block.status === "approved"
                              ? styles.tagApproved
                              : block.status === "rejected"
                                ? styles.tagRejected
                                : styles.tagDraft
                          }`}
                        >
                          {block.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {!blocks.length ? (
                  <tr>
                    <td colSpan={4} className={styles.empty}>
                      Tài liệu này chưa có đoạn nội dung nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </>
  );
}
