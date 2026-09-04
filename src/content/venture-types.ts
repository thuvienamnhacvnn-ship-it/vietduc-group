/**
 * Shapes for the hospitality arm's content.
 *
 * Kept apart from the data itself so the project file stays readable: it is
 * long because the source documents are long, and every figure in it is quoted
 * rather than summarised.
 */

export type Localised = { vi: string; de?: string; en?: string };
export type LocalisedList = { vi: string[]; de?: string[]; en?: string[] };

export type VentureImage = {
  src: string;
  /** Caption describing what the picture actually shows. */
  caption: Localised;
};

export type VentureFact = { label: Localised; value: Localised };

/**
 * A section of a project page.
 *
 * One union rather than a fixed page layout, because the documents differ:
 * TOKI has an approved investment decision and a works programme, the resort
 * proposal has a land-use table and nothing else. A project renders exactly the
 * sections its paperwork supports.
 */
export type VentureBlock =
  | { kind: "prose"; title: Localised; paragraphs: LocalisedList }
  | { kind: "list"; title: Localised; items: LocalisedList; note?: Localised }
  | { kind: "table"; title: Localised; rows: VentureFact[]; note?: Localised }
  | {
      kind: "grid";
      title: Localised;
      columns: [Localised, Localised, Localised];
      rows: [Localised, Localised, Localised][];
      note?: Localised;
    }
  | { kind: "steps"; title: Localised; steps: { when: Localised; what: Localised }[] };

export type VentureProject = {
  slug: string;
  status: "published" | "draft";
  /** Sort order on the listing: lower first. */
  order: number;
  name: Localised;
  kind: Localised;
  location: Localised;
  /** Where the project stands, in the reader's language. */
  stage: Localised;
  lead: Localised;
  body: LocalisedList;
  facts: VentureFact[];
  blocks: VentureBlock[];
  hero: VentureImage;
  gallery: VentureImage[];
  /** Named organisations, with the role each document gives them. */
  parties: { name: string; role: Localised }[];
  sources: { document: Localised; date: string }[];
};

export type VentureService = {
  key: string;
  name: Localised;
  lead: Localised;
  points: LocalisedList;
  image: string;
  /** True when the documents do not yet describe this line in detail. */
  pending?: boolean;
};

export type VenturePartner = { name: string; role: Localised; note: Localised };
