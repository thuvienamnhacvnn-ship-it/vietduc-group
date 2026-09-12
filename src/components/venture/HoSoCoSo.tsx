import { pick, t, tList, type Locale, type L10nMap } from "@/lib/i18n/config";
import type { DossierIcon, VentureProject } from "@/content/venture-types";
import styles from "./HoSoCoSo.module.css";

/**
 * Hồ sơ của một cơ sở đang vận hành, trình bày như một bộ hồ sơ doanh nghiệp.
 *
 * Bản cũ là ba đoạn chữ dài, một cột thông số, rồi bốn danh sách gạch đầu dòng
 * chồng lên nhau — đủ thông tin nhưng người xem phải đọc hết mới biết khách
 * sạn có gì. Ở đây thông tin chia theo câu hỏi của người xem:
 *
 *   quy mô bao nhiêu        → bốn ô số lớn
 *   ai vận hành, pháp lý    → thẻ pháp nhân + thẻ đối tác
 *   có dịch vụ gì           → lưới biểu tượng
 *   phòng loại nào          → hai cột Khu A / Khu B
 *   đã đón ai               → dòng thời gian
 *   liên quan gì tới trường → lộ trình đánh số
 *
 * Không có JavaScript phía trình duyệt.
 */

const CHU: Record<string, L10nMap> = {
  tongQuan: { vi: "Tổng quan", en: "Overview", de: "Überblick", ja: "概要", ko: "개요", "zh-TW": "概覽" },
  quyMo: { vi: "Quy mô", en: "Scale", de: "Umfang", ja: "規模", ko: "규모", "zh-TW": "規模" },
  phapNhan: { vi: "Pháp nhân vận hành", en: "Operating company", de: "Betreibergesellschaft", ja: "運営会社", ko: "운영 법인", "zh-TW": "營運法人" },
  doiTac: { vi: "Đối tác chuyên môn", en: "Professional partners", de: "Fachpartner", ja: "専門パートナー", ko: "전문 협력사", "zh-TW": "專業夥伴" },
  dichVu: { vi: "Dịch vụ", en: "Services", de: "Leistungen", ja: "サービス", ko: "서비스", "zh-TW": "服務" },
  hangPhong: { vi: "Hạng phòng", en: "Room types", de: "Zimmerkategorien", ja: "客室タイプ", ko: "객실 유형", "zh-TW": "房型" },
  doan: { vi: "Đoàn khách và sự kiện tiêu biểu", en: "Groups and events", de: "Gruppen und Veranstaltungen", ja: "団体客とイベント", ko: "단체 고객과 행사", "zh-TW": "團體與活動" },
  daoTao: { vi: "Gắn với đào tạo", en: "Link to training", de: "Verbindung zur Ausbildung", ja: "研修とのつながり", ko: "교육과의 연계", "zh-TW": "與培訓的連結" },
  xemPhong: { vi: "Xem ảnh từng hạng phòng", en: "See each room type", de: "Alle Zimmer ansehen", ja: "客室の写真を見る", ko: "객실 사진 보기", "zh-TW": "查看各房型照片" },
  xemDoan: { vi: "Xem ảnh đoàn khách", en: "See the group photos", de: "Gruppenfotos ansehen", ja: "団体客の写真を見る", ko: "단체 사진 보기", "zh-TW": "查看團體照片" },
  hang: { vi: "hạng", en: "types", de: "Kategorien", ja: "タイプ", ko: "유형", "zh-TW": "種" },
};

const NET = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const HINH: Record<DossierIcon | "chuong" | "cua" | "lich" | "mu" | "toa" | "bat-tay", string> = {
  bed: "M2.5 19v-8.5M2.5 15.5h19M21.5 19v-5.5a2 2 0 0 0-2-2H11v4M6.8 13a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z",
  dining: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4M17 3v18",
  bar: "M5 4h14l-7 8.5zM12 12.5V20M8 20h8M9 7h6",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6",
  breakfast: "M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10.5h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5v2.5M12.5 3.5v2.5",
  party: "M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8zM18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5.5 16l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z",
  chuong: "M3 18h18M5 18a7 7 0 0 1 14 0M12 8.5V6M10 6h4",
  cua: "M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18M15 12.5h.01",
  lich: "M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 2.5v4M16 2.5v4",
  mu: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6",
  toa: "M4 21V6l8-3 8 3v15M2 21h20M9 9h1.5M13.5 9H15M9 13h1.5M13.5 13H15M10 21v-4h4v4",
  "bat-tay": "M8 11l3-3 2 1.5 4-3.5 4 4-7 7-2-1.5M3 10l4-4 3 3M3 10l6 6 1.5-1.5M7.5 14.5l1.5 1.5M9.5 12.5l2 2",
};

function Hinh({ ten, className }: { ten: keyof typeof HINH; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path {...NET} d={HINH[ten]} />
    </svg>
  );
}

function DauBang({ hinh, ten, phu }: { hinh: keyof typeof HINH; ten: string; phu?: string }) {
  return (
    <header className={styles.dauBang}>
      <Hinh ten={hinh} className={styles.hinhBang} />
      <h2>{ten}</h2>
      {phu ? <span className={styles.phu}>{phu}</span> : null}
    </header>
  );
}

