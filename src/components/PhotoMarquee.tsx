import Image from "next/image";
import styles from "./PhotoMarquee.module.css";

/**
 * Băng ảnh chạy ngang không dứt.
 *
 * Danh sách được dựng HAI LẦN liền nhau rồi kéo đúng một nửa chiều dài. Khi
 * nửa đầu vừa trôi hết khỏi màn hình thì nửa sau đang nằm đúng vị trí nửa đầu
 * lúc bắt đầu, nên vòng lặp khép kín mà mắt không thấy chỗ nối — không có cú
 * giật nào, và không cần một dòng JavaScript nào cả.
 *
 * Bản sao thứ hai bị ẩn khỏi trình đọc màn hình: về mặt nội dung nó không tồn
 * tại, nó chỉ là thủ thuật để vòng lặp liền mạch.
 */
export function PhotoMarquee({
  shots,
  alt,
  seconds = 70,
}: {
  shots: readonly string[];
  alt: string;
  /** Thời gian đi hết một vòng. Càng nhiều ảnh càng nên dài, không thì trôi vụt. */
  seconds?: number;
}) {
  if (!shots.length) return null;

  const row = (hidden: boolean) =>
    shots.map((src) => (
      <li key={(hidden ? "b-" : "a-") + src} aria-hidden={hidden || undefined}>
        <Image src={src} alt={hidden ? "" : alt} width={1400} height={1000} sizes="380px" />
      </li>
    ));

  return (
    <div className={styles.frame}>
      <ul className={styles.track} style={{ "--run": `${seconds}s` } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
