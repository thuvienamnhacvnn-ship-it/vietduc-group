import Image from "next/image";
import styles from "./PhotoWall.module.css";

export type Shot = { src: string; alt: string };

/**
 * Một mảng ảnh, xếp thành bức tường chứ không thành hàng ô vuông đều nhau.
 *
 * Tấm đầu chiếm bốn ô, những tấm sau mỗi tấm một ô. Lý do không cho tất cả bằng
 * nhau: một lưới ô đều tăm tắp thì mắt không biết nhìn vào đâu trước, và với
 * ảnh chụp sự kiện — nơi tấm nào cũng là người đứng thành hàng — lưới đều biến
 * cả mảng thành một tấm thảm. Cho một tấm to lên là có chỗ để mắt bám vào.
 *
 * Số ảnh nhận vào bao nhiêu cũng được, nhưng chỉ dựng `limit` tấm. Phần còn lại
 * không bị giấu đi im lặng: số ảnh còn lại được nói ra.
 */
export function PhotoWall({
  shots,
  limit = 9,
  moreLabel,
}: {
  shots: Shot[];
  limit?: number;
  /** Nhận số ảnh còn lại, trả về câu để hiện. Không truyền thì không hiện gì. */
  moreLabel?: (rest: number) => string;
}) {
  if (!shots.length) return null;
  const shown = shots.slice(0, limit);
  const rest = shots.length - shown.length;

  return (
    <div className={styles.wrap}>
      <ul className={styles.wall}>
        {shown.map((shot, i) => (
          <li
            key={shot.src}
            className={i === 0 ? styles.lead : undefined}
            data-reveal
            style={{ "--reveal-delay": `${Math.min(i, 6) * 70}ms` } as React.CSSProperties}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={1400}
              height={1050}
              sizes={i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
            />
          </li>
        ))}
      </ul>
      {rest > 0 && moreLabel ? <p className={styles.more}>{moreLabel(rest)}</p> : null}
    </div>
  );
}
