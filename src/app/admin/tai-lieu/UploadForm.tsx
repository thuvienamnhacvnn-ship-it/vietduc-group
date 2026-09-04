"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

type Result = {
  ok?: boolean;
  pages?: number;
  blocks?: number;
  ocrUsed?: boolean;
  flagged?: number;
  error?: string;
};

const ERRORS: Record<string, string> = {
  no_file: "Chưa chọn tệp.",
  too_large: "Tệp vượt quá 40 MB.",
  not_a_pdf: "Tệp không phải PDF hợp lệ.",
  processing_failed: "Đã lưu tệp nhưng bóc tách thất bại. Xem cột lỗi trong bảng bên dưới.",
  unauthorised: "Bạn không có quyền tải tài liệu lên.",
};

/**
 * PDF upload. Reading a scanned document takes a while - roughly ten seconds a
 * page for OCR - so the form says so plainly instead of appearing to hang.
 */
export function UploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setBusy(true);
    try {
      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = (await response.json()) as Result;
      setResult(data);
      if (data.ok) {
        formRef.current?.reset();
        router.refresh();
      }
    } catch {
      setResult({ error: "processing_failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.panel}>
      <h2>Tải lên tài liệu PDF</h2>

      <form ref={formRef} onSubmit={submit}>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="doc-file">Tệp PDF (tối đa 40 MB)</label>
            <input
              id="doc-file"
              name="file"
              type="file"
              accept="application/pdf,.pdf"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="doc-title">Tên tài liệu</label>
            <input
              id="doc-title"
              name="title"
              type="text"
              maxLength={200}
              placeholder="vd. Hồ sơ năng lực 2026"
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="doc-language">Ngôn ngữ</label>
            <select id="doc-language" name="language" className={styles.select} defaultValue="vi">
              <option value="vi">Tiếng Việt</option>
              <option value="de">Tiếng Đức</option>
              <option value="en">Tiếng Anh</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="doc-date">Ngày trên tài liệu</label>
            <input
              id="doc-date"
              name="documentDate"
              type="text"
              placeholder="vd. 2023-09-14"
              maxLength={40}
              className={styles.input}
            />
            <small>Để trống nếu tài liệu không ghi ngày.</small>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.button} disabled={busy}>
            {busy ? "Đang bóc tách…" : "Tải lên và bóc tách"}
          </button>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", alignSelf: "center" }}>
            Trang không có text layer sẽ được OCR (tiếng Việt + Đức + Anh), mất khoảng 10 giây mỗi
            trang. Đừng đóng tab khi đang xử lý.
          </p>
        </div>
      </form>

      {result ? (
        <div
          className={styles.note}
          style={{ marginTop: "var(--s-4)" }}
          role="status"
        >
          {result.ok ? (
            <>
              <strong>Đã bóc tách xong.</strong>
              {result.pages} trang, {result.blocks} đoạn nội dung
              {result.ocrUsed ? " (có dùng OCR)" : ""}
              {result.flagged ? ` · ${result.flagged} đoạn bị đánh dấu nghi ngờ chỉ thị AI` : ""}. Tất
              cả đang ở trạng thái nháp – hãy duyệt bên dưới rồi cập nhật Knowledge Base.
            </>
          ) : (
            <>
              <strong>Không xử lý được.</strong>
              {ERRORS[result.error ?? ""] ?? "Đã có lỗi xảy ra."}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
