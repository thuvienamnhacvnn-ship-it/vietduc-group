import Link from "next/link";
import { pick, type Locale, type L10nMap } from "@/lib/i18n/config";
import { BAN_DO, chieu } from "@/content/ban-do-cham";
import {
  KHU_VUC,
  NHOM_CHIEN_LUOC,
  VIET_NAM,
  demMangLuoi,
  type NhomChienLuoc,
  type QuocGia,
} from "@/content/mang-luoi-nibelc";
import { CoQuocGia } from "./CoQuocGia";
import styles from "./MangLuoiNibelc.module.css";

/**
 * NIBELC GROUP — MẠNG LƯỚI ĐỐI TÁC QUỐC TẾ.
 *
 * Một dải tối liền mạch gồm: tiêu đề lớn, dải số liệu, bản đồ đường nối từ Việt
 * Nam tới 12 nước, bảng đối tác theo từng khu vực, và bốn nhóm đối tác chiến
 * lược. Không có JavaScript phía trình duyệt — chuyển động là CSS, và tắt hết
 * khi người xem chọn giảm chuyển động.
 *
 * `gon`: bản rút gọn cho trang chủ đào tạo — giữ bản đồ, số liệu và nhóm chiến
 * lược, thay bảng đầy đủ bằng một dải cờ kèm số đối tác, và dẫn sang trang
 * Đối tác bằng `lienKet`.
 */

