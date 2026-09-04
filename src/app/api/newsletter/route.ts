import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { isLocale } from "@/lib/i18n/config";
import { getDb } from "@/lib/db";
import { newsletter } from "@/lib/db/schema";
import { check, clientKey, RULES, tooManyRequests } from "@/lib/rate-limit";
import { emailConfigured, send } from "@/lib/notify";
import { getSiteSettings } from "@/lib/settings";
import { resolveSiteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().trim().email().max(160),
  locale: z.string().trim().max(5).optional().default("vi"),
  consentText: z.string().trim().min(1).max(400),
});

/**
 * Double opt-in. The row is stored unconfirmed and only the link in the
 * confirmation email activates it, so an address someone else typed never ends
 * up on the list. When no mail service is configured the response says the
 * confirmation step is pending rather than claiming an email was sent.
 */
export async function POST(request: NextRequest) {
  const limit = check(clientKey(request, "newsletter"), RULES.newsletter);
  if (!limit.ok) return tooManyRequests(limit, "Too many attempts");

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const locale = isLocale(body.locale) ? body.locale : "vi";
  const email = body.email.toLowerCase();

  try {
    const db = await getDb();
    const existing = await db.select().from(newsletter).where(eq(newsletter.email, email)).limit(1);

    if (existing[0]?.confirmedAt) {
      // Already subscribed: same response as a fresh sign-up, so the endpoint
      // cannot be used to test whether an address is on the list.
      return NextResponse.json({ ok: true, emailSent: emailConfigured() });
    }

    const confirmToken = randomBytes(24).toString("base64url");
    if (existing[0]) {
      await db
        .update(newsletter)
        .set({ confirmToken, locale, consentText: body.consentText, unsubscribedAt: null })
        .where(eq(newsletter.id, existing[0].id));
    } else {
      await db.insert(newsletter).values({
        email,
        locale,
        confirmToken,
        consentText: body.consentText,
      });
    }

    if (!emailConfigured()) {
      return NextResponse.json({ ok: true, emailSent: false });
    }

    const settings = await getSiteSettings();
    const base = resolveSiteUrl(settings.seo.siteUrl);
    const link = `${base}/api/newsletter/confirm?token=${confirmToken}&locale=${locale}`;

    const result = await send({
      to: email,
      subject: {
        vi: "Xác nhận đăng ký bản tin Việt Đức Group",
        de: "Newsletter-Anmeldung bestätigen – Viet Duc Group",
        en: "Confirm your Viet Duc Group newsletter subscription",
      }[locale],
      text: {
        vi: `Bấm vào liên kết sau để xác nhận đăng ký nhận bản tin:\n\n${link}\n\nNếu bạn không đăng ký, hãy bỏ qua email này.`,
        de: `Bitte bestätigen Sie Ihre Newsletter-Anmeldung über diesen Link:\n\n${link}\n\nFalls Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail.`,
        en: `Confirm your newsletter subscription using this link:\n\n${link}\n\nIf you did not sign up, please ignore this email.`,
      }[locale],
    });

    if (!result.sent) console.warn(`[newsletter] confirmation not sent (${result.reason})`);
    return NextResponse.json({ ok: true, emailSent: result.sent });
  } catch (error) {
    console.error("[newsletter] subscribe failed:", (error as Error).message);
    return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 500 });
  }
}
