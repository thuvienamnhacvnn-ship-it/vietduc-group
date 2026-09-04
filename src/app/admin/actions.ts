"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import {
  activities,
  contentBlocks,
  documents,
  faqs,
  leads,
  pages,
  partners,
  posts,
  programs,
  schools,
  settings as settingsTable,
  unanswered,
  users,
  STATUSES,
  LEAD_STATES,
  type Status,
} from "@/lib/db/schema";
import {
  createSession,
  destroySession,
  recordAudit,
  requireCapability,
  verifyPassword,
} from "@/lib/auth";
import { rebuildKnowledgeBase } from "@/lib/rag/build";
import { writeSetting } from "@/lib/settings";
import { SETTINGS_KEYS, SOCIAL_KEYS } from "@/lib/site-config";
import { check, RULES } from "@/lib/rate-limit";

/**
 * Server actions for the editor area.
 *
 * Every action starts with `requireCapability`. The check lives inside the
 * action, not in a layout or middleware, so an action cannot be reached without
 * it - a hidden button is not access control.
 */

/* ----------------------------------------------------------------- auth */

export async function signIn(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Rate limit by address as well as by client, so a single account cannot be
  // ground down from many IPs.
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = check(`login:${ip}:${email}`, RULES.login);
  if (!limit.ok) {
    return { error: "Bạn đã thử quá nhiều lần. Vui lòng đợi vài phút." };
  }

  if (!email || !password) return { error: "Vui lòng nhập email và mật khẩu." };

  const db = await getDb();
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  // One message for every failure mode: a different message for "no such user"
  // would turn this form into an account enumerator.
  const invalid = { error: "Email hoặc mật khẩu không đúng." };
  if (!user || !user.active) return invalid;
  if (!(await verifyPassword(password, user.passwordHash))) return invalid;

  await createSession(user.id);
  await recordAudit(user.id, "sign_in", "user", String(user.id));
  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/dang-nhap");
}

/* -------------------------------------------------------------- content */

const ENTITIES = {
  program: programs,
  school: schools,
  page: pages,
  faq: faqs,
  partner: partners,
  activity: activities,
  post: posts,
  document: documents,
} as const;

type EntityKey = keyof typeof ENTITIES;

const StatusInput = z.object({
  entity: z.enum(Object.keys(ENTITIES) as [EntityKey, ...EntityKey[]]),
  id: z.coerce.number().int().positive(),
  status: z.enum(STATUSES),
});

export async function setStatus(formData: FormData) {
  const user = await requireCapability("content.publish");
  const input = StatusInput.parse({
    entity: formData.get("entity"),
    id: formData.get("id"),
    status: formData.get("status"),
  });

  const db = await getDb();
  const table = ENTITIES[input.entity];
  await db
    .update(table)
    .set({ status: input.status as Status })
    .where(eq(table.id, input.id));

  await recordAudit(user.id, "set_status", input.entity, String(input.id), {
    status: input.status,
  });
  revalidatePath("/admin/noi-dung");
  revalidatePath("/", "layout");
}

const TextInput = z.object({
  entity: z.enum(Object.keys(ENTITIES) as [EntityKey, ...EntityKey[]]),
  id: z.coerce.number().int().positive(),
  field: z.string().min(1).max(40),
  vi: z.string().max(20000).optional().default(""),
  en: z.string().max(20000).optional().default(""),
  de: z.string().max(20000).optional().default(""),
});

/** Fields an editor may change through the generic editor, per entity. */
const EDITABLE: Record<EntityKey, string[]> = {
  program: ["title", "overview", "tuition", "intakeSchedule", "certificate", "durationLabel"],
  school: ["name", "shortName", "tagline", "summary"],
  page: ["title", "body", "seoTitle", "seoDescription"],
  faq: ["question", "answer"],
  partner: ["note"],
  activity: ["title", "description"],
  post: ["title", "excerpt", "body"],
  document: ["title"],
};

