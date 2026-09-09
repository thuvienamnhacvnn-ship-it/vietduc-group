import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  getPeople,
  getSchools,
  type NguoiDayDu,
  type ChucVuRow,
} from "@/lib/queries";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { ChanDung } from "@/components/nhan-su/ChanDung";
import { MangLuoi } from "@/components/nhan-su/MangLuoi";
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

type Ghe = { nguoi: NguoiDayDu; cv: ChucVuRow };

/**
 * Cơ cấu nhân sự toàn hệ thống.
 *
 * Trục của trang là CƠ CẤU, không phải danh bạ: người đọc cần trả lời được "ai
 * chịu trách nhiệm gì, ở đâu". Nhưng cơ cấu không có nghĩa là vẽ mấy cái hộp
 * nối bằng đường kẻ — bản trước làm thế và nó đọc ra như một sơ đồ dán trên
 * tường phòng hành chính.
 *
 * Nay thứ bậc thể hiện bằng CHỖ ĐỨNG và KÍCH THƯỚC: người đứng đầu được một
 * khối trang trọng riêng có câu nói của chính ông; các ban còn lại là lưới thẻ
 * đều nhau; mỗi trường mở đầu bằng logo của trường ấy. Không hộp, không mũi
 * tên, không badge đếm số.
 *
 * Một người xuất hiện ở nhiều khối, đúng như ngoài đời. Ở mỗi khối, chức danh
 * hiện ra là chức danh TẠI ĐƠN VỊ ẤY — nếu không thì khối "Hội đồng trường
 * Bách Khoa Vũng Tàu" sẽ hiện một loạt "Chủ tịch HĐQT Việt Đức Group" và chẳng
 * nói lên điều gì về hội đồng ấy cả.
 */
