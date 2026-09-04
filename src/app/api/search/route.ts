import { NextResponse, type NextRequest } from "next/server";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { searchSite } from "@/lib/search";
import { getDb } from "@/lib/db";
import { searchLog } from "@/lib/db/schema";
import { check, clientKey, RULES, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Search endpoint for the header dialog.
 *
 * Queries are logged as anonymous statistics - the term and the result count -
 * so editors can see what visitors look for and cannot find. No IP address, no
 * identifier and no personal data is stored with them.
 */
export async function GET(request: NextRequest) {
  const limit = check(clientKey(request, "search"), RULES.search);
  if (!limit.ok) return tooManyRequests(limit, "Too many searches");

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().slice(0, 120);
  const rawLocale = searchParams.get("locale") ?? "vi";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";

  if (query.length < 2) return NextResponse.json({ hits: [] });

  try {
    const hits = await searchSite(query, locale, 12);

    // Fire and forget: the visitor should not wait on a statistics write.
    void (async () => {
      try {
        const db = await getDb();
        await db.insert(searchLog).values({ query, locale, results: hits.length });
      } catch {
        /* statistics are optional; search must still return */
      }
    })();

    return NextResponse.json({
      hits: hits.map(({ score: _score, ...hit }) => hit),
    });
  } catch (error) {
    console.error("[search] failed:", (error as Error).message);
    return NextResponse.json({ error: "search_failed" }, { status: 500 });
  }
}
