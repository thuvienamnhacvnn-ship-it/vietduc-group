import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPeople, getSchools, type NguoiDayDu, type ChucVuRow } from "@/lib/queries";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { ChanDung } from "@/components/nhan-su/ChanDung";
import shell from "../page-shell.module.css";
import styles from "./people.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.people,
    alternates: { canonical: `/${locale}/doi-ngu` },
  };
}

/**
 * Cơ cấu nhân sự toàn hệ thống.
 *
 * Trang này KHÔNG phải một lưới ảnh chân dung. Cái người đọc cần trả lời được
 * là "ai chịu trách nhiệm gì, ở đâu" — nên trục chính là CƠ CẤU: hội đồng quản
 * trị và ban kiểm soát ở cấp tập đoàn, rồi mỗi trường một khối gồm hội đồng
 * trường và ban giám hiệu.
 *
 * Một người xuất hiện ở nhiều khối, đúng như ngoài đời: chủ tịch hội đồng quản
 * trị tập đoàn cũng là chủ tịch hội đồng ba trường. Ở mỗi khối, chức danh hiện
 * ra là chức danh TẠI ĐƠN VỊ ẤY, không phải chức danh chính — nếu không thì
 * khối "Hội đồng trường Bách Khoa Vũng Tàu" sẽ hiện một loạt "Chủ tịch HĐQT
 * Việt Đức Group" và chẳng nói lên điều gì về hội đồng ấy cả.
 */
