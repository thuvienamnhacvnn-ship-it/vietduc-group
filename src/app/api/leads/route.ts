import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { isLocale } from "@/lib/i18n/config";
import { getDb } from "@/lib/db";
import { leads, programs } from "@/lib/db/schema";
import { check, clientKey, RULES, tooManyRequests } from "@/lib/rate-limit";
import { adminRecipient, send } from "@/lib/notify";

export const dynamic = "force-dynamic";

const trimmed = (max: number) => z.string().trim().max(max);

const Body = z.object({
  fullName: trimmed(120).min(1),
  phone: trimmed(40).optional().default(""),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional().default(""),
  whatsapp: trimmed(40).optional().default(""),
  field: trimmed(60).optional().default(""),
  program: trimmed(90).optional().default(""),
  currentLevel: trimmed(40).optional().default(""),
  goal: trimmed(40).optional().default(""),
  mode: trimmed(40).optional().default(""),
  startWindow: trimmed(40).optional().default(""),
  question: trimmed(1000).optional().default(""),
  locale: trimmed(5).optional().default("vi"),
  source: z.enum(["website_form", "ai_advisor", "contact_page"]).optional().default("website_form"),
  consentText: trimmed(400).min(1),
  /** Honeypot: a real person never fills a field they cannot see. */
  website: trimmed(200).optional().default(""),
});

export async function POST(request: NextRequest) {
  const limit = check(clientKey(request, "lead"), RULES.lead);
  if (!limit.ok) return tooManyRequests(limit, "Too many submissions");

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  // Silently accept and drop obvious bot traffic: telling a bot it was caught
  // only helps it try again differently.
  if (body.website) return NextResponse.json({ ok: true, id: null });

  if (!body.phone && !body.email && !body.whatsapp) {
    return NextResponse.json({ ok: false, error: "contact_required" }, { status: 400 });
  }

  const locale = isLocale(body.locale) ? body.locale : "vi";

  try {
    const db = await getDb();

    let programId: number | null = null;
    if (body.program) {
      const found = await db
        .select({ id: programs.id })
        .from(programs)
        .where(eq(programs.slug, body.program))
        .limit(1);
      programId = found[0]?.id ?? null;
    }

    const [row] = await db
      .insert(leads)
      .values({
        fullName: body.fullName,
        phone: body.phone || null,
        email: body.email || null,
        whatsapp: body.whatsapp || null,
        interestCategory: body.field || null,
        programId,
        currentLevel: body.currentLevel || null,
        goal: body.goal || null,
        preferredMode: body.mode || null,
        startWindow: body.startWindow || null,
        question: body.question || null,
        source: body.source,
        locale,
        state: "new",
        consentAt: new Date(),
        consentText: body.consentText,
      })
      .returning({ id: leads.id });

    // The record is saved before any notification is attempted; a mail failure
    // must never lose the enquiry. No personal data is written to the log.
    const recipient = adminRecipient();
    let notified = false;
    if (recipient) {
      const result = await send({
        to: recipient,
        subject: `[Việt Đức Group] Đăng ký tư vấn mới #VDG-${row.id}`,
        text: [
          `Mã hồ sơ: VDG-${row.id}`,
          `Ngôn ngữ: ${locale}`,
          `Lĩnh vực: ${body.field || "-"}`,
          `Chương trình: ${body.program || "-"}`,
          `Trình độ hiện tại: ${body.currentLevel || "-"}`,
          `Mục tiêu: ${body.goal || "-"}`,
          "",
          "Mở trang quản trị để xem thông tin liên hệ.",
        ].join("\n"),
      });
      notified = result.sent;
      if (!result.sent) {
        console.warn(`[leads] admin notification not sent (${result.reason})`);
      }
    }

    return NextResponse.json({ ok: true, id: row.id, notified });
  } catch (error) {
    console.error("[leads] could not store lead:", (error as Error).message);
    return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 500 });
  }
}