const CHU: Record<string, L10nMap> = {
  nhan: {
    vi: "Đối tác chiến lược của Việt Đức Group",
    en: "Strategic partner of Viet Duc Group",
    de: "Strategischer Partner der Viet Duc Group",
    ja: "Viet Duc Group の戦略的パートナー",
    ko: "Viet Duc Group의 전략적 파트너",
    "zh-TW": "Viet Duc Group 策略夥伴",
  },
  phuDe: {
    vi: "Mạng lưới đối tác quốc tế",
    en: "International partner network",
    de: "Internationales Partnernetzwerk",
    ja: "国際パートナーネットワーク",
    ko: "국제 파트너 네트워크",
    "zh-TW": "國際夥伴網絡",
  },
  dan: {
    vi: "NIBELC Group có hơn 20 năm kinh nghiệm cung ứng nhân lực và thực thi các dự án hạ tầng, công nghiệp tại hơn 15 quốc gia. Dưới đây là các doanh nghiệp và tổ chức trong mạng lưới ấy — từ tập đoàn xây dựng Nhật Bản, hãng hàng không Trung Đông tới chuỗi siêu thị, nông trại và nhà máy khắp châu Âu.",
    en: "NIBELC Group has more than 20 years of experience in workforce deployment and in delivering infrastructure and industrial projects in more than 15 countries. These are the companies and organisations in that network — from Japanese construction groups and a Gulf airline to supermarket chains, farms and factories across Europe.",
    de: "Die NIBELC Group verfügt über mehr als 20 Jahre Erfahrung in der Personalvermittlung und in Infrastruktur- und Industrieprojekten in über 15 Ländern. Hier stehen die Unternehmen und Organisationen dieses Netzwerks — von japanischen Baukonzernen und einer Airline am Golf bis zu Supermarktketten, Höfen und Werken in ganz Europa.",
    ja: "NIBELC Group は人材派遣とインフラ・産業プロジェクトの遂行で 20 年以上の経験を持ち、15 か国以上で事業を展開してきました。ここに並ぶのはそのネットワークの企業・団体です — 日本の建設大手や中東の航空会社から、ヨーロッパ各地のスーパーマーケット、農園、工場まで。",
    ko: "NIBELC Group은 인력 파견과 인프라·산업 프로젝트 수행에서 20년 이상의 경험을 쌓으며 15개국 이상에서 사업을 펼쳐 왔습니다. 아래는 그 네트워크의 기업과 기관입니다 — 일본 건설 대기업과 중동 항공사부터 유럽 곳곳의 슈퍼마켓 체인, 농장, 공장까지.",
    "zh-TW": "NIBELC Group 在人力派遣與基礎建設、工業專案執行方面擁有逾 20 年經驗，業務遍及 15 個以上國家。以下是這個網絡中的企業與機構——從日本營建集團、中東航空公司，到遍布歐洲的連鎖超市、農場與工廠。",
  },
  doiTac: { vi: "đối tác", en: "partners", de: "Partner", ja: "社・団体", ko: "개 협력사", "zh-TW": "家夥伴" },
  quocGia: { vi: "quốc gia", en: "countries", de: "Länder", ja: "か国", ko: "개국", "zh-TW": "個國家" },
  khuVuc: { vi: "khu vực", en: "regions", de: "Regionen", ja: "地域", ko: "개 지역", "zh-TW": "個區域" },
  nam: { vi: "năm kinh nghiệm", en: "years of experience", de: "Jahre Erfahrung", ja: "年の実績", ko: "년의 경험", "zh-TW": "年經驗" },
  vietNam: { vi: "Việt Nam", en: "Vietnam", de: "Vietnam", ja: "ベトナム", ko: "베트남", "zh-TW": "越南" },
  banDo: {
    vi: "Bản đồ mạng lưới: đường nối từ Việt Nam tới 12 quốc gia có đối tác của NIBELC Group.",
    en: "Network map: routes from Vietnam to the 12 countries where NIBELC Group has partners.",
    de: "Netzwerkkarte: Verbindungen von Vietnam in die 12 Länder mit Partnern der NIBELC Group.",
    ja: "ネットワーク地図：ベトナムから NIBELC Group の提携先がある 12 か国への線。",
    ko: "네트워크 지도: 베트남에서 NIBELC Group 협력사가 있는 12개국으로 이어지는 선.",
    "zh-TW": "網絡地圖：從越南連向 NIBELC Group 設有夥伴的 12 個國家。",
  },
  chienLuoc: {
    vi: "Nhóm đối tác chiến lược nổi bật",
    en: "Leading strategic partners",
    de: "Herausragende strategische Partner",
    ja: "主要な戦略的パートナー",
    ko: "주요 전략 협력사",
    "zh-TW": "重點策略夥伴",
  },
  ghiChu: {
    vi: "Đối tác trong mạng lưới của NIBELC Group — đối tác chiến lược của Việt Đức Group. Danh sách do tập đoàn cung cấp, tháng 9/2026.",
    en: "Partners within the network of NIBELC Group, a strategic partner of Viet Duc Group. List supplied by the group, September 2026.",
    de: "Partner im Netzwerk der NIBELC Group, eines strategischen Partners der Viet Duc Group. Liste von der Gruppe bereitgestellt, September 2026.",
    ja: "Viet Duc Group の戦略的パートナーである NIBELC Group のネットワークに属する提携先です。一覧はグループ提供（2026年9月）。",
    ko: "Viet Duc Group의 전략적 파트너인 NIBELC Group 네트워크의 협력사입니다. 목록은 그룹 제공(2026년 9월).",
    "zh-TW": "以上為 Viet Duc Group 策略夥伴 NIBELC Group 網絡中的合作夥伴，名單由集團提供（2026年9月）。",
  },
  xemHet: {
    vi: "Xem toàn bộ mạng lưới đối tác",
    en: "See the full partner network",
    de: "Das ganze Partnernetz ansehen",
    ja: "パートナーネットワークをすべて見る",
    ko: "전체 파트너 네트워크 보기",
    "zh-TW": "查看完整夥伴網絡",
  },
};

/*
 * Chỗ đặt nhãn cạnh từng chấm. Châu Âu có sáu nước chen nhau trong một vùng
 * nhỏ hơn ngón tay trên bản đồ, nên nhãn phải đẩy sang trái/phải xen kẽ bằng
 * tay — tính tự động thì chồng lên nhau.
 */
const NHAN_DAT: Record<QuocGia["ma"], [number, number, "start" | "middle" | "end"]> = {
  DE: [-10, 4, "end"],
  PL: [10, -2, "start"],
  AT: [-10, 12, "end"],
  HU: [10, 4, "start"],
  RO: [10, 6, "start"],
  GR: [10, 8, "start"],
  QA: [-10, 4, "end"],
  AE: [8, 16, "start"],
  IN: [0, -14, "middle"],
  MY: [-10, 2, "end"],
  SG: [10, 10, "start"],
  JP: [0, -14, "middle"],
};

/*
 * Bố cục thẻ nước trong lưới bốn cột: nước nhiều đối tác thì thẻ rộng gấp đôi
 * (chia hai cột tên), Nhật Bản cao gấp đôi để ba nước nhỏ xếp bên cạnh, còn
 * những nước lẻ cuối hàng thì giãn ra lấp chỗ trống.
 */
