import Image from "next/image";
import { t, tList, type Locale } from "@/lib/i18n/config";
import type { VentureService } from "@/content/venture-types";
import styles from "./ServicePanels.module.css";

/**
 * The three lines of business as three standing panels.
 *
 * The education arm reads horizontally - slats lying on top of one another; on
 * this side the same idea is turned on its end, so the two arms never look like
 * the same page with different words. A panel opens when it is pointed at or
 * tabbed to: its photograph widens, the detail appears, and the other two
 * narrow to a column carrying just the name.
 *
 * Nothing is hidden behind the interaction that a reader needs: the name is on
 * every panel in both states, and below the breakpoint all three simply stand
 * open.
 */
export function ServicePanels({
  services,
  locale,
}: {
  services: VentureService[];
  locale: Locale;
}) {
  return (
    <ul className={styles.panels}>
      {services.map((service, index) => (
        <li
          key={service.key}
          className={styles.panel}
          data-reveal suppressHydrationWarning
          style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
        >
          {/* A group, not a link: these are explanations, not destinations. The
              tabindex lets a keyboard open one the way a pointer does. */}
          <article tabIndex={0} className={styles.card}>
            <Image
              src={service.image}
              alt=""
              width={1200}
              height={1600}
              sizes="(min-width: 900px) 42vw, 100vw"
              className={styles.image}
            />
            <div className={styles.body}>
              <span className={styles.no}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{t(service.name, locale)}</h3>

              {/*
                Phần chi tiết gói trong MỘT ô lưới, không phải hai.

                Ô lưới đóng lại bằng cách cho hàng cao 0fr. Nhưng lưới chỉ khai
                báo một hàng, mà bên trong có hai thẻ con — thẻ thứ hai rơi vào
                một hàng ngầm cao "auto", nên nó vẫn chiếm chỗ dù mắt không thấy.
                Ba tấm có số gạch đầu dòng khác nhau nên chiếm khác nhau, và đó
                đúng là lý do ba cái tên nằm ở ba độ cao khác nhau.
              */}
              <div className={styles.detail}>
                <div className={styles.detailTrong}>
                  <p>{t(service.lead, locale)}</p>
                  <ul className={service.pending ? styles.pending : undefined}>
                    {tList(service.points, locale).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
