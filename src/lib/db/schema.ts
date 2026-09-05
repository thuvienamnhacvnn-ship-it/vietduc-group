import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Localised string. `vi` is authoritative - it is the language the source
 * documents were written in. `en`/`de` are optional and fall back to `vi`.
 */
/*
 * Trường đa ngôn ngữ. Tiếng Việt bắt buộc vì mọi tài liệu gốc viết bằng tiếng
 * Việt; năm thứ tiếng còn lại tuỳ chọn và khi thiếu thì t() lùi về tiếng Việt —
 * một câu đúng nhưng chưa dịch vẫn hơn một ô trống.
 */
export type L10n = {
  vi: string;
  en?: string;
  de?: string;
  ja?: string;
  ko?: string;
  "zh-TW"?: string;
};
export type L10nList = {
  vi: string[];
  en?: string[];
  de?: string[];
  ja?: string[];
  ko?: string[];
  "zh-TW"?: string[];
};

/** Where a piece of content came from. Never lost, never guessed. */
export type Provenance = {
  /** Document slug in `documents`, or a well-known source id. */
  source: string;
  /** Human readable document title at the time of import. */
  sourceTitle?: string;
  /** 1-based page number in the source PDF. */
  page?: number;
  /** Date printed on the document, if any (ISO or free text as printed). */
  documentDate?: string;
  /** When this content entered the system (ISO). */
  importedAt: string;
  /** How it was obtained. */
  method: "pdf-text" | "pdf-ocr" | "manual" | "legacy-website";
};

export const ROLES = ["administrator", "content_editor", "admissions_staff"] as const;
export type Role = (typeof ROLES)[number];

export const STATUSES = ["draft", "pending", "approved", "rejected", "archived"] as const;
export type Status = (typeof STATUSES)[number];

/* ------------------------------------------------------------------ auth */

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").$type<Role>().notNull().default("content_editor"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    token: text("token").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  detail: jsonb("detail").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* --------------------------------------------------------------- content */

export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    /** Public path under /media, e.g. "/media/schools/ivs-campus.webp" */
    path: text("path").notNull(),
    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes"),
    alt: jsonb("alt").$type<L10n>(),
    caption: jsonb("caption").$type<L10n>(),
    provenance: jsonb("provenance").$type<Provenance>(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("media_path_idx").on(t.path)],
);

export const schools = pgTable(
  "schools",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    order: integer("sort_order").notNull().default(0),
    name: jsonb("name").$type<L10n>().notNull(),
    shortName: jsonb("short_name").$type<L10n>(),
    tagline: jsonb("tagline").$type<L10n>(),
    summary: jsonb("summary").$type<L10n>(),
    /** Official English trading name as printed on the licence, if stated. */
    legalNameEn: text("legal_name_en"),
    city: jsonb("city").$type<L10n>(),
    country: text("country").notNull().default("VN"),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    website: text("website"),
    logoPath: text("logo_path"),
    coverPath: text("cover_path"),
    highlights: jsonb("highlights").$type<L10nList>(),
    /** Establishment / renaming decisions, quoted verbatim from the licence. */
    legalRefs: jsonb("legal_refs").$type<{ label: L10n; number: string; date: string; issuer: L10n }[]>(),
    stats: jsonb("stats").$type<{ value: string; label: L10n }[]>(),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
    editorNote: text("editor_note"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("schools_slug_idx").on(t.slug)],
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: jsonb("name").$type<L10n>().notNull(),
    description: jsonb("description").$type<L10n>(),
    order: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

/**
 * A training programme. Fields the source documents do not state are left NULL
 * on purpose - the UI renders "chưa công bố" rather than inventing a value.
 */
export const programs = pgTable(
  "programs",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: jsonb("title").$type<L10n>().notNull(),
    schoolId: integer("school_id").references(() => schools.id, { onDelete: "set null" }),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),

    /** Official occupation code from the licence (mã ngành/nghề). */
    officialCode: text("official_code"),
    /** cao_dang | trung_cap | so_cap | lien_ket - mirrors "trình độ đào tạo". */
    level: text("level").notNull(),
    /** Annual intake quota stated on the licence (quy mô tuyển sinh/năm). */
    intakeQuota: integer("intake_quota"),

    overview: jsonb("overview").$type<L10n>(),
    audience: jsonb("audience").$type<L10nList>(),
    objectives: jsonb("objectives").$type<L10nList>(),
    outcomes: jsonb("outcomes").$type<L10nList>(),
    modules: jsonb("modules").$type<{ title: L10n; detail?: L10n }[]>(),
    roadmap: jsonb("roadmap").$type<{ title: L10n; detail?: L10n }[]>(),
    careers: jsonb("careers").$type<L10nList>(),
    admissionFile: jsonb("admission_file").$type<L10nList>(),

    durationMonths: integer("duration_months"),
    durationLabel: jsonb("duration_label").$type<L10n>(),
    /** offline | online | blended | abroad */
    mode: text("mode"),
    languages: jsonb("languages").$type<string[]>().notNull().default([]),
    locationCity: jsonb("location_city").$type<L10n>(),
    /** Only filled when a document states it. */
    intakeSchedule: jsonb("intake_schedule").$type<L10n>(),
    tuition: jsonb("tuition").$type<L10n>(),
    certificate: jsonb("certificate").$type<L10n>(),

    coverPath: text("cover_path"),
    brochureDocumentId: integer("brochure_document_id"),
    featured: boolean("featured").notNull().default(false),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
    /** Note for editors about what still needs verifying. */
    editorNote: text("editor_note"),
    views: integer("views").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("programs_slug_idx").on(t.slug),
    index("programs_school_idx").on(t.schoolId),
    index("programs_level_idx").on(t.level),
    index("programs_status_idx").on(t.status),
  ],
);