export async function setLocalisedField(formData: FormData) {
  const user = await requireCapability("content.write");
  const input = TextInput.parse({
    entity: formData.get("entity"),
    id: formData.get("id"),
    field: formData.get("field"),
    vi: formData.get("vi"),
    en: formData.get("en"),
    de: formData.get("de"),
  });

  // Whitelist, not blacklist: an unexpected field name is rejected rather than
  // written into an arbitrary column.
  if (!EDITABLE[input.entity].includes(input.field)) {
    throw new Error(`Field "${input.field}" is not editable on ${input.entity}`);
  }

  const value: Record<string, string> = { vi: input.vi };
  if (input.en.trim()) value.en = input.en;
  if (input.de.trim()) value.de = input.de;

  const db = await getDb();
  const table = ENTITIES[input.entity];
  await db
    .update(table)
    .set({ [input.field]: value })
    .where(eq(table.id, input.id));

  await recordAudit(user.id, "edit_field", input.entity, String(input.id), { field: input.field });
  revalidatePath("/admin/noi-dung");
  revalidatePath("/", "layout");
}

export async function setEditorNote(formData: FormData) {
  const user = await requireCapability("content.write");
  const entity = String(formData.get("entity"));
  const id = Number(formData.get("id"));
  const note = String(formData.get("note") ?? "").slice(0, 2000);
  if (entity !== "program" && entity !== "school") throw new Error("Unsupported entity");
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid id");

  const db = await getDb();
  const table = entity === "program" ? programs : schools;
  await db.update(table).set({ editorNote: note || null }).where(eq(table.id, id));
  await recordAudit(user.id, "edit_note", entity, String(id));
  revalidatePath("/admin/noi-dung");
}

/* ------------------------------------------------------------- documents */

const BlockReview = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(["approved", "rejected", "draft", "pending"]),
  note: z.string().max(600).optional().default(""),
  assignedTo: z.string().max(80).optional().default(""),
});

export async function reviewBlock(formData: FormData) {
  const user = await requireCapability("content.publish");
  const input = BlockReview.parse({
    id: formData.get("id"),
    status: formData.get("status"),
    note: formData.get("note"),
    assignedTo: formData.get("assignedTo"),
  });

  const db = await getDb();
  await db
    .update(contentBlocks)
    .set({
      status: input.status as Status,
      reviewedBy: user.id,
      reviewedAt: new Date(),
      reviewNote: input.note || null,
      assignedTo: input.assignedTo || null,
    })
    .where(eq(contentBlocks.id, input.id));

  await recordAudit(user.id, "review_block", "content_block", String(input.id), {
    status: input.status,
  });
  revalidatePath("/admin/tai-lieu");
}

export async function reviewAllBlocks(formData: FormData) {
  const user = await requireCapability("content.publish");
  const documentId = Number(formData.get("documentId"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(documentId) || !STATUSES.includes(status as Status)) {
    throw new Error("Invalid request");
  }

  const db = await getDb();
  await db
    .update(contentBlocks)
    .set({ status: status as Status, reviewedBy: user.id, reviewedAt: new Date() })
    .where(and(eq(contentBlocks.documentId, documentId), eq(contentBlocks.status, "draft")));

  await recordAudit(user.id, "review_blocks_bulk", "document", String(documentId), { status });
  revalidatePath("/admin/tai-lieu");
}

export async function setDocumentFlags(formData: FormData) {
  const user = await requireCapability("content.publish");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "draft");
  const downloadable = formData.get("downloadable") === "on";
  if (!Number.isInteger(id) || !STATUSES.includes(status as Status)) {
    throw new Error("Invalid request");
  }

  const db = await getDb();
  await db
    .update(documents)
    .set({ status: status as Status, downloadable })
    .where(eq(documents.id, id));

  await recordAudit(user.id, "update_document", "document", String(id), { status, downloadable });
  revalidatePath("/admin/tai-lieu");
  revalidatePath("/", "layout");
}

export async function deleteDocument(formData: FormData) {
  const user = await requireCapability("documents.delete");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid id");

  const db = await getDb();
  // Pages and blocks cascade; the knowledge base is rebuilt below so nothing
  // from this document can survive in the advisor's index.
  await db.delete(documents).where(eq(documents.id, id));
  await rebuildKnowledgeBase();

  await recordAudit(user.id, "delete_document", "document", String(id));
  revalidatePath("/admin/tai-lieu");
}

