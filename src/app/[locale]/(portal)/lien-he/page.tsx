import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, t, type Locale, pick } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getSchools } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/site-config";
import { ArrowLink, Breadcrumbs, ButtonLink } from "@/components/ui";
import { SocialLinks, hasSocial } from "@/components/SocialLinks";
import { PageHead } from "@/components/PageHead";
import { FooterMap } from "@/components/FooterMap";
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
        <PageHead
          crumbs={<Breadcrumbs locale={locale} trail={[{ label: dict.contact.title }]} />}
          eyebrow={pick({ vi: "Liên hệ", en: "Contact", de: "Kontakt", ja: "お問い合わせ", ko: "문의하기", "zh-TW": "聯絡我們" }, locale)}
          title={dict.contact.title}
          lead={
            pick({
              vi: "Liên hệ trực tiếp với văn phòng tập đoàn, hoặc với phòng tuyển sinh của trường thành viên phụ trách ngành bạn quan tâm.",
              en: "Contact the group office directly, or the admissions office of the member school that runs the programme you are interested in.",
              de: "Wenden Sie sich an die Zentrale oder direkt an das Zulassungsbüro der zuständigen Mitgliedsschule.",
              ja: "グループ本部へ直接、またはご関心の課程を運営する加盟校の入学窓口へ、どちらでもご連絡いただけます。",
              ko: "그룹 본부로 직접 연락하시거나, 관심 있는 과정을 운영하는 회원 학교의 입학 담당 부서로 연락하셔도 됩니다.",
              "zh-TW": "您可直接聯絡集團辦公室，或聯絡開設該課程之成員學校的招生單位。",
            }, locale)
          }
        />
        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>{dict.contact.headquarters}</h2>
            <p className={styles.legal}>{contact.organisationLegalName}</p>
            <dl className={styles.details}>
              {/*
                Hai văn phòng, mỗi nơi một dòng có tên thành phố đứng trước.

                Gộp cả hai vào một dòng "trụ sở" thì người đọc không biết cái
                nào là cái nào; mà bỏ bớt một cái thì nửa hệ thống ở Quảng Trị
                biến mất khỏi trang liên hệ.
              */}
              {contact.offices?.length ? (
                contact.offices.map((vp, i) => (
                  <div key={i}>
                    <dt>{pick(vp.city, locale)}</dt>
                    <dd>{pick(vp.address, locale)}</dd>
                  </div>
                ))
              ) : (
                <div>
                  <dt>{dict.contact.headquarters}</dt>
                  <dd>{contact.headquarters}</dd>
                </div>
              )}
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
                  <dt>{pick({ vi: "Giờ làm việc", en: "Office hours", de: "Öffnungszeiten", ja: "受付時間", ko: "업무 시간", "zh-TW": "服務時間" }, locale)}</dt>
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
                  pick({
                    vi: "Các kênh mạng xã hội chính thức sẽ hiển thị tại đây khi được cập nhật trong trang quản trị.",
                    en: "Official social channels will appear here once they are set in the admin area.",
                    de: "Offizielle Social-Media-Kanäle erscheinen hier, sobald sie im Redaktionsbereich hinterlegt sind.",
                    ja: "公式ソーシャルチャンネルは、管理画面で設定されしだいここに表示されます。",
                    ko: "공식 소셜 채널은 관리자 화면에서 설정하는 대로 이곳에 표시됩니다.",
                    "zh-TW": "官方社群頻道將於管理後台設定完成後顯示於此。",
                  }, locale)
                }
              </p>
            )}
          </section>

          {/*
            Sáu trường có trang riêng của mình.

            Trước đây cả danh bạ sáu trường — địa chỉ, điện thoại, hòm thư,
            trang web — nằm gọn trong trang Liên hệ. Hệ thống trường là thứ
            đáng giá nhất của tập đoàn mà lại đứng nhờ trong một trang nói về
            chuyện khác, còn trang Liên hệ thì dài ra mà không ai đọc hết.
            Danh bạ nay ở /dao-tao/truong; đây chỉ giữ lối dẫn sang.
          */}
          <section className={styles.card}>
            <h2>{dict.contact.schoolsTitle}</h2>
            <p className={styles.schoolsLead}>
              {pick(
                {
                  vi: `${schools.length} trường thành viên, mỗi trường một địa bàn và một phòng tuyển sinh riêng. Địa chỉ, điện thoại và hòm thư của từng trường nằm ở trang hệ thống trường.`,
                  en: `${schools.length} member schools, each with its own place and its own admissions office. Addresses, phones and mailboxes are on the member schools page.`,
                  de: `${schools.length} Mitgliedsschulen, jede mit eigenem Standort und eigenem Zulassungsbüro. Adressen, Telefonnummern und E-Mail stehen auf der Seite der Mitgliedsschulen.`,
                  ja: `${schools.length} の加盟校が、それぞれの土地で、それぞれの入学窓口を持っています。所在地・電話・メールは加盟校のページにあります。`,
                  ko: `${schools.length}개 회원 학교가 저마다의 지역에서 저마다의 입학 부서를 두고 있습니다. 주소와 전화, 메일은 회원 학교 페이지에 있습니다.`,
                  "zh-TW": `${schools.length} 所成員學校各有所在地與招生單位。地址、電話與電子郵件請見成員學校頁面。`,
                },
                locale,
              )}
            </p>
            <ArrowLink href={localePath(locale, "/dao-tao/truong")}>{dict.nav.schools}</ArrowLink>
          </section>
        </div>

        {/* The map is drawn from the address rather than from a configured
            embed URL. The setting for that URL has never been filled in, so
            the page has been shipping without a map at all - the largest part
            of why it read as a wall of type. */}
        <section className={styles.map}>
          <FooterMap
            address={contact.headquarters}
            bbox="105.7690,20.9660,105.7900,20.9780"
            marker="20.9718,105.7793"
            title={dict.contact.headquarters}
            directionsLabel={dict.footer.directions}
          />
        </section>
      </div>
    </div>
  );
}
