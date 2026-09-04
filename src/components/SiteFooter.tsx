import Image from "next/image";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { telHref, type ContactSettings, type SocialSettings } from "@/lib/site-config";
import type { SchoolRow, CategoryRow } from "@/lib/queries";
import { SocialLinks, hasSocial } from "./SocialLinks";
import { NewsletterForm } from "./NewsletterForm";
import { FooterMap } from "./FooterMap";
import styles from "./SiteFooter.module.css";

type Props = {
  locale: Locale;
  contact: ContactSettings;
  social: SocialSettings;
  schools: SchoolRow[];
  categories: CategoryRow[];
};

/**
 * The footer, in three even bands.
 *
 * Top: the office - a map you can get directions from, beside the address and
 * the channels. Middle: four columns of equal weight, one per part of the site.
 * Bottom: the legal line. Each band is its own grid, so nothing has to be
 * nudged to look level with anything else.
 */
export function SiteFooter({ locale, contact, social, schools, categories }: Props) {
  const dict = getDictionary(locale);
  const path = (href: string) => localePath(locale, href);
  const tel = telHref(contact.phoneE164 || contact.phone);

  return (
    <footer className={`on-dark ${styles.footer}`}>
      {/* ------------------------------------------------------ the office */}
      <div className={`shell ${styles.office}`}>
        <div className={styles.officeText}>
          <Image
            src="/brand/viet-duc-group-logo.png"
            alt={dict.brand.name}
            width={459}
            height={167}
            className={styles.logo}
          />
          <p className={styles.motto}>{dict.brand.motto}</p>
          <p className={styles.legalName}>{contact.organisationLegalName}</p>

          <dl className={styles.contactList}>
            <div>
              <dt>{dict.footer.addressLabel}</dt>
              <dd>{contact.headquarters}</dd>
            </div>
            {tel ? (
              <div>
                <dt>{dict.footer.phoneLabel}</dt>
                <dd>
                  <a href={tel}>{contact.phone}</a>
                </dd>
              </div>
            ) : null}
            {contact.email ? (
              <div>
                <dt>{dict.footer.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
            ) : null}
            {contact.website ? (
              <div>
                <dt>{dict.footer.webLabel}</dt>
                <dd>
                  <a href={contact.website} target="_blank" rel="noopener noreferrer">
                    {contact.website.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>

          {hasSocial(social) ? (
            <div className={styles.socialWrap}>
              <h2 className={styles.colTitle}>{dict.contact.followUs}</h2>
              <SocialLinks social={social} locale={locale} variant="boxed" />
            </div>
          ) : null}
        </div>

        <FooterMap
          address={contact.headquarters}
          /* Trần Phú, Hà Nội. The window is wide enough to show the
             neighbourhood; the directions button searches the written address,
             so it resolves the building even if the pin is a few metres out. */
          bbox="105.7690,20.9660,105.7900,20.9780"
          marker="20.9718,105.7793"
          title={dict.footer.mapTitle}
          directionsLabel={dict.footer.directions}
        />
      </div>

      {/* -------------------------------------------------------- sitemap */}
      <div className={`shell ${styles.columns}`}>
        <nav aria-label={dict.footer.sitemap}>
          <h2 className={styles.colTitle}>{dict.nav.about}</h2>
          <ul>
            <li>
              <Link href={path("/gioi-thieu")}>{dict.nav.aboutGroup}</Link>
            </li>
            <li>
              <Link href={path("/tam-nhin-su-menh")}>{dict.nav.vision}</Link>
            </li>
            <li>
              <Link href={path("/doi-ngu")}>{dict.nav.people}</Link>
            </li>
            <li>
              <Link href={path("/doi-tac")}>{dict.nav.partners}</Link>
            </li>
            <li>
              <Link href={path("/hoat-dong")}>{dict.nav.activities}</Link>
            </li>
            <li>
              <Link href={path("/tin-tuc")}>{dict.nav.news}</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={dict.nav.programs}>
          <h2 className={styles.colTitle}>{dict.nav.programs}</h2>
          <ul>
            <li>
              <Link href={path("/dao-tao")}>{dict.hub.education.name}</Link>
            </li>
            <li>
              <Link href={path("/dao-tao/chuong-trinh")}>{dict.nav.explorer}</Link>
            </li>
            {categories.slice(0, 4).map((category) => (
              <li key={category.slug}>
                <Link href={path(`/dao-tao/chuong-trinh?linh-vuc=${category.slug}`)}>
                  {t(category.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.nav.schools}>
          <h2 className={styles.colTitle}>{dict.nav.schools}</h2>
          <ul>
            {schools.slice(0, 6).map((school) => (
              <li key={school.slug}>
                <Link href={path(`/dao-tao/truong/${school.slug}`)}>
                  {t(school.shortName ?? school.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.newsletterCol}>
          <h2 className={styles.colTitle}>{dict.newsletter.title}</h2>
          <p className={styles.newsletterLead}>{dict.newsletter.lead}</p>
          <NewsletterForm locale={locale} />
          <ul className={styles.quickLinks}>
            <li>
              <Link href={path("/dau-tu")}>{dict.hub.venture.name}</Link>
            </li>
            <li>
              <Link href={path("/lien-he")}>{dict.nav.contact}</Link>
            </li>
            <li>
              <Link href={path("/dao-tao/thu-vien-tai-lieu")}>{dict.nav.library}</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ---------------------------------------------------------- legal */}
      <div className={styles.bottom}>
        <div className={`shell ${styles.bottomInner}`}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} {dict.brand.name}. {dict.footer.rights}
          </p>
          <ul className={styles.legalLinks}>
            <li>
              <Link href={path("/chinh-sach-bao-mat")}>{dict.footer.privacy}</Link>
            </li>
            <li>
              <Link href={path("/chinh-sach-cookie")}>{dict.footer.cookies}</Link>
            </li>
            <li>
              <Link href={path("/dieu-khoan-su-dung")}>{dict.footer.terms}</Link>
            </li>
            <li>
              <Link href={path("/impressum")}>{dict.footer.imprint}</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