const KHUNG: Partial<Record<QuocGia["ma"], "lon" | "cao" | "rong">> = {
  GR: "lon",
  HU: "lon",
  JP: "cao",
  IN: "rong",
  QA: "rong",
  AE: "rong",
};

function BieuTuong({ loai }: { loai: NhomChienLuoc["key"] }) {
  const net = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.nhomIcon}>
      {loai === "xay-dung" ? (
        <path {...net} d="M3 21h18M5 21V8l7-5 7 5v13M9 10h1.5M13.5 10H15M9 14h1.5M13.5 14H15M10 21v-3h4v3" />
      ) : loai === "nang-luong" ? (
        <path {...net} d="M12 2.5c3.2 4.2 6 7.6 6 11.2a6 6 0 0 1-12 0c0-3.6 2.8-7 6-11.2zM12 13.5c1.3 1.6 2.2 2.8 2.2 4a2.2 2.2 0 0 1-4.4 0c0-1.2.9-2.4 2.2-4z" />
      ) : loai === "san-xuat" ? (
        <path {...net} d="M2.5 21V10.5l5.5 3.5v-3.5l5.5 3.5V7l8 4.5V21zM2.5 21h19M7 17.5h2M12 17.5h2M17 17.5h2" />
      ) : (
        <path {...net} d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      )}
    </svg>
  );
}

