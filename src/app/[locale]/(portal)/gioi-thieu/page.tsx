import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getPage, getPartners, getPrograms, getSchools } from "@/lib/queries";
import { ArrowLink, Breadcrumbs, Prose, SectionHeading, StatRow } from "@/components/ui";
import { PageHead } from "@/components/PageHead";
import shell from "../page-shell.module.css";
import styles from "./about.module.css";

const SLUG = "gioi-thieu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  const page = await getPage(SLUG);
  if (!page) return {};
  return {
    title: page.seoTitle ? t(page.seoTitle, locale) : t(page.title, locale),
    description: page.seoDescription ? t(page.seoDescription, locale) : undefined,
    alternates: { canonical: `/${locale}/${SLUG}` },
  };
}

/**
 * The group's own page.
 *
 * The text is the same editable page row the generic CMS template renders -
 * this route exists only to give it somewhere better to live. As plain prose in
 * a narrow column it was a wall of type on paper, which is the wrong first
 * impression for the page a visitor opens to decide whether the group is real.
 *
 * So the words keep their place, and everything the site already knows is set
 * around them: the building, the count of schools and programmes actually
 * registered, photographs from the workshops and the ceremonies, and the crests
 * of the six member schools.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);

  const [page, schools, programs, partners] = await Promise.all([
    getPage(SLUG),
    getSchools(),
    getPrograms(),
    getPartners(),
  ]);
  if (!page) notFound();

  const pick = (vi: string, en: string, de: string): string => ({ vi, en, de })[locale];

  const stats = [
    {
      value: String(schools.length),
      label: pick("trường thành viên", "member schools", "Mitgliedsschulen"),
    },
    {
      value: String(programs.length),
      label: pick("ngành đã đăng ký", "registered programmes", "registrierte Programme"),
    },
    {
      value: String(partners.length),
      label: pick("doanh nghiệp đối tác", "partner employers", "Partnerunternehmen"),
    },
    {
      value: "2",
      label: pick("quốc gia", "countries", "Länder"),
    },
  ];

  /* The workshops and the ceremonies: what the group does, not what it says. */
  const mosaic = [
    {
      src: "/media/education/xuong-thuc-hanh-may.webp",
      alt: pick("Xưởng thực hành cơ khí", "The machining workshop", "Die Maschinenwerkstatt"),
      wide: true,
    },
    {
      src: "/media/education/nghiep-vu-le-tan.webp",
      alt: pick("Thực hành nghiệp vụ lễ tân", "Front-office training", "Rezeptionstraining"),
      wide: false,
    },
    {
      src: "/media/education/gap-doi-tac-chau-au.webp",
      alt: pick(
        "Làm việc với đối tác châu Âu",
        "Meeting European partners",
        "Treffen mit europäischen Partnern",
      ),
      wide: false,
    },
    {
      src: "/media/education/tien-hoc-vien-len-duong.webp",
      alt: pick(
        "Tiễn học viên lên đường",
        "Seeing students off",
        "Verabschiedung der Auszubildenden",
      ),
      wide: true,
    },
  ];

  return (
    <div className={shell.page}>
      <div className="shell">
        <PageHead
          crumbs={<Breadcrumbs locale={locale} trail={[{ label: t(page.title, locale) }]} />}
          eyebrow={pick("Việt Đức Group", "Viet Duc Group", "Viet Duc Group")}
          title={t(page.title, locale)}
          lead={dict.brand.motto}
        />
      </div>

      {/* The building, full width, with the numbers riding its lower edge. */}
      <section className={styles.hero}>
        <Image
          src="/media/hero/vdg-banner-16x9.webp"
          alt={pick(
            "Trụ sở Việt Đức Group",
            "The Viet Duc Group headquarters",
            "Der Hauptsitz der Viet Duc Group",
          )}
          width={1672}
          height={941}
          priority
          className={styles.heroImage}
        />
        <span className={styles.heroFade} aria-hidden="true" />
      </section>

      <div className={`shell ${styles.statWrap}`}>
        <StatRow stats={stats} />
      </div>

      {/* The editable text, with photographs beside it rather than under it. */}
      <section className={`section ${styles.storySection}`}>
        <div className="shell">
          <div className={styles.story}>
            <div className={styles.storyText}>
              {page.body ? <Prose markdown={t(page.body, locale)} /> : null}
              <div className={styles.storyLinks}>
                <ArrowLink href={path("/tam-nhin-su-menh")}>{dict.nav.vision}</ArrowLink>
                <ArrowLink href={path("/dao-tao/truong")}>{dict.nav.schools}</ArrowLink>
              </div>
            </div>

            <aside className={styles.storyAside} data-reveal>
              <figure className={styles.asideFigure}>
                <Image
                  src="/media/education/cong-truong-ky-thuat.webp"
                  alt={pick(
                    "Giờ thực hành kỹ thuật",
                    "A technical practical",
                    "Technische Übungsstunde",
                  )}
                  width={1400}
                  height={1000}
                />
              </figure>
              <figure className={styles.asideFigure}>
                <Image
                  src="/media/education/trao-thuong-hoc-sinh.webp"
                  alt={pick("Trao thưởng cho học sinh", "Prize-giving", "Preisverleihung")}
                  width={1400}
                  height={1000}
                />
              </figure>
            </aside>
          </div>
        </div>
      </section>

      {/* A band of what the schools actually do. */}
      <section className={`section ${styles.mosaicSection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={pick("Bên trong hệ thống", "Inside the network", "Im Verbund")}
            title={pick(
              "Học ở xưởng, ở bếp, ở quầy lễ tân",
              "Taught in the workshop, the kitchen, at the front desk",
              "Unterricht in Werkstatt, Küche und an der Rezeption",
            )}
            lead={pick(
              "Ảnh chụp tại các trường thành viên: giờ thực hành, lễ trao thưởng và những buổi làm việc với đối tác nước ngoài.",
              "Photographs from the member schools: practicals, prize-givings and working sessions with partners abroad.",
              "Aufnahmen aus den Mitgliedsschulen: Übungsstunden, Preisverleihungen und Arbeitstreffen mit Partnern im Ausland.",
            )}
          />
        </div>
        <div className={styles.mosaicWrap}>
          <ul className={styles.mosaic}>
            {mosaic.map((shot, i) => (
              <li
                key={shot.src}
                className={shot.wide ? styles.mosaicWide : undefined}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1400}
                  height={1000}
                  sizes="(min-width: 900px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The crests, as proof the network is six real institutions. */}
      <section className={`section ${styles.crestSection}`}>
        <div className="shell">
          <SectionHeading
            eyebrow={pick("Hệ thống", "The network", "Der Verbund")}
            title={dict.home.schoolsTitle}
          />
          <ul className={styles.crests}>
            {schools.map((school) => (
              <li key={school.id}>
                {school.logoPath ? (
                  <Image
                    src={school.logoPath}
                    alt={t(school.shortName ?? school.name, locale)}
                    width={160}
                    height={160}
                  />
                ) : null}
                <span>{t(school.shortName ?? school.name, locale)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.crestMore}>
            <ArrowLink href={path("/dao-tao/truong")}>{dict.common.viewAll}</ArrowLink>
          </div>
        </div>
      </section>
    </div>
  );
}
