/**
 * Shapes for the hospitality arm's content.
 *
 * Kept apart from the data itself so the project file stays readable: it is
 * long because the source documents are long, and every figure in it is quoted
 * rather than summarised.
 */

import type { L10nMap } from "@/lib/i18n/config";

export type Localised = L10nMap;
export type LocalisedList = L10nMap<string[]>;

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
  /**
   * Phần trưng bày của cơ sở ĐANG VẬN HÀNH: video, bảng hạng phòng, các khu ảnh.
   *
   * Dự án trên giấy chỉ có bản vẽ và số liệu; cơ sở đã chạy thì thứ khách cần xem
   * là phòng thật, nhà hàng thật, đoàn khách thật. Không có trường này thì trang
   * dự án dựng như cũ.
   */
  showcase?: VentureShowcase;
  /**
   * Hồ sơ của cơ sở đang vận hành, dựng thành các ô số, thẻ pháp nhân và bảng
   * (dịch vụ, hạng phòng, dòng thời gian, đào tạo) thay cho cột chữ + danh sách
   * gạch đầu dòng. Có trường này thì trang không dựng `blocks` và cột `facts`
   * nữa — `facts` vẫn giữ cho thẻ dự án ở trang tổng.
   */
  dossier?: VentureDossier;
};

export type DossierIcon = "bed" | "dining" | "bar" | "mic" | "breakfast" | "party";

export type VentureDossier = {
  /** Các ô số lớn đầu trang: "85" + "phòng nghỉ". */
  kpis: { value: string; label: Localised }[];
  /**
   * Tiêu đề cho các đoạn `body` từ đoạn thứ hai trở đi; đoạn đầu là lời dẫn.
   * `badge` là nhãn nổi bật gắn vào thẻ (ví dụ "Học phí 0 đồng").
   */
  bodyCards: { title: Localised; badge?: Localised }[];
  /** Thẻ pháp nhân vận hành. */
  company: { name: string; nameEn: string; rows: VentureFact[] };
  services: { icon: DossierIcon; text: Localised }[];
  roomZones: { zone: Localised; rooms: string[] }[];
  roomsNote?: Localised;
  timeline: { date?: string; text: Localised }[];
  timelineNote?: Localised;
  training: Localised[];
  trainingNote?: Localised;
};

export type VentureShowcase = {
  /** Video đầu tiên dựng khổ lớn, các video sau thành hàng thẻ. */
  videos?: { src: string; poster: string; title: Localised; note?: Localised }[];
  /** Mỗi hạng phòng một thẻ: ảnh bìa, tên, khu, và vài ảnh phụ. */
  rooms?: { name: string; zone: Localised; cover: string; more: string[] }[];
  /** Các khu ảnh có tiêu đề riêng, mỗi khu một bức tường ảnh. */
  sections?: { key: string; title: Localised; lead?: Localised; shots: VentureImage[] }[];
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
