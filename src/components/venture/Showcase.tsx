import Image from "next/image";
import { t, type Locale } from "@/lib/i18n/config";
import type { Localised, VentureShowcase } from "@/content/venture-types";
import { PhotoWall } from "@/components/PhotoWall";
import styles from "./Showcase.module.css";

/**
 * Phần trưng bày của một cơ sở đang vận hành.
 *
 * Mấy trăm tấm ảnh và vài chục video mà đổ chung vào một bộ ảnh thì người xem
 * không biết mình đang nhìn phòng nào, tiệc nào. Nên chia thành các khu, mỗi khu
 * một câu hỏi của khách: có video không, phòng trông thế nào, ăn ở đâu, tổ chức
 * tiệc được không, đã từng đón đoàn nào chưa. Thanh điều hướng dính trên đầu cho
 * phép nhảy thẳng tới khu cần xem.
 *
 * Không dùng JavaScript: video là thẻ <video> gốc với ảnh bìa, chỉ tải khi người
 * xem bấm phát (preload="none") — một trang có năm video mà tự tải cả năm thì
 * nặng hơn cả phần còn lại của trang cộng lại.
 */

const NHAN: Record<string, Localised> = {
  video: { vi: "Video", en: "Video", de: "Video", ja: "動画", ko: "영상", "zh-TW": "影片" },
  rooms: { vi: "Hạng phòng", en: "Rooms", de: "Zimmer", ja: "客室", ko: "객실", "zh-TW": "房型" },
  photos: { vi: "ảnh", en: "photos", de: "Fotos", ja: "枚", ko: "장", "zh-TW": "張" },
};

export function Showcase({ showcase, locale }: { showcase: VentureShowcase; locale: Locale }) {
  const { videos = [], rooms = [], sections = [] } = showcase;
  const [chinh, ...phu] = videos;

  const muc = [
    ...(videos.length ? [{ id: "video", ten: t(NHAN.video, locale) }] : []),
    ...(rooms.length ? [{ id: "hang-phong", ten: t(NHAN.rooms, locale) }] : []),
    ...sections.map((s) => ({ id: s.key, ten: t(s.title, locale) })),
  ];

  return (
    <div className={styles.wrap}>
      {/* Thanh điều hướng các khu, dính trên đầu khi cuộn. */}
      <nav className={styles.nav} aria-label={t(NHAN.rooms, locale)}>
        <ul>
          {muc.map((m, i) => (
            <li key={m.id}>
              <a href={`#${m.id}`}>
                <span className={styles.navSo}>{String(i + 1).padStart(2, "0")}</span>
                {m.ten}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ------------------------------------------------------------- video */}
      {chinh ? (
        <section id="video" className={styles.section}>
          <header className={styles.head}>
            <span className={styles.headSo}>01</span>
            <h2>{t(NHAN.video, locale)}</h2>
          </header>

          <figure className={styles.videoChinh}>
            <video controls preload="none" playsInline poster={chinh.poster} src={chinh.src} />
            <figcaption>
              <strong>{t(chinh.title, locale)}</strong>
              {chinh.note ? <span>{t(chinh.note, locale)}</span> : null}
            </figcaption>
          </figure>

          {phu.length ? (
            <ul className={styles.videoHang}>
              {phu.map((v) => (
                <li key={v.src}>
                  <video controls preload="none" playsInline poster={v.poster} src={v.src} />
                  <strong>{t(v.title, locale)}</strong>
                  {v.note ? <span>{t(v.note, locale)}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* -------------------------------------------------------- hạng phòng */}
      {rooms.length ? (
        <section id="hang-phong" className={styles.section}>
          <header className={styles.head}>
            <span className={styles.headSo}>{String(videos.length ? 2 : 1).padStart(2, "0")}</span>
            <h2>{t(NHAN.rooms, locale)}</h2>
          </header>

          <ul className={styles.phong}>
            {rooms.map((r) => (
              <li key={r.name} className={styles.the} data-reveal suppressHydrationWarning>
                <div className={styles.theAnh}>
                  <Image src={r.cover} alt={r.name} width={900} height={600} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw" />
                  <span className={styles.khu}>{t(r.zone, locale)}</span>
                </div>
                <div className={styles.theChu}>
                  <strong>{r.name}</strong>
                  <span>
                    {r.more.length + 1} {t(NHAN.photos, locale)}
                  </span>
                </div>
                {r.more.length ? (
                  <div className={styles.theNho}>
                    {r.more.slice(0, 3).map((src) => (
                      <Image key={src} src={src} alt="" width={240} height={160} sizes="120px" />
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------------- các khu ảnh */}
      {sections.map((s, i) => {
        const so = (videos.length ? 1 : 0) + (rooms.length ? 1 : 0) + i + 1;
        return (
          <section key={s.key} id={s.key} className={styles.section}>
            <header className={styles.head}>
              <span className={styles.headSo}>{String(so).padStart(2, "0")}</span>
              <h2>{t(s.title, locale)}</h2>
              <span className={styles.dem}>
                {s.shots.length} {t(NHAN.photos, locale)}
              </span>
            </header>
            {s.lead ? <p className={styles.lead}>{t(s.lead, locale)}</p> : null}
            <PhotoWall
              shots={s.shots.map((shot) => ({ src: shot.src, alt: t(shot.caption, locale) }))}
              limit={s.shots.length}
              chuLap={t(s.title, locale)}
            />
          </section>
        );
      })}
    </div>
  );
}
