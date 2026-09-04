import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { renderPage } from "../src/lib/pdf/extract";

/**
 * Builds the image library for the hospitality arm from the project documents.
 *
 * Three shapes of source, so three strategies:
 *
 *  - `slideImage`: the architectural presentation places one render per page on
 *    a paper-texture background with the studio's watermark beside it. Taking
 *    the render object itself gives the artwork at full resolution with neither
 *    the texture nor the watermark baked in.
 *  - `crop`: the resort proposal was exported as one flattened bitmap per page,
 *    so a region of the rendered page is the only way in.
 *  - `page`: a whole plan sheet, kept as it is.
 *
 * Every asset records the document and page it came from. Nothing is downloaded
 * and nothing is generated.
 *
 * WARNING: this script only produces the drawings and the plan sheets. The
 * banner photography in public/media/hero and the four resort views are
 * hand-retouched files supplied separately - they are deliberately NOT targets
 * here, because every run would otherwise overwrite the retouching with the
 * untouched render out of the PDF.
 *
 * Usage: npm run media:hospitality
 */

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "public", "media", "hospitality");
const MANIFEST = path.join(ROOT, "src", "content", "media-hospitality.json");

/** Page render scale for crops: 4 gives roughly 3100px-wide pages to cut from. */
const RENDER_SCALE = 4;

type Alt = { vi: string; en: string; de: string };

type Source = { file: string; slug: string; title: string };

const SOURCES: Record<string, Source> = {
  botrach: {
    file: "du-an-bo-trach-phoi-canh.pdf",
    slug: "du-an-bo-trach-phoi-canh",
    title: "PRESENTATION QUẢNG BÌNH – Bố Trạch (TOAM Studio, 10/2025)",
  },
  toki: {
    file: "toki-boutique-hotel-quang-binh.pdf",
    slug: "toki-boutique-hotel-quang-binh",
    title: "TOKI Boutique Hotel Quảng Bình – Dự kiến hiệu quả đầu tư (28/11/2024)",
  },
  vinhhung: {
    file: "khu-nghi-duong-vinh-hung.pdf",
    slug: "khu-nghi-duong-vinh-hung",
    title: "Khu nghỉ dưỡng Vĩnh Hưng – Proposal design (18/04/2026)",
  },
  tokiHienTrang: {
    file: "toki-ban-do-hien-trang.pdf",
    slug: "toki-ban-do-hien-trang",
    title: "Chỉnh lý địa chính khu đất – xã Hoàn Lão, tỷ lệ 1/2000",
  },
  tokiViTri: {
    file: "toki-vi-tri.pdf",
    slug: "toki-vi-tri",
    title: "Vị trí đề xuất dự án trên ảnh vệ tinh",
  },
  tokiQhsdd: {
    file: "toki-quy-hoach-su-dung-dat.pdf",
    slug: "toki-quy-hoach-su-dung-dat",
    title: "Trích quy hoạch sử dụng đất – vị trí đề xuất dự án",
  },
  tokiQhpk: {
    file: "toki-quy-hoach-phan-khu.pdf",
    slug: "toki-quy-hoach-phan-khu",
    title: "Trích quy hoạch phân khu khu vực phát triển đô thị xã Trung Trạch, tỷ lệ 1/2000",
  },
  tokiThongKe: {
    file: "toki-thong-ke-su-dung-dat.pdf",
    slug: "toki-thong-ke-su-dung-dat",
    title: "Thống kê kết quả chỉnh lý địa chính khu đất",
  },
  tokiTongMatBang: {
    file: "toki-quy-hoach-tong-mat-bang.pdf",
    slug: "toki-quy-hoach-tong-mat-bang",
    title: "Quy hoạch tổng mặt bằng dự án Khách sạn nghỉ dưỡng Toki, tỷ lệ 1/500",
  },
  longBeach: {
    file: "long-beach-resort-thiet-ke-co-so.pdf",
    slug: "long-beach-resort-thiet-ke-co-so",
    title: "Long Beach Resort – hồ sơ thiết kế cơ sở (01/08/2025)",
  },
};

type Base = { out: string; source: keyof typeof SOURCES; page: number; alt: Alt; tags: string[] };

