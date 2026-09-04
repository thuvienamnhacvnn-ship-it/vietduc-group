import { NextResponse, type NextRequest } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDb } from "@/lib/db";
import { newsletter } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

/**
 * Completes the double opt-in. The token is single use: it is cleared as the
 * subscription is confirmed, so a forwarded link cannot re-confirm or be
 * replayed.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = (searchParams.get("token") ?? "").trim();
  const rawLocale = searchParams.get("locale") ?? "vi";
  const locale = isLocale(rawLocale) ? rawLocale : "vi";
  const home = `${origin}${localePath(locale, "/")}`;

  if (!token) return NextResponse.redirect(`${home}?newsletter=invalid`);

  try {
    const db = await getDb();
    const rows = await db
      .update(newsletter)
      .set({ confirmedAt: new Date(), confirmToken: null })
      .where(and(eq(newsletter.confirmToken, token), isNull(newsletter.confirmedAt)))
      .returning({ id: newsletter.id });

    return NextResponse.redirect(`${home}?newsletter=${rows.length ? "confirmed" : "invalid"}`);
  } catch (error) {
    console.error("[newsletter] confirm failed:", (error as Error).message);
    return NextResponse.redirect(`${home}?newsletter=error`);
  }
}