export const people = pgTable(
  "people",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    role: jsonb("role").$type<L10n>(),
    /** leadership | lecturer | admissions */
    kind: text("kind").notNull().default("leadership"),
    bio: jsonb("bio").$type<L10n>(),
    photoPath: text("photo_path"),
    schoolId: integer("school_id").references(() => schools.id, { onDelete: "set null" }),
    order: integer("sort_order").notNull().default(0),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
  },
  (t) => [uniqueIndex("people_slug_idx").on(t.slug)],
);

export const partners = pgTable(
  "partners",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    /** enterprise | institution | association | group */
    kind: text("kind").notNull().default("enterprise"),
    country: text("country"),
    region: text("region"),
    note: jsonb("note").$type<L10n>(),
    logoPath: text("logo_path"),
    website: text("website"),
    order: integer("sort_order").notNull().default(0),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
  },
  (t) => [uniqueIndex("partners_slug_idx").on(t.slug)],
);

export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: jsonb("title").$type<L10n>().notNull(),
    description: jsonb("description").$type<L10n>(),
    /** culture | sports | volunteer | soft_skills | career | international */
    kind: text("kind").notNull().default("culture"),
    coverPath: text("cover_path"),
    happenedOn: text("happened_on"),
    order: integer("sort_order").notNull().default(0),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
  },
  (t) => [uniqueIndex("activities_slug_idx").on(t.slug)],
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: jsonb("title").$type<L10n>().notNull(),
    excerpt: jsonb("excerpt").$type<L10n>(),
    body: jsonb("body").$type<L10n>(),
    coverPath: text("cover_path"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug)],
);

export const faqs = pgTable(
  "faqs",
  {
    id: serial("id").primaryKey(),
    question: jsonb("question").$type<L10n>().notNull(),
    answer: jsonb("answer").$type<L10n>().notNull(),
    topic: text("topic").notNull().default("general"),
    programId: integer("program_id").references(() => programs.id, { onDelete: "set null" }),
    order: integer("sort_order").notNull().default(0),
    status: text("status").$type<Status>().notNull().default("draft"),
    provenance: jsonb("provenance").$type<Provenance>(),
  },
  (t) => [index("faqs_topic_idx").on(t.topic)],
);

export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: jsonb("title").$type<L10n>().notNull(),
    body: jsonb("body").$type<L10n>(),
    seoTitle: jsonb("seo_title").$type<L10n>(),
    seoDescription: jsonb("seo_description").$type<L10n>(),
    status: text("status").$type<Status>().notNull().default("draft"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("pages_slug_idx").on(t.slug)],
);

/* ------------------------------------------------------------- documents */

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: jsonb("title").$type<L10n>().notNull(),
    /** Original filename as uploaded. */
    originalName: text("original_name").notNull(),
    /** Path relative to the private documents dir - never served directly. */
    storagePath: text("storage_path").notNull(),
    /** Public download path, only set once an editor publishes it. */
    publicPath: text("public_path"),
    bytes: integer("bytes").notNull().default(0),
    pageCount: integer("page_count").notNull().default(0),
    language: text("language").notNull().default("vi"),
    documentDate: text("document_date"),
    /** queued | extracting | ocr | ready | failed */
    processingState: text("processing_state").notNull().default("queued"),
    processingError: text("processing_error"),
    /** true when the PDF had no text layer and OCR was required. */
    ocrUsed: boolean("ocr_used").notNull().default(false),
    downloadable: boolean("downloadable").notNull().default(false),
    status: text("status").$type<Status>().notNull().default("draft"),
    sha256: text("sha256"),
    uploadedBy: integer("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("documents_slug_idx").on(t.slug), index("documents_state_idx").on(t.processingState)],
);

export const documentPages = pgTable(
  "document_pages",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    pageNumber: integer("page_number").notNull(),
    text: text("text").notNull().default(""),
    /** text-layer | ocr | empty */
    textSource: text("text_source").notNull().default("empty"),
    ocrConfidence: real("ocr_confidence"),
    previewPath: text("preview_path"),
  },
  (t) => [uniqueIndex("document_pages_idx").on(t.documentId, t.pageNumber)],
);

