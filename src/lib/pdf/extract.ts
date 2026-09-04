// NOTE: no `server-only` here - the CLI scripts in /scripts import this module
// directly. It is never imported from a client component.
import { createHash } from "node:crypto";
import { tidy } from "../text";

/**
 * PDF ingest primitives, shared by the CLI (`npm run ingest`) and the admin
 * upload route. Everything here is WASM or pure JS: this machine blocks
 * unsigned native binaries, so poppler/tesseract CLI are not options.
 */

export type PageText = {
  pageNumber: number;
  text: string;
  source: "text-layer" | "ocr" | "empty";
  confidence?: number;
};

export type ExtractedImage = {
  pageNumber: number;
  /** Raw bytes of the embedded image, in whatever format the PDF stored. */
  data: Buffer;
  width: number;
  height: number;
  sha256: string;
};

type MupdfModule = typeof import("mupdf");

let mupdfPromise: Promise<MupdfModule> | undefined;
function loadMupdf(): Promise<MupdfModule> {
  // mupdf is an async ESM module; importing it at call time keeps it out of the
  // Next.js server bundle graph until a document is actually processed.
  mupdfPromise ??= import("mupdf");
  return mupdfPromise;
}

export async function openDocument(bytes: Buffer) {
  const mupdf = await loadMupdf();
  return mupdf.Document.openDocument(bytes, "application/pdf");
}

export async function countPages(bytes: Buffer): Promise<number> {
  const doc = await openDocument(bytes);
  return doc.countPages();
}

/**
 * Text layer, page by page. Canva and other design tools often export pages as
 * flattened images; those pages come back empty and need OCR.
 */
export async function extractTextLayer(bytes: Buffer): Promise<PageText[]> {
  const doc = await openDocument(bytes);
  const total = doc.countPages();
  const out: PageText[] = [];

  for (let i = 0; i < total; i++) {
    const page = doc.loadPage(i);
    let text = "";
    try {
      text = tidy(page.toStructuredText("preserve-whitespace").asText());
    } catch {
      text = "";
    }
    out.push({
      pageNumber: i + 1,
      text,
      source: text.length > 20 ? "text-layer" : "empty",
    });
    page.destroy();
  }
  return out;
}

/** Renders one page to PNG bytes. `scale` 1 gives roughly 72 dpi. */
export async function renderPage(bytes: Buffer, pageNumber: number, scale = 2): Promise<Buffer> {
  const mupdf = await loadMupdf();
  const doc = await openDocument(bytes);
  const page = doc.loadPage(pageNumber - 1);
  const pixmap = page.toPixmap(
    mupdf.Matrix.scale(scale, scale),
    mupdf.ColorSpace.DeviceRGB,
    false,
    true,
  );
  const png = Buffer.from(pixmap.asPNG());
  pixmap.destroy();
  page.destroy();
  return png;
}

/** Every raster image embedded in the document, with the page it sits on. */
export async function extractImages(bytes: Buffer, minEdge = 320): Promise<ExtractedImage[]> {
  const doc = await openDocument(bytes);
  const total = doc.countPages();
  const seen = new Set<string>();
  const out: ExtractedImage[] = [];

  for (let i = 0; i < total; i++) {
    const page = doc.loadPage(i);
    const images = collectPageImages(page);
    for (const image of images) {
      try {
        const pixmap = image.toPixmap();
        const width = pixmap.getWidth();
        const height = pixmap.getHeight();
        if (Math.min(width, height) < minEdge) {
          pixmap.destroy();
          continue;
        }
        const data = Buffer.from(pixmap.asPNG());
        pixmap.destroy();
        const sha256 = createHash("sha256").update(data).digest("hex");
        // The same logo appears on almost every page; keep one copy.
        if (seen.has(sha256)) continue;
        seen.add(sha256);
        out.push({ pageNumber: i + 1, data, width, height, sha256 });
      } catch {
        // A single unreadable XObject must not abort the whole document.
      }
    }
    page.destroy();
  }
  return out;
}

type MupdfImage = { toPixmap(): { getWidth(): number; getHeight(): number; asPNG(): Uint8Array; destroy(): void } };

/**
 * Walks a page's display list and picks up every image it draws. mupdf exposes
 * this through a device callback rather than a list, so the device collects
 * into a closure.
 */
function collectPageImages(page: {
  toStructuredText(options?: string): { walk(walker: Record<string, unknown>): void };
}): MupdfImage[] {
  const found: MupdfImage[] = [];
  try {
    const stext = page.toStructuredText("preserve-images");
    stext.walk({
      onImageBlock(_bbox: unknown, _transform: unknown, image: MupdfImage) {
        found.push(image);
      },
    });
  } catch {
    return [];
  }
  return found;
}

/* ------------------------------------------------------------------- OCR */

type Worker = {
  recognize(image: Buffer): Promise<{ data: { text: string; confidence: number } }>;
  terminate(): Promise<unknown>;
};

let workerPromise: Promise<Worker> | null = null;

/**
 * Vietnamese + German + English traineddata. tesseract.js downloads language
 * files on first use; set TESSERACT_LANG_PATH to a local directory to run
 * offline (see docs/PDF-PIPELINE.md).
 */
export const OCR_LANGS = "vie+deu+eng";

async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      const options: Record<string, unknown> = {};
      if (process.env.TESSERACT_LANG_PATH) options.langPath = process.env.TESSERACT_LANG_PATH;
      if (process.env.TESSERACT_CACHE_PATH) options.cachePath = process.env.TESSERACT_CACHE_PATH;
      return (await createWorker(OCR_LANGS, 1, options)) as unknown as Worker;
    })();
  }
  return workerPromise;
}

export async function closeOcr(): Promise<void> {
  if (!workerPromise) return;
  const worker = await workerPromise;
  await worker.terminate();
  workerPromise = null;
}

export async function ocrPage(png: Buffer): Promise<{ text: string; confidence: number }> {
  const worker = await getWorker();
  const result = await worker.recognize(png);
  return { text: tidy(result.data.text), confidence: result.data.confidence };
}

/**
 * Full read of a document: text layer where it exists, OCR where it does not.
 * `onProgress` lets the admin UI show which page is being worked on.
 */
export async function readDocument(
  bytes: Buffer,
  options: {
    ocr?: boolean;
    scale?: number;
    onProgress?: (page: number, total: number, mode: string) => void;
  } = {},
): Promise<{ pages: PageText[]; ocrUsed: boolean }> {
  const { ocr = true, scale = 2, onProgress } = options;
  const pages = await extractTextLayer(bytes);
  let ocrUsed = false;

  if (ocr) {
    for (const page of pages) {
      if (page.source !== "empty") {
        onProgress?.(page.pageNumber, pages.length, "text-layer");
        continue;
      }
      onProgress?.(page.pageNumber, pages.length, "ocr");
      try {
        const png = await renderPage(bytes, page.pageNumber, scale);
        const { text, confidence } = await ocrPage(png);
        if (text.length > 20) {
          page.text = text;
          page.source = "ocr";
          page.confidence = confidence;
          ocrUsed = true;
        }
      } catch (error) {
        // Leave the page empty and carry on; a failed page is recorded as such
        // rather than silently dropping the rest of the document.
        console.warn(`[pdf] OCR failed on page ${page.pageNumber}: ${(error as Error).message}`);
      }
    }
  }

  return { pages, ocrUsed };
}

export function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}
