import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale, type L10nMap, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPartners, getSourceDocuments } from "@/lib/queries";
import { Breadcrumbs, EmptyState, SourceNote } from "@/components/ui";
import { PhotoSections } from "@/components/PhotoSections";
import { NHOM_DOI_TAC } from "@/content/anh-nhom";
import { khoAnh } from "@/content/kho-media";
import { MangLuoiNibelc } from "@/components/mang-luoi/MangLuoiNibelc";
import { VIA_NIBELC } from "@/content/seed/network";
import shell from "../page-shell.module.css";
import styles from "./partners.module.css";

const COUNTRY_LABEL: Record<string, L10nMap> = {
  VN: { vi: "Việt Nam", en: "Vietnam", de: "Vietnam", ja: "ベトナム", ko: "베트남", "zh-TW": "越南" },
  DE: { vi: "CHLB Đức", en: "Germany", de: "Deutschland", ja: "ドイツ連邦共和国", ko: "독일 연방공화국", "zh-TW": "德意志聯邦共和國" },
  AT: { vi: "Áo", en: "Austria", de: "Österreich", ja: "オーストリア", ko: "오스트리아", "zh-TW": "奧地利" },
  GR: { vi: "Hy Lạp", en: "Greece", de: "Griechenland", ja: "ギリシャ", ko: "그리스", "zh-TW": "希臘" },
  HU: { vi: "Hungary", en: "Hungary", de: "Ungarn", ja: "ハンガリー", ko: "헝가리", "zh-TW": "匈牙利" },
  AE: { vi: "UAE", en: "UAE", de: "VAE", ja: "アラブ首長国連邦", ko: "아랍에미리트", "zh-TW": "阿拉伯聯合大公國" },
  QA: { vi: "Qatar", en: "Qatar", de: "Katar", ja: "カタール", ko: "카타르", "zh-TW": "卡達" },
  KR: { vi: "Hàn Quốc", en: "South Korea", de: "Südkorea", ja: "韓国", ko: "대한민국", "zh-TW": "韓國" },
  JP: { vi: "Nhật Bản", en: "Japan", de: "Japan", ja: "日本", ko: "일본", "zh-TW": "日本" },
  IN: { vi: "Ấn Độ", en: "India", de: "Indien", ja: "インド", ko: "인도", "zh-TW": "印度" },
  MY: { vi: "Malaysia", en: "Malaysia", de: "Malaysia", ja: "マレーシア", ko: "말레이시아", "zh-TW": "馬來西亞" },
  RO: { vi: "Romania", en: "Romania", de: "Rumänien", ja: "ルーマニア", ko: "루마니아", "zh-TW": "羅馬尼亞" },
  KW: { vi: "Kuwait", en: "Kuwait", de: "Kuwait", ja: "クウェート", ko: "쿠웨이트", "zh-TW": "科威特" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).nav.partners,
    alternates: { canonical: `/${locale}/doi-tac` },
  };
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [partners, documents] = await Promise.all([getPartners(), getSourceDocuments()]);
  const profile = documents.find((d) => d.slug === "profile-viet-duc-vi");

  /*
   * Danh sách theo nước của mạng lưới NIBELC nằm trong khối MangLuoiNibelc
   * (theo danh sách tập đoàn gửi). Từ cơ sở dữ liệu chỉ còn lấy hai phần mà
   * danh sách ấy không có: đối tác trực tiếp của Việt Đức (không gắn khu vực),
   * và những mốc hợp tác có ngày tháng, việc cụ thể — bản ghi nào chỉ mang câu
   * chung "đối tác trong mạng lưới NIBELC" thì đã có mặt trong bảng ở trên.
   */
  const direct = partners.filter((p) => !p.region);
  const milestones = partners.filter((p) => p.region && p.note && p.note.vi !== VIA_NIBELC.vi);

  /* Ảnh mạng lưới đối tác lấy từ kho tiếp nhận. */
  const network = khoAnh("partners");

  const renderList = (list: typeof partners) => (
    <ul className={styles.list}>
      {list.map((partner) => (
        <li key={partner.id}>
          <span className={styles.name}>{partner.name}</span>
          {partner.country ? (
            <span className={styles.country}>
              {COUNTRY_LABEL[partner.country]
                ? pick(COUNTRY_LABEL[partner.country], locale)
                : partner.country}
            </span>
          ) : null}
          {partner.note ? (
            <span className={styles.note}>{t(partner.note, locale)}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.partners }]} />
        <header className={shell.header}>
          <h1>{dict.home.partnersTitle}</h1>
          <p className={shell.lead}>
            {
              pick({
                vi: "Việt Đức Group hợp tác trực tiếp với doanh nghiệp và nhà trường trong, ngoài nước, và mở đường ra thị trường quốc tế qua mạng lưới của NIBELC Group – đối tác chiến lược của tập đoàn.",
                en: "Viet Duc Group works directly with employers and schools at home and abroad, and reaches international markets through the network of NIBELC Group, the group's strategic partner.",
                de: "Die Viet Duc Group arbeitet direkt mit Unternehmen und Schulen im In- und Ausland zusammen und erreicht internationale Märkte über das Netzwerk der NIBELC Group, ihres strategischen Partners.",
                ja: "Viet Duc Group は国内外の企業・教育機関と直接連携し、戦略的パートナーである NIBELC Group のネットワークを通じて海外市場へ道を開いています。",
                ko: "Viet Duc Group은 국내외 기업·학교와 직접 협력하고, 전략적 파트너인 NIBELC Group의 네트워크를 통해 해외 시장으로 길을 열고 있습니다.",
                "zh-TW": "Viet Duc Group 與國內外企業、學校直接合作，並透過策略夥伴 NIBELC Group 的網絡通往國際市場。",
              }, locale)
            }
          </p>
        </header>
      </div>

      <MangLuoiNibelc locale={locale} />

      <div className="shell">
        {!partners.length ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          <>
            {direct.length ? (
              <section className={styles.group}>
                <h2 className={styles.groupTitle}>
                  {pick({ vi: "Đối tác trực tiếp và tổ chức thành viên", en: "Direct partners and member organisations", de: "Direkte Partner und Mitgliedsorganisationen", ja: "直接の提携先と加盟団体", ko: "직접 협력사와 회원 기관", "zh-TW": "直接合作夥伴與成員機構" }, locale)}
                </h2>
                {renderList(direct)}
              </section>
            ) : null}
            {milestones.length ? (
              <section className={styles.group}>
                <h2 className={styles.groupTitle}>
                  {pick({ vi: "Dấu mốc hợp tác quốc tế", en: "International cooperation milestones", de: "Meilensteine der internationalen Zusammenarbeit", ja: "国際協力のあゆみ", ko: "국제 협력의 이정표", "zh-TW": "國際合作里程碑" }, locale)}
                </h2>
                {renderList(milestones)}
              </section>
            ) : null}
          </>
        )}

        {/* Ảnh mạng lưới đối tác: văn phòng NIBELC ở Hungary, Ba Lan, Rumani,
            Đức, các buổi ký kết và tuyển dụng. */}
        {network.length ? (
          <section className={styles.gallery}>
            <h2>
              {
                pick({
                  vi: "Mạng lưới trong ảnh",
                  en: "The network in pictures",
                  de: "Das Netz in Bildern",
                  ja: "写真で見るネットワーク",
                  ko: "사진으로 보는 네트워크",
                  "zh-TW": "影像中的網絡",
                }, locale)
              }
            </h2>
            <PhotoSections
              groups={NHOM_DOI_TAC}
              all={network}
              locale={locale}
              otherLabel={{ vi: "Hình ảnh khác", en: "Other photographs", de: "Weitere Aufnahmen", ja: "その他の写真", ko: "그 밖의 사진", "zh-TW": "其他照片" }}
              alt={(nhom) => nhom}
            />
          </section>
        ) : null}

        {profile ? (
          <div className={styles.source}>
            <SourceNote locale={locale} source={t(profile.title, locale)} page={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
