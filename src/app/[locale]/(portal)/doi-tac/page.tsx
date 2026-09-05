import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPartners, getSourceDocuments } from "@/lib/queries";
import { Breadcrumbs, EmptyState, SourceNote } from "@/components/ui";
import { PhotoWall } from "@/components/PhotoWall";
import { khoAnh } from "@/content/kho-media";
import shell from "../page-shell.module.css";
import styles from "./partners.module.css";

const REGION_LABEL: Record<string, { vi: string; en: string; de: string }> = {
  europe: { vi: "Châu Âu", en: "Europe", de: "Europa" },
  "middle-east": { vi: "Trung Đông & Tây Á", en: "Middle East & West Asia", de: "Naher Osten & Westasien" },
  asia: { vi: "Châu Á", en: "Asia", de: "Asien" },
};

const COUNTRY_LABEL: Record<string, { vi: string; en: string; de: string }> = {
  VN: { vi: "Việt Nam", en: "Vietnam", de: "Vietnam" },
  DE: { vi: "CHLB Đức", en: "Germany", de: "Deutschland" },
  AT: { vi: "Áo", en: "Austria", de: "Österreich" },
  GR: { vi: "Hy Lạp", en: "Greece", de: "Griechenland" },
  HU: { vi: "Hungary", en: "Hungary", de: "Ungarn" },
  AE: { vi: "UAE", en: "UAE", de: "VAE" },
  QA: { vi: "Qatar", en: "Qatar", de: "Katar" },
  KR: { vi: "Hàn Quốc", en: "South Korea", de: "Südkorea" },
  JP: { vi: "Nhật Bản", en: "Japan", de: "Japan" },
  KW: { vi: "Kuwait", en: "Kuwait", de: "Kuwait" },
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
              {
                vi: "Danh sách dưới đây được nêu trong hồ sơ năng lực của Việt Đức Group. Phần lớn đối tác quốc tế đến từ mạng lưới của NIBELC Group – đối tác chiến lược của Việt Đức Group – và được ghi rõ trong từng mục.",
                en: "The list below is named in the Viet Duc Group capability profile. Most international partners come through the network of NIBELC Group, a strategic partner of Viet Duc Group; each entry says which.",
                de: "Die folgende Liste stammt aus dem Leistungsprofil der Viet Duc Group. Die meisten internationalen Partner stammen aus dem Netzwerk der NIBELC Group, eines strategischen Partners; jeder Eintrag weist dies aus.",
              }[locale]
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
                ? { vi: "Đối tác và tổ chức thành viên", en: "Partners and member organisations", de: "Partner und Mitgliedsorganisationen" }[locale]
                : (REGION_LABEL[key]?.[locale] ?? key);

            return (
              <section key={key} className={styles.group}>
                <h2 className={styles.groupTitle}>{label}</h2>
                <ul className={styles.list}>
                  {list.map((partner) => (
                    <li key={partner.id}>
                      <span className={styles.name}>{partner.name}</span>
                      {partner.country ? (
                        <span className={styles.country}>
                          {COUNTRY_LABEL[partner.country]?.[locale] ?? partner.country}
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
                {
                  vi: "Mạng lưới trong ảnh",
                  en: "The network in pictures",
                  de: "Das Netz in Bildern",
                }[locale]
              }
            </h2>
            <PhotoWall
              shots={network.map((src) => ({
                src,
                alt: {
                  vi: "Hoạt động của mạng lưới đối tác",
                  en: "The partner network at work",
                  de: "Das Partnernetz bei der Arbeit",
                }[locale],
              }))}
              limit={24}
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