export function HoSoCoSo({ project, locale }: { project: VentureProject; locale: Locale }) {
  const hs = project.dossier;
  if (!hs) return null;
  const [dan, ...doan] = tList(project.body, locale);
  const soPhong = hs.roomZones.reduce((s, z) => s + z.rooms.length, 0);

  return (
    <div className={styles.wrap}>
      {/* ------------------------------------------------ tổng quan + quy mô */}
      <section className={styles.tongQuan} aria-labelledby="hs-tong-quan">
        <div className={styles.tongQuanChu} data-reveal suppressHydrationWarning>
          <p className={styles.nhan} id="hs-tong-quan">
            {pick(CHU.tongQuan, locale)}
          </p>
          <p className={styles.dan}>{dan}</p>
          <div className={styles.theDoi}>
            {doan.map((doanVan, i) => {
              const the = hs.bodyCards[i];
              return (
                <article key={doanVan} className={styles.the}>
                  {the ? (
                    <header>
                      <h3>{t(the.title, locale)}</h3>
                      {the.badge ? <span className={styles.nhanNoi}>{t(the.badge, locale)}</span> : null}
                    </header>
                  ) : null}
                  <p>{doanVan}</p>
                </article>
              );
            })}
          </div>
        </div>

        <ul className={styles.kpi} aria-label={pick(CHU.quyMo, locale)} data-reveal suppressHydrationWarning>
          {hs.kpis.map((k) => (
            <li key={k.value}>
              <strong>{k.value}</strong>
              <span>{t(k.label, locale)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------ pháp nhân + đối tác */}
      <section className={styles.phapLy}>
        <article className={`${styles.bang} ${styles.congTy}`} data-reveal suppressHydrationWarning>
          <DauBang hinh="toa" ten={pick(CHU.phapNhan, locale)} />
          <div className={styles.tenCongTy}>
            <p className={styles.tenViet}>{hs.company.name}</p>
            <p className={styles.tenAnh}>{hs.company.nameEn}</p>
          </div>
          <dl className={styles.thongSo}>
            {hs.company.rows.map((r) => (
              <div key={t(r.label, locale)}>
                <dt>{t(r.label, locale)}</dt>
                <dd>{t(r.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </article>

        {project.parties.length ? (
          <article className={styles.bang} data-reveal suppressHydrationWarning>
            <DauBang hinh="bat-tay" ten={pick(CHU.doiTac, locale)} />
            <ol className={styles.doiTac}>
              {project.parties.map((p) => (
                <li key={p.name}>
                  <div>
                    <strong>{p.name}</strong>
                    <span>{t(p.role, locale)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ) : null}
      </section>

      {/* ------------------------------------------------------- bốn bảng */}
      <section className={styles.bonBang}>
        <article className={styles.bang} data-reveal suppressHydrationWarning>
          <DauBang hinh="chuong" ten={pick(CHU.dichVu, locale)} />
          <ul className={styles.dichVu}>
            {hs.services.map((s) => (
              <li key={t(s.text, locale)}>
                <Hinh ten={s.icon} className={styles.hinhDv} />
                <span>{t(s.text, locale)}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.bang} data-reveal suppressHydrationWarning>
          <DauBang hinh="cua" ten={pick(CHU.hangPhong, locale)} phu={`${soPhong} ${pick(CHU.hang, locale)}`} />
          <div className={styles.khuPhong}>
            {hs.roomZones.map((z) => (
              <div key={t(z.zone, locale)}>
                <p className={styles.tenKhu}>{t(z.zone, locale)}</p>
                <ul>
                  {z.rooms.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <footer className={styles.chanBang}>
            {hs.roomsNote ? <p>{t(hs.roomsNote, locale)}</p> : null}
            {project.showcase?.rooms?.length ? <a href="#hang-phong">{pick(CHU.xemPhong, locale)} ↓</a> : null}
          </footer>
        </article>

        <article className={styles.bang} data-reveal suppressHydrationWarning>
          <DauBang hinh="lich" ten={pick(CHU.doan, locale)} />
          <ol className={styles.dongThoiGian}>
            {hs.timeline.map((m) => (
              <li key={t(m.text, locale)}>
                {m.date ? <time>{m.date}</time> : null}
                <span>{t(m.text, locale)}</span>
              </li>
            ))}
          </ol>
          <footer className={styles.chanBang}>
            {hs.timelineNote ? <p>{t(hs.timelineNote, locale)}</p> : null}
            {project.showcase?.sections?.some((s) => s.key === "doan-khach") ? (
              <a href="#doan-khach">{pick(CHU.xemDoan, locale)} ↓</a>
            ) : null}
          </footer>
        </article>

        <article className={`${styles.bang} ${styles.bangNhan}`} data-reveal suppressHydrationWarning>
          <DauBang hinh="mu" ten={pick(CHU.daoTao, locale)} />
          <ol className={styles.loTrinh}>
            {hs.training.map((b) => (
              <li key={t(b, locale)}>
                <span>{t(b, locale)}</span>
              </li>
            ))}
          </ol>
          {hs.trainingNote ? (
            <footer className={styles.chanBang}>
              <p>{t(hs.trainingNote, locale)}</p>
            </footer>
          ) : null}
        </article>
      </section>
    </div>
  );
}
