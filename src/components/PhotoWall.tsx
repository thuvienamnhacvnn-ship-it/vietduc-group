import Image from "next/image";
import styles from "./PhotoWall.module.css";

export type Shot = { src: string; alt: string };

/** Một ô trong bức tường: hoặc là ảnh, hoặc là ô trang trí lấp chỗ thừa. */
type O =
  | { loai: "anh"; shot: Shot; rong: 1 | 2 }
  | { loai: "lap"; rong: 1 | 2 | 3 };

/**
 * Nhịp các hàng, mỗi hàng đúng bốn cột.
 *
 * Lưới ô đều tăm tắp thì mắt không biết bám vào đâu, mà ảnh sự kiện thì tấm nào
 * cũng na ná nhau nên cả mảng thành một tấm thảm. Bốn nhịp này lặp lại làm mảng
 * ảnh có lên có xuống, trong khi các hàng vẫn thẳng lối vì hàng nào cũng cộng
 * đủ bốn cột.
 */
const NHIP: (1 | 2)[][] = [
  [2, 1, 1],
  [1, 1, 2],
  [2, 2],
  [1, 2, 1],
];

/**
 * Xếp ảnh vào các hàng, và lấp phần thừa của hàng cuối.
 *
 * Chỗ thừa là chuyện thường xuyên: số ảnh mỗi mục do kho ảnh quyết định, không
 * bao giờ vừa khít bốn cột. Bản trước để CSS tự xếp nên chỗ thừa thành một lỗ
 * hổng giữa lưới. Ở đây phép xếp tự biết còn thiếu mấy cột và trả về một ô
 * trang trí đúng bề rộng ấy — mảng ảnh luôn là một khối chữ nhật kín.
 */
function xepGach(shots: Shot[]): O[] {
  const ra: O[] = [];
  let i = 0;
  let hang = 0;

  while (i < shots.length) {
    const mau = NHIP[hang % NHIP.length];
    let daDung = 0;

    for (const rong of mau) {
      if (i >= shots.length) break;
      ra.push({ loai: "anh", shot: shots[i], rong });
      daDung += rong;
      i += 1;
    }

    const thua = 4 - daDung;
    if (thua > 0 && i >= shots.length) ra.push({ loai: "lap", rong: thua as 1 | 2 | 3 });
    hang += 1;
  }

  return ra;
}

/**
 * Một mảng ảnh, xếp thành bức tường chứ không thành hàng ô vuông đều nhau.
 *
 * Số ảnh nhận vào bao nhiêu cũng được, nhưng chỉ dựng `limit` tấm. Phần còn lại
 * không bị giấu đi im lặng: số ảnh còn lại được nói ra.
 */
export function PhotoWall({
  shots,
  limit = 9,
  moreLabel,
  chuLap,
}: {
  shots: Shot[];
  limit?: number;
  /** Nhận số ảnh còn lại, trả về câu để hiện. Không truyền thì không hiện gì. */
  moreLabel?: (rest: number) => string;
  /**
   * Chữ đặt vào ô lấp chỗ thừa.
   *
   * Không truyền thì ô ấy chỉ có hoa văn. Truyền một câu ngắn — tên mục, một
   * dòng trích — thì chỗ thừa thành chỗ nói được điều gì đó.
   */
  chuLap?: string;
}) {
  if (!shots.length) return null;
  const shown = shots.slice(0, limit);
  const rest = shots.length - shown.length;
  const o = xepGach(shown);

  return (
    <div className={styles.wrap}>
      <ul className={styles.wall}>
        {o.map((item, i) =>
          item.loai === "anh" ? (
            <li
              key={item.shot.src}
              className={item.rong === 2 ? styles.rong : undefined}
              data-reveal
              suppressHydrationWarning
              style={{ "--reveal-delay": `${Math.min(i, 6) * 70}ms` } as React.CSSProperties}
            >
              <Image
                src={item.shot.src}
                alt={item.shot.alt}
                width={1400}
                height={1050}
                sizes={item.rong === 2 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
              />
            </li>
          ) : (
            /*
             * Ô lấp: hoa văn, không phải ảnh.
             *
             * Nó không mang thông tin nên máy đọc màn hình bỏ qua. Việc của nó
             * là đóng kín hàng cuối, để mảng ảnh không kết thúc bằng một lỗ
             * hổng — thứ mà người xem đọc ra là "trang bị lỗi", không phải "hết
             * ảnh rồi".
             */
            <li
              key={`lap-${i}`}
              className={`${styles.lap} ${item.rong >= 2 ? styles.rong : ""} ${item.rong === 3 ? styles.rongBa : ""}`}
              aria-hidden="true"
              data-reveal
              suppressHydrationWarning
            >
              {chuLap ? <span className={styles.chuLap}>{chuLap}</span> : null}
            </li>
          ),
        )}
      </ul>
      {rest > 0 && moreLabel ? <p className={styles.more}>{moreLabel(rest)}</p> : null}
    </div>
  );
}
