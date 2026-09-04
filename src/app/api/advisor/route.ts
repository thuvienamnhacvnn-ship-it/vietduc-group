import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { ask, MAX_HISTORY_TURNS, MAX_QUESTION_CHARS } from "@/lib/rag/advisor";
import { getDb } from "@/lib/db";
import { conversations, messages, unanswered } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { check, clientKey, RULES, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Body = z.object({
  question: z.string().min(1).max(MAX_QUESTION_CHARS),
  locale: z.string().optional(),
  conversationId: z.string().max(64).nullable().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_QUESTION_CHARS),
      }),
    )
    .max(MAX_HISTORY_TURNS)
    .optional(),
});

export async function POST(request: NextRequest) {
  const limit = check(clientKey(request, "advisor"), RULES.advisor);
  if (!limit.ok) return tooManyRequests(limit, "Too many messages");

  let payload: z.infer<typeof Body>;
  try {
    payload = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const locale: Locale = isLocale(payload.locale ?? "") ? (payload.locale as Locale) : "vi";

  try {
    const answer = await ask({
      question: payload.question,
      locale,
      history: payload.history ?? [],
    });

    // Conversation persistence is best-effort: a storage failure must not cost
    // the visitor their answer.
    const conversationId = payload.conversationId?.trim() || randomUUID();
    void (async () => {
      try {
        const db = await getDb();
        const existing = await db
          .select({ id: conversations.id })
          .from(conversations)
          .where(eq(conversations.id, conversationId));

        if (!existing.length) {
          await db.insert(conversations).values({ id: conversationId, locale });
        } else {
          await db
            .update(conversations)
            .set({ lastAt: new Date() })
            .where(eq(conversations.id, conversationId));
        }

        await db.insert(messages).values([
          { conversationId, role: "user", content: payload.question },
          {
            conversationId,
            role: "assistant",
            content: answer.text,
            citations: answer.citations.map((c) => ({ label: c.label, href: c.href })),
            outcome: answer.outcome,
            confidence: answer.confidence,
          },
        ]);

        // The gap report: what people ask that the documents do not cover.
        if (answer.outcome === "no_data") {
          await db.insert(unanswered).values({
            question: payload.question,
            locale,
            conversationId,
            topScore: answer.confidence,
          });
        }
      } catch (error) {
        console.error("[advisor] could not record conversation:", (error as Error).message);
      }
    })();

    return NextResponse.json({
      answer: answer.text,
      citations: answer.citations,
      outcome: answer.outcome,
      suggestHandoff: answer.suggestHandoff,
      conversationId,
    });
  } catch (error) {
    // Never leak provider messages, keys or stack traces to the browser.
    console.error("[advisor] request failed:", (error as Error).message);
    return NextResponse.json(
      { answer: getDictionary(locale).common.error, citations: [], outcome: "error" },
      { status: 500 },
    );
  }
}