/** Đường cong từ Việt Nam tới một nước — cong lên phía bắc, dài thì cong nhiều. */
function duongNoi(den: [number, number]) {
  const [x0, y0] = chieu(...VIET_NAM);
  const [x1, y1] = chieu(...den);
  const dai = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = Math.min(y0, y1) - dai * 0.28;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

export function MangLuoiNibelc({
  locale,
  gon = false,
  lienKet,
}: {
  locale: Locale;
  gon?: boolean;
  lienKet?: string;
}) {
  const dem = demMangLuoi();
  const tatCaNuoc = KHU_VUC.flatMap((k) => k.quocGia);
  const [vx, vy] = chieu(...VIET_NAM);

  const soLieu = [
    { so: String(dem.doiTac), nhan: pick(CHU.doiTac, locale) },
    { so: String(dem.quocGia), nhan: pick(CHU.quocGia, locale) },
    { so: String(dem.khuVuc), nhan: pick(CHU.khuVuc, locale) },
    { so: "20+", nhan: pick(CHU.nam, locale) },
  ];

  return (
    <section className={`on-dark ${styles.band}`} id="mang-luoi-nibelc" aria-labelledby="mang-luoi-nibelc-td">
      <div className={`shell ${styles.trong}`}>
        {/* ---------------------------------------------------- tiêu đề */}
        <header className={styles.dau} data-reveal suppressHydrationWarning>
          <p className={styles.nhan}>{pick(CHU.nhan, locale)}</p>
          <h2 id="mang-luoi-nibelc-td" className={styles.tieuDe}>
            <span className={styles.tenLon}>NIBELC GROUP</span>
            <span className={styles.phuDe}>{pick(CHU.phuDe, locale)}</span>
          </h2>
          <p className={styles.dan}>{pick(CHU.dan, locale)}</p>
        </header>

        {/* --------------------------------------------------- số liệu */}
        <ul className={styles.soLieu} data-reveal suppressHydrationWarning>
          {soLieu.map((s) => (
            <li key={s.nhan}>
              <strong>{s.so}</strong>
              <span>{s.nhan}</span>
            </li>
          ))}
        </ul>

        {/* ---------------------------------------------------- bản đồ */}
        <figure className={styles.banDo} data-reveal suppressHydrationWarning>
          <svg viewBox={`0 0 ${BAN_DO.w} ${BAN_DO.h}`} role="img" aria-label={pick(CHU.banDo, locale)}>
            <defs>
              <radialGradient id="nb-quang">
                <stop offset="0" stopColor="var(--gold)" stopOpacity="0.5" />
                <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path className={styles.cham} d={BAN_DO.cham} />

            {tatCaNuoc.map((q, i) => {
              const d = duongNoi(q.toaDo);
              return (
                <g key={q.ma} style={{ "--i": i } as React.CSSProperties}>
                  <path className={styles.duongNen} d={d} />
                  <path className={styles.duongChay} d={d} pathLength={100} />
                </g>
              );
            })}

            {tatCaNuoc.map((q, i) => {
              const [x, y] = chieu(...q.toaDo);
              const [dx, dy, neo] = NHAN_DAT[q.ma];
              return (
                <g key={q.ma} className={styles.diem} style={{ "--i": i } as React.CSSProperties}>
                  <circle cx={x} cy={y} r="14" fill="url(#nb-quang)" />
                  <circle className={styles.song} cx={x} cy={y} r="4" />
                  <circle cx={x} cy={y} r="3.6" className={styles.nhanDiem} />
                  <text x={x + dx} y={y + dy} textAnchor={neo} className={styles.chuDiem}>
                    {pick(q.ten, locale)}
                    <tspan className={styles.soDiem}> {q.doiTac.length}</tspan>
                  </text>
                </g>
              );
            })}

            {/* Việt Nam — tâm mạng lưới */}
            <g className={styles.tam}>
              <circle className={styles.songTam} cx={vx} cy={vy} r="7" />
              <circle className={styles.songTam} cx={vx} cy={vy} r="7" style={{ animationDelay: "1.2s" }} />
              <circle cx={vx} cy={vy} r="6.5" className={styles.tamDiem} />
              <text x={vx + 12} y={vy + 18} className={styles.chuTam}>
                {pick(CHU.vietNam, locale)}
              </text>
            </g>
          </svg>
        </figure>

        {/* ------------------------------------------- bảng theo khu vực */}
        {gon ? (
          <ul className={styles.tomTat} data-reveal suppressHydrationWarning>
            {KHU_VUC.map((k) => (
              <li key={k.key}>
                <p className={styles.tomTatKhu}>{pick(k.ten, locale)}</p>
                <ul>
                  {k.quocGia.map((q) => (
                    <li key={q.ma}>
                      <CoQuocGia ma={q.ma} className={styles.co} />
                      {pick(q.ten, locale)}
                      <b>{q.doiTac.length}</b>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          KHU_VUC.map((k) => {
            const soDt = k.quocGia.reduce((s, q) => s + q.doiTac.length, 0);
            return (
              <section key={k.key} className={styles.khu} aria-labelledby={`nb-${k.key}`}>
                <header className={styles.khuDau} data-reveal suppressHydrationWarning>
                  <h3 id={`nb-${k.key}`}>{pick(k.ten, locale)}</h3>
                  <span className={styles.khuDem}>
                    {k.quocGia.length} {pick(CHU.quocGia, locale)} · {soDt} {pick(CHU.doiTac, locale)}
                  </span>
                </header>

                <div className={styles.luoiNuoc}>
                  {k.quocGia.map((q) => {
                    const khung = KHUNG[q.ma];
                    return (
                      <article
                        key={q.ma}
                        className={`${styles.nuoc} ${khung ? styles[khung] : ""}`}
                        data-reveal
                        suppressHydrationWarning
                      >
                        <header className={styles.nuocDau}>
                          <CoQuocGia ma={q.ma} className={styles.co} />
                          <h4>{pick(q.ten, locale)}</h4>
                          <span className={styles.nuocDem}>{q.doiTac.length}</span>
                        </header>
                        <ol className={styles.ds}>
                          {q.doiTac.map((ten) => (
                            <li key={ten}>{ten}</li>
                          ))}
                        </ol>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}

        {/* ------------------------------------------ nhóm chiến lược */}
        <section className={styles.chienLuoc} aria-labelledby="nb-chien-luoc">
          <header className={styles.khuDau} data-reveal suppressHydrationWarning>
            <h3 id="nb-chien-luoc">{pick(CHU.chienLuoc, locale)}</h3>
          </header>
          <ul className={styles.nhom}>
            {NHOM_CHIEN_LUOC.map((n) => (
              <li key={n.key} data-reveal suppressHydrationWarning>
                <BieuTuong loai={n.key} />
                <p className={styles.nhomTen}>{pick(n.ten, locale)}</p>
                <ul className={styles.nhomDs}>
                  {n.ten_dn.map((ten) => (
                    <li key={ten}>{ten}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.chan}>
          <p>{pick(CHU.ghiChu, locale)}</p>
          {lienKet ? (
            <Link href={lienKet} className={styles.nut}>
              {pick(CHU.xemHet, locale)}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
