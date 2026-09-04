import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Builds the education arm's photo library from the harvested profile images.
 *
 * Two sources, and they are not interchangeable:
 *
 *  - `profile-vietduc-*` is Viet Duc Group's own capability profile, so those
 *    pictures show the group's own schools, students and events.
 *  - `nibelc-*` is the NIBELC Group profile - the partner network. Those show
 *    partner workplaces and international meetings, and every caption says so.
 *    They are never described as a Viet Duc campus.
 *
 * Source files live in _harvest/, produced by _harvest.mjs from the PDFs.
 *
 * Usage: npm run media:education
 */

const IN = "_harvest";
const OUT = path.join("public", "media", "education");
const MANIFEST = path.join("src", "content", "media-education.json");

type Alt = { vi: string; en: string; de: string };

type Shot = {
  from: string;
  out: string;
  width: number;
  height: number;
  alt: Alt;
  /** Which document it came from, for the record. */
  source: string;
  tags: string[];
};

const SHOTS: Shot[] = [
  {
    from: "profile-a-p23-2-7ffd40de6a.png",
    out: "tai-nang-thanh-lich.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Đêm chung kết cuộc thi Học sinh – Sinh viên tài năng thanh lịch",
      en: "Final night of the student talent and poise contest",
      de: "Finalabend des Talentwettbewerbs für Schülerinnen und Schüler",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 23",
    tags: ["student-life", "event"],
  },
  {
    from: "profile-a-p23-4-b8a0825676.png",
    out: "trao-thuong-hoc-sinh.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Trao phần thưởng cho học sinh trong đồng phục nhà trường",
      en: "Prizes presented to students in school uniform",
      de: "Preisverleihung an Schülerinnen und Schüler in Schuluniform",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 23",
    tags: ["student-life", "event"],
  },
  {
    from: "profile-a-p23-5-d7a87e0183.png",
    out: "hoc-sinh-tham-quan.webp",
    width: 1200,
    height: 900,
    alt: {
      vi: "Học sinh tham quan trưng bày trong khuôn viên trường",
      en: "Students at an exhibition on campus",
      de: "Schülerinnen und Schüler bei einer Ausstellung auf dem Campus",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 23",
    tags: ["student-life"],
  },
  {
    from: "profile-a-p23-6-9465c8bab5.png",
    out: "hien-mau-tinh-nguyen.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Chương trình hiến máu tình nguyện do nhà trường tổ chức",
      en: "The school's voluntary blood donation programme",
      de: "Freiwillige Blutspendeaktion der Schule",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 23",
    tags: ["student-life", "community"],
  },
  {
    from: "profile-a-p23-7-bf8d30d144.png",
    out: "hoc-sinh-san-khau.webp",
    width: 1200,
    height: 900,
    alt: {
      vi: "Học sinh trình bày trên sân khấu trong hoạt động ngoại khoá",
      en: "A student presenting on stage at a school event",
      de: "Eine Schülerin präsentiert bei einer Schulveranstaltung",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 23",
    tags: ["student-life"],
  },
  {
    from: "profile-a-p18-2-7611a0283a.png",
    out: "nghiep-vu-le-tan.webp",
    width: 1200,
    height: 900,
    alt: {
      vi: "Thực hành nghiệp vụ lễ tân trong ngành du lịch – dịch vụ",
      en: "Front-desk practice in the tourism and services field",
      de: "Rezeptionspraxis im Bereich Tourismus und Dienstleistung",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 18",
    tags: ["practice", "field-tourism"],
  },
  {
    from: "profile-a-p24-7-ad899f76ce.png",
    out: "lam-viec-doi-tac.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Buổi làm việc giữa nhà trường và đối tác nước ngoài",
      en: "A working session between the school and an overseas partner",
      de: "Arbeitstreffen zwischen der Schule und einem Partner aus dem Ausland",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 24",
    tags: ["partnership"],
  },
  {
    from: "profile-a-p24-8-d6d3bfc4eb.png",
    out: "hoi-nghi-hop-tac.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Hội nghị hợp tác đào tạo với đối tác quốc tế",
      en: "A training-cooperation conference with international partners",
      de: "Konferenz zur Ausbildungskooperation mit internationalen Partnern",
    },
    source: "Hồ sơ năng lực Việt Đức Group, trang 24",
    tags: ["partnership"],
  },
  {
    from: "nibelc-en-p20-8-0efc4e7a22.png",
    out: "xuong-thuc-hanh-may.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Học viên thực hành trên dây chuyền máy tại doanh nghiệp trong mạng lưới NIBELC",
      en: "Trainees at a production line in the NIBELC partner network",
      de: "Auszubildende an einer Fertigungslinie im NIBELC-Partnernetz",
    },
    source: "NIBELC Group profile (bản tiếng Anh), trang 20",
    tags: ["practice", "partner-network"],
  },
  {
    from: "nibelc-en-p48-5-081c681092.png",
    out: "cong-truong-ky-thuat.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Kỹ thuật viên tại công trường của doanh nghiệp trong mạng lưới NIBELC",
      en: "Technicians on site at a company in the NIBELC network",
      de: "Techniker auf der Baustelle eines Unternehmens im NIBELC-Netz",
    },
    source: "NIBELC Group profile (bản tiếng Anh), trang 48",
    tags: ["practice", "partner-network"],
  },
  {
    from: "nibelc-en-p13-12-859fa1363.png",
    out: "xuong-lap-rap.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Xưởng lắp ráp điện tử tại doanh nghiệp trong mạng lưới NIBELC",
      en: "An electronics assembly floor in the NIBELC network",
      de: "Elektronikmontage in einem Betrieb des NIBELC-Netzes",
    },
    source: "NIBELC Group profile (bản tiếng Anh), trang 13",
    tags: ["practice", "partner-network"],
  },
  {
    from: "nibelc-vi-p45-9-e4f6a669c1.png",
    out: "tien-hoc-vien-len-duong.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Tiễn học viên lên đường sang nước ngoài làm việc",
      en: "Sending trainees off to work abroad",
      de: "Verabschiedung von Auszubildenden vor der Ausreise",
    },
    source: "NIBELC Group profile (bản tiếng Việt), trang 45",
    tags: ["partner-network", "overseas"],
  },
  {
    from: "nibelc-vi-p36-7-8ac8dc4379.png",
    out: "tiep-doan-quoc-te.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Tiếp đoàn công tác quốc tế trong mạng lưới NIBELC",
      en: "Receiving an international delegation in the NIBELC network",
      de: "Empfang einer internationalen Delegation im NIBELC-Netz",
    },
    source: "NIBELC Group profile (bản tiếng Việt), trang 36",
    tags: ["partnership", "partner-network"],
  },
  {
    from: "nibelc-en-p54-2-484064cc90.png",
    out: "gap-doi-tac-chau-au.webp",
    width: 1400,
    height: 933,
    alt: {
      vi: "Gặp gỡ đối tác châu Âu trong mạng lưới NIBELC",
      en: "Meeting European partners in the NIBELC network",
      de: "Treffen mit europäischen Partnern im NIBELC-Netz",
    },
    source: "NIBELC Group profile (bản tiếng Anh), trang 54",
    tags: ["partnership", "partner-network"],
  },
];

