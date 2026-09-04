import type { ReactElement, SVGProps } from "react";
import {
  socialHref,
  SOCIAL_LABEL,
  SOCIAL_KEYS,
  type SocialKey,
  type SocialSettings,
} from "@/lib/site-config";
import { fmt, getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import styles from "./SocialLinks.module.css";

/**
 * Brand marks drawn as single paths so they inherit `currentColor`, stay sharp
 * at any size and add no network requests. A channel with no configured URL
 * renders nothing at all - the brief is explicit that a missing link must not
 * become a dead icon.
 */
const ICONS: Record<SocialKey, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  facebook: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  ),
  instagram: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.14 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.62-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.62.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.62.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.62-.07-4.76-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.82Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
    </svg>
  ),
  tiktok: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.77.12v-3.2a5.72 5.72 0 0 0-.77-.05 5.72 5.72 0 1 0 5.72 5.72V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.28-1.48Z" />
    </svg>
  ),
  youtube: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41c-.86.23-1.54.91-1.77 1.78C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.87.91 1.55 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z" />
    </svg>
  ),
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.94h3.4V21h-3.4V8.94Zm5.53 0h3.26v1.65h.05c.45-.86 1.57-1.77 3.23-1.77 3.45 0 4.09 2.27 4.09 5.23V21h-3.4v-5.36c0-1.28-.02-2.93-1.79-2.93-1.79 0-2.06 1.4-2.06 2.84V21h-3.4V8.94Z" />
    </svg>
  ),
  zalo: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.4c-5.52 0-10 3.86-10 8.62 0 2.71 1.45 5.13 3.72 6.71-.13.98-.6 2.4-1.5 3.4-.2.22-.05.58.25.53 2.1-.35 3.72-1.24 4.62-1.86 .93.2 1.9.3 2.91.3 5.52 0 10-3.86 10-8.62S17.52 2.4 12 2.4Zm-4.6 5.5h3.65c.3 0 .5.24.5.53 0 .13-.05.26-.13.36l-2.9 3.53h2.6c.3 0 .5.24.5.53s-.2.53-.5.53H7.3a.52.52 0 0 1-.5-.53c0-.13.04-.26.12-.36l2.9-3.53h-2.4a.52.52 0 0 1-.5-.53c0-.29.2-.53.5-.53Zm5.6 0c.3 0 .53.24.53.53v4.42c0 .3-.24.53-.53.53a.52.52 0 0 1-.53-.53V8.43c0-.29.24-.53.53-.53Zm3.55 1.3c1.15 0 2.05.94 2.05 2.1s-.9 2.1-2.05 2.1c-1.16 0-2.06-.94-2.06-2.1s.9-2.1 2.06-2.1Zm0 1.05c-.57 0-1 .47-1 1.05 0 .58.43 1.05 1 1.05s1-.47 1-1.05c0-.58-.43-1.05-1-1.05Z" />
    </svg>
  ),
  whatsapp: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35ZM12.05 2C6.55 2 2.1 6.45 2.1 11.94c0 1.76.46 3.47 1.34 4.98L2 22l5.23-1.37a9.9 9.9 0 0 0 4.82 1.23h.01c5.49 0 9.95-4.45 9.95-9.94A9.86 9.86 0 0 0 19.1 4.9 9.86 9.86 0 0 0 12.05 2Zm0 18.13h-.01a8.26 8.26 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38 8.27 8.27 0 0 1 14.11-5.84 8.2 8.2 0 0 1 2.42 5.84 8.27 8.27 0 0 1-8.27 8.24Z" />
    </svg>
  ),
};

type Props = {
  social: SocialSettings;
  locale: Locale;
  /** Which channels to consider. Defaults to all of them. */
  keys?: SocialKey[];
  size?: "sm" | "md";
  variant?: "plain" | "boxed";
  className?: string;
};

export function SocialLinks({
  social,
  locale,
  keys = SOCIAL_KEYS,
  size = "md",
  variant = "plain",
  className,
}: Props) {
  const dict = getDictionary(locale);
  const items = keys
    .map((key) => ({ key, href: socialHref(key, social[key] ?? "") }))
    .filter((item): item is { key: SocialKey; href: string } => Boolean(item.href));

  if (!items.length) return null;

  return (
    <ul className={[styles.list, styles[size], styles[variant], className].filter(Boolean).join(" ")}>
      {items.map(({ key, href }) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title={SOCIAL_LABEL[key]}
            >
              <Icon className={styles.icon} />
              <span className="visually-hidden">
                {fmt(dict.a11y.socialOn, { name: SOCIAL_LABEL[key] })}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** True when at least one channel in `keys` has a URL. */
export function hasSocial(social: SocialSettings, keys: SocialKey[] = SOCIAL_KEYS): boolean {
  return keys.some((key) => Boolean(socialHref(key, social[key] ?? "")));
}
