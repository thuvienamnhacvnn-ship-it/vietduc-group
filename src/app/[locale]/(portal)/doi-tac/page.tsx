import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale, type L10nMap, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPartners, getSourceDocuments } from "@/lib/queries";
import { Breadcrumbs, EmptyState, SourceNote } from "@/components/ui";
import { PhotoSections } from "@/components/PhotoSections";
import { NHOM_DOI_TAC } from "@/content/anh-nhom";
import { khoAnh } from "@/content/kho-media";
import shell from "../page-shell.module.css";
import styles from "./partners.module.css";

const REGION_LABEL: Record<string, L10nMap> = {
  europe: { vi: "Châu Âu", en: "Europe", de: "Europa", ja: "ヨーロッパ", ko: "유럽", "zh-TW": "歐洲" },
  "middle-east": { vi: "Trung Đông & Tây Á", en: "Middle East & West Asia", de: "Naher Osten & Westasien", ja: "中東・西アジア", ko: "중동·서아시아", "zh-TW": "中東與西亞" },
  asia: { vi: "Châu Á", en: "Asia", de: "Asien", ja: "アジア", ko: "아시아", "zh-TW": "亞洲" },
};

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

  // Grouped by region, with the unassigned ones - direct partners of the group
  // rather than of the NIBELC network - shown first.
  const groups = new Map<string, typeof partners>();
  for (const partner of partners) {
    const key = partner.region ?? "direct";
    const list = groups.get(key) ?? [];
    list.push(partner);
    groups.set(key, list);
  }
  const order = ["direct", "europe", "middle-east", "asia", ...groups.keys()];
  const seen = new Set<string>();

  /* Ảnh mạng lưới đối tác lấy từ kho tiếp nhận. */
  const network = khoAnh("partners");

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.nav.partners }]} />
        <header className={shell.header}>
          <h1>{dict.home.partnersTitle}</h1>
          <p className={shell.lead}>
            {
              pick({
                vi: "Danh sách dưới đây được nêu trong hồ sơ năng lực của Việt Đức Group. Phần lớn đối tác quốc tế đến từ mạng lưới của NIBELC Group – đối tác chiến lược của Việt Đức Group – và được ghi rõ trong từng mục.",
                en: "The list below is named in the Viet Duc Group capability profile. Most international partners come through the network of NIBELC Group, a strategic partner of Viet Duc Group; each entry says which.",
                de: "Die folgende Liste stammt aus dem Leistungsprofil der Viet Duc Group. Die meisten internationalen Partner stammen aus dem Netzwerk der NIBELC Group, eines strategischen Partners; jeder Eintrag weist dies aus.",
                ja: "以下は Viet Duc Group の会社案内に記載された一覧です。海外提携先の多くは、Viet Duc Group の戦略的パートナーである NIBELC Group のネットワークを通じたもので、各項目にその旨を明記しています。",
                ko: "아래 목록은 Viet Duc Group 역량 소개서에 실린 것입니다. 해외 협력사의 대부분은 Viet Duc Group의 전략적 파트너인 NIBELC Group의 네트워크를 통한 곳이며, 항목마다 이를 밝혀 두었습니다.",
                "zh-TW": "以下清單載於 Viet Duc Group 的能力簡介。多數國際夥伴來自 Viet Duc Group 策略夥伴 NIBELC Group 的網絡，各項目均已註明。",
              }, locale)
            }
          </p>
        </header>

        {!partners.length ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          order.map((key) => {
            if (seen.has(key)) return null;
            seen.add(key);
            const list = groups.get(key);
            if (!list?.length) return null;
            const label =
              key === "direct"
                ? pick({ vi: "Đối tác và tổ chức thành viên", en: "Partners and member organisations", de: "Partner und Mitgliedsorganisationen", ja: "提携先と加盟団体", ko: "협력사와 회원 기관", "zh-TW": "合作夥伴與成員機構" }, locale)
                : (REGION_LABEL[key] ? pick(REGION_LABEL[key], locale) : key);

            return (
              <section key={key} className={styles.group}>
                <h2 className={styles.groupTitle}>{label}</h2>
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
              </section>
            );
          })
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