export async function rebuildKb() {
  const user = await requireCapability("kb.rebuild");
  const report = await rebuildKnowledgeBase();
  await recordAudit(user.id, "rebuild_kb", "knowledge_base", null, {
    chunks: report.chunks,
    embedded: report.embedded,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/tai-lieu");
}

/* ----------------------------------------------------------------- leads */

export async function updateLead(formData: FormData) {
  const user = await requireCapability("leads.write");
  const id = Number(formData.get("id"));
  const state = String(formData.get("state"));
  const note = String(formData.get("note") ?? "").slice(0, 2000);
  if (!Number.isInteger(id) || !LEAD_STATES.includes(state as (typeof LEAD_STATES)[number])) {
    throw new Error("Invalid request");
  }

  const db = await getDb();
  await db
    .update(leads)
    .set({
      state: state as (typeof LEAD_STATES)[number],
      note: note || null,
      assignedTo: user.id,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id));

  // The audit trail records that the lead changed, never what it contains.
  await recordAudit(user.id, "update_lead", "lead", String(id), { state });
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  const user = await requireCapability("leads.write");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid id");

  const db = await getDb();
  await db.delete(leads).where(eq(leads.id, id));
  await recordAudit(user.id, "delete_lead", "lead", String(id));
  revalidatePath("/admin/leads");
}

export async function resolveQuestion(formData: FormData) {
  const user = await requireCapability("content.write");
  const ids = String(formData.get("ids") ?? "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
  if (!ids.length) return;

  const db = await getDb();
  await db.update(unanswered).set({ resolved: true }).where(inArray(unanswered.id, ids));
  await recordAudit(user.id, "resolve_questions", "unanswered", ids.join(","));
  revalidatePath("/admin/tro-ly");
}

/* -------------------------------------------------------------- settings */

export async function saveSocial(formData: FormData) {
  const user = await requireCapability("settings.write");
  const value: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    value[key] = String(formData.get(key) ?? "").trim().slice(0, 300);
  }
  await writeSetting(SETTINGS_KEYS.social, value, user.id);
  await recordAudit(user.id, "save_settings", "settings", SETTINGS_KEYS.social);
  revalidatePath("/", "layout");
  revalidatePath("/admin/cai-dat");
}

export async function saveContact(formData: FormData) {
  const user = await requireCapability("settings.write");
  const read = (key: string, max = 300) => String(formData.get(key) ?? "").trim().slice(0, max);
  const officeHoursVi = read("officeHoursVi");

  await writeSetting(
    SETTINGS_KEYS.contact,
    {
      organisationLegalName: read("organisationLegalName"),
      headquarters: read("headquarters", 400),
      phone: read("phone", 60),
      phoneE164: read("phoneE164", 30),
      email: read("email", 160),
      website: read("website"),
      admissionsPhone: read("admissionsPhone", 60),
      officeHours: officeHoursVi ? { vi: officeHoursVi } : null,
      mapEmbedUrl: read("mapEmbedUrl", 600),
    },
    user.id,
  );
  await recordAudit(user.id, "save_settings", "settings", SETTINGS_KEYS.contact);
  revalidatePath("/", "layout");
  revalidatePath("/admin/cai-dat");
}

export async function saveSeo(formData: FormData) {
  const user = await requireCapability("settings.write");
  const read = (key: string, max = 300) => String(formData.get(key) ?? "").trim().slice(0, max);

  await writeSetting(
    SETTINGS_KEYS.seo,
    {
      siteName: read("siteName", 120),
      siteUrl: read("siteUrl"),
      ogImage: read("ogImage"),
      defaultTitle: {
        vi: read("titleVi"),
        en: read("titleEn"),
        de: read("titleDe"),
      },
      defaultDescription: {
        vi: read("descVi", 400),
        en: read("descEn", 400),
        de: read("descDe", 400),
      },
    },
    user.id,
  );
  await recordAudit(user.id, "save_settings", "settings", SETTINGS_KEYS.seo);
  revalidatePath("/", "layout");
  revalidatePath("/admin/cai-dat");
}

export async function readSettingsRow(key: string) {
  await requireCapability("settings.write");
  const db = await getDb();
  const rows = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
  return rows[0]?.value ?? null;
}
