import { fromProfileVi, type SeedProgram } from "./types";
import type { L10n } from "@/lib/db/schema";

/**
 * Programme records transcribed from the vocational-education licences
 * reproduced in the group profile (PROFILE VIỆT ĐỨC, pages 5-20).
 *
 * `officialCode` and `intakeQuota` are copied character for character from the
 * licence tables. Where a licence prints no code for a row (common for sơ cấp
 * entries) the field stays empty rather than being filled in from a guess.
 *
 * Nothing here states tuition, an intake calendar or a certificate type,
 * because none of the source documents state them.
 */

type Row = {
  /** Occupation name exactly as printed, plus translations. */
  title: L10n;
  code?: string;
  level: SeedProgram["level"];
  quota?: number;
  category: string;
  slug: string;
  featured?: boolean;
};

function build(
  school: string,
  page: number,
  city: L10n,
  rows: Row[],
  extra?: Partial<SeedProgram>,
): SeedProgram[] {
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    school,
    category: row.category,
    officialCode: row.code,
    level: row.level,
    intakeQuota: row.quota,
    locationCity: city,
    languages: ["vi"],
    mode: "offline",
    featured: row.featured ?? false,
    provenance: fromProfileVi(page),
    ...extra,
  }));
}

/* --------------------------- Trường Cao đẳng Công nghệ – Ngoại thương ----- */
/* Giấy chứng nhận số 69/2023/GCNĐKHĐ-TCGDNN ngày 14/9/2023 (hồ sơ tr. 5-7). */

const DA_NANG: L10n = { vi: "Đà Nẵng", en: "Da Nang", de: "Da Nang" };

