import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { can, getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { conversations, messages, unanswered } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { truncate } from "@/lib/text";
import { describeAiConfig } from "@/lib/ai";
import { resolveQuestion } from "../actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const OUTCOME_LABEL: Record<string, string> = {
  answered: "đã trả lời",
  no_data: "không có dữ liệu",
  unavailable: "chưa bật AI",
  error: "lỗi",
  refused: "từ chối",
};

export default async function AdvisorAdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/dang-nhap");
  if (!can(user.role, "conversations.read")) redirect("/admin");

  const db = await getDb();

  const [openQuestions, recentConversations, recentMessages] = await Promise.all([
    db
      .select()
      .from(unanswered)
      .where(eq(unanswered.resolved, false))
      .orderBy(desc(unanswered.createdAt))
      .limit(60),
    db.select().from(conversations).orderBy(desc(conversations.lastAt)).limit(20),
    db.select().from(messages).orderBy(desc(messages.createdAt)).limit(120),
  ]);

  const ai = describeAiConfig();
  const byConversation = new Map<string, typeof recentMessages>();
  for (const message of recentMessages) {
    const list = byConversation.get(message.conversationId) ?? [];
    list.push(message);
    byConversation.set(message.conversationId, list);
  }

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Trợ lý AI</h1>
        <p>
          Trợ lý chỉ trả lời từ nội dung <strong>đã duyệt</strong> và luôn dẫn nguồn. Những câu hỏi
          không tìm được dữ liệu được liệt kê bên dưới – đó chính là danh sách nội dung còn thiếu.
        </p>
      </header>

      <section className={styles.panel}>
        <h2>Cấu hình hiện tại</h2>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td style={{ width: "38%" }}>Mô hình sinh câu trả lời</td>
              <td>{ai.chat ? `${ai.chat.provider} · ${ai.chat.model}` : "chưa cấu hình"}</td>
            </tr>
            <tr>
              <td>Embedding (vector)</td>
              <td>
                {ai.embeddings
                  ? `${ai.embeddings.provider} · ${ai.embeddings.model}`
                  : "chưa cấu hình – dùng truy xuất từ khoá"}
              </td>
            </tr>
            <tr>
              <td>Cách truy xuất</td>
              <td>{ai.retrieval}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.panel}>
        <h2>Câu hỏi trợ lý chưa trả lời được ({openQuestions.length})</h2>
        {!openQuestions.length ? (
          <p className={styles.empty}>Chưa có câu hỏi nào rơi vào trạng thái này.</p>
        ) : (
          <>
            <form
              action={resolveQuestion}
              style={{ marginBottom: "var(--s-4)" }}
            >
              <input
                type="hidden"
                name="ids"
                value={openQuestions.map((q) => q.id).join(",")}
              />
              <button type="submit" className={styles.buttonGhost}>
                Đánh dấu đã xử lý tất cả
              </button>
            </form>
            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Câu hỏi</th>
                    <th>Ngôn ngữ</th>
                    <th>Điểm khớp</th>
                    <th>Thời gian</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {openQuestions.map((question) => (
                    <tr key={question.id}>
                      <td style={{ maxWidth: "48ch" }}>{question.question}</td>
                      <td>{question.locale}</td>
                      <td>{question.topScore?.toFixed(2) ?? "—"}</td>
                      <td>{formatDate(question.createdAt, "vi")}</td>
                      <td>
                        <form action={resolveQuestion}>
                          <input type="hidden" name="ids" value={question.id} />
                          <button type="submit" className={styles.buttonGhost}>
                            Đã xử lý
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className={styles.panel}>
        <h2>Hội thoại gần đây</h2>
        {!recentConversations.length ? (
          <p className={styles.empty}>Chưa có hội thoại nào.</p>
        ) : (
          recentConversations.map((conversation) => {
            const turns = (byConversation.get(conversation.id) ?? []).slice().reverse();
            return (
              <details key={conversation.id} style={{ marginBottom: "var(--s-3)" }}>
                <summary style={{ cursor: "pointer", fontSize: "0.88rem" }}>
                  {formatDate(conversation.startedAt, "vi")} · {conversation.locale} ·{" "}
                  {turns.length} lượt
                </summary>
                <div style={{ padding: "var(--s-3) 0" }}>
                  {turns.map((message) => (
                    <p
                      key={message.id}
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.85rem",
                        color: message.role === "user" ? "var(--ink)" : "var(--muted)",
                      }}
                    >
                      <strong>{message.role === "user" ? "Người dùng" : "Trợ lý"}:</strong>{" "}
                      {truncate(message.content, 400)}
                      {message.outcome ? (
                        <span className={`${styles.tag} ${styles.tagNeutral}`} style={{ marginLeft: 6 }}>
                          {OUTCOME_LABEL[message.outcome] ?? message.outcome}
                        </span>
                      ) : null}
                    </p>
                  ))}
                  {!turns.length ? (
                    <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                      Không còn lưu nội dung của hội thoại này.
                    </p>
                  ) : null}
                </div>
              </details>
            );
          })
        )}
      </section>
    </>
  );
}
