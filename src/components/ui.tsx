import type { ReactNode } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import styles from "./ui.module.css";

/* ------------------------------------------------------------- headings */

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  as?: "h2" | "h3";
  action?: ReactNode;
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "start",
  as: Tag = "h2",
  action,
  tone = "light",
}: SectionHeadingProps) {
  return (
    <div
      className={[
        styles.heading,
        align === "center" ? styles.headingCenter : "",
        tone === "dark" ? styles.headingDark : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <Tag className={styles.headingTitle}>{title}</Tag>
        {lead ? <p className={styles.headingLead}>{lead}</p> : null}
      </div>
      {action ? <div className={styles.headingAction}>{action}</div> : null}
    </div>
  );
}


/* ---------------------------------------------------------------- links */

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={[styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ")}
    >
      {children}
    </Link>
  );
}

/** Text link with a trailing arrow, used to close a section. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.arrowLink}>
      <span>{children}</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/* ---------------------------------------------------------- breadcrumbs */

export function Breadcrumbs({
  locale,
  trail,
}: {
  locale: Locale;
  trail: { href?: string; label: string }[];
}) {
  const dict = getDictionary(locale);
  return (
    <nav aria-label={dict.a11y.breadcrumb} className={styles.crumbs}>
      <ol>
        <li>
          <Link href={localePath(locale, "/")}>{dict.nav.home}</Link>
        </li>
        {trail.map((item, index) => (
          <li key={`${item.label}-${index}`} aria-current={index === trail.length - 1 ? "page" : undefined}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------------- prose */

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul"; items: string[] };

/**
 * A deliberately small Markdown subset: `##`/`###` headings, `-` lists, `>`
 * quotes, blank-line paragraphs and `**bold**`.
 *
 * Editors write into a database, so a full Markdown engine would mean either
 * shipping a parser plus a sanitiser to the browser or trusting stored HTML.
 * Parsing a fixed grammar into React elements means no HTML is ever
 * interpreted - `dangerouslySetInnerHTML` appears nowhere in this project.
 */
function parse(markdown: string): Block[] {
  const blocks: Block[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };

  for (const raw of markdown.split(/\n/)) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("### ")) blocks.push({ type: "h3", text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ type: "h2", text: line.slice(3) });
    else if (line.startsWith("> ")) blocks.push({ type: "quote", text: line.slice(2) });
    else {
      const previous = blocks[blocks.length - 1];
      // Consecutive non-empty lines belong to the same paragraph.
      if (previous?.type === "p") previous.text += ` ${line}`;
      else blocks.push({ type: "p", text: line });
    }
  }
  flushList();
  return blocks;
}

/** Splits on `**bold**` and returns React nodes - never raw HTML. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function Prose({ markdown, className }: { markdown: string; className?: string }) {
  const blocks = parse(markdown);
  return (
    <div className={[styles.prose, className].filter(Boolean).join(" ")}>
      {blocks.map((block, index) => {
        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item, i) => (
                <li key={i}>{inline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "h2") return <h2 key={index}>{inline(block.text)}</h2>;
        if (block.type === "h3") return <h3 key={index}>{inline(block.text)}</h3>;
        if (block.type === "quote") return <blockquote key={index}>{inline(block.text)}</blockquote>;
        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- misc */

/** Small caption that names the document a fact came from. */
export function SourceNote({
  locale,
  source,
  page,
  className,
}: {
  locale: Locale;
  source: string;
  page?: number | null;
  className?: string;
}) {
  const dict = getDictionary(locale);
  return (
    <p className={[styles.sourceNote, className].filter(Boolean).join(" ")}>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" strokeLinejoin="round" />
        <path d="M14 3v5h5" strokeLinejoin="round" />
      </svg>
      {dict.common.source}: {source}
      {page ? `, ${dict.common.page} ${page}` : ""}
    </p>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "burgundy" | "navy";
}) {
  return <span className={`${styles.badge} ${styles[`badge_${tone}`]}`}>{children}</span>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>{title}</p>
      {hint ? <p className={styles.emptyHint}>{hint}</p> : null}
    </div>
  );
}

/** A row of figures. Every value here comes from a sourced document. */
export function StatRow({
  stats,
  tone = "light",
}: {
  stats: { value: string; label: string }[];
  tone?: "light" | "dark";
}) {
  if (!stats.length) return null;
  return (
    <dl className={`${styles.stats} ${tone === "dark" ? styles.statsDark : ""}`}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.value}</dt>
          <dd>{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}
