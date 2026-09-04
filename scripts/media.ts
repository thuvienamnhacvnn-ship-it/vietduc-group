import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { extractImages, renderPage } from "../src/lib/pdf/extract";

/**
 * Builds the site's image library from the official PDF profile.
 *
 * The profile was produced in a design tool, so most pages are a single
 * flattened bitmap - there is no separable "campus photo" object to pull out.
 * Two strategies are therefore supported:
 *
 *  - `crop`: render the page at high resolution and cut a named region. Used
 *    for the school photographs that only exist inside a composed page.
 *  - `embedded`: take a specific embedded image. Used for the event and student
 *    photographs on pages 22-24, which were placed as separate images.
 *
 * Every asset keeps the document and page it came from. Nothing is downloaded
 * from the internet and nothing is generated.
 *
 * Usage: npm run media
 */

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "content", "media-manifest.json");

const SOURCE_PDF = "profile-vietduc-a.pdf";
const SOURCE_SLUG = "profile-viet-duc-vi";
const SOURCE_TITLE = "PROFILE VIỆT ĐỨC GROUP (bản tiếng Việt)";

/** Page render scale for crops. 4 gives ~4600px wide pages to cut from. */
const RENDER_SCALE = 4;

type Alt = { vi: string; en: string; de: string };

type CropTarget = {
  kind: "crop";
  out: string;
  page: number;
  /** Region as fractions of the page: [x0, y0, x1, y1]. */
  rect: [number, number, number, number];
  width: number;
  height: number;
  alt: Alt;
  tags: string[];
};

type EmbeddedTarget = {
  kind: "embedded";
  out: string;
  page: number;
  /** 0-based index into that page's images, largest first. */
  pick: number;
  width: number;
  height: number;
  alt: Alt;
  tags: string[];
};

/**
 * A school crest.
 *
 * The embedded logo objects carry their transparency in a separate soft mask
 * that mupdf's `toPixmap()` does not composite, so pulling them out directly
 * turns every transparent pixel black. Cropping them off the rendered page
 * instead gives the artwork as designed, on the cover's white ground - which is
 * also the ground it is displayed on.
 */
type LogoTarget = {
  kind: "logo";
  out: string;
  page: number;
  /** Region as fractions of the page: [x0, y0, x1, y1]. */
  rect: [number, number, number, number];
  size: number;
  alt: Alt;
  tags: string[];
};

type Target = CropTarget | EmbeddedTarget | LogoTarget;