async function main() {
  if (!fs.existsSync(IN)) {
    console.error(`Chưa có ${IN}. Chạy: node _harvest.mjs`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const manifest: Record<string, unknown>[] = [];
  for (const shot of SHOTS) {
    const stem = shot.from.replace(/.png$/, "");
    const match = fs.readdirSync(IN).find((f) => f.startsWith(stem.slice(0, stem.lastIndexOf("-") + 1)) && f.startsWith(stem.slice(0, 22)));
    const from = match ? path.join(IN, match) : path.join(IN, shot.from);
    if (!fs.existsSync(from)) {
      console.log(`thiếu ${shot.from}`);
      continue;
    }
    const to = path.join(OUT, shot.out);
    await sharp(from)
      .resize(shot.width, shot.height, { fit: "cover", position: "top" })
      .webp({ quality: 82 })
      .toFile(to);
    const bytes = fs.statSync(to).size;
    manifest.push({
      src: `/media/education/${shot.out}`,
      width: shot.width,
      height: shot.height,
      bytes,
      alt: shot.alt,
      tags: shot.tags,
      source: shot.source,
    });
    console.log(`${shot.out}  ${(bytes / 1024).toFixed(0)}KB`);
  }

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\n${manifest.length} ảnh -> ${MANIFEST}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