/** One render object on a presentation page, picked by size rather than index. */
type SlideImageTarget = Base & { kind: "slideImage"; width: number; height: number };

/** A region of the rendered page, as fractions of its width and height. */
type CropTarget = Base & {
  kind: "crop";
  rect: [number, number, number, number];
  width: number;
  height: number;
};

/** A whole drawing sheet, rendered as it is. */
type PageTarget = Base & { kind: "page"; width: number; height: number; background: string };

type Target = SlideImageTarget | CropTarget | PageTarget;

/**
 * The renders below carry no caption in the source file beyond the cover's
 * "BỐ TRẠCH_QUẢNG BÌNH". Each alt text therefore describes what the picture
 * shows, and stops there - it does not name a room count, a facility or a phase
 * that the drawing does not state.
 */
const TARGETS: Target[] = [

  // The resort proposal is a flattened export, so these come off the page.
  {
    kind: "crop",
    out: "vinh-hung-vi-tri.webp",
    source: "vinhhung",
    page: 2,
    rect: [0.33, 0.11, 0.79, 0.79],
    width: 1400,
    height: 1400,
    alt: {
      vi: "Ảnh vệ tinh xác định ranh giới khu đất 2,1 ha giáp biển Đông",
      en: "Satellite image marking the 2.1 hectare plot on the East Sea shore",
      de: "Satellitenbild mit der Abgrenzung des 2,1 Hektar großen Grundstücks an der Ostsee-Küste",
    },
    tags: ["hospitality", "plan", "site"],
  },
  {
    kind: "crop",
    out: "vinh-hung-hien-trang.webp",
    source: "vinhhung",
    page: 3,
    rect: [0.13, 0.1, 0.88, 0.86],
    width: 1600,
    height: 1300,
    alt: {
      vi: "Hiện trạng khu đất: bãi cát trống ven biển, đang thi công hạ tầng",
      en: "The site today: open coastal sand with infrastructure work under way",
      de: "Das Gelände heute: offener Küstensand, Erschließung im Bau",
    },
    tags: ["hospitality", "plan"],
  },
  {
    kind: "crop",
    out: "vinh-hung-mat-bang.webp",
    source: "vinhhung",
    page: 4,
    rect: [0.13, 0.1, 0.88, 0.86],
    width: 1600,
    height: 1300,
    alt: {
      vi: "Phương án mặt bằng tổng thể khu nghỉ dưỡng Vĩnh Hưng",
      en: "Overall site layout proposed for the Vinh Hung resort",
      de: "Vorgeschlagener Gesamtlageplan für das Resort Vinh Hung",
    },
    tags: ["hospitality", "plan"],
  },

  {
    kind: "crop",
    out: "vinh-hung-phan-khu.webp",
    source: "vinhhung",
    page: 5,
    rect: [0.13, 0.1, 0.88, 0.86],
    width: 1600,
    height: 1300,
    alt: {
      vi: "Sơ đồ phân khu chức năng khu nghỉ dưỡng Vĩnh Hưng",
      en: "Functional zoning diagram for the Vinh Hung resort",
      de: "Funktionszonierung für das Resort Vinh Hung",
    },
    tags: ["hospitality", "plan"],
  },

  // The Toki planning file: the drawings the investment decision rests on.
  {
    kind: "page",
    out: "toki-tong-mat-bang.webp",
    source: "tokiTongMatBang",
    page: 1,
    width: 2000,
    height: 1414,
    background: "#ffffff",
    alt: {
      vi: "Bản đồ quy hoạch tổng mặt bằng sử dụng đất dự án Khách sạn nghỉ dưỡng Toki, tỷ lệ 1/500",
      en: "Toki resort hotel master layout plan, scale 1:500",
      de: "Gesamtlageplan des Resorthotels Toki, Maßstab 1:500",
    },
    tags: ["hospitality", "plan", "toki"],
  },
  {
    kind: "page",
    out: "toki-quy-hoach-phan-khu.webp",
    source: "tokiQhpk",
    page: 1,
    width: 1800,
    height: 1273,
    background: "#ffffff",
    alt: {
      vi: "Trích quy hoạch phân khu khu vực phát triển đô thị xã Trung Trạch, tỷ lệ 1/2000, có đánh dấu vị trí dự án",
      en: "Extract of the Trung Trach urban zoning plan, 1:2000, with the project plot marked",
      de: "Auszug aus dem Zonenplan Trung Trach, 1:2000, mit markiertem Projektgrundstück",
    },
    tags: ["hospitality", "plan", "toki"],
  },
  {
    kind: "page",
    out: "toki-quy-hoach-su-dung-dat.webp",
    source: "tokiQhsdd",
    page: 1,
    width: 1600,
    height: 1236,
    background: "#ffffff",
    alt: {
      vi: "Trích quy hoạch sử dụng đất với vị trí đề xuất dự án nằm trong đất thương mại dịch vụ",
      en: "Land-use plan extract showing the proposed plot inside commercial-service land",
      de: "Auszug des Flächennutzungsplans mit dem Grundstück in Gewerbe- und Dienstleistungsfläche",
    },
    tags: ["hospitality", "plan", "toki"],
  },
  {
    kind: "page",
    out: "toki-vi-tri.webp",
    source: "tokiViTri",
    page: 1,
    width: 1600,
    height: 1236,
    background: "#ffffff",
    alt: {
      vi: "Vị trí đề xuất dự án trên ảnh vệ tinh, giáp đường ven biển",
      en: "The proposed plot on satellite imagery, beside the coastal road",
      de: "Das vorgeschlagene Grundstück im Satellitenbild an der Küstenstraße",
    },
    tags: ["hospitality", "plan", "toki"],
  },
  {
    kind: "page",
    out: "toki-ban-do-hien-trang.webp",
    source: "tokiHienTrang",
    page: 1,
    width: 1300,
    height: 1840,
    background: "#ffffff",
    alt: {
      vi: "Bản đồ chỉnh lý địa chính khu đất tại xã Hoàn Lão, tỷ lệ 1/2000",
      en: "Cadastral revision map of the plot at Hoan Lao commune, 1:2000",
      de: "Katasterberichtigungskarte des Grundstücks in Hoan Lao, 1:2000",
    },
    tags: ["hospitality", "plan", "toki"],
  },
  {
    kind: "page",
    out: "toki-thong-ke-su-dung-dat.webp",
    source: "tokiThongKe",
    page: 1,
    width: 1300,
    height: 1682,
    background: "#ffffff",
    alt: {
      vi: "Bảng thống kê kết quả chỉnh lý địa chính khu đất, tổng 16.244,9 m²",
      en: "Cadastral revision table for the plot, 16,244.9 m² in total",
      de: "Katastertabelle des Grundstücks, insgesamt 16.244,9 m²",
    },
    tags: ["hospitality", "plan", "toki"],
  },

  // Long Beach Resort: the sheets that carry the project's own figures.
  {
    kind: "page",
    out: "long-beach-mat-bang-tong-the.webp",
    source: "longBeach",
    page: 10,
    width: 2000,
    height: 1414,
    background: "#ffffff",
    alt: {
      vi: "Mặt bằng tổng thể Long Beach Resort, tỷ lệ 1/250, kèm bảng thống kê hạng mục",
      en: "Long Beach Resort overall site plan, 1:250, with the schedule of works",
      de: "Gesamtlageplan Long Beach Resort, 1:250, mit Bauteilverzeichnis",
    },
    tags: ["hospitality", "plan", "long-beach"],
  },
  {
    kind: "page",
    out: "long-beach-mat-dung.webp",
    source: "longBeach",
    page: 24,
    width: 2000,
    height: 1414,
    background: "#ffffff",
    alt: {
      vi: "Mặt đứng trục 12–1 và 1–12 của công trình Long Beach Resort",
      en: "Long Beach Resort elevations on axes 12-1 and 1-12",
      de: "Ansichten der Achsen 12-1 und 1-12 des Long Beach Resort",
    },
    tags: ["hospitality", "plan", "long-beach"],
  },
  {
    kind: "page",
    out: "long-beach-vi-tri.webp",
    source: "longBeach",
    page: 5,
    width: 1800,
    height: 1273,
    background: "#ffffff",
    alt: {
      vi: "Mặt bằng vị trí khu đất Long Beach Resort trên đường Trương Pháp",
      en: "Long Beach Resort site location plan on Truong Phap road",
      de: "Lageplan des Grundstücks Long Beach Resort an der Truong-Phap-Straße",
    },
    tags: ["hospitality", "plan", "long-beach"],
  },

  // TOKI's own material: photographs of the operator's design language, used
  // where the site talks about operation rather than about a specific project.
];