const TARGETS: Target[] = [
  {
    kind: "crop",
    out: "hero/group-hq.webp",
    page: 2,
    rect: [0.635, 0.05, 1.0, 0.52],
    width: 1800, height: 1200,
    alt: {
      vi: "Toà nhà Việt Đức Group",
      en: "The Viet Duc Group building",
      de: "Das Gebäude der Viet Duc Group",
    },
    tags: ["hero", "campus"],
  },
  {
    kind: "crop",
    out: "schools/cao-dang-cong-nghe-ngoai-thuong.webp",
    page: 4,
    rect: [0.62, 0.07, 1.0, 0.52],
    width: 1400, height: 1000,
    alt: {
      vi: "Khuôn viên Trường Cao đẳng Công nghệ – Ngoại thương",
      en: "Campus of Foreign Trade Technology College",
      de: "Campus des Foreign Trade Technology College",
    },
    tags: ["school", "campus"],
  },
  {
    kind: "crop",
    out: "schools/trung-cap-cong-nghe-viet-duc.webp",
    page: 8,
    rect: [0.58, 0.07, 1.0, 0.39],
    width: 1400, height: 1000,
    alt: {
      vi: "Khuôn viên Trường Trung cấp Công nghệ Việt Đức",
      en: "Campus of Viet Duc Vocational School of Technology",
      de: "Campus der Viet Duc Berufsfachschule für Technik",
    },
    tags: ["school", "campus"],
  },
  {
    kind: "crop",
    out: "schools/trung-cap-nghe-quoc-te-ivs.webp",
    page: 10,
    rect: [0.52, 0.07, 0.81, 0.37],
    width: 1400, height: 1000,
    alt: {
      vi: "Khuôn viên Trường Trung cấp nghề Quốc tế (IVS)",
      en: "Campus of the International Vocational School (IVS)",
      de: "Campus der International Vocational School (IVS)",
    },
    tags: ["school", "campus"],
  },
  {
    kind: "crop",
    out: "schools/trung-cap-bach-khoa-vung-tau.webp",
    page: 14,
    rect: [0.5, 0.06, 1.0, 0.32],
    width: 1400, height: 1000,
    alt: {
      vi: "Khuôn viên Trường Trung cấp Bách khoa Vũng Tàu",
      en: "Campus of Bach Khoa Vung Tau Vocational School",
      de: "Campus der Bach Khoa Vung Tau Berufsfachschule",
    },
    tags: ["school", "campus"],
  },
  {
    kind: "crop",
    out: "schools/trung-cap-viet-han.webp",
    page: 18,
    rect: [0.0, 0.78, 0.235, 1.0],
    width: 1400, height: 1000,
    alt: {
      vi: "Khuôn viên Trường Trung cấp Việt Hàn",
      en: "Campus of Viet Han Vocational School",
      de: "Campus der Viet Han Berufsfachschule",
    },
    tags: ["school", "campus"],
  },
  {
    kind: "crop",
    out: "schools/itw-berlin.webp",
    page: 21,
    rect: [0.605, 0.115, 0.785, 0.305],
    width: 1400, height: 1000,
    alt: {
      vi: "Trụ sở itw Berlin, CHLB Đức",
      en: "The itw Berlin premises, Germany",
      de: "Das Gebäude des itw Berlin, Deutschland",
    },
    tags: ["school", "campus", "germany"],
  },

  // Photographs placed as separate images on the partnership and student-life
  // pages. Each caption describes what is actually visible in the photo -
  // banners in shot were read to get the event right.
  {
    kind: "embedded",
    out: "activities/le-ky-ket-sungwoo.webp",
    page: 22, pick: 2,
    width: 1200, height: 800,
    alt: {
      vi: "Lễ ký kết hợp tác giữa Trường Cao đẳng Công nghệ – Ngoại thương và Công ty TNHH Sungwoo",
      en: "Cooperation signing between Foreign Trade Technology College and Sungwoo Co., Ltd",
      de: "Kooperationsunterzeichnung zwischen dem Foreign Trade Technology College und Sungwoo Co., Ltd",
    },
    tags: ["activity", "partnership"],
  },
  {
    kind: "embedded",
    out: "activities/le-ky-ket-mou-acts.webp",
    page: 22, pick: 3,
    width: 1200, height: 800,
    alt: {
      vi: "Lễ ký kết MOU giữa Trường Trung cấp nghề Quốc tế Ninh Bình và ACTS University (Hàn Quốc)",
      en: "MOU signing between the International Vocational School, Ninh Binh and ACTS University, South Korea",
      de: "MOU-Unterzeichnung zwischen der International Vocational School Ninh Binh und der ACTS University, Südkorea",
    },
    tags: ["activity", "partnership", "international"],
  },
  {
    kind: "embedded",
    out: "activities/le-khai-giang.webp",
    page: 22, pick: 1,
    width: 1200, height: 800,
    alt: {
      vi: "Lễ khai giảng lớp đào tạo phối hợp giữa Học viện Tư pháp và Trường Cao đẳng Công nghệ – Ngoại thương",
      en: "Opening ceremony of a joint course run with the Judicial Academy and Foreign Trade Technology College",
      de: "Eröffnung eines gemeinsamen Kurses der Justizakademie und des Foreign Trade Technology College",
    },
    tags: ["activity", "ceremony"],
  },
  {
    kind: "embedded",
    out: "activities/tu-van-tuyen-sinh.webp",
    page: 22, pick: 5,
    width: 1200, height: 800,
    alt: {
      vi: "Gian tư vấn tuyển sinh của Trường Cao đẳng Công nghệ – Ngoại thương tại ngày hội hướng nghiệp",
      en: "The Foreign Trade Technology College admissions stand at a careers fair",
      de: "Der Zulassungsstand des Foreign Trade Technology College auf einer Berufsmesse",
    },
    tags: ["activity", "admissions"],
  },
  {
    kind: "embedded",
    out: "activities/hoi-thao-sinh-vien.webp",
    page: 23, pick: 0,
    width: 1200, height: 800,
    alt: {
      vi: "Lễ bế mạc Hội thao sinh viên năm 2025",
      en: "Closing ceremony of the 2025 student sports festival",
      de: "Abschlussfeier des Sportfests 2025",
    },
    tags: ["activity", "sports"],
  },
  {
    kind: "embedded",
    out: "activities/tai-nang-thanh-lich.webp",
    page: 23, pick: 5,
    width: 1200, height: 800,
    alt: {
      vi: "Chung kết cuộc thi Học sinh – Sinh viên tài năng thanh lịch",
      en: "The final of the student talent and poise contest",
      de: "Finale des Talent- und Auftrittswettbewerbs der Lernenden",
    },
    tags: ["activity", "culture"],
  },
  {
    kind: "embedded",
    out: "activities/hien-mau-tinh-nguyen.webp",
    page: 23, pick: 3,
    width: 1200, height: 800,
    alt: {
      vi: "Chương trình hiến máu tình nguyện năm 2025",
      en: "The 2025 voluntary blood donation programme",
      de: "Die freiwillige Blutspendeaktion 2025",
    },
    tags: ["activity", "volunteer"],
  },
  {
    kind: "embedded",
    out: "activities/cam-hoa-nghe-thuat.webp",
    page: 23, pick: 1,
    width: 1200, height: 800,
    alt: {
      vi: "Trao giải cuộc thi Cắm hoa nghệ thuật chào mừng ngày Phụ nữ Việt Nam",
      en: "Prize-giving at the floral art contest marking Vietnamese Women's Day",
      de: "Preisverleihung beim Blumenkunst-Wettbewerb zum vietnamesischen Frauentag",
    },
    tags: ["activity", "culture"],
  },
  {
    kind: "embedded",
    out: "activities/chap-canh-uoc-mo-xanh.webp",
    page: 23, pick: 4,
    width: 1200, height: 800,
    alt: {
      vi: "Sinh viên tham gia chương trình tình nguyện Chắp cánh ước mơ xanh",
      en: "Students taking part in the Green Dreams volunteering programme",
      de: "Lernende beim Freiwilligenprogramm „Grüne Träume\"",
    },
    tags: ["activity", "volunteer"],
  },
  {
    kind: "embedded",
    out: "activities/tham-quan-bao-tang.webp",
    page: 23, pick: 2,
    width: 1200, height: 800,
    alt: {
      vi: "Sinh viên trong chuyến tham quan bảo tàng",
      en: "Students on a museum visit",
      de: "Lernende bei einem Museumsbesuch",
    },
    tags: ["activity", "culture"],
  },
  // The six school crests, all present on the profile cover (page 1).
  {
    kind: "logo", out: "schools/logos/trung-cap-nghe-quoc-te-ivs.webp",
    page: 1, rect: [0.233, 0.760, 0.324, 0.882], size: 320,
    alt: {
      vi: "Logo Trường Trung cấp nghề Quốc tế (IVS)",
      en: "Logo of the International Vocational School (IVS)",
      de: "Logo der International Vocational School (IVS)",
    },
    tags: ["logo", "school"],
  },
  {
    kind: "logo", out: "schools/logos/trung-cap-bach-khoa-vung-tau.webp",
    page: 1, rect: [0.390, 0.767, 0.489, 0.885], size: 320,
    alt: {
      vi: "Logo Trường Trung cấp Bách khoa Vũng Tàu",
      en: "Logo of Bach Khoa Vung Tau Vocational School",
      de: "Logo der Bach Khoa Vung Tau Berufsfachschule",
    },
    tags: ["logo", "school"],
  },
  {
    kind: "logo", out: "schools/logos/cao-dang-cong-nghe-ngoai-thuong.webp",
    page: 1, rect: [0.069, 0.772, 0.181, 0.858], size: 320,
    alt: {
      vi: "Logo Trường Cao đẳng Công nghệ – Ngoại thương",
      en: "Logo of Foreign Trade Technology College",
      de: "Logo des Foreign Trade Technology College",
    },
    tags: ["logo", "school"],
  },
  {
    kind: "logo", out: "schools/logos/trung-cap-cong-nghe-viet-duc.webp",
    page: 1, rect: [0.683, 0.767, 0.785, 0.882], size: 320,
    alt: {
      vi: "Logo Trường Trung cấp Công nghệ Việt Đức",
      en: "Logo of Viet Duc Vocational School of Technology",
      de: "Logo der Viet Duc Berufsfachschule für Technik",
    },
    tags: ["logo", "school"],
  },
  {
    kind: "logo", out: "schools/logos/itw-berlin.webp",
    page: 1, rect: [0.826, 0.782, 0.924, 0.862], size: 320,
    alt: {
      vi: "Logo itw Berlin",
      en: "Logo of itw Berlin",
      de: "Logo des itw Berlin",
    },
    tags: ["logo", "school"],
  },
  {
    kind: "logo", out: "schools/logos/trung-cap-viet-han.webp",
    page: 1, rect: [0.538, 0.770, 0.632, 0.878], size: 320,
    alt: {
      vi: "Logo Trường Trung cấp Việt Hàn",
      en: "Logo of Viet Han Vocational School",
      de: "Logo der Viet Han Berufsfachschule",
    },
    tags: ["logo", "school"],
  },
];

