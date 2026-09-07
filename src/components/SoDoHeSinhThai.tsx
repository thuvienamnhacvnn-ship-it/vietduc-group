"use client";

import Image from "next/image";
import { useState } from "react";
import { pick, type Locale, type L10nMap } from "@/lib/i18n/config";
import styles from "./SoDoHeSinhThai.module.css";

/**
 * Sơ đồ hệ sinh thái: Việt Đức Group ở giữa, các thương hiệu và trường toả ra.
 *
 * Trước đây chỗ này là một ảnh chụp sơ đồ — nền trắng đặc, dán lên nền tối của
 * trang, không bấm được, không đọc được trên điện thoại. Nay mỗi logo là một
 * tệp riêng đã tách nền (xem `_tach-logo.mjs`), đặt trong một vòng viền không
 * nền, nối về tâm bằng những đường có ánh sáng chạy dọc.
 *
 * Vị trí tính bằng lượng giác chứ không gõ tay: hai vòng, vòng trong năm
 * thương hiệu xếp theo ngũ giác, vòng ngoài sáu trường theo lục giác, lệch pha
 * nhau để nhánh nọ không che nhánh kia.
 *
 * Trên điện thoại thì bỏ hẳn vòng tròn. Ở bề ngang 375px, mười một logo xếp
 * quanh một vòng thì mỗi cái còn bằng đầu ngón tay và các đường nối chồng lên
 * nhau thành một mớ. Ở khổ ấy chúng xếp thành lưới, giữ nguyên viền và hiệu
 * ứng, chỉ bỏ phần hình học.
 */

export type Nhanh = {
  src: string;
  ten: L10nMap;
  /** Đường dẫn nếu nhánh này có trang riêng trên site. */
  href?: string;
};

export function SoDoHeSinhThai({
  locale,
  tam,
  vongTrong,
  vongNgoai,
}: {
  locale: Locale;
  tam: { src: string; ten: L10nMap };
  vongTrong: Nhanh[];
  vongNgoai: Nhanh[];
}) {
  const [dangRe, setDangRe] = useState<string | null>(null);

  /* Toạ độ phần trăm trong khung vuông. Góc tính từ 12 giờ, quay theo chiều kim đồng hồ. */
  const diem = (goc: number, banKinh: number) => {
    const rad = ((goc - 90) * Math.PI) / 180;
    return { x: 50 + Math.cos(rad) * banKinh, y: 50 + Math.sin(rad) * banKinh };
  };

  const nut = [
    ...vongTrong.map((n, i) => ({
      ...n,
      vong: "trong" as const,
      ...diem((360 / vongTrong.length) * i, 27),
    })),
    /* Vòng ngoài lệch nửa bước so với vòng trong: nhánh ngoài không nằm thẳng
       sau nhánh trong, nên không có đường nối nào bị che khuất. */
    ...vongNgoai.map((n, i) => ({
      ...n,
      vong: "ngoai" as const,
      ...diem((360 / vongNgoai.length) * i + 360 / vongNgoai.length / 2, 43),
    })),
  ];

  return (
    <div className={styles.boc}>
      <div className={styles.khung}>
        {/* Đường nối, vẽ trước để nằm dưới các logo. */}
        <svg className={styles.day} viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="day-sang" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {nut.map((n) => (
            <g key={n.src}>
              <line
                x1="50"
                y1="50"
                x2={n.x}
                y2={n.y}
                className={`${styles.duong} ${dangRe === n.src ? styles.duongSang : ""}`}
              />
              {/* Vệt sáng chạy dọc đường nối. Nét đứt dài chạy trên nền đường
                  mờ, nên nhìn ra hướng đi từ tâm ra nhánh. */}
              <line
                x1="50"
                y1="50"
                x2={n.x}
                y2={n.y}
                className={styles.vet}
                style={{ animationDelay: `${(nut.indexOf(n) % 6) * 420}ms` }}
              />
            </g>
          ))}
        </svg>

        {/* Tâm */}
        <div className={`${styles.nut} ${styles.tam}`} style={{ left: "50%", top: "50%" }}>
          <span className={styles.vien} aria-hidden="true" />
          <Image src={tam.src} alt={pick(tam.ten, locale)} width={465} height={327} sizes="240px" />
        </div>

        {/* Các nhánh */}
        {nut.map((n) => {
          const ten = pick(n.ten, locale);
          const trong = (
            <>
              <span className={styles.vien} aria-hidden="true" />
              <Image src={n.src} alt={ten} width={320} height={320} sizes="140px" />
              <span className={styles.nhan}>{ten}</span>
            </>
          );
          /*
           * Nhãn neo theo phía. Nhánh nằm sát rìa phải mà nhãn vẫn neo giữa thì
           * một nửa nhãn thò ra ngoài khung — và vì nó là phần tử tuyệt đối, nó
           * kéo cả trang cuộn ngang chứ không chỉ bị cắt.
           */
          const phia = n.x > 66 ? styles.nhanPhai : n.x < 34 ? styles.nhanTrai : "";
          const chung = {
            className: `${styles.nut} ${n.vong === "trong" ? styles.trong : styles.ngoai} ${phia}`,
            style: { left: `${n.x}%`, top: `${n.y}%` },
            onMouseEnter: () => setDangRe(n.src),
            onMouseLeave: () => setDangRe(null),
            onFocus: () => setDangRe(n.src),
            onBlur: () => setDangRe(null),
          };
          return n.href ? (
            <a key={n.src} href={n.href} {...chung}>
              {trong}
            </a>
          ) : (
            <div key={n.src} {...chung}>
              {trong}
            </div>
          );
        })}
      </div>
    </div>
  );
}
