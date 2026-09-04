import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { AuthError, recordAudit, requireCapability } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { contentBlocks, documentPages, documents } from "@/lib/db/schema";
import { closeOcr, readDocument, sha256 } from "@/lib/pdf/extract";
import { buildBlocks } from "@/lib/pdf/classify";
import { slugify } from "@/lib/text";
import { check, clientKey, RULES, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** PDFs only, 40 MB ceiling, stored outside /public so they are never served. */
const MAX_BYTES = 40 * 1024 * 1024;
const STORAGE_DIR = process.env.DOCUMENT_STORAGE_DIR
  ? path.resolve(process.env.DOCUMENT_STORAGE_DIR)
  : path.resolve(process.cwd(), "storage", "documents");

/**
 * Uploads a PDF and reads it.
 *
 * Everything the reader extracts lands as `draft`: the document, its pages and
 * every content block. Nothing reaches the public site or the advisor until an
 * editor approves it and rebuilds the knowledge base.
 */
export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireCapability("documents.upload");
  } catch (error) {
    const status = error instanceof AuthError && error.kind === "forbidden" ? 403 : 401;
    return NextResponse.json({ error: "unauthorised" }, { status });
  }

  const limit = check(clientKey(request, `upload:${user.id}`), RULES.upload);
  if (!limit.ok) return tooManyRequests(limit, "Too many uploads");

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const title = String(form?.get("title") ?? "").trim();
  const language = String(form?.get("language") ?? "vi").trim().slice(0, 5);
  const documentDate = String(form?.get("documentDate") ?? "").trim().slice(0, 40);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large", maxBytes: MAX_BYTES }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Trust the bytes, not the filename or the declared type: only a real PDF
  // starts with %PDF-.
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json({ error: "not_a_pdf" }, { status: 415 });
  }

  const db = await getDb();
  const digest = sha256(bytes);

  const baseSlug = slugify(title || file.name.replace(/\.pdf$/i, "")) || `tai-lieu-${Date.now()}`;
  let slug = baseSlug;
  for (let i = 2; ; i++) {
    const clash = await db.select({ id: documents.id }).from(documents).where(eq(documents.slug, slug));
    if (!clash.length) break;
    slug = `${baseSlug}-${i}`;
  }

  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const storagePath = path.join(STORAGE_DIR, `${slug}.pdf`);
  await fs.writeFile(storagePath, bytes);

  const [row] = await db
    .insert(documents)
    .values({
      slug,
      title: { vi: title || file.name },
      originalName: file.name.slice(0, 200),
      storagePath: path.relative(process.cwd(), storagePath),
      bytes: bytes.length,
      language,
      documentDate: documentDate || null,
      processingState: "extracting",
      status: "draft",
      sha256: digest,
      uploadedBy: user.id,
    })
    .returning({ id: documents.id });

  try {
    const { pages, ocrUsed } = await readDocument(bytes, { ocr: true, scale: 2 });

    if (pages.length) {
      await db.insert(documentPages).values(
        pages.map((page) => ({
          documentId: row.id,
          pageNumber: page.pageNumber,
          text: page.text,
          textSource: page.source,
          ocrConfidence: page.confidence ?? null,
        })),
      );
    }

    const blocks = buildBlocks(pages);
    if (blocks.length) {
      await db.insert(contentBlocks).values(
        blocks.map((block) => ({
          documentId: row.id,
          pageNumber: block.pageNumber,
          heading: block.heading,
          body: block.body,
          category: block.category,
          language,
          status: "draft" as const,
          injectionFlag: block.injectionFlag,
        })),
      );
    }

    await db
      .update(documents)
      .set({
        pageCount: pages.length,
        ocrUsed,
        processingState: "ready",
        processedAt: new Date(),
      })
      .where(eq(documents.id, row.id));

    await recordAudit(user.id, "upload_document", "document", String(row.id), {
      pages: pages.length,
      blocks: blocks.length,
      ocrUsed,
    });

    return NextResponse.json({
      ok: true,
      id: row.id,
      slug,
      pages: pages.length,
      blocks: blocks.length,
      ocrUsed,
      flagged: blocks.filter((b) => b.injectionFlag).length,
    });
  } catch (error) {
    const message = (error as Error).message.slice(0, 400);
    console.error("[documents] processing failed:", message);
    await db
      .update(documents)
      .set({ processingState: "failed", processingError: message })
      .where(eq(documents.id, row.id));
    return NextResponse.json({ ok: false, id: row.id, error: "processing_failed" }, { status: 500 });
  } finally {
    // The OCR worker holds a WASM instance; releasing it keeps memory flat
    // across a batch of uploads.
    await closeOcr().catch(() => undefined);
  }
}