export type MediaEntry = {
  path: string;
  width: number;
  height: number;
  bytes: number;
  alt: Alt;
  tags: string[];
  provenance: {
    source: string;
    sourceTitle: string;
    page: number;
    importedAt: string;
    method: "pdf-ocr";
  };
};

async function main() {
  const pdfPath = path.join(CONTENT_DIR, SOURCE_PDF);
  if (!fs.existsSync(pdfPath)) {
    console.error(`Missing ${pdfPath}. Copy the source PDFs into /content first.`);
    process.exit(1);
  }

  const bytes = fs.readFileSync(pdfPath);
  console.log(`Reading ${SOURCE_PDF} …`);

  const embedded = await extractImages(bytes, 200);
  const byPage = new Map<number, typeof embedded>();
  for (const image of embedded) {
    const list = byPage.get(image.pageNumber) ?? [];
    list.push(image);
    byPage.set(image.pageNumber, list);
  }
  for (const list of byPage.values()) list.sort((a, b) => b.width * b.height - a.width * a.height);

  const renderCache = new Map<number, Buffer>();
  const manifest: MediaEntry[] = [];
  const importedAt = new Date().toISOString().slice(0, 10);

  for (const target of TARGETS) {
    let input: Buffer;
    let describe: string;

    if (target.kind === "logo") {
      let page = renderCache.get(target.page);
      if (!page) {
        page = await renderPage(bytes, target.page, RENDER_SCALE);
        renderCache.set(target.page, page);
      }
      const meta = await sharp(page).metadata();
      const pw = meta.width ?? 0;
      const ph = meta.height ?? 0;
      const [x0, y0, x1, y1] = target.rect;
      const cropped = await sharp(page)
        .extract({
          left: Math.round(x0 * pw),
          top: Math.round(y0 * ph),
          width: Math.max(1, Math.round((x1 - x0) * pw)),
          height: Math.max(1, Math.round((y1 - y0) * ph)),
        })
        .toBuffer();

      const outPath = path.join(OUT_DIR, target.out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      // Trim the white margin so crests of different proportions optically
      // match, then `contain` on a square so they line up in a row.
      const output = await sharp(cropped)
        .trim({ background: "#ffffff", threshold: 14 })
        .resize(target.size, target.size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({ quality: 92 })
        .toBuffer();
      fs.writeFileSync(outPath, output);
      manifest.push({
        path: `/media/${target.out}`,
        width: target.size,
        height: target.size,
        bytes: output.length,
        alt: target.alt,
        tags: target.tags,
        provenance: {
          source: SOURCE_SLUG,
          sourceTitle: SOURCE_TITLE,
          page: target.page,
          importedAt,
          method: "pdf-ocr",
        },
      });
      console.log(
        `  ${target.out.padEnd(46)} <- p${target.page} crest crop, ${Math.round(output.length / 1024)} KB`,
      );
      continue;
    }

    if (target.kind === "embedded") {
      const chosen = byPage.get(target.page)?.[target.pick];
      if (!chosen) {
        console.warn(`  !! no embedded image #${target.pick} on page ${target.page}`);
        continue;
      }
      input = chosen.data;
      describe = `p${target.page} embedded #${target.pick} (${chosen.width}x${chosen.height})`;
    } else {
      let page = renderCache.get(target.page);
      if (!page) {
        page = await renderPage(bytes, target.page, RENDER_SCALE);
        renderCache.set(target.page, page);
      }
      const meta = await sharp(page).metadata();
      const pw = meta.width ?? 0;
      const ph = meta.height ?? 0;
      const [x0, y0, x1, y1] = target.rect;
      const left = Math.round(x0 * pw);
      const top = Math.round(y0 * ph);
      const width = Math.max(1, Math.round((x1 - x0) * pw));
      const height = Math.max(1, Math.round((y1 - y0) * ph));
      input = await sharp(page).extract({ left, top, width, height }).toBuffer();
      describe = `p${target.page} crop ${width}x${height} of ${pw}x${ph}`;
    }

    const outPath = path.join(OUT_DIR, target.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    // `cover` never distorts; `attention` keeps the salient subject in frame.
    const output = await sharp(input)
      .resize(target.width, target.height, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toBuffer();
    fs.writeFileSync(outPath, output);

    manifest.push({
      path: `/media/${target.out}`,
      width: target.width,
      height: target.height,
      bytes: output.length,
      alt: target.alt,
      tags: target.tags,
      provenance: {
        source: SOURCE_SLUG,
        sourceTitle: SOURCE_TITLE,
        page: target.page,
        importedAt,
        method: "pdf-ocr",
      },
    });
    console.log(`  ${target.out.padEnd(46)} <- ${describe}, ${Math.round(output.length / 1024)} KB`);
  }

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nWrote ${manifest.length} assets and ${path.relative(ROOT, MANIFEST)}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
