import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getSchools } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/site-config";
import { Breadcrumbs, ButtonLink } from "@/components/ui";
import { SocialLinks, hasSocial } from "@/components/SocialLinks";
import shell from "../page-shell.module.css";
import styles from "./contact.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "vi";
  return {
    title: getDictionary(locale).contact.title,
    alternates: { canonical: `/${locale}/lien-he` },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const [settings, schools] = await Promise.all([getSiteSettings(), getSchools()]);
  const { contact, social } = settings;
  const tel = telHref(contact.phoneE164 || contact.phone);

  return (
    <div className={shell.page}>
      <div className="shell">
        <Breadcrumbs locale={locale} trail={[{ label: dict.contact.title }]} />
        <header className={shell.header}>
          <h1>{dict.contact.title}</h1>
          <p className={shell.lead}>
            {
              {
                vi: "Liên hệ trực tiếp với văn phòng tập đoàn, hoặc với phòng tuyển sinh của trường thành viên phụ trách ngành bạn quan tâm.",
                en: "Contact the group office directly, or the admissions office of the member school that runs the programme you are interested in.",
                de: "Wenden Sie sich an die Zentrale oder direkt an das Zulassungsbüro der zuständigen Mitgliedsschule.",
              }[locale]
            }
          </p>
        </header>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>{dict.contact.headquarters}</h2>
            <p className={styles.legal}>{contact.organisationLegalName}</p>
            <dl className={styles.details}>
              <div>
                <dt>{dict.contact.headquarters}</dt>
                <dd>{contact.headquarters}</dd>
              </div>
              {contact.phone ? (
                <div>
                  <dt>{dict.contact.phone}</dt>
                  <dd>{tel ? <a href={tel}>{contact.phone}</a> : contact.phone}</dd>
                </div>
              ) : null}
              {contact.email ? (
                <div>
                  <dt>{dict.contact.email}</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </dd>
                </div>
              ) : null}
              {contact.website ? (
                <div>
                  <dt>{dict.contact.website}</dt>
                  <dd>
                    <a href={contact.website} target="_blank" rel="noopener noreferrer">
                      {contact.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
              {contact.officeHours ? (
                <div>
                  <dt>{{ vi: "Giờ làm việc", en: "Office hours", de: "Öffnungszeiten" }[locale]}</dt>
                  <dd>{t(contact.officeHours, locale)}</dd>
                </div>
              ) : null}
            </dl>

            <div className={styles.actions}>
              {tel ? (
                <a href={tel} className={styles.callButton}>
                  {dict.contact.callNow}
                </a>
              ) : null}
              <ButtonLink href={localePath(locale, "/dao-tao/dang-ky-tu-van")} variant="secondary">
                {dict.nav.apply}
              </ButtonLink>
            </div>

            {hasSocial(social) ? (
              <div className={styles.social}>
                <h3>{dict.contact.followUs}</h3>
                <SocialLinks social={social} locale={locale} variant="boxed" />
              </div>
            ) : (
              <p className={styles.noSocial}>
                {
                  {
                    vi: "Các kênh mạng xã hội chính thức sẽ hiển thị tại đây khi được cập nhật trong trang quản trị.",
                    en: "Official social channels will appear here once they are set in the admin area.",
                    de: "Offizielle Social-Media-Kanäle erscheinen hier, sobald sie im Redaktionsbereich hinterlegt sind.",
                  }[locale]
                }
              </p>
            )}
          </section>

          <section className={styles.card}>
            <h2>{dict.contact.schoolsTitle}</h2>
            <ul className={styles.schools}>
              {schools.map((school) => {
                const schoolTel = telHref(school.phone ?? "");
                return (
                  <li key={school.id}>
                    <Link
                      href={localePath(locale, `/dao-tao/truong/${school.slug}`)}
                      className={styles.schoolName}
                    >
                      {t(school.shortName ?? school.name, locale)}
                    </Link>
                    {school.address ? <span className={styles.schoolLine}>{school.address}</span> : null}
                    <span className={styles.schoolContacts}>
                      {school.phone ? (
                        schoolTel ? (
                          <a href={schoolTel}>{school.phone}</a>
                        ) : (
                          <span>{school.phone}</span>
                        )
                      ) : null}
                      {school.email ? <a href={`mailto:${school.email}`}>{school.email}</a> : null}
                      {school.website ? (
                        <a href={school.website} target="_blank" rel="noopener noreferrer">
                          {school.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {contact.mapEmbedUrl ? (
          <section className={styles.map}>
            <iframe
              src={contact.mapEmbedUrl}
              title={dict.contact.headquarters}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}