export default async function PeoplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [nguoi, truong] = await Promise.all([getPeople(), getSchools()]);

  const trongBan = (loc: (cv: ChucVuRow) => boolean): Ghe[] =>
    nguoi
      .flatMap((p) => p.chucVu.filter(loc).map((cv) => ({ nguoi: p, cv })))
      .sort((a, b) => a.cv.rank - b.cv.rank || a.nguoi.order - b.nguoi.order);

  const hdqt = trongBan((cv) => cv.body === "hdqt" && !cv.schoolId);
  const dieuHanh = trongBan((cv) => cv.body === "dieuhanh");
  // Chỉ ghế cấp tập đoàn. Thiếu điều kiện này thì khối "Ban Kiểm soát" của
  // tập đoàn nuốt luôn ban kiểm soát của cả sáu trường — 21 người trong một ban
  // ba người.
  const bks = trongBan((cv) => cv.body === "bks" && !cv.schoolId);

  /*
   * Người đứng đầu có khối trang trọng riêng ở đầu trang, NHƯNG vẫn nằm trong
   * danh sách Hội đồng quản trị bên dưới.
   *
   * Bản trước cắt ông khỏi danh sách để tránh lặp, và hệ quả là khối "Hội đồng
   * quản trị" hiện ra hai người trong khi hội đồng có ba. Một danh sách cơ cấu
   * thiếu người đứng đầu thì không còn là cơ cấu.
   */
  const dungDau = hdqt[0] ?? null;

  const khoiTruong = truong
    .map((tr) => ({
      truong: tr,
      hdt: trongBan((cv) => cv.body === "hdt" && cv.schoolId === tr.id),
      bgh: trongBan((cv) => cv.body === "bgh" && cv.schoolId === tr.id),
      bksTruong: trongBan((cv) => cv.body === "bks" && cv.schoolId === tr.id),
    }))
    .filter((k) => k.hdt.length || k.bgh.length || k.bksTruong.length);

  const nhan = {
    hdqt: pick(
      {
        vi: "Hội đồng quản trị",
        en: "Board of Directors",
        de: "Verwaltungsrat",
        ja: "取締役会",
        ko: "이사회",
        "zh-TW": "董事會",
      },
      locale,
    ),
    dieuHanh: pick(
      {
        vi: "Ban Điều hành",
        en: "Executive Board",
        de: "Geschäftsführung",
        ja: "執行部",
        ko: "집행부",
        "zh-TW": "經營團隊",
      },
      locale,
    ),
    bks: pick(
      {
        vi: "Ban Kiểm soát",
        en: "Supervisory Board",
        de: "Aufsichtsrat",
        ja: "監査役会",
        ko: "감사위원회",
        "zh-TW": "監事會",
      },
      locale,
    ),
    hdt: pick(
      {
        vi: "Hội đồng trường",
        en: "School Council",
        de: "Schulrat",
        ja: "学校評議会",
        ko: "학교 이사회",
        "zh-TW": "校務委員會",
      },
      locale,
    ),
    bgh: pick(
      {
        vi: "Ban Giám hiệu",
        en: "School Executive",
        de: "Schulleitung",
        ja: "学校執行部",
        ko: "학교 집행부",
        "zh-TW": "校領導班子",
      },
      locale,
    ),
    tapDoan: pick(
      {
        vi: "Cấp tập đoàn",
        en: "Group level",
        de: "Konzernebene",
        ja: "グループ本部",
        ko: "그룹 본부",
        "zh-TW": "集團層級",
      },
      locale,
    ),
    truong: pick(
      {
        vi: "Các trường thành viên",
        en: "Member schools",
        de: "Mitgliedsschulen",
        ja: "加盟校",
        ko: "회원 학교",
        "zh-TW": "成員學校",
      },
      locale,
    ),
    nguoi: pick(
      {
        vi: "nhân sự",
        en: "people",
        de: "Personen",
        ja: "名",
        ko: "명",
        "zh-TW": "人",
      },
      locale,
    ),
    chucVu: pick(
      {
        vi: "chức vụ",
        en: "appointments",
        de: "Ämter",
        ja: "の役職",
        ko: "개 직책",
        "zh-TW": "項職務",
      },
      locale,
    ),
    donVi: pick(
      {
        vi: "đơn vị",
        en: "institutions",
        de: "Einrichtungen",
        ja: "の機関",
        ko: "개 기관",
        "zh-TW": "個機構",
      },
      locale,
    ),
  };

  const soChucVu = nguoi.reduce((n, p) => n + p.chucVu.length, 0);

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.people }]} />
        <header className={styles.dau}>
          <h1>{dict.nav.people}</h1>
          <p className={styles.lead}>
            {pick(
              {
                vi: "Hội đồng quản trị, ban điều hành, ban kiểm soát và bộ máy lãnh đạo của từng trường thành viên. Nhiều người giữ chức vụ ở nhiều đơn vị, nên mỗi nơi ghi đúng chức danh tại đơn vị đó.",
                en: "The board, the executive, the supervisory board and the leadership of each member school. Several people hold posts at more than one institution, so each block shows the title held there.",
                de: "Verwaltungsrat, Geschäftsführung, Aufsichtsrat und die Leitung jeder Mitgliedsschule. Mehrere Personen haben Ämter an mehreren Einrichtungen; jeder Block nennt daher das dort geführte Amt.",
                ja: "取締役会、執行部、監査役会、そして加盟各校の経営体制です。複数の機関で役職を兼ねる方がいるため、各欄にはその機関での役職を記しています。",
                ko: "이사회와 집행부, 감사위원회, 그리고 각 회원 학교의 지도부입니다. 여러 기관에서 직책을 겸하는 분들이 있어, 각 항목에는 해당 기관에서의 직책을 적었습니다.",
                "zh-TW":
                  "董事會、經營團隊、監事會，以及各成員學校的領導層。多位成員身兼數個機構的職務，因此每一區塊標示的是在該機構的職稱。",
              },
              locale,
            )}
          </p>

          {nguoi.length ? (
            <dl className={styles.soLieu}>
              <div>
                <dt>{nguoi.length}</dt>
                <dd>{nhan.nguoi}</dd>
              </div>
              <div>
                <dt>{soChucVu}</dt>
                <dd>{nhan.chucVu}</dd>
              </div>
              <div>
                <dt>{khoiTruong.length + 1}</dt>
                <dd>{nhan.donVi}</dd>
              </div>
            </dl>
          ) : null}
        </header>

        {!nguoi.length ? (
          <EmptyState
            title={pick(
              {
                vi: "Chưa công bố thông tin nhân sự",
                en: "Staff information not published yet",
                de: "Angaben zum Team noch nicht veröffentlicht",
                ja: "人事情報はまだ公開されていません",
                ko: "인사 정보는 아직 공개되지 않았습니다",
                "zh-TW": "尚未公布人事資訊",
              },
              locale,
            )}
            hint={pick(
              {
                vi: "Trang này hiển thị ngay khi biên tập viên duyệt hồ sơ trong trang quản trị.",
                en: "The page fills in as soon as an editor approves the profiles in the admin area.",
                de: "Die Seite füllt sich, sobald die Redaktion die Profile freigibt.",
                ja: "編集者が管理画面で承認しだい、このページに表示されます。",
                ko: "편집자가 관리 화면에서 승인하는 대로 이 페이지에 표시됩니다.",
                "zh-TW": "待編輯者於管理後台審核後，本頁即會顯示。",
              },
              locale,
            )}
          />
        ) : (
          <>
            {dungDau ? <DungDau locale={locale} ghe={dungDau} /> : null}

            {/*
              Mạng lưới đặt TRƯỚC các danh sách, không phải sau.

              Nó trả lời câu hỏi "hệ thống này nối với nhau thế nào" trong một
              cái nhìn; các khối bên dưới mới là chỗ tra cứu từng ban. Đảo thứ
              tự thì người đọc phải cuộn qua bốn màn hình danh sách rồi mới
              hiểu được cấu trúc.
            */}
            <MangLuoi
              locale={locale}
              nhanTam="Việt Đức Group"
              donVi={[
                { khoa: "hdqt", ten: nhan.hdqt, loai: "ban" },
                { khoa: "dieuhanh", ten: nhan.dieuHanh, loai: "ban" },
                { khoa: "bks", ten: nhan.bks, loai: "ban" },
                ...khoiTruong.map((k) => ({
                  khoa: `truong-${k.truong.id}`,
                  ten: t(k.truong.shortName ?? k.truong.name, locale),
                  loai: "truong" as const,
                  logo: k.truong.logoPath,
                })),
              ]}
              nguoi={nguoi.map((p) => {
                const tu = p.name.trim().split(/\s+/);
                return {
                  slug: p.slug,
                  ten: p.name,
                  hocVi: p.honorific,
                  chuCai: (
                    tu[tu.length - 1]?.[0] ??
                    p.name[0] ??
                    "?"
                  ).toUpperCase(),
                  anh: p.photoPath,
                  chuc: p.headline ? t(p.headline, locale) : "",
                  // Một người nối tới mọi đơn vị mình giữ chức. Chức vụ ở pháp
                  // nhân ngoài hệ thống (NIBELC, ITW Berlin) không có nút riêng
                  // nên bỏ qua, nếu không mạng lưới mọc thêm những nhánh cụt.
                  donVi: [
                    ...new Set(
                      p.chucVu
                        .map((cv) =>
                          cv.schoolId
                            ? `truong-${cv.schoolId}`
                            : cv.body === "hdqt" ||
                                cv.body === "dieuhanh" ||
                                cv.body === "bks"
                              ? cv.body
                              : null,
                        )
                        .filter((x): x is string => x !== null),
                    ),
                  ],
                };
              })}
            />

            <section className={styles.cap}>
              <h2 className={styles.capTieuDe}>
                <span>{nhan.tapDoan}</span>
              </h2>
              <div className={styles.capLuoi}>
                <Ban locale={locale} ten={nhan.hdqt} ds={hdqt} />
                <Ban locale={locale} ten={nhan.dieuHanh} ds={dieuHanh} />
                <Ban locale={locale} ten={nhan.bks} ds={bks} />
              </div>
            </section>

            <section className={styles.cap}>
              <h2 className={styles.capTieuDe}>
                <span>{nhan.truong}</span>
              </h2>
              {khoiTruong.map(({ truong: tr, hdt, bgh, bksTruong }) => (
                <article
                  key={tr.id}
                  className={styles.truong}
                  data-reveal
                  suppressHydrationWarning
                >
                  <header className={styles.truongDau}>
                    {tr.logoPath ? (
                      <Image
                        src={tr.logoPath}
                        alt=""
                        width={104}
                        height={104}
                        className={styles.truongLogo}
                      />
                    ) : null}
                    <div>
                      <h3>{t(tr.shortName ?? tr.name, locale)}</h3>
                      {tr.city ? <p>{t(tr.city, locale)}</p> : null}
                    </div>
                  </header>
                  <div className={styles.capLuoi}>
                    <Ban locale={locale} ten={nhan.hdt} ds={hdt} />
                    <Ban locale={locale} ten={nhan.bgh} ds={bgh} />
                    <Ban locale={locale} ten={nhan.bks} ds={bksTruong} />
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

/**
 * Khối người đứng đầu.
 *
 * Một tập đoàn giới thiệu bộ máy của mình thì bắt đầu bằng người chịu trách
 * nhiệm cao nhất, và bắt đầu bằng lời của chính người ấy — không phải bằng một
 * ô vuông có chữ "Hội đồng quản trị" ở giữa.
 */
function DungDau({ locale, ghe }: { locale: Locale; ghe: Ghe }) {
  const { nguoi: p, cv } = ghe;
  return (
    <section className={styles.trum} data-reveal suppressHydrationWarning>
      <Link href={`/${locale}/doi-ngu/${p.slug}`} className={styles.trumLink}>
        {p.photoPath ? (
          <span className={styles.trumAnh}>
            <span className={styles.trumAnhTrong}>
              <Image
                src={p.photoPath}
                alt=""
                width={640}
                height={640}
                priority
                className={styles.anh}
              />
            </span>
            {/*
              Nét sáng chạy quanh khung.

              Vẽ bằng SVG chứ không bằng viền CSS, vì chỉ nét vẽ mới cắt được
              thành đoạn rồi trượt dọc theo đường bo góc. Khung ảnh luôn theo tỉ
              lệ 4/5 nên viewBox 400x500 khớp đúng, không méo.
            */}
            <svg
              className={styles.trumVien}
              viewBox="0 0 400 500"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                className={styles.trumVienDuoi}
                x="1.6"
                y="1.6"
                width="396.8"
                height="496.8"
                rx="19"
                pathLength="100"
              />
              <rect
                className={styles.trumVienNet}
                x="1.6"
                y="1.6"
                width="396.8"
                height="496.8"
                rx="19"
                pathLength="100"
              />
            </svg>
          </span>
        ) : (
          <ChanDung ten={p.name} anh={null} lon />
        )}
        <div className={styles.trumChu}>
          <p className={styles.trumChuc}>{t(cv.title, locale)}</p>
          <h2 className={styles.trumTen}>
            {p.honorific ? (
              <span className={styles.hocVi}>{p.honorific} </span>
            ) : null}
            {p.name}
          </h2>
          {p.quote ? (
            <p className={styles.trumTrich}>{t(p.quote, locale)}</p>
          ) : null}
        </div>
      </Link>
    </section>
  );
}

/** Một ban: tên ban, nhiệm kỳ nếu có, và lưới thẻ người. */
function Ban({ locale, ten, ds }: { locale: Locale; ten: string; ds: Ghe[] }) {
  if (!ds.length) return null;
  const moc = ds.find((x) => x.cv.term)?.cv;
  return (
    <section className={styles.ban}>
      <header className={styles.banDau}>
        <h4>{ten}</h4>
        {moc?.term ? (
          <p className={styles.nhiemKy}>
            {pick(
              {
                vi: "Nhiệm kỳ",
                en: "Term",
                de: "Amtszeit",
                ja: "任期",
                ko: "임기",
                "zh-TW": "任期",
              },
              locale,
            )}{" "}
            {moc.term}
            {moc.decisionRef ? (
              <span className={styles.quyetDinh}>{moc.decisionRef}</span>
            ) : null}
          </p>
        ) : null}
      </header>
      <ul className={styles.dsNguoi}>
        {ds.map(({ nguoi: p, cv }) => (
          <li key={`${p.id}-${cv.id}`}>
            <Link href={`/${locale}/doi-ngu/${p.slug}`} className={styles.the}>
              <span className={styles.theAnh}>
                {p.photoPath ? (
                  <Image
                    src={p.photoPath}
                    alt=""
                    width={640}
                    height={640}
                    sizes="(min-width: 1100px) 20vw, (min-width: 700px) 33vw, 90vw"
                    className={styles.anh}
                  />
                ) : (
                  <ChanDung ten={p.name} anh={null} lon />
                )}
                {/* Chức danh nằm TRÊN ảnh, ở dải tối dưới chân — đọc được ngay
                    mà không cần thêm một hàng chữ dưới thẻ. */}
                <span className={styles.theChuc}>{t(cv.title, locale)}</span>
              </span>
              <span className={styles.theChu}>
                <span className={styles.theTen}>
                  {p.honorific ? (
                    <span className={styles.hocVi}>{p.honorific} </span>
                  ) : null}
                  {p.name}
                </span>
                {p.birthYear ? (
                  <span className={styles.theNam}>{p.birthYear}</span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