const FTC: Row[] = [
  { slug: "ftc-tieng-anh-cao-dang", code: "6220206", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Anh", en: "English language", de: "Englisch" } },
  { slug: "ftc-tieng-trung-quoc-cao-dang", code: "6220209", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Trung Quốc", en: "Chinese language", de: "Chinesisch" } },
  { slug: "ftc-tieng-han-quoc-cao-dang", code: "6220211", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Hàn Quốc", en: "Korean language", de: "Koreanisch" } },
  { slug: "ftc-tieng-nhat-ban-cao-dang", code: "6220212", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Nhật Bản", en: "Japanese language", de: "Japanisch" } },
  { slug: "ftc-bao-chi-cao-dang", code: "6320103", level: "cao_dang", quota: 20, category: "truyen-thong",
    title: { vi: "Báo chí", en: "Journalism", de: "Journalismus" } },
  { slug: "ftc-he-thong-thong-tin-quan-ly-cao-dang", code: "6320202", level: "cao_dang", quota: 20, category: "cong-nghe-thong-tin",
    title: { vi: "Hệ thống thông tin quản lý", en: "Management information systems", de: "Managementinformationssysteme" } },
  { slug: "ftc-kinh-doanh-xuat-nhap-khau-cao-dang", code: "6340102", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri", featured: true,
    title: { vi: "Kinh doanh xuất nhập khẩu", en: "Import–export business", de: "Import- und Exporthandel" } },
  { slug: "ftc-logistics-cao-dang", code: "6340113", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri", featured: true,
    title: { vi: "Logistics", en: "Logistics", de: "Logistik" } },
  { slug: "ftc-marketing-cao-dang", code: "6340116", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Marketing", en: "Marketing", de: "Marketing" } },
  { slug: "ftc-thuong-mai-dien-tu-cao-dang", code: "6340122", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Thương mại điện tử", en: "E-commerce", de: "E-Commerce" } },
  { slug: "ftc-kinh-doanh-thuong-mai-va-dich-vu-trung-cap", code: "5340101", level: "trung_cap", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Kinh doanh thương mại và dịch vụ", en: "Trade and service business", de: "Handel und Dienstleistung" } },
  { slug: "ftc-tai-chinh-ngan-hang-cao-dang", code: "6340202", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Tài chính – Ngân hàng", en: "Finance and banking", de: "Finanzen und Bankwesen" } },
  { slug: "ftc-tai-chinh-ngan-hang-trung-cap", code: "5340202", level: "trung_cap", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Tài chính – Ngân hàng", en: "Finance and banking", de: "Finanzen und Bankwesen" } },
  { slug: "ftc-ke-toan-doanh-nghiep-cao-dang", code: "6340302", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen" } },
  { slug: "ftc-ke-toan-doanh-nghiep-trung-cap", code: "5340302", level: "trung_cap", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen" } },
  { slug: "ftc-quan-tri-kinh-doanh-cao-dang", code: "6340404", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Quản trị kinh doanh", en: "Business administration", de: "Betriebswirtschaft" } },
  { slug: "ftc-quan-ly-va-kinh-doanh-du-lich-trung-cap", code: "5340421", level: "trung_cap", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Quản lý và kinh doanh du lịch", en: "Tourism management and business", de: "Tourismusmanagement" } },
  { slug: "ftc-phap-luat-trung-cap", code: "5380101", level: "trung_cap", quota: 20, category: "luat-hanh-chinh",
    title: { vi: "Pháp luật", en: "Law", de: "Recht" } },
  { slug: "ftc-cong-nghe-thong-tin-cao-dang", code: "6480201", level: "cao_dang", quota: 20, category: "cong-nghe-thong-tin", featured: true,
    title: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik" } },
  { slug: "ftc-huong-dan-du-lich-cao-dang", code: "6810103", level: "cao_dang", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung" } },
  { slug: "ftc-du-lich-lu-hanh-trung-cap", code: "5810101", level: "trung_cap", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Du lịch lữ hành", en: "Travel and tour operations", de: "Reiseveranstaltung" } },
  { slug: "ftc-ky-thuat-che-bien-mon-an-cao-dang", code: "6810207", level: "cao_dang", quota: 20, category: "du-lich-dich-vu", featured: true,
    title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik" } },
  { slug: "ftc-nghiep-vu-le-tan-trung-cap", code: "5810203", level: "trung_cap", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ lễ tân", en: "Front office operations", de: "Rezeptionsdienst" } },
  { slug: "ftc-nghiep-vu-le-tan-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ lễ tân", en: "Front office operations", de: "Rezeptionsdienst" } },
  { slug: "ftc-nghiep-vu-nha-hang-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ nhà hàng", en: "Restaurant operations", de: "Restaurantservice" } },
  { slug: "ftc-quan-tri-khach-san-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Quản trị khách sạn", en: "Hotel management", de: "Hotelmanagement" } },
  { slug: "ftc-nghiep-vu-buong-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ buồng", en: "Housekeeping operations", de: "Housekeeping" } },
  { slug: "ftc-thiet-ke-dieu-hanh-tour-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Thiết kế – Điều hành tour du lịch", en: "Tour design and operations", de: "Tourgestaltung und -abwicklung" } },
];

/* ----------------------------- Trường Trung cấp nghề Quốc tế (IVS) -------- */
/* GCN 01/GCNĐKHĐ-LĐTBXH 06/02/2017 và các giấy bổ sung (hồ sơ tr. 11-13).    */

const NINH_BINH: L10n = { vi: "Ninh Bình", en: "Ninh Binh", de: "Ninh Binh" };

const IVS: Row[] = [
  { slug: "ivs-ky-thuat-xay-dung-trung-cap", code: "40510106", level: "trung_cap", quota: 50, category: "ky-thuat-cong-nghiep", featured: true,
    title: { vi: "Kỹ thuật xây dựng", en: "Construction engineering", de: "Bautechnik" } },
  { slug: "ivs-phien-dich-tieng-anh-du-lich-trung-cap", code: "40220203", level: "trung_cap", quota: 30, category: "ngon-ngu",
    title: { vi: "Phiên dịch tiếng Anh du lịch", en: "English interpreting for tourism", de: "Englisch-Dolmetschen für Tourismus" } },
  { slug: "ivs-phien-dich-tieng-nhat-kinh-te-thuong-mai-trung-cap", code: "40220204", level: "trung_cap", quota: 30, category: "ngon-ngu",
    title: { vi: "Phiên dịch tiếng Nhật kinh tế – thương mại", en: "Japanese interpreting for business and trade", de: "Japanisch-Dolmetschen für Wirtschaft und Handel" } },
  { slug: "ivs-phien-dich-tieng-duc-kinh-te-thuong-mai-trung-cap", code: "40220205", level: "trung_cap", quota: 30, category: "ngon-ngu", featured: true,
    title: { vi: "Phiên dịch tiếng Đức kinh tế – thương mại", en: "German interpreting for business and trade", de: "Deutsch-Dolmetschen für Wirtschaft und Handel" } },
  { slug: "ivs-huong-dan-du-lich-trung-cap", code: "40810101", level: "trung_cap", quota: 30, category: "du-lich-dich-vu",
    title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung" } },
  { slug: "ivs-quan-tri-khach-san-trung-cap", code: "5810201", level: "trung_cap", quota: 70, category: "du-lich-dich-vu",
    title: { vi: "Quản trị khách sạn", en: "Hotel management", de: "Hotelmanagement" } },
  { slug: "ivs-ky-thuat-che-bien-mon-an-trung-cap", code: "40810203", level: "trung_cap", quota: 30, category: "du-lich-dich-vu",
    title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik" } },
  { slug: "ivs-sua-chua-co-khi-dong-luc-trung-cap", code: "40510258", level: "trung_cap", quota: 30, category: "ky-thuat-cong-nghiep",
    title: { vi: "Sửa chữa cơ khí động lực", en: "Powertrain mechanical repair", de: "Instandsetzung von Antriebstechnik" } },
  { slug: "ivs-dich-vu-nha-hang-khach-san-so-cap", level: "so_cap", quota: 50, category: "du-lich-dich-vu",
    title: { vi: "Dịch vụ nhà hàng, khách sạn", en: "Restaurant and hotel services", de: "Restaurant- und Hoteldienstleistungen" } },
  { slug: "ivs-huong-dan-du-lich-so-cap", level: "so_cap", quota: 50, category: "du-lich-dich-vu",
    title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung" } },
  { slug: "ivs-ky-thuat-xay-dung-so-cap", level: "so_cap", quota: 25, category: "ky-thuat-cong-nghiep",
    title: { vi: "Kỹ thuật xây dựng", en: "Construction engineering", de: "Bautechnik" } },
  { slug: "ivs-vi-tinh-van-phong-so-cap", level: "so_cap", quota: 25, category: "cong-nghe-thong-tin",
    title: { vi: "Vi tính văn phòng", en: "Office computing", de: "Bürocomputing" } },
];

/* --------------------------- Trường Trung cấp Bách khoa Vũng Tàu --------- */
/* GCN 71/GCNĐKHĐ-SLĐTBXH ngày 26/5/2021 (hồ sơ tr. 17).                     */

const VUNG_TAU: L10n = { vi: "Vũng Tàu", en: "Vung Tau", de: "Vung Tau" };

const BKVT: Row[] = [
  { slug: "bkvt-tieng-anh-trung-cap", code: "5220206", level: "trung_cap", quota: 50, category: "ngon-ngu",
    title: { vi: "Tiếng Anh", en: "English language", de: "Englisch" } },
  { slug: "bkvt-tieng-han-quoc-trung-cap", code: "5220211", level: "trung_cap", quota: 50, category: "ngon-ngu",
    title: { vi: "Tiếng Hàn Quốc", en: "Korean language", de: "Koreanisch" } },
  { slug: "bkvt-tieng-nhat-trung-cap", code: "5220212", level: "trung_cap", quota: 50, category: "ngon-ngu",
    title: { vi: "Tiếng Nhật", en: "Japanese language", de: "Japanisch" } },
  { slug: "bkvt-ke-toan-doanh-nghiep-trung-cap", code: "5340302", level: "trung_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen" } },
  { slug: "bkvt-quan-tri-doanh-nghiep-vua-va-nho-trung-cap", code: "5340417", level: "trung_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Quản trị doanh nghiệp vừa và nhỏ", en: "Small and medium enterprise management", de: "Management kleiner und mittlerer Unternehmen" } },
  { slug: "bkvt-tai-chinh-doanh-nghiep-trung-cap", code: "5340201", level: "trung_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Tài chính doanh nghiệp", en: "Corporate finance", de: "Unternehmensfinanzierung" } },
  { slug: "bkvt-thiet-ke-do-hoa-trung-cap", code: "5210402", level: "trung_cap", quota: 100, category: "cong-nghe-thong-tin", featured: true,
    title: { vi: "Thiết kế đồ họa", en: "Graphic design", de: "Grafikdesign" } },
  { slug: "bkvt-cong-nghe-thong-tin-ung-dung-phan-mem-trung-cap", code: "5480202", level: "trung_cap", quota: 100, category: "cong-nghe-thong-tin", featured: true,
    title: { vi: "Công nghệ thông tin (ứng dụng phần mềm)", en: "Information technology (software applications)", de: "Informationstechnik (Softwareanwendungen)" } },
  { slug: "bkvt-quan-tri-mang-may-tinh-trung-cap", code: "5480209", level: "trung_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Quản trị mạng máy tính", en: "Computer network administration", de: "Netzwerkadministration" } },
  { slug: "bkvt-tin-hoc-van-phong-va-quan-ly-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Tin học văn phòng và quản lý", en: "Office computing and administration", de: "Bürocomputing und Verwaltung" } },
  { slug: "bkvt-lap-trinh-ung-dung-web-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Lập trình ứng dụng web", en: "Web application programming", de: "Webanwendungsprogrammierung" } },
  { slug: "bkvt-lap-rap-cai-dat-bao-tri-may-tinh-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Lắp ráp, cài đặt, bảo trì máy tính", en: "Computer assembly, installation and maintenance", de: "Montage, Installation und Wartung von Computern" } },
  { slug: "bkvt-thiet-ke-do-hoa-corel-photoshop-so-cap", level: "so_cap", quota: 150, category: "cong-nghe-thong-tin",
    title: { vi: "Thiết kế đồ họa (Corel, Photoshop)", en: "Graphic design (Corel, Photoshop)", de: "Grafikdesign (Corel, Photoshop)" } },
  { slug: "bkvt-thiet-ke-website-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Thiết kế website", en: "Website design", de: "Webdesign" } },
  { slug: "bkvt-quan-tri-he-thong-mang-may-tinh-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Quản trị hệ thống mạng máy tính", en: "Computer network systems administration", de: "Administration von Netzwerksystemen" } },
  { slug: "bkvt-ke-toan-doanh-nghiep-so-cap", level: "so_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen" } },
  { slug: "bkvt-kiem-toan-noi-bo-so-cap", level: "so_cap", quota: 50, category: "kinh-te-quan-tri",
    title: { vi: "Kiểm toán nội bộ", en: "Internal audit", de: "Interne Revision" } },
];

/* ------------------------------- Trường Trung cấp Việt Hàn ---------------- */
/* QĐ 561/QĐ-SGDĐT ngày 07/3/2019 (hồ sơ tr. 20).                            */

const DONG_XOAI: L10n = { vi: "Đồng Xoài, Đồng Nai", en: "Dong Xoai, Dong Nai", de: "Dong Xoai, Dong Nai" };

const VIET_HAN: Row[] = [
  { slug: "vh-giao-duc-mam-non-trung-cap", code: "42140201", level: "trung_cap", category: "su-pham",
    title: { vi: "Giáo dục Mầm non", en: "Pre-school education", de: "Vorschulpädagogik" } },
  { slug: "vh-giao-duc-tieu-hoc-trung-cap", code: "42140202", level: "trung_cap", category: "su-pham",
    title: { vi: "Giáo dục Tiểu học", en: "Primary education", de: "Grundschulpädagogik" } },
];

export const LICENSED_PROGRAMS: SeedProgram[] = [
  ...build("cao-dang-cong-nghe-ngoai-thuong", 5, DA_NANG, FTC),
  ...build("trung-cap-nghe-quoc-te-ivs", 11, NINH_BINH, IVS),
  ...build("trung-cap-bach-khoa-vung-tau", 17, VUNG_TAU, BKVT),
  ...build("trung-cap-viet-han", 20, DONG_XOAI, VIET_HAN),
];

/**
 * Fields the profile advertises for schools whose licence tables are not in the
 * source documents. They are real statements of intent by the schools, but they
 * carry no occupation code and no quota, so they are seeded as `draft` and are
 * displayed as "định hướng đào tạo" rather than as open admissions.
 */
export type SeedIntent = {
  school: string;
  page: number;
  city: L10n;
  note: string;
  fields: { slug: string; category: string; title: L10n }[];
};

export const TRAINING_INTENTS: SeedIntent[] = [
  {
    school: "trung-cap-viet-han",
    page: 18,
    city: DONG_XOAI,
    note: "Ngành nghề đào tạo tiêu biểu nêu trong hồ sơ năng lực (tr.18). Chưa có mã ngành và chỉ tiêu trong giấy chứng nhận kèm theo hồ sơ – cần trường bổ sung trước khi công bố tuyển sinh.",
    fields: [
      { slug: "vh-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik" } },
      { slug: "vh-dien-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện công nghiệp", en: "Industrial electricity", de: "Industrieelektrik" } },
      { slug: "vh-dien-tu-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện tử công nghiệp", en: "Industrial electronics", de: "Industrieelektronik" } },
      { slug: "vh-cong-nghe-thong-tin", category: "cong-nghe-thong-tin", title: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik" } },
      { slug: "vh-logistics", category: "kinh-te-quan-tri", title: { vi: "Logistics", en: "Logistics", de: "Logistik" } },
      { slug: "vh-quan-tri-kinh-doanh", category: "kinh-te-quan-tri", title: { vi: "Quản trị kinh doanh", en: "Business administration", de: "Betriebswirtschaft" } },
      { slug: "vh-cham-soc-sac-dep", category: "cham-soc-suc-khoe", title: { vi: "Chăm sóc sắc đẹp", en: "Beauty care", de: "Schönheitspflege" } },
      { slug: "vh-ky-thuat-che-bien-mon-an", category: "du-lich-dich-vu", title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik" } },
      { slug: "vh-ngon-ngu-han-quoc", category: "ngon-ngu", title: { vi: "Ngôn ngữ Hàn Quốc", en: "Korean language", de: "Koreanisch" } },
      { slug: "vh-du-lich-nha-hang-khach-san", category: "du-lich-dich-vu", title: { vi: "Du lịch – Nhà hàng – Khách sạn", en: "Tourism, restaurants and hotels", de: "Tourismus, Gastronomie und Hotellerie" } },
    ],
  },
  {
    school: "trung-cap-cong-nghe-viet-duc",
    page: 8,
    city: { vi: "Quảng Trị", en: "Quang Tri", de: "Quang Tri" },
    note: "Ngành nghề đào tạo tiêu biểu nêu trong hồ sơ năng lực (tr.8). Theo QĐ 2567/QĐ-UBND ngày 26/6/2026, trường chỉ được tuyển sinh sau khi được cấp Giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp – chưa công bố chỉ tiêu.",
    fields: [
      { slug: "vdct-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik" } },
      { slug: "vdct-dien-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện công nghiệp", en: "Industrial electricity", de: "Industrieelektrik" } },
      { slug: "vdct-dien-tu-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện tử công nghiệp", en: "Industrial electronics", de: "Industrieelektronik" } },
      { slug: "vdct-co-khi-che-tao", category: "ky-thuat-cong-nghiep", title: { vi: "Cơ khí chế tạo", en: "Manufacturing mechanics", de: "Fertigungstechnik" } },
      { slug: "vdct-cong-nghe-thong-tin", category: "cong-nghe-thong-tin", title: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik" } },
      { slug: "vdct-ke-toan-doanh-nghiep", category: "kinh-te-quan-tri", title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen" } },
      { slug: "vdct-quan-tri-kinh-doanh", category: "kinh-te-quan-tri", title: { vi: "Quản trị kinh doanh", en: "Business administration", de: "Betriebswirtschaft" } },
      { slug: "vdct-thuong-mai-dien-tu", category: "kinh-te-quan-tri", title: { vi: "Thương mại điện tử", en: "E-commerce", de: "E-Commerce" } },
      { slug: "vdct-logistics", category: "kinh-te-quan-tri", title: { vi: "Logistics", en: "Logistics", de: "Logistik" } },
      { slug: "vdct-huong-dan-du-lich", category: "du-lich-dich-vu", title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung" } },
      { slug: "vdct-cham-soc-sac-dep", category: "cham-soc-suc-khoe", title: { vi: "Chăm sóc sắc đẹp", en: "Beauty care", de: "Schönheitspflege" } },
      { slug: "vdct-ky-thuat-che-bien-mon-an", category: "du-lich-dich-vu", title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik" } },
      { slug: "vdct-may-thoi-trang", category: "ky-thuat-cong-nghiep", title: { vi: "May thời trang", en: "Fashion garment making", de: "Modeschneiderei" } },
    ],
  },
  {
    school: "trung-cap-bach-khoa-vung-tau",
    page: 14,
    city: VUNG_TAU,
    note: "Ngành kỹ thuật nêu trên trang giới thiệu trường (tr.14) nhưng không có trong GCN 71/GCNĐKHĐ-SLĐTBXH. Cần trường bổ sung giấy phép trước khi tuyển sinh.",
    fields: [
      { slug: "bkvt-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik" } },
      { slug: "bkvt-dien-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện công nghiệp", en: "Industrial electricity", de: "Industrieelektrik" } },
      { slug: "bkvt-dien-tu-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện tử công nghiệp", en: "Industrial electronics", de: "Industrieelektronik" } },
      { slug: "bkvt-co-khi-che-tao", category: "ky-thuat-cong-nghiep", title: { vi: "Cơ khí chế tạo", en: "Manufacturing mechanics", de: "Fertigungstechnik" } },
      { slug: "bkvt-tu-dong-hoa-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Tự động hóa công nghiệp", en: "Industrial automation", de: "Industrieautomation" } },
      { slug: "bkvt-han", category: "ky-thuat-cong-nghiep", title: { vi: "Hàn", en: "Welding", de: "Schweißtechnik" } },
      { slug: "bkvt-ky-thuat-may-lanh-va-dieu-hoa-khong-khi", category: "ky-thuat-cong-nghiep", title: { vi: "Kỹ thuật máy lạnh và điều hòa không khí", en: "Refrigeration and air-conditioning technology", de: "Kälte- und Klimatechnik" } },
    ],
  },
  {
    school: "cao-dang-cong-nghe-ngoai-thuong",
    page: 4,
    city: DA_NANG,
    note: "Ngành kỹ thuật nêu trên trang giới thiệu trường (tr.4) nhưng không có mã ngành trong GCN 69/2023/GCNĐKHĐ-TCGDNN. Cần trường bổ sung giấy phép.",
    fields: [
      { slug: "ftc-dien-dien-lanh", category: "ky-thuat-cong-nghiep", title: { vi: "Điện – Điện lạnh", en: "Electrical and refrigeration", de: "Elektro- und Kältetechnik" } },
      { slug: "ftc-co-khi", category: "ky-thuat-cong-nghiep", title: { vi: "Cơ khí", en: "Mechanical engineering", de: "Maschinenbau" } },
      { slug: "ftc-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik" } },
    ],
  },
  {
    school: "itw-berlin",
    page: 21,
    city: { vi: "Berlin, CHLB Đức", en: "Berlin, Germany", de: "Berlin, Deutschland" },
    note: "Nội dung hợp tác ITW Berlin nêu trong hồ sơ (tr.21). Đây là chương trình liên kết, chưa có mã ngành Việt Nam – cần ITW Berlin và trường thành viên xác nhận chi tiết chương trình trước khi công bố.",
    fields: [
      { slug: "itw-dao-tao-tieng-duc", category: "ngon-ngu", title: { vi: "Đào tạo tiếng Đức chuẩn quốc tế", en: "German language training to international standards", de: "Deutschunterricht nach internationalem Standard" } },
      { slug: "itw-chuyen-giao-chuong-trinh-nghe", category: "ky-thuat-cong-nghiep", title: { vi: "Chuyển giao chương trình đào tạo nghề chuẩn Đức", en: "Transfer of German-standard vocational programmes", de: "Transfer von Ausbildungsprogrammen nach deutschem Standard" } },
    ],
  },
];
