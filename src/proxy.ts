import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Locale routing plus one small piece of plumbing: the chosen locale is passed
 * on as a request header so the root layout can put the right value in
 * `<html lang>` during server rendering, rather than patching it in the
 * browser after paint.
 */

export const LOCALE_HEADER = "x-vdg-locale";
export const LOCALE_COOKIE = "vdg_locale";

const PUBLIC_FILE = /\.(?:png|jpe?g|webp|avif|svg|ico|pdf|txt|xml|webmanifest|woff2?)$/i;

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;

  // Accept-Language, most-preferred first. Only the language subtag matters
  // here, so "de-AT" still resolves to German.
  const header = request.headers.get("accept-language");
  if (header) {
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);
    for (const { tag } of ranked) {
      if (isLocale(tag)) return tag;
    }
  }
  return DEFAULT_LOCALE;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/documents") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const first = segments[1];

  if (isLocale(first)) {
    const response = NextResponse.next({
      request: { headers: new Headers({ ...Object.fromEntries(request.headers), [LOCALE_HEADER]: first }) },
    });
    // Remember the reader's choice for the next visit to "/".
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export { LOCALES };