export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [nguoi, truong] = await Promise.all([getPeople(), getSchools()]);

  /** Cặp (người, chức vụ) cho một ban, đã xếp theo thứ bậc rồi theo tên. */
  const trongBan = (loc: (cv: ChucVuRow) => boolean) =>
    nguoi
      .flatMap((p) => p.chucVu.filter(loc).map((cv) => ({ nguoi: p, cv })))
      .sort((a, b) => a.cv.rank - b.cv.rank || a.nguoi.order - b.nguoi.order);

  const hdqt = trongBan((cv) => cv.body === "hdqt" && !cv.schoolId);
  const dieuHanh = trongBan((cv) => cv.body === "dieuhanh");
  const bks = trongBan((cv) => cv.body === "bks");

  const khoiTruong = truong
    .map((tr) => ({
      truong: tr,
      hdt: trongBan((cv) => cv.body === "hdt" && cv.schoolId === tr.id),
      bgh: trongBan((cv) => cv.body === "bgh" && cv.schoolId === tr.id),
    }))
    .filter((k) => k.hdt.length || k.bgh.length);

  const nhan = {
    hdqt: pick({ vi: "Hội đồng quản trị", en: "Board of Directors", de: "Verwaltungsrat", ja: "取締役会", ko: "이사회", "zh-TW": "董事會" }, locale),
    dieuHanh: pick({ vi: "Ban Điều hành", en: "Executive Board", de: "Geschäftsführung", ja: "執行部", ko: "집행부", "zh-TW": "經營團隊" }, locale),
    bks: pick({ vi: "Ban Kiểm soát", en: "Supervisory Board", de: "Aufsichtsrat", ja: "監査役会", ko: "감사위원회", "zh-TW": "監事會" }, locale),
    hdt: pick({ vi: "Hội đồng trường", en: "School Council", de: "Schulrat", ja: "学校評議会", ko: "학교 이사회", "zh-TW": "校務委員會" }, locale),
    bgh: pick({ vi: "Ban Giám hiệu", en: "School Executive", de: "Schulleitung", ja: "学校執行部", ko: "학교 집행부", "zh-TW": "校領導班子" }, locale),
    tapDoan: pick({ vi: "Cấp tập đoàn", en: "Group level", de: "Konzernebene", ja: "グループ本部", ko: "그룹 본부", "zh-TW": "集團層級" }, locale),
    truong: pick({ vi: "Các trường thành viên", en: "Member schools", de: "Mitgliedsschulen", ja: "加盟校", ko: "회원 학교", "zh-TW": "成員學校" }, locale),
  };

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.people }]} />
        <header className={shell.header}>
          <h1>{dict.nav.people}</h1>
          <p className={shell.lead}>
            {pick(
              {
                vi: "Hội đồng quản trị, ban kiểm soát và bộ máy lãnh đạo của từng trường thành viên. Nhiều người giữ chức vụ ở nhiều đơn vị, nên mỗi nơi ghi đúng chức danh tại đơn vị đó.",
                en: "The board, the supervisory board and the leadership of each member school. Several people hold posts at more than one institution, so each block shows the title held there.",
                de: "Verwaltungsrat, Aufsichtsrat und die Leitung jeder Mitgliedsschule. Mehrere Personen haben Ämter an mehreren Einrichtungen; jeder Block nennt daher das dort geführte Amt.",
                ja: "取締役会、監査役会、そして加盟各校の経営体制です。複数の機関で役職を兼ねる方がいるため、各欄にはその機関での役職を記しています。",
                ko: "이사회와 감사위원회, 그리고 각 회원 학교의 지도부입니다. 여러 기관에서 직책을 겸하는 분들이 있어, 각 항목에는 해당 기관에서의 직책을 적었습니다.",
                "zh-TW": "董事會、監事會，以及各成員學校的領導層。多位成員身兼數個機構的職務，因此每一區塊標示的是在該機構的職稱。",
              },
              locale,
            )}
          </p>
        </header>

        {!nguoi.length ? (
          <EmptyState
            title={pick({ vi: "Chưa công bố thông tin nhân sự", en: "Staff information not published yet", de: "Angaben zum Team noch nicht veröffentlicht", ja: "人事情報はまだ公開されていません", ko: "인사 정보는 아직 공개되지 않았습니다", "zh-TW": "尚未公布人事資訊" }, locale)}
            hint={pick({ vi: "Trang này hiển thị ngay khi biên tập viên duyệt hồ sơ trong trang quản trị.", en: "The page fills in as soon as an editor approves the profiles in the admin area.", de: "Die Seite füllt sich, sobald die Redaktion die Profile freigibt.", ja: "編集者が管理画面で承認しだい、このページに表示されます。", ko: "편집자가 관리 화면에서 승인하는 대로 이 페이지에 표시됩니다.", "zh-TW": "待編輯者於管理後台審核後，本頁即會顯示。" }, locale)}
          />
        ) : (
          <>
            <SoDo locale={locale} nhan={nhan} khoiTruong={khoiTruong} soHdqt={hdqt.length} soBks={bks.length} />

            <section className={styles.cap} data-reveal suppressHydrationWarning>
              <h2 className={styles.capTieuDe}>{nhan.tapDoan}</h2>
              <div className={styles.capLuoi}>
                <Ban locale={locale} ten={nhan.hdqt} ds={hdqt} noiBat />
                <Ban locale={locale} ten={nhan.dieuHanh} ds={dieuHanh} />
                <Ban locale={locale} ten={nhan.bks} ds={bks} />
              </div>
            </section>

            <section className={styles.cap}>
              <h2 className={styles.capTieuDe}>{nhan.truong}</h2>
              {khoiTruong.map(({ truong: tr, hdt, bgh }) => (
                <article key={tr.id} className={styles.truong} data-reveal suppressHydrationWarning>
                  <header className={styles.truongDau}>
                    <h3>{t(tr.shortName ?? tr.name, locale)}</h3>
                    {tr.city ? <p className={styles.truongNoi}>{t(tr.city, locale)}</p> : null}
                  </header>
                  <div className={styles.capLuoi}>
                    <Ban locale={locale} ten={nhan.hdt} ds={hdt} />
                    <Ban locale={locale} ten={nhan.bgh} ds={bgh} />
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

/** Một ban: tiêu đề, số người, và các thẻ người trong ban. */
function Ban({
  locale,
  ten,
  ds,
  noiBat = false,
}: {
  locale: Locale;
  ten: string;
  ds: { nguoi: NguoiDayDu; cv: ChucVuRow }[];
  noiBat?: boolean;
}) {
  if (!ds.length) return null;
  const nhiemKy = ds.find((x) => x.cv.term)?.cv;
  return (
    <section className={`${styles.ban} ${noiBat ? styles.banNoiBat : ""}`}>
      <header className={styles.banDau}>
        <h4>{ten}</h4>
        <span className={styles.banSo}>{ds.length}</span>
      </header>
      {nhiemKy?.term ? (
        <p className={styles.nhiemKy}>
          {pick({ vi: "Nhiệm kỳ", en: "Term", de: "Amtszeit", ja: "任期", ko: "임기", "zh-TW": "任期" }, locale)}{" "}
          {nhiemKy.term}
          {nhiemKy.decisionRef ? <span className={styles.quyetDinh}> · {nhiemKy.decisionRef}</span> : null}
        </p>
      ) : null}
      <ul className={styles.dsNguoi}>
        {ds.map(({ nguoi: p, cv }) => (
          <li key={`${p.id}-${cv.id}`}>
            <Link href={`/${locale}/doi-ngu/${p.slug}`} className={styles.the}>
              <ChanDung ten={p.name} anh={p.photoPath} />
              <span className={styles.theChu}>
                <span className={styles.theTen}>
                  {p.honorific ? <span className={styles.hocVi}>{p.honorific} </span> : null}
                  {p.name}
                </span>
                <span className={styles.theChuc}>{t(cv.title, locale)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Sơ đồ cơ cấu, vẽ bằng chính bố cục chứ không phải một tấm ảnh.
 *
 * Ảnh sơ đồ thì không đọc được trên trình đọc màn hình, không dịch được sang
 * năm thứ tiếng còn lại, và cứ mỗi lần đổi nhân sự lại phải vẽ lại. Ở đây các
 * ô là chữ thật, đường nối là viền CSS.
 */
function SoDo({
  locale,
  nhan,
  khoiTruong,
  soHdqt,
  soBks,
}: {
  locale: Locale;
  nhan: Record<string, string>;
  khoiTruong: { truong: { id: number; shortName: unknown; name: unknown }; hdt: unknown[]; bgh: unknown[] }[];
  soHdqt: number;
  soBks: number;
}) {
  return (
    <figure className={styles.soDo} data-reveal suppressHydrationWarning>
      <figcaption className={styles.soDoNhan}>
        {pick({ vi: "Sơ đồ tổ chức", en: "Organisation chart", de: "Organigramm", ja: "組織図", ko: "조직도", "zh-TW": "組織圖" }, locale)}
      </figcaption>

      <div className={styles.soDoDinh}>
        <div className={`${styles.o} ${styles.oGoc}`}>
          <strong>{nhan.hdqt}</strong>
          <span>Việt Đức Group</span>
          <em>{soHdqt}</em>
        </div>
        {soBks ? (
          <div className={`${styles.o} ${styles.oPhu}`}>
            <strong>{nhan.bks}</strong>
            <em>{soBks}</em>
          </div>
        ) : null}
      </div>

      <div className={styles.soDoNhanh}>
        {khoiTruong.map(({ truong: tr, hdt, bgh }) => (
          <div key={tr.id} className={styles.nhanh}>
            <div className={`${styles.o} ${styles.oTruong}`}>
              <strong>{t(tr.shortName as never, locale)}</strong>
              <span>
                {nhan.hdt} {hdt.length} · {nhan.bgh} {bgh.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