/**
 * A candidate block of content extracted from a document. Always lands as
 * `draft`; nothing reaches the public site or the AI until an editor approves.
 */
export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id").references(() => documents.id, { onDelete: "cascade" }),
    pageNumber: integer("page_number"),
    heading: text("heading"),
    body: text("body").notNull(),
    /** organisation | program | course | people | partner | certificate | news | activity | faq | policy | download | other */
    category: text("category").notNull().default("other"),
    language: text("language").notNull().default("vi"),
    /** Entity this block was assigned to, e.g. "program:12". */
    assignedTo: text("assigned_to"),
    status: text("status").$type<Status>().notNull().default("draft"),
    reviewedBy: integer("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),
    /** Set when the ingest pipeline saw instruction-like text in the source. */
    injectionFlag: boolean("injection_flag").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("content_blocks_doc_idx").on(t.documentId),
    index("content_blocks_status_idx").on(t.status),
    index("content_blocks_category_idx").on(t.category),
  ],
);

/* -------------------------------------------------------------------- RAG */

/**
 * One retrievable passage. Only rows whose `status` is `approved` are ever
 * given to the model - enforced in `lib/rag/retrieve.ts`, not by convention.
 */
export const kbChunks = pgTable(
  "kb_chunks",
  {
    id: serial("id").primaryKey(),
    /** Stable id of the thing this came from, e.g. "program:12" | "block:88". */
    sourceRef: text("source_ref").notNull(),
    sourceKind: text("source_kind").notNull(),
    documentId: integer("document_id").references(() => documents.id, { onDelete: "cascade" }),
    pageNumber: integer("page_number"),
    /** Reader-facing citation, e.g. "Hồ sơ năng lực Việt Đức Group, trang 3". */
    citation: jsonb("citation").$type<L10n>().notNull(),
    /** Where a reader can verify it on this site. */
    href: text("href"),
    language: text("language").notNull().default("vi"),
    title: text("title"),
    body: text("body").notNull(),
    /** Lowercased, diacritic-folded body used by the lexical retriever. */
    normalized: text("normalized").notNull().default(""),
    tokenCount: integer("token_count").notNull().default(0),
    embedding: jsonb("embedding").$type<number[]>(),
    embeddingModel: text("embedding_model"),
    status: text("status").$type<Status>().notNull().default("draft"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("kb_source_idx").on(t.sourceRef),
    index("kb_status_idx").on(t.status),
    index("kb_lang_idx").on(t.language),
  ],
);

/* ------------------------------------------------------------------ leads */

export const LEAD_STATES = ["new", "contacting", "qualified", "enrolled", "closed"] as const;
export type LeadState = (typeof LEAD_STATES)[number];

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    email: text("email"),
    whatsapp: text("whatsapp"),
    zalo: text("zalo"),
    /** Slug of the field of study the person asked about. */
    interestCategory: text("interest_category"),
    programId: integer("program_id").references(() => programs.id, { onDelete: "set null" }),
    currentLevel: text("current_level"),
    goal: text("goal"),
    preferredMode: text("preferred_mode"),
    startWindow: text("start_window"),
    question: text("question"),
    /** website_form | ai_advisor | newsletter | contact_page */
    source: text("source").notNull().default("website_form"),
    locale: text("locale").notNull().default("vi"),
    state: text("state").$type<LeadState>().notNull().default("new"),
    assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }),
    note: text("note"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    consentText: text("consent_text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_state_idx").on(t.state), index("leads_created_idx").on(t.createdAt)],
);

export const newsletter = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    locale: text("locale").notNull().default("vi"),
    confirmToken: text("confirm_token"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    consentText: text("consent_text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("newsletter_email_idx").on(t.email)],
);

/* --------------------------------------------------------------- advisor */

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  locale: text("locale").notNull().default("vi"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  lastAt: timestamp("last_at", { withTimezone: true }).notNull().defaultNow(),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
  handoffRequested: boolean("handoff_requested").notNull().default(false),
});

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    citations: jsonb("citations").$type<{ label: string; href?: string }[]>(),
    /** answered | no_data | refused | error */
    outcome: text("outcome"),
    confidence: real("confidence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_conv_idx").on(t.conversationId)],
);

/** Questions the retriever could not support. Drives the admin gap report. */
export const unanswered = pgTable("unanswered_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  locale: text("locale").notNull().default("vi"),
  conversationId: text("conversation_id"),
  topScore: real("top_score"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const searchLog = pgTable("search_log", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  locale: text("locale").notNull().default("vi"),
  results: integer("results").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------- settings */

/** Site-wide editable configuration: contact block, social links, menus, SEO. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" }),
});

export const programMedia = pgTable(
  "program_media",
  {
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    mediaId: integer("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    order: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.programId, t.mediaId] })],
);
