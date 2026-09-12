"use client";

import { useState } from "react";
import Image from "next/image";
import { t, tList, type Locale } from "@/lib/i18n/config";
import type { VentureService } from "@/content/venture-types";
import styles from "./ServicePanels.module.css";

/**
 * Ba mảng kinh doanh, dựng hai kiểu theo cỡ màn hình.
 *
 * Điện thoại — ảnh nằm trên, TÊN NẰM DƯỚI ẢNH trong một thẻ có viền, phần mô tả
 * đóng lại và chạm vào tên mới mở ra. Bản trước đặt cả tên lẫn mô tả đè lên ảnh:
 * trên màn hình rộng thì tấm ảnh còn chỗ trống để chữ nổi lên, nhưng ở khổ điện
 * thoại chữ rơi thẳng vào mặt nước bể bơi và tán lá — chìm nghỉm, đúng như lời
 * Sếp. Chữ trên nền giấy thì không bao giờ chìm.
 *
 * Máy tính — giữ nguyên lối cũ: ba tấm đứng cạnh nhau, chữ nằm trên ảnh, rê
 * chuột vào tấm nào thì tấm ấy nở ra và mô tả hiện lên.
 *
 * Trạng thái mở nằm ở đây chứ không phải trong CSS, vì màn hình cảm ứng không có
 * "rê chuột": phải có một cú chạm thật, và cú chạm ấy cần một cái nút thật để
 * trình đọc màn hình cũng dùng được (`aria-expanded`).
 */
export function ServicePanels({
  services,
  locale,
}: {
  services: VentureService[];
  locale: Locale;
}) {
  const [dangMo, setDangMo] = useState<string | null>(null);

  return (
    <ul className={styles.panels}>
      {services.map((service, index) => {
        const mo = dangMo === service.key;
        const vungId = `dich-vu-${service.key}`;
        return (
          <li
            key={service.key}
            className={styles.panel}
            data-mo={mo ? "" : undefined}
            data-reveal
            suppressHydrationWarning
            style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
          >
            <article className={styles.card}>
              <span className={styles.anh}>
                <Image
                  src={service.image}
                  alt=""
                  width={1200}
                  height={1600}
                  sizes="(min-width: 900px) 42vw, 100vw"
                  className={styles.image}
                />
              </span>

              <button
                type="button"
                className={styles.head}
                aria-expanded={mo}
                aria-controls={vungId}
                onClick={() => setDangMo(mo ? null : service.key)}
              >
                <span className={styles.ten}>{t(service.name, locale)}</span>
                <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m6 9 6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/*
                Phần chi tiết gói trong MỘT thẻ con. Ô lưới đóng lại bằng hàng cao
                0fr; hai thẻ con thì thẻ thứ hai rơi vào hàng ngầm cao "auto" và
                phần đã đóng vẫn chiếm chỗ.
              */}
              <div className={styles.detail} id={vungId}>
                <div className={styles.detailTrong}>
                  <p>{t(service.lead, locale)}</p>
                  <ul className={service.pending ? styles.pending : undefined}>
                    {tList(service.points, locale).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
