import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import {
  activities,
  categories,
  documents,
  faqs,
  media,
  pages,
  partners,
  programs,
  schools,
  settings,
  users,
  type L10n,
  type Provenance,
  type Status,
} from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/password";
import { formatDate } from "../src/lib/format";
import { DEFAULT_SETTINGS, SETTINGS_KEYS } from "../src/lib/site-config";
import { CATEGORIES, DOCUMENTS, SCHOOLS } from "../src/content/seed/schools";
import { LICENSED_PROGRAMS, TRAINING_INTENTS } from "../src/content/seed/programs";
import { ACTIVITIES, FAQS, PARTNERS } from "../src/content/seed/network";
import { PAGES } from "../src/content/seed/pages";

/**
 * Loads the transcribed source data into the database.
 *
 * Status policy, applied deliberately:
 *  - Records transcribed from an official licence or from the capability
 *    profile and checked line by line are seeded `approved`. They are already
 *    reviewed content, and the site would otherwise ship empty.
 *  - Records that only appear as marketing claims with no licence backing are
 *    seeded `draft` with an editor note, so they never reach the public site or
 *    the advisor until someone at the organisation confirms them.
 *  - Content produced later by the runtime PDF pipeline always lands `draft`,
 *    regardless of this file.
 *
 * Re-running is safe: every entity is matched on its slug and updated in place.
 */

const ROOT = process.cwd();

type MediaManifestEntry = {
  path: string;
  width: number;
  height: number;
  bytes: number;
  alt: { vi: string; en: string; de: string };
  tags: string[];
  provenance: Provenance;
};

const LEVEL_LABEL: Record<string, L10n> = {
  cao_dang: { vi: "trình độ cao đẳng", en: "college level", de: "College-Niveau" },
  trung_cap: { vi: "trình độ trung cấp", en: "intermediate level", de: "Fachschulniveau" },
  so_cap: { vi: "trình độ sơ cấp", en: "elementary level", de: "Grundstufe" },
  lien_ket: { vi: "chương trình liên kết", en: "partnership programme", de: "Kooperationsprogramm" },
};

/**
 * Builds a factual one-paragraph overview from the licence row itself. This is
 * a restatement of data already in the record, not an invented description -
 * marked as such so an editor knows it is theirs to expand.
 */
function licenceOverview(
  title: L10n,
  schoolName: L10n,
  level: string,
  code: string | undefined,
  quota: number | undefined,
  licence: { number: string; date: string } | undefined,
): L10n {
  const build = (locale: "vi" | "en" | "de") => {
    const t = (f: L10n) => f[locale] ?? f.vi;
    if (locale === "en") {
      const parts = [
        `${t(title)} is offered at ${t(LEVEL_LABEL[level])} by ${t(schoolName)}.`,
        code ? `Official occupation code ${code}.` : null,
        quota ? `Registered annual intake: ${quota} learners.` : null,
        licence ? `Registered under certificate ${licence.number} of ${formatDate(licence.date, "en")}.` : null,
      ];
      return parts.filter(Boolean).join(" ");
    }
    if (locale === "de") {
      const parts = [
        `${t(title)} wird von ${t(schoolName)} auf ${t(LEVEL_LABEL[level])} angeboten.`,
        code ? `Amtlicher Berufscode ${code}.` : null,
        quota ? `Registrierte Aufnahmekapazität: ${quota} Lernende pro Jahr.` : null,
        licence ? `Registriert unter Bescheid ${licence.number} vom ${formatDate(licence.date, "de")}.` : null,
      ];
      return parts.filter(Boolean).join(" ");
    }
    const parts = [
      `Ngành ${t(title)} được ${t(schoolName)} tổ chức đào tạo ở ${t(LEVEL_LABEL[level])}.`,
      code ? `Mã ngành/nghề: ${code}.` : null,
      quota ? `Quy mô tuyển sinh đã đăng ký: ${quota} người học/năm.` : null,
      licence ? `Đăng ký theo Giấy chứng nhận số ${licence.number} ngày ${formatDate(licence.date, "vi")}.` : null,
    ];
    return parts.filter(Boolean).join(" ");
  };
  return { vi: build("vi"), en: build("en"), de: build("de") };
}