function loadSource(source: Source): Buffer {
  const file = path.join(CONTENT_DIR, source.file);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing source document: ${file}`);
  }
  return fs.readFileSync(file);
}

/**
 * Picks the render off a presentation page.
 *
 * Every page of that deck draws the same paper texture behind the render and
 * the same studio watermark beside it, so both repeat across pages while the
 * render itself never does. Choosing the largest image that is not one of the
 * repeated ones is steadier than trusting a draw order.
 */
async function pickSlideImage(bytes: Buffer, pageNumber: number): Promise<Buffer> {
  const mupdf = await import("mupdf");
  const doc = mupdf.Document.openDocument(bytes, "application/pdf");
  const page = doc.loadPage(pageNumber - 1);
  const found: { area: number; data: Buffer; width: number; height: number }[] = [];
  page.toStructuredText("preserve-images").walk({
    onImageBlock(_bbox, _transform, image) {
      const pixmap = image.toPixmap();
      const width = pixmap.getWidth();
      const height = pixmap.getHeight();
      // The texture is 2076x1467 on every page and the watermark is 232x78.
      const isTexture = width === 2076 && height === 1467;
      const isWatermark = Math.min(width, height) < 200;
      if (!isTexture && !isWatermark) {
        found.push({ area: width * height, data: Buffer.from(pixmap.asPNG()), width, height });
      }
      pixmap.destroy();
    },
  });
  if (!found.length) throw new Error(`No render found on page ${pageNumber}`);
  found.sort((a, b) => b.area - a.area);
  return found[0].data;
}

/**
 * Renders a full sheet. Drawings are line art on white, so they are fitted onto
 * a white ground rather than cropped - cutting a plan down to a tile would lose
 * the legend and the dimension strings the plan depends on.
 */
async function renderSheet(bytes: Buffer, pageNumber: number): Promise<Buffer> {
  return renderPage(bytes, pageNumber, RENDER_SCALE);
}

async function cropPage(
  bytes: Buffer,
  pageNumber: number,
  rect: [number, number, number, number],
): Promise<Buffer> {
  const png = await renderPage(bytes, pageNumber, RENDER_SCALE);
  const meta = await sharp(png).metadata();
  const pageWidth = meta.width ?? 0;
  const pageHeight = meta.height ?? 0;
  const left = Math.round(rect[0] * pageWidth);
  const top = Math.round(rect[1] * pageHeight);
  const width = Math.round((rect[2] - rect[0]) * pageWidth);
  const height = Math.round((rect[3] - rect[1]) * pageHeight);
  return sharp(png).extract({ left, top, width, height }).png().toBuffer();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const cache = new Map<string, Buffer>();
  const manifest: Record<string, unknown>[] = [];

  for (const target of TARGETS) {
    const source = SOURCES[target.source];
    if (!cache.has(source.file)) cache.set(source.file, loadSource(source));
    const bytes = cache.get(source.file)!;

    const raw =
      target.kind === "slideImage"
        ? await pickSlideImage(bytes, target.page)
        : target.kind === "page"
          ? await renderSheet(bytes, target.page)
          : await cropPage(bytes, target.page, target.rect);

    const outFile = path.join(OUT_DIR, target.out);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const resized =
      target.kind === "page"
        ? sharp(raw).resize(target.width, target.height, {
            fit: "contain",
            background: target.background,
          })
        : sharp(raw).resize(target.width, target.height, { fit: "cover", position: "attention" });
    await resized.webp({ quality: 82 }).toFile(outFile);

    const size = fs.statSync(outFile).size;
    manifest.push({
      src: `/media/hospitality/${target.out}`,
      width: target.width,
      height: target.height,
      bytes: size,
      alt: target.alt,
      tags: target.tags,
      source: { document: source.title, slug: source.slug, page: target.page },
    });
    console.log(`${target.out}  ${(size / 1024).toFixed(0)}KB`);
  }

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\n${manifest.length} images -> ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
