import type { ReactNode } from "react";
import styles from "./PageHead.module.css";

/**
 * Đầu trang cho các trang con trong portal.
 *
 * Thay cho PageBand — dải đỏ kín chiều ngang trước đây. Màu đỏ của tập đoàn
 * đắt giá vì nó hiếm; dùng làm nền cho mọi tiêu đề thì trang nào cũng mở ra
 * giống hệt trang trước, và cái nhấn không còn là nhấn nữa.
 *
 * `crumbs` nhận vào chứ không tự dựng: mỗi trang có đường dẫn riêng, và thành
 * phần này không nên biết trang nó đang phục vụ là trang nào.
 */
export function PageHead({
  crumbs,
  eyebrow,
  title,
  lead,
}: {
  crumbs?: ReactNode;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <>
      {crumbs ? <div className={styles.crumbs}>{crumbs}</div> : null}
      <header className={styles.head}>
        <span className={styles.rule} aria-hidden="true" />
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </header>
    </>
  );
}
