import Image from "next/image";
import { CURRENT_SITE_ID, WEBSITE_NETWORK, getWebsiteNetworkLabels } from "@/lib/website-network";
import styles from "./WebsiteNetwork.module.css";

export function WebsiteNetworkList({ locale }: { locale: string }) {
  const labels = getWebsiteNetworkLabels(locale);
  return (
    <ul className={styles.list} data-website-network-list>
      {WEBSITE_NETWORK.map((site) => {
        const current = site.id === CURRENT_SITE_ID;
        const content = <>
          <span className={styles.logo} data-plate={site.plate}>
            <Image src={site.logo} alt={site.name} width={88} height={52} unoptimized />
          </span>
          <span className={styles.text}>
            <span className={styles.name}>{site.name}</span>
            {current ? <span className={styles.status}>{labels.current}</span> : null}
          </span>
          {!current ? <><span className={styles.arrow} aria-hidden="true">↗</span><span className={styles.srOnly}>{labels.newTab}</span></> : null}
        </>;
        return <li key={site.id} data-site-id={site.id}>
          {current ? <div className={styles.card} aria-current="true">{content}</div> :
            <a className={styles.card} href={site.url} target="_blank" rel="noopener noreferrer" title={`${site.name} — ${labels.newTab}`}>{content}</a>}
        </li>;
      })}
    </ul>
  );
}

export function WebsiteNetworkFooter({ locale }: { locale: string }) {
  return <section className={`on-dark ${styles.footer}`} data-website-network="footer" aria-label={getWebsiteNetworkLabels(locale).title}>
    <h2 className={styles.heading}>{getWebsiteNetworkLabels(locale).title}</h2>
    <WebsiteNetworkList locale={locale} />
  </section>;
}

export function WebsiteNetworkMobile({ locale }: { locale: string }) {
  return <section className={styles.mobile} data-website-network="mobile" aria-label={getWebsiteNetworkLabels(locale).title}>
    <h2 className={styles.heading}>{getWebsiteNetworkLabels(locale).title}</h2>
    <WebsiteNetworkList locale={locale} />
  </section>;
}
