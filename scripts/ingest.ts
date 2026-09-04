import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { contentBlocks, documentPages, documents } from "../src/lib/db/schema";
import { closeOcr, readDocument, sha256 } from "../src/lib/pdf/extract";
import { buildBlocks } from "../src/lib/pdf/classify";
import { slugify } from "../src/lib/text";

/**
 * Reads every PDF in ./content into the database.
 *
 * Same pipeline as the admin upload, run over the source documents in bulk:
 * text layer where it exists, OCR where it does not, repeated headers removed,
 * blocks classified and flagged. Everything lands as `draft` for review.
 *
 * Usage: npm run ingest [-- --no-ocr] [-- --only=<slug fragment>]
 *
 * Stop the dev server first: PGlite allows one process per data directory.
 */

const CONTENT_DIR = path.resolve(process.cwd(), "content");

async function main() {
  const args = process.argv.slice(2);
  const useOcr = !args.includes("--no-ocr");
  const only = args.find((a) => a.startsWith("--only="))?.slice("--only=".length);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`No ./content directory. Put the source PDFs there first.`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .filter((f) => !only || f.toLowerCase().includes(only.toLowerCase()))
    .sort();

  if (!files.length) {
    console.error("No PDFs matched.");
    process.exit(1);
  }

  const db = await getDb();
  const seenHashes = new Map<string, string>();

  for (const file of files) {
    const bytes = fs.readFileSync(path.join(CONTENT_DIR, file));
    const digest = sha256(bytes);

    // The source folder contains byte-identical duplicates under different
    // names; reading them twice would double every block.
    const duplicateOf = seenHashes.get(digest);
    if (duplicateOf) {
      console.log(`skip  ${file}  (identical to ${duplicateOf})`);
      continue;
    }
    seenHashes.set(digest, file);

    const slug = slugify(file.replace(/\.pdf$/i, "")) || `tai-lieu-${digest.slice(0, 8)}`;
    const existing = await db.select().from(documents).where(eq(documents.slug, slug)).limit(1);

    if (existing[0]?.sha256 === digest && existing[0].processingState === "ready") {
      console.log(`skip  ${file}  (already ingested, unchanged)`);
      continue;
    }

    console.log(`read  ${file} …`);
    const started = Date.now();

    let documentId: number;
    if (existing[0]) {
      documentId = existing[0].id;
      await db.delete(documentPages).where(eq(documentPages.documentId, documentId));
      await db.delete(contentBlocks).where(eq(contentBlocks.documentId, documentId));
      await db
        .update(documents)
        .set({ processingState: "extracting", sha256: digest, bytes: bytes.length })
        .where(eq(documents.id, documentId));
    } else {
      const [row] = await db
        .insert(documents)
        .values({
          slug,
          title: { vi: file.replace(/\.pdf$/i, "") },
          originalName: file,
          storagePath: path.join("content", file),
          bytes: bytes.length,
          language: /eng|english/i.test(file) ? "en" : "vi",
          processingState: "extracting",
          status: "draft",
          sha256: digest,
        })
        .returning({ id: documents.id });
      documentId = row.id;
    }

    try {
      const { pages, ocrUsed } = await readDocument(bytes, {
        ocr: useOcr,
        scale: 2,
        onProgress: (page, total, mode) => {
          if (mode === "ocr") process.stdout.write(`\r      OCR trang ${page}/${total}   `);
        },
      });
      process.stdout.write("\r");

      if (pages.length) {
        for (let i = 0; i < pages.length; i += 50) {
          await db.insert(documentPages).values(
            pages.slice(i, i + 50).map((page) => ({
              documentId,
              pageNumber: page.pageNumber,
              text: page.text,
              textSource: page.source,
              ocrConfidence: page.confidence ?? null,
            })),
          );
        }
      }

      const blocks = buildBlocks(pages);
      for (let i = 0; i < blocks.length; i += 50) {
        await db.insert(contentBlocks).values(
          blocks.slice(i, i + 50).map((block) => ({
            documentId,
            pageNumber: block.pageNumber,
            heading: block.heading,
            body: block.body,
            category: block.category,
            language: /eng|english/i.test(file) ? "en" : "vi",
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
          processingError: null,
        })
        .where(eq(documents.id, documentId));

      const withText = pages.filter((p) => p.source !== "empty").length;
      const flagged = blocks.filter((b) => b.injectionFlag).length;
      console.log(
        `ok    ${file}: ${pages.length} trang (${withText} có chữ${ocrUsed ? ", có OCR" : ""}), ` +
          `${blocks.length} đoạn${flagged ? `, ${flagged} đoạn bị đánh dấu nghi ngờ` : ""} ` +
          `— ${Math.round((Date.now() - started) / 1000)}s`,
      );
    } catch (error) {
      const message = (error as Error).message.slice(0, 400);
      await db
        .update(documents)
        .set({ processingState: "failed", processingError: message })
        .where(eq(documents.id, documentId));
      console.error(`fail  ${file}: ${message}`);
    }
  }

  await closeOcr().catch(() => undefined);
  console.log(
    "\nMọi đoạn nội dung đang ở trạng thái nháp. Duyệt tại /admin/tai-lieu rồi chạy `npm run kb:build`.",
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
