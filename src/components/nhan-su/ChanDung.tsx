import Image from "next/image";
import styles from "./ChanDung.module.css";

/**
 * Ảnh chân dung, hoặc chữ cái thay ảnh khi chưa có.
 *
 * Hồ sơ nào cũng ghi "ẢNH CHÂN DUNG (Bổ sung khi có ảnh)", nên trạng thái
 * thường gặp lúc này là CHƯA CÓ ảnh. Chỗ trống ấy phải trông như một quyết
 * định thiết kế chứ không như một tấm ảnh vỡ: một đĩa tròn nền tối với chữ cái
 * đầu của tên, cùng hệ màu với phần còn lại của trang.
 *
 * KHÔNG dùng ảnh minh hoạ người thật thay thế — đó là điều cả site này tránh
 * từ đầu, và với hồ sơ lãnh đạo thì nó còn là gán mặt người này cho tên người
 * kia.
 */
export function ChanDung({
  ten,
  anh,
  lon = false,
}: {
  ten: string;
  anh?: string | null;
  lon?: boolean;
}) {
  const lop = `${styles.khung} ${lon ? styles.lon : ""}`;

  if (anh) {
    return (
      <span className={lop}>
        <Image src={anh} alt="" width={lon ? 320 : 96} height={lon ? 320 : 96} className={styles.anh} />
      </span>
    );
  }

  // Chữ cái của TÊN, không phải của họ: người Việt gọi nhau bằng tên.
  const tu = ten.trim().split(/\s+/);
  const chu = (tu[tu.length - 1]?.[0] ?? ten[0] ?? "?").toUpperCase();

  return (
    <span className={lop} aria-hidden="true">
      <span className={styles.chu}>{chu}</span>
    </span>
  );
}