async function main() {
  const db = await getDb();
  const now = new Date();

  /* ----------------------------------------------------------- documents */
  const documentIdBySlug = new Map<string, number>();
  for (const doc of DOCUMENTS) {
    const existing = await db.select().from(documents).where(eq(documents.slug, doc.slug));
    const values = {
      slug: doc.slug,
      title: doc.title,
      originalName: doc.originalName,
      storagePath: `content/${doc.slug}.pdf`,
      bytes: 0,
      pageCount: doc.pageCount,
      language: doc.language,
      documentDate: doc.documentDate ?? null,
      processingState: "ready",
      ocrUsed: doc.ocrUsed,
      downloadable: false,
      status: "approved" as Status,
      processedAt: now,
    };
    if (existing[0]) {
      await db.update(documents).set(values).where(eq(documents.id, existing[0].id));
      documentIdBySlug.set(doc.slug, existing[0].id);
    } else {
      const [row] = await db.insert(documents).values(values).returning({ id: documents.id });
      documentIdBySlug.set(doc.slug, row.id);
    }
  }
  console.log(`documents      ${DOCUMENTS.length}`);

  /* ---------------------------------------------------------- categories */
  const categoryIdBySlug = new Map<string, number>();
  for (const category of CATEGORIES) {
    const existing = await db.select().from(categories).where(eq(categories.slug, category.slug));
    const values = {
      slug: category.slug,
      name: category.name,
      description: category.description ?? null,
      order: category.order,
    };
    if (existing[0]) {
      await db.update(categories).set(values).where(eq(categories.id, existing[0].id));
      categoryIdBySlug.set(category.slug, existing[0].id);
    } else {
      const [row] = await db.insert(categories).values(values).returning({ id: categories.id });
      categoryIdBySlug.set(category.slug, row.id);
    }
  }
  console.log(`categories     ${CATEGORIES.length}`);

  /* ------------------------------------------------------------- schools */
  const schoolIdBySlug = new Map<string, number>();
  const schoolBySlug = new Map(SCHOOLS.map((s) => [s.slug, s]));
  for (const school of SCHOOLS) {
    const existing = await db.select().from(schools).where(eq(schools.slug, school.slug));
    const values = {
      slug: school.slug,
      order: school.order,
      name: school.name,
      shortName: school.shortName ?? null,
      tagline: school.tagline ?? null,
      summary: school.summary ?? null,
      legalNameEn: school.legalNameEn ?? null,
      city: school.city ?? null,
      country: school.country ?? "VN",
      address: school.address ?? null,
      phone: school.phone ?? null,
      email: school.email ?? null,
      website: school.website ?? null,
      logoPath: school.logoPath ?? null,
      coverPath: school.coverPath ?? null,
      highlights: school.highlights ?? null,
      legalRefs: school.legalRefs ?? null,
      stats: school.stats ?? null,
      status: "approved" as Status,
      provenance: school.provenance,
      editorNote: school.editorNote ?? null,
      updatedAt: now,
    };
    if (existing[0]) {
      await db.update(schools).set(values).where(eq(schools.id, existing[0].id));
      schoolIdBySlug.set(school.slug, existing[0].id);
    } else {
      const [row] = await db.insert(schools).values(values).returning({ id: schools.id });
      schoolIdBySlug.set(school.slug, row.id);
    }
  }
  console.log(`schools        ${SCHOOLS.length}`);

  /* ------------------------------------------------------------ programs */
  let approvedPrograms = 0;
  let draftPrograms = 0;

  for (const program of LICENSED_PROGRAMS) {
    const school = schoolBySlug.get(program.school);
    // The registration certificate is the last legalRef of kind "Giấy chứng nhận".
    const licence = school?.legalRefs?.filter((r) => /chứng nhận|certificate/i.test(r.label.vi)).at(-1);
    const overview =
      program.overview ??
      licenceOverview(
        program.title,
        school?.shortName ?? school?.name ?? { vi: "Việt Đức Group" },
        program.level,
        program.officialCode,
        program.intakeQuota,
        licence ? { number: licence.number, date: licence.date } : undefined,
      );

    const values = {
      slug: program.slug,
      title: program.title,
      schoolId: schoolIdBySlug.get(program.school) ?? null,
      categoryId: categoryIdBySlug.get(program.category) ?? null,
      officialCode: program.officialCode ?? null,
      level: program.level,
      intakeQuota: program.intakeQuota ?? null,
      overview,
      audience: program.audience ?? null,
      objectives: program.objectives ?? null,
      outcomes: program.outcomes ?? null,
      modules: program.modules ?? null,
      roadmap: program.roadmap ?? null,
      careers: program.careers ?? null,
      admissionFile: program.admissionFile ?? null,
      durationMonths: program.durationMonths ?? null,
      durationLabel: program.durationLabel ?? null,
      mode: program.mode ?? null,
      languages: program.languages ?? ["vi"],
      locationCity: program.locationCity ?? null,
      intakeSchedule: program.intakeSchedule ?? null,
      tuition: program.tuition ?? null,
      certificate: program.certificate ?? null,
      coverPath: program.coverPath ?? school?.coverPath ?? null,
      featured: program.featured ?? false,
      status: "approved" as Status,
      provenance: program.provenance,
      editorNote:
        program.editorNote ??
        "Tổng quan được sinh tự động từ dòng tương ứng trong giấy chứng nhận. Biên tập viên nên bổ sung mục tiêu, chuẩn đầu ra, module và cơ hội việc làm theo chương trình đào tạo thực tế của trường.",
      updatedAt: now,
    };

    const existing = await db.select().from(programs).where(eq(programs.slug, program.slug));
    if (existing[0]) {
      await db.update(programs).set(values).where(eq(programs.id, existing[0].id));
    } else {
      await db.insert(programs).values(values);
    }
    approvedPrograms += 1;
  }

  for (const intent of TRAINING_INTENTS) {
    const school = schoolBySlug.get(intent.school);
    for (const field of intent.fields) {
      const values = {
        slug: field.slug,
        title: field.title,
        schoolId: schoolIdBySlug.get(intent.school) ?? null,
        categoryId: categoryIdBySlug.get(field.category) ?? null,
        officialCode: null,
        level: intent.school === "itw-berlin" ? "lien_ket" : "trung_cap",
        intakeQuota: null,
        overview: null,
        locationCity: intent.city,
        languages: intent.school === "itw-berlin" ? ["vi", "de"] : ["vi"],
        mode: intent.school === "itw-berlin" ? ("abroad" as const) : ("offline" as const),
        coverPath: school?.coverPath ?? null,
        featured: false,
        // Not licence-backed: stays out of the public site and the advisor
        // until the organisation supplies the registration certificate.
        status: "draft" as Status,
        provenance: {
          source: "profile-viet-duc-vi",
          sourceTitle: "PROFILE VIỆT ĐỨC GROUP (bản tiếng Việt)",
          page: intent.page,
          importedAt: "2026-09-01",
          method: "pdf-ocr" as const,
        },
        editorNote: intent.note,
        updatedAt: now,
      };
      const existing = await db.select().from(programs).where(eq(programs.slug, field.slug));
      if (existing[0]) {
        await db.update(programs).set(values).where(eq(programs.id, existing[0].id));
      } else {
        await db.insert(programs).values(values);
      }
      draftPrograms += 1;
    }
  }
  console.log(`programs       ${approvedPrograms} approved, ${draftPrograms} draft`);

  /* ------------------------------------------------------------ partners */
  for (const partner of PARTNERS) {
    const values = {
      slug: partner.slug,
      name: partner.name,
      kind: partner.kind,
      country: partner.country ?? null,
      region: partner.region ?? null,
      note: partner.note ?? null,
      order: partner.order,
      // Names read off a logo strip are uncertain; they wait for confirmation.
      status: (partner.needsVerification ? "draft" : "approved") as Status,
      provenance: partner.provenance,
    };
    const existing = await db.select().from(partners).where(eq(partners.slug, partner.slug));
    if (existing[0]) {
      await db.update(partners).set(values).where(eq(partners.id, existing[0].id));
    } else {
      await db.insert(partners).values(values);
    }
  }
  const needsCheck = PARTNERS.filter((p) => p.needsVerification).length;
  console.log(`partners       ${PARTNERS.length - needsCheck} approved, ${needsCheck} draft`);

  /* ---------------------------------------------------------- activities */
  const ACTIVITY_COVER: Record<string, string> = {
    "chao-tan-sinh-vien": "/media/activities/le-khai-giang.webp",
    "hoi-thao-sinh-vien": "/media/activities/hoi-thao-sinh-vien.webp",
    "cuoc-thi-tay-nghe": "/media/activities/tu-van-tuyen-sinh.webp",
    "cuoc-thi-van-nghe": "/media/activities/tai-nang-thanh-lich.webp",
    "ngay-hoi-viec-lam": "/media/activities/le-ky-ket-sungwoo.webp",
    "hoat-dong-thien-nguyen": "/media/activities/hien-mau-tinh-nguyen.webp",
    "team-building": "/media/activities/chap-canh-uoc-mo-xanh.webp",
    "tham-quan-doanh-nghiep": "/media/activities/tham-quan-bao-tang.webp",
    "giao-luu-quoc-te": "/media/activities/le-ky-ket-mou-acts.webp",
  };

  for (const activity of ACTIVITIES) {
    const values = {
      slug: activity.slug,
      title: activity.title,
      description: activity.description ?? null,
      kind: activity.kind,
      coverPath: ACTIVITY_COVER[activity.slug] ?? null,
      order: activity.order,
      status: "approved" as Status,
      provenance: activity.provenance,
    };
    const existing = await db.select().from(activities).where(eq(activities.slug, activity.slug));
    if (existing[0]) {
      await db.update(activities).set(values).where(eq(activities.id, existing[0].id));
    } else {
      await db.insert(activities).values(values);
    }
  }
  console.log(`activities     ${ACTIVITIES.length}`);

  /* ---------------------------------------------------------------- FAQs */
  await db.delete(faqs);
  await db.insert(faqs).values(
    FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      topic: faq.topic,
      order: faq.order,
      status: "approved" as Status,
      provenance: faq.provenance,
    })),
  );
  console.log(`faqs           ${FAQS.length}`);

  /* --------------------------------------------------------------- pages */
  for (const page of PAGES) {
    const values = {
      slug: page.slug,
      title: page.title,
      body: page.body,
      seoDescription: page.seoDescription ?? null,
      status: "approved" as Status,
      updatedAt: now,
    };
    const existing = await db.select().from(pages).where(eq(pages.slug, page.slug));
    if (existing[0]) {
      await db.update(pages).set(values).where(eq(pages.id, existing[0].id));
    } else {
      await db.insert(pages).values(values);
    }
  }
  console.log(`pages          ${PAGES.length}`);

  /* --------------------------------------------------------------- media */
  const manifestPath = path.join(ROOT, "src", "content", "media-manifest.json");
  if (fs.existsSync(manifestPath)) {
    const entries: MediaManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    for (const entry of entries) {
      const values = {
        path: entry.path,
        width: entry.width,
        height: entry.height,
        bytes: entry.bytes,
        alt: entry.alt,
        tags: entry.tags,
        provenance: entry.provenance,
      };
      const existing = await db.select().from(media).where(eq(media.path, entry.path));
      if (existing[0]) {
        await db.update(media).set(values).where(eq(media.id, existing[0].id));
      } else {
        await db.insert(media).values(values);
      }
    }
    console.log(`media          ${entries.length}`);
  } else {
    console.log("media          none (run `npm run media` first)");
  }

  /* ------------------------------------------------------------ settings */
  for (const [key, value] of [
    [SETTINGS_KEYS.contact, DEFAULT_SETTINGS.contact],
    [SETTINGS_KEYS.social, DEFAULT_SETTINGS.social],
    [SETTINGS_KEYS.seo, DEFAULT_SETTINGS.seo],
  ] as const) {
    const existing = await db.select().from(settings).where(eq(settings.key, key));
    if (!existing[0]) await db.insert(settings).values({ key, value });
  }
  console.log("settings       seeded (existing values left untouched)");

  /* ---------------------------------------------------------------- user */
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (email && password) {
    const existing = await db.select().from(users).where(eq(users.email, email));
    const passwordHash = await hashPassword(password);
    if (existing[0]) {
      await db.update(users).set({ passwordHash, role: "administrator", active: true }).where(eq(users.id, existing[0].id));
      console.log(`admin user     updated ${email}`);
    } else {
      await db.insert(users).values({
        email,
        name: process.env.ADMIN_NAME?.trim() || "Administrator",
        passwordHash,
        role: "administrator",
      });
      console.log(`admin user     created ${email}`);
    }
  } else {
    const count = await db.select({ id: users.id }).from(users);
    if (!count.length) {
      console.log(
        "admin user     none. Set ADMIN_EMAIL and ADMIN_PASSWORD and re-run `npm run seed` to create one.",
      );
    }
  }

  console.log("\nSeed complete. Next: npm run kb:build");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
