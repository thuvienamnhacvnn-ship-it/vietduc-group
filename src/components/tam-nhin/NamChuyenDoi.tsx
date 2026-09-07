"use client";

import { useId, useState } from "react";
import { pick, type Locale } from "@/lib/i18n/config";
import { CHUYEN_DOI } from "@/content/tam-nhin-cach-lam";
import styles from "./TamNhin.module.css";

/**
 * Khối 07: năm chuyển đổi.
 *
 * Một cấu trúc HTML duy nhất cho cả hai khổ màn hình. Mỗi mục là một cặp
 * nút + bảng nội dung, viết liền nhau trong mã — đó chính là hình dạng của một
 * đàn xếp trên điện thoại.
 *
 * Trên máy tính, `display: contents` ở thẻ bọc mỗi mục khiến nút và bảng rơi
 * thẳng vào lưới của khối cha: mọi nút vào cột trái theo thứ tự, mọi bảng vào
 * cột phải cùng một ô. Nhờ vậy không phải dựng hai cây DOM khác nhau rồi giấu
 * đi một cây — thứ luôn dẫn tới việc trình đọc màn hình đọc mọi thứ hai lần.
 *
 * Cả năm bảng đều nằm sẵn trong trang, chỉ ẩn bằng `hidden`. Không có gì phải
 * tải thêm khi người đọc bấm sang mục khác, và công cụ tìm kiếm thấy đủ nội
 * dung.
 */
export function NamChuyenDoi({ locale }: { locale: Locale }) {
  const [mo, setMo] = useState(0);
  const id = useId();

  return (
    <div className={styles.chuyenDoi}>
      {CHUYEN_DOI.muc.map((m, i) => {
        const dangMo = i === mo;
        return (
          <div key={m.so} className={styles.chuyenDoiMuc}>
            <button
              type="button"
              id={`${id}-nut-${i}`}
              className={styles.chuyenDoiNut}
              aria-expanded={dangMo}
              data-mo={dangMo ? "true" : undefined}
              aria-controls={`${id}-bang-${i}`}
              onClick={() => setMo(i)}
            >
              <span className={styles.chuyenDoiSo}>{m.so}</span>
              <span className={styles.chuyenDoiTen}>{pick(m.ten, locale)}</span>
            </button>

            <div
              id={`${id}-bang-${i}`}
              className={styles.chuyenDoiBang}
              aria-labelledby={`${id}-nut-${i}`}
              hidden={!dangMo}
            >
              <p className={styles.chuyenDoiDinhHuong}>{pick(m.dinhHuong, locale)}</p>

              <ol className={styles.chuyenDoiHanhDong}>
                {pick(m.hanhDong, locale).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>

              <p className={styles.chuyenDoiGiaTri}>
                <span className={styles.chuyenDoiGiaTriNhan}>
                  {pick(CHUYEN_DOI.nhanGiaTri, locale)}
                </span>
                <span className={styles.chuyenDoiGiaTriY}>{pick(m.giaTri, locale)}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
