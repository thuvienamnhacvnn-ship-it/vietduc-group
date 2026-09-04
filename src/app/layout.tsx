import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { DEFAULT_LOCALE, LOCALE_TAG, isLocale } from "@/lib/i18n/config";
import "@/styles/globals.css";

/**
 * Two families, no more: a high-contrast serif for display type and a humanist
 * sans for everything a reader has to work with. Both ship a Vietnamese subset,
 * which rules out most "premium" display faces.
 */
const display = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Việt Đức Group", template: "%s | Việt Đức Group" },
  robots: { index: true, follow: true },
};

/**
 * Applies a saved appearance choice before the first paint.
 *
 * The theme cannot come from the server: it lives in the reader's browser, and
 * this site is rendered per request rather than per visitor. Running this
 * synchronously in <head> is what prevents a white flash on a dark-mode device.
 * With no saved choice it does nothing, and the prefers-color-scheme query in
 * tokens.css decides.
 */
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("vdg_theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

/**
 * The locale is resolved in middleware and handed over as a request header, so
 * `<html lang>` is right in the first byte of HTML rather than being corrected
 * by a client effect after paint.
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const header = requestHeaders.get("x-vdg-locale") ?? "";
  const locale = isLocale(header) ? header : DEFAULT_LOCALE;

  return (
    <html
      lang={LOCALE_TAG[locale]}
      className={`${display.variable} ${sans.variable}`}
      // The bootstrap script adds data-theme before React hydrates, which would
      // otherwise be reported as a server/client mismatch on <html>.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
