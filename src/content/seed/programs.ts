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

const DA_NANG: L10n = { vi: "Đà Nẵng", en: "Da Nang", de: "Da Nang", ja: "ダナン", ko: "다낭", "zh-TW": "峴港" };

const FTC: Row[] = [
  { slug: "ftc-tieng-anh-cao-dang", code: "6220206", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Anh", en: "English language", de: "Englisch", ja: "英語", ko: "영어", "zh-TW": "英語" } },
  { slug: "ftc-tieng-trung-quoc-cao-dang", code: "6220209", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Trung Quốc", en: "Chinese language", de: "Chinesisch", ja: "中国語", ko: "중국어", "zh-TW": "華語" } },
  { slug: "ftc-tieng-han-quoc-cao-dang", code: "6220211", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Hàn Quốc", en: "Korean language", de: "Koreanisch", ja: "韓国語", ko: "한국어", "zh-TW": "韓語" } },
  { slug: "ftc-tieng-nhat-ban-cao-dang", code: "6220212", level: "cao_dang", quota: 20, category: "ngon-ngu",
    title: { vi: "Tiếng Nhật Bản", en: "Japanese language", de: "Japanisch", ja: "日本語", ko: "일본어", "zh-TW": "日語" } },
  { slug: "ftc-bao-chi-cao-dang", code: "6320103", level: "cao_dang", quota: 20, category: "truyen-thong",
    title: { vi: "Báo chí", en: "Journalism", de: "Journalismus", ja: "ジャーナリズム", ko: "저널리즘", "zh-TW": "新聞學" } },
  { slug: "ftc-he-thong-thong-tin-quan-ly-cao-dang", code: "6320202", level: "cao_dang", quota: 20, category: "cong-nghe-thong-tin",
    title: { vi: "Hệ thống thông tin quản lý", en: "Management information systems", de: "Managementinformationssysteme", ja: "経営情報システム", ko: "경영정보시스템", "zh-TW": "管理資訊系統" } },
  { slug: "ftc-kinh-doanh-xuat-nhap-khau-cao-dang", code: "6340102", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri", featured: true,
    title: { vi: "Kinh doanh xuất nhập khẩu", en: "Import–export business", de: "Import- und Exporthandel", ja: "輸出入ビジネス", ko: "수출입 비즈니스", "zh-TW": "進出口貿易" } },
  { slug: "ftc-logistics-cao-dang", code: "6340113", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri", featured: true,
    title: { vi: "Logistics", en: "Logistics", de: "Logistik", ja: "ロジスティクス", ko: "물류", "zh-TW": "物流" } },
  { slug: "ftc-marketing-cao-dang", code: "6340116", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Marketing", en: "Marketing", de: "Marketing", ja: "マーケティング", ko: "마케팅", "zh-TW": "行銷" } },
  { slug: "ftc-thuong-mai-dien-tu-cao-dang", code: "6340122", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Thương mại điện tử", en: "E-commerce", de: "E-Commerce", ja: "電子商取引", ko: "전자상거래", "zh-TW": "電子商務" } },
  { slug: "ftc-kinh-doanh-thuong-mai-va-dich-vu-trung-cap", code: "5340101", level: "trung_cap", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Kinh doanh thương mại và dịch vụ", en: "Trade and service business", de: "Handel und Dienstleistung", ja: "商業・サービスビジネス", ko: "상업·서비스 비즈니스", "zh-TW": "商業與服務經營" } },
  { slug: "ftc-tai-chinh-ngan-hang-cao-dang", code: "6340202", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Tài chính – Ngân hàng", en: "Finance and banking", de: "Finanzen und Bankwesen", ja: "金融・銀行", ko: "금융·은행", "zh-TW": "財務金融與銀行" } },
  { slug: "ftc-tai-chinh-ngan-hang-trung-cap", code: "5340202", level: "trung_cap", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Tài chính – Ngân hàng", en: "Finance and banking", de: "Finanzen und Bankwesen", ja: "金融・銀行", ko: "금융·은행", "zh-TW": "財務金融與銀行" } },
  { slug: "ftc-ke-toan-doanh-nghiep-cao-dang", code: "6340302", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen", ja: "企業会計", ko: "기업 회계", "zh-TW": "企業會計" } },
  { slug: "ftc-ke-toan-doanh-nghiep-trung-cap", code: "5340302", level: "trung_cap", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen", ja: "企業会計", ko: "기업 회계", "zh-TW": "企業會計" } },
  { slug: "ftc-quan-tri-kinh-doanh-cao-dang", code: "6340404", level: "cao_dang", quota: 20, category: "kinh-te-quan-tri",
    title: { vi: "Quản trị kinh doanh", en: "Business administration", de: "Betriebswirtschaft", ja: "経営管理", ko: "경영학", "zh-TW": "企業管理" } },
  { slug: "ftc-quan-ly-va-kinh-doanh-du-lich-trung-cap", code: "5340421", level: "trung_cap", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Quản lý và kinh doanh du lịch", en: "Tourism management and business", de: "Tourismusmanagement", ja: "観光経営", ko: "관광 경영", "zh-TW": "觀光經營與管理" } },
  { slug: "ftc-phap-luat-trung-cap", code: "5380101", level: "trung_cap", quota: 20, category: "luat-hanh-chinh",
    title: { vi: "Pháp luật", en: "Law", de: "Recht", ja: "法律", ko: "법률", "zh-TW": "法律" } },
  { slug: "ftc-cong-nghe-thong-tin-cao-dang", code: "6480201", level: "cao_dang", quota: 20, category: "cong-nghe-thong-tin", featured: true,
    title: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik", ja: "情報技術", ko: "정보기술", "zh-TW": "資訊科技" } },
  { slug: "ftc-huong-dan-du-lich-cao-dang", code: "6810103", level: "cao_dang", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung", ja: "観光ガイド", ko: "관광 가이드", "zh-TW": "導遊" } },
  { slug: "ftc-du-lich-lu-hanh-trung-cap", code: "5810101", level: "trung_cap", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Du lịch lữ hành", en: "Travel and tour operations", de: "Reiseveranstaltung", ja: "旅行業務", ko: "여행업", "zh-TW": "旅行業務" } },
  { slug: "ftc-ky-thuat-che-bien-mon-an-cao-dang", code: "6810207", level: "cao_dang", quota: 20, category: "du-lich-dich-vu", featured: true,
    title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik", ja: "調理技術", ko: "조리 기술", "zh-TW": "餐飲製備技術" } },
  { slug: "ftc-nghiep-vu-le-tan-trung-cap", code: "5810203", level: "trung_cap", quota: 20, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ lễ tân", en: "Front office operations", de: "Rezeptionsdienst", ja: "フロント業務", ko: "프런트 업무", "zh-TW": "櫃檯接待實務" } },
  { slug: "ftc-nghiep-vu-le-tan-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ lễ tân", en: "Front office operations", de: "Rezeptionsdienst", ja: "フロント業務", ko: "프런트 업무", "zh-TW": "櫃檯接待實務" } },
  { slug: "ftc-nghiep-vu-nha-hang-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ nhà hàng", en: "Restaurant operations", de: "Restaurantservice", ja: "レストランサービス実務", ko: "레스토랑 서비스 실무", "zh-TW": "餐廳服務實務" } },
  { slug: "ftc-quan-tri-khach-san-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Quản trị khách sạn", en: "Hotel management", de: "Hotelmanagement", ja: "ホテル経営", ko: "호텔 경영", "zh-TW": "旅館管理" } },
  { slug: "ftc-nghiep-vu-buong-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Nghiệp vụ buồng", en: "Housekeeping operations", de: "Housekeeping", ja: "客室整備実務", ko: "객실 정비 실무", "zh-TW": "房務實務" } },
  { slug: "ftc-thiet-ke-dieu-hanh-tour-so-cap", level: "so_cap", quota: 105, category: "du-lich-dich-vu",
    title: { vi: "Thiết kế – Điều hành tour du lịch", en: "Tour design and operations", de: "Tourgestaltung und -abwicklung", ja: "ツアーの企画・運行", ko: "여행 상품 기획·운영", "zh-TW": "遊程規劃與帶團作業" } },
];

/* ----------------------------- Trường Trung cấp nghề Quốc tế (IVS) -------- */
/* GCN 01/GCNĐKHĐ-LĐTBXH 06/02/2017 và các giấy bổ sung (hồ sơ tr. 11-13).    */

const NINH_BINH: L10n = { vi: "Ninh Bình", en: "Ninh Binh", de: "Ninh Binh", ja: "ニンビン", ko: "닌빈", "zh-TW": "寧平" };

const IVS: Row[] = [
  { slug: "ivs-ky-thuat-xay-dung-trung-cap", code: "40510106", level: "trung_cap", quota: 50, category: "ky-thuat-cong-nghiep", featured: true,
    title: { vi: "Kỹ thuật xây dựng", en: "Construction engineering", de: "Bautechnik", ja: "建設技術", ko: "건설 기술", "zh-TW": "營建工程" } },
  { slug: "ivs-phien-dich-tieng-anh-du-lich-trung-cap", code: "40220203", level: "trung_cap", quota: 30, category: "ngon-ngu",
    title: { vi: "Phiên dịch tiếng Anh du lịch", en: "English interpreting for tourism", de: "Englisch-Dolmetschen für Tourismus", ja: "観光英語通訳", ko: "관광 영어 통역", "zh-TW": "觀光英語口譯" } },
  { slug: "ivs-phien-dich-tieng-nhat-kinh-te-thuong-mai-trung-cap", code: "40220204", level: "trung_cap", quota: 30, category: "ngon-ngu",
    title: { vi: "Phiên dịch tiếng Nhật kinh tế – thương mại", en: "Japanese interpreting for business and trade", de: "Japanisch-Dolmetschen für Wirtschaft und Handel", ja: "経済・商務日本語通訳", ko: "경제·통상 일본어 통역", "zh-TW": "經貿日語口譯" } },
  { slug: "ivs-phien-dich-tieng-duc-kinh-te-thuong-mai-trung-cap", code: "40220205", level: "trung_cap", quota: 30, category: "ngon-ngu", featured: true,
    title: { vi: "Phiên dịch tiếng Đức kinh tế – thương mại", en: "German interpreting for business and trade", de: "Deutsch-Dolmetschen für Wirtschaft und Handel", ja: "経済・商務ドイツ語通訳", ko: "경제·통상 독일어 통역", "zh-TW": "經貿德語口譯" } },
  { slug: "ivs-huong-dan-du-lich-trung-cap", code: "40810101", level: "trung_cap", quota: 30, category: "du-lich-dich-vu",
    title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung", ja: "観光ガイド", ko: "관광 가이드", "zh-TW": "導遊" } },
  { slug: "ivs-quan-tri-khach-san-trung-cap", code: "5810201", level: "trung_cap", quota: 70, category: "du-lich-dich-vu",
    title: { vi: "Quản trị khách sạn", en: "Hotel management", de: "Hotelmanagement", ja: "ホテル経営", ko: "호텔 경영", "zh-TW": "旅館管理" } },
  { slug: "ivs-ky-thuat-che-bien-mon-an-trung-cap", code: "40810203", level: "trung_cap", quota: 30, category: "du-lich-dich-vu",
    title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik", ja: "調理技術", ko: "조리 기술", "zh-TW": "餐飲製備技術" } },
  { slug: "ivs-sua-chua-co-khi-dong-luc-trung-cap", code: "40510258", level: "trung_cap", quota: 30, category: "ky-thuat-cong-nghiep",
    title: { vi: "Sửa chữa cơ khí động lực", en: "Powertrain mechanical repair", de: "Instandsetzung von Antriebstechnik", ja: "動力機械の整備", ko: "동력 기계 정비", "zh-TW": "動力機械修護" } },
  { slug: "ivs-dich-vu-nha-hang-khach-san-so-cap", level: "so_cap", quota: 50, category: "du-lich-dich-vu",
    title: { vi: "Dịch vụ nhà hàng, khách sạn", en: "Restaurant and hotel services", de: "Restaurant- und Hoteldienstleistungen", ja: "レストラン・ホテルサービス", ko: "레스토랑·호텔 서비스", "zh-TW": "餐旅服務" } },
  { slug: "ivs-huong-dan-du-lich-so-cap", level: "so_cap", quota: 50, category: "du-lich-dich-vu",
    title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung", ja: "観光ガイド", ko: "관광 가이드", "zh-TW": "導遊" } },
  { slug: "ivs-ky-thuat-xay-dung-so-cap", level: "so_cap", quota: 25, category: "ky-thuat-cong-nghiep",
    title: { vi: "Kỹ thuật xây dựng", en: "Construction engineering", de: "Bautechnik", ja: "建設技術", ko: "건설 기술", "zh-TW": "營建工程" } },
  { slug: "ivs-vi-tinh-van-phong-so-cap", level: "so_cap", quota: 25, category: "cong-nghe-thong-tin",
    title: { vi: "Vi tính văn phòng", en: "Office computing", de: "Bürocomputing", ja: "オフィス情報処理", ko: "사무 전산", "zh-TW": "辦公室電腦應用" } },
];

/* --------------------------- Trường Trung cấp Bách khoa Vũng Tàu --------- */
/* GCN 71/GCNĐKHĐ-SLĐTBXH ngày 26/5/2021 (hồ sơ tr. 17).                     */

const VUNG_TAU: L10n = { vi: "Vũng Tàu", en: "Vung Tau", de: "Vung Tau", ja: "ブンタウ", ko: "붕따우", "zh-TW": "頭頓" };

const BKVT: Row[] = [
  { slug: "bkvt-tieng-anh-trung-cap", code: "5220206", level: "trung_cap", quota: 50, category: "ngon-ngu",
    title: { vi: "Tiếng Anh", en: "English language", de: "Englisch", ja: "英語", ko: "영어", "zh-TW": "英語" } },
  { slug: "bkvt-tieng-han-quoc-trung-cap", code: "5220211", level: "trung_cap", quota: 50, category: "ngon-ngu",
    title: { vi: "Tiếng Hàn Quốc", en: "Korean language", de: "Koreanisch", ja: "韓国語", ko: "한국어", "zh-TW": "韓語" } },
  { slug: "bkvt-tieng-nhat-trung-cap", code: "5220212", level: "trung_cap", quota: 50, category: "ngon-ngu",
    title: { vi: "Tiếng Nhật", en: "Japanese language", de: "Japanisch", ja: "日本語", ko: "일본어", "zh-TW": "日語" } },
  { slug: "bkvt-ke-toan-doanh-nghiep-trung-cap", code: "5340302", level: "trung_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen", ja: "企業会計", ko: "기업 회계", "zh-TW": "企業會計" } },
  { slug: "bkvt-quan-tri-doanh-nghiep-vua-va-nho-trung-cap", code: "5340417", level: "trung_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Quản trị doanh nghiệp vừa và nhỏ", en: "Small and medium enterprise management", de: "Management kleiner und mittlerer Unternehmen", ja: "中小企業経営", ko: "중소기업 경영", "zh-TW": "中小企業管理" } },
  { slug: "bkvt-tai-chinh-doanh-nghiep-trung-cap", code: "5340201", level: "trung_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Tài chính doanh nghiệp", en: "Corporate finance", de: "Unternehmensfinanzierung", ja: "企業財務", ko: "기업 재무", "zh-TW": "企業財務" } },
  { slug: "bkvt-thiet-ke-do-hoa-trung-cap", code: "5210402", level: "trung_cap", quota: 100, category: "cong-nghe-thong-tin", featured: true,
    title: { vi: "Thiết kế đồ họa", en: "Graphic design", de: "Grafikdesign", ja: "グラフィックデザイン", ko: "그래픽 디자인", "zh-TW": "平面設計" } },
  { slug: "bkvt-cong-nghe-thong-tin-ung-dung-phan-mem-trung-cap", code: "5480202", level: "trung_cap", quota: 100, category: "cong-nghe-thong-tin", featured: true,
    title: { vi: "Công nghệ thông tin (ứng dụng phần mềm)", en: "Information technology (software applications)", de: "Informationstechnik (Softwareanwendungen)", ja: "情報技術(ソフトウェア応用)", ko: "정보기술(소프트웨어 응용)", "zh-TW": "資訊科技（軟體應用）" } },
  { slug: "bkvt-quan-tri-mang-may-tinh-trung-cap", code: "5480209", level: "trung_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Quản trị mạng máy tính", en: "Computer network administration", de: "Netzwerkadministration", ja: "コンピューターネットワーク管理", ko: "컴퓨터 네트워크 관리", "zh-TW": "電腦網路管理" } },
  { slug: "bkvt-tin-hoc-van-phong-va-quan-ly-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Tin học văn phòng và quản lý", en: "Office computing and administration", de: "Bürocomputing und Verwaltung", ja: "オフィス情報処理と管理", ko: "사무 전산과 관리", "zh-TW": "辦公室資訊處理與管理" } },
  { slug: "bkvt-lap-trinh-ung-dung-web-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Lập trình ứng dụng web", en: "Web application programming", de: "Webanwendungsprogrammierung", ja: "ウェブアプリケーション開発", ko: "웹 애플리케이션 개발", "zh-TW": "網頁應用程式開發" } },
  { slug: "bkvt-lap-rap-cai-dat-bao-tri-may-tinh-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Lắp ráp, cài đặt, bảo trì máy tính", en: "Computer assembly, installation and maintenance", de: "Montage, Installation und Wartung von Computern", ja: "パソコンの組立・設置・保守", ko: "컴퓨터 조립·설치·유지보수", "zh-TW": "電腦組裝、安裝與維護" } },
  { slug: "bkvt-thiet-ke-do-hoa-corel-photoshop-so-cap", level: "so_cap", quota: 150, category: "cong-nghe-thong-tin",
    title: { vi: "Thiết kế đồ họa (Corel, Photoshop)", en: "Graphic design (Corel, Photoshop)", de: "Grafikdesign (Corel, Photoshop)", ja: "グラフィックデザイン(Corel・Photoshop)", ko: "그래픽 디자인(Corel, Photoshop)", "zh-TW": "平面設計（Corel、Photoshop）" } },
  { slug: "bkvt-thiet-ke-website-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Thiết kế website", en: "Website design", de: "Webdesign", ja: "ウェブサイト制作", ko: "웹사이트 디자인", "zh-TW": "網站設計" } },
  { slug: "bkvt-quan-tri-he-thong-mang-may-tinh-so-cap", level: "so_cap", quota: 200, category: "cong-nghe-thong-tin",
    title: { vi: "Quản trị hệ thống mạng máy tính", en: "Computer network systems administration", de: "Administration von Netzwerksystemen", ja: "コンピューターネットワークシステム管理", ko: "컴퓨터 네트워크 시스템 관리", "zh-TW": "電腦網路系統管理" } },
  { slug: "bkvt-ke-toan-doanh-nghiep-so-cap", level: "so_cap", quota: 100, category: "kinh-te-quan-tri",
    title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen", ja: "企業会計", ko: "기업 회계", "zh-TW": "企業會計" } },
  { slug: "bkvt-kiem-toan-noi-bo-so-cap", level: "so_cap", quota: 50, category: "kinh-te-quan-tri",
    title: { vi: "Kiểm toán nội bộ", en: "Internal audit", de: "Interne Revision", ja: "内部監査", ko: "내부 감사", "zh-TW": "內部稽核" } },
];

/* ------------------------------- Trường Trung cấp Việt Hàn ---------------- */
/* QĐ 561/QĐ-SGDĐT ngày 07/3/2019 (hồ sơ tr. 20).                            */

const DONG_XOAI: L10n = { vi: "Đồng Xoài, Đồng Nai", en: "Dong Xoai, Dong Nai", de: "Dong Xoai, Dong Nai", ja: "ドンナイ省ドンソアイ", ko: "동나이성 동사와이", "zh-TW": "同奈省同帥" };

const VIET_HAN: Row[] = [
  { slug: "vh-giao-duc-mam-non-trung-cap", code: "42140201", level: "trung_cap", category: "su-pham",
    title: { vi: "Giáo dục Mầm non", en: "Pre-school education", de: "Vorschulpädagogik", ja: "幼児教育", ko: "유아교육", "zh-TW": "幼兒教育" } },
  { slug: "vh-giao-duc-tieu-hoc-trung-cap", code: "42140202", level: "trung_cap", category: "su-pham",
    title: { vi: "Giáo dục Tiểu học", en: "Primary education", de: "Grundschulpädagogik", ja: "初等教育", ko: "초등교육", "zh-TW": "國小教育" } },
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
      { slug: "vh-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik", ja: "自動車工学", ko: "자동차 공학", "zh-TW": "汽車科技" } },
      { slug: "vh-dien-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện công nghiệp", en: "Industrial electricity", de: "Industrieelektrik", ja: "産業電気", ko: "산업 전기", "zh-TW": "工業電機" } },
      { slug: "vh-dien-tu-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện tử công nghiệp", en: "Industrial electronics", de: "Industrieelektronik", ja: "産業電子", ko: "산업 전자", "zh-TW": "工業電子" } },
      { slug: "vh-cong-nghe-thong-tin", category: "cong-nghe-thong-tin", title: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik", ja: "情報技術", ko: "정보기술", "zh-TW": "資訊科技" } },
      { slug: "vh-logistics", category: "kinh-te-quan-tri", title: { vi: "Logistics", en: "Logistics", de: "Logistik", ja: "ロジスティクス", ko: "물류", "zh-TW": "物流" } },
      { slug: "vh-quan-tri-kinh-doanh", category: "kinh-te-quan-tri", title: { vi: "Quản trị kinh doanh", en: "Business administration", de: "Betriebswirtschaft", ja: "経営管理", ko: "경영학", "zh-TW": "企業管理" } },
      { slug: "vh-cham-soc-sac-dep", category: "cham-soc-suc-khoe", title: { vi: "Chăm sóc sắc đẹp", en: "Beauty care", de: "Schönheitspflege", ja: "美容", ko: "미용", "zh-TW": "美容" } },
      { slug: "vh-ky-thuat-che-bien-mon-an", category: "du-lich-dich-vu", title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik", ja: "調理技術", ko: "조리 기술", "zh-TW": "餐飲製備技術" } },
      { slug: "vh-ngon-ngu-han-quoc", category: "ngon-ngu", title: { vi: "Ngôn ngữ Hàn Quốc", en: "Korean language", de: "Koreanisch", ja: "韓国語", ko: "한국어", "zh-TW": "韓語" } },
      { slug: "vh-du-lich-nha-hang-khach-san", category: "du-lich-dich-vu", title: { vi: "Du lịch – Nhà hàng – Khách sạn", en: "Tourism, restaurants and hotels", de: "Tourismus, Gastronomie und Hotellerie", ja: "観光・レストラン・ホテル", ko: "관광·레스토랑·호텔", "zh-TW": "觀光、餐飲與旅館" } },
    ],
  },
  {
    school: "trung-cap-cong-nghe-viet-duc",
    page: 8,
    city: { vi: "Quảng Trị", en: "Quang Tri", de: "Quang Tri", ja: "クアンチ", ko: "꽝찌", "zh-TW": "廣治" },
    note: "Ngành nghề đào tạo tiêu biểu nêu trong hồ sơ năng lực (tr.8). Theo QĐ 2567/QĐ-UBND ngày 26/6/2026, trường chỉ được tuyển sinh sau khi được cấp Giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp – chưa công bố chỉ tiêu.",
    fields: [
      { slug: "vdct-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik", ja: "自動車工学", ko: "자동차 공학", "zh-TW": "汽車科技" } },
      { slug: "vdct-dien-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện công nghiệp", en: "Industrial electricity", de: "Industrieelektrik", ja: "産業電気", ko: "산업 전기", "zh-TW": "工業電機" } },
      { slug: "vdct-dien-tu-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện tử công nghiệp", en: "Industrial electronics", de: "Industrieelektronik", ja: "産業電子", ko: "산업 전자", "zh-TW": "工業電子" } },
      { slug: "vdct-co-khi-che-tao", category: "ky-thuat-cong-nghiep", title: { vi: "Cơ khí chế tạo", en: "Manufacturing mechanics", de: "Fertigungstechnik", ja: "機械製造", ko: "기계 제작", "zh-TW": "機械製造" } },
      { slug: "vdct-cong-nghe-thong-tin", category: "cong-nghe-thong-tin", title: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik", ja: "情報技術", ko: "정보기술", "zh-TW": "資訊科技" } },
      { slug: "vdct-ke-toan-doanh-nghiep", category: "kinh-te-quan-tri", title: { vi: "Kế toán doanh nghiệp", en: "Business accounting", de: "Betriebliches Rechnungswesen", ja: "企業会計", ko: "기업 회계", "zh-TW": "企業會計" } },
      { slug: "vdct-quan-tri-kinh-doanh", category: "kinh-te-quan-tri", title: { vi: "Quản trị kinh doanh", en: "Business administration", de: "Betriebswirtschaft", ja: "経営管理", ko: "경영학", "zh-TW": "企業管理" } },
      { slug: "vdct-thuong-mai-dien-tu", category: "kinh-te-quan-tri", title: { vi: "Thương mại điện tử", en: "E-commerce", de: "E-Commerce", ja: "電子商取引", ko: "전자상거래", "zh-TW": "電子商務" } },
      { slug: "vdct-logistics", category: "kinh-te-quan-tri", title: { vi: "Logistics", en: "Logistics", de: "Logistik", ja: "ロジスティクス", ko: "물류", "zh-TW": "物流" } },
      { slug: "vdct-huong-dan-du-lich", category: "du-lich-dich-vu", title: { vi: "Hướng dẫn du lịch", en: "Tour guiding", de: "Reiseleitung", ja: "観光ガイド", ko: "관광 가이드", "zh-TW": "導遊" } },
      { slug: "vdct-cham-soc-sac-dep", category: "cham-soc-suc-khoe", title: { vi: "Chăm sóc sắc đẹp", en: "Beauty care", de: "Schönheitspflege", ja: "美容", ko: "미용", "zh-TW": "美容" } },
      { slug: "vdct-ky-thuat-che-bien-mon-an", category: "du-lich-dich-vu", title: { vi: "Kỹ thuật chế biến món ăn", en: "Culinary arts", de: "Küchentechnik", ja: "調理技術", ko: "조리 기술", "zh-TW": "餐飲製備技術" } },
      { slug: "vdct-may-thoi-trang", category: "ky-thuat-cong-nghiep", title: { vi: "May thời trang", en: "Fashion garment making", de: "Modeschneiderei", ja: "ファッション縫製", ko: "패션 봉제", "zh-TW": "時裝製作" } },
    ],
  },
  {
    school: "trung-cap-bach-khoa-vung-tau",
    page: 14,
    city: VUNG_TAU,
    note: "Ngành kỹ thuật nêu trên trang giới thiệu trường (tr.14) nhưng không có trong GCN 71/GCNĐKHĐ-SLĐTBXH. Cần trường bổ sung giấy phép trước khi tuyển sinh.",
    fields: [
      { slug: "bkvt-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik", ja: "自動車工学", ko: "자동차 공학", "zh-TW": "汽車科技" } },
      { slug: "bkvt-dien-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện công nghiệp", en: "Industrial electricity", de: "Industrieelektrik", ja: "産業電気", ko: "산업 전기", "zh-TW": "工業電機" } },
      { slug: "bkvt-dien-tu-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Điện tử công nghiệp", en: "Industrial electronics", de: "Industrieelektronik", ja: "産業電子", ko: "산업 전자", "zh-TW": "工業電子" } },
      { slug: "bkvt-co-khi-che-tao", category: "ky-thuat-cong-nghiep", title: { vi: "Cơ khí chế tạo", en: "Manufacturing mechanics", de: "Fertigungstechnik", ja: "機械製造", ko: "기계 제작", "zh-TW": "機械製造" } },
      { slug: "bkvt-tu-dong-hoa-cong-nghiep", category: "ky-thuat-cong-nghiep", title: { vi: "Tự động hóa công nghiệp", en: "Industrial automation", de: "Industrieautomation", ja: "産業オートメーション", ko: "산업 자동화", "zh-TW": "工業自動化" } },
      { slug: "bkvt-han", category: "ky-thuat-cong-nghiep", title: { vi: "Hàn", en: "Welding", de: "Schweißtechnik", ja: "溶接", ko: "용접", "zh-TW": "銲接" } },
      { slug: "bkvt-ky-thuat-may-lanh-va-dieu-hoa-khong-khi", category: "ky-thuat-cong-nghiep", title: { vi: "Kỹ thuật máy lạnh và điều hòa không khí", en: "Refrigeration and air-conditioning technology", de: "Kälte- und Klimatechnik", ja: "冷凍・空調技術", ko: "냉동·공조 기술", "zh-TW": "冷凍空調技術" } },
    ],
  },
  {
    school: "cao-dang-cong-nghe-ngoai-thuong",
    page: 4,
    city: DA_NANG,
    note: "Ngành kỹ thuật nêu trên trang giới thiệu trường (tr.4) nhưng không có mã ngành trong GCN 69/2023/GCNĐKHĐ-TCGDNN. Cần trường bổ sung giấy phép.",
    fields: [
      { slug: "ftc-dien-dien-lanh", category: "ky-thuat-cong-nghiep", title: { vi: "Điện – Điện lạnh", en: "Electrical and refrigeration", de: "Elektro- und Kältetechnik", ja: "電気・冷凍設備", ko: "전기·냉동 설비", "zh-TW": "電機與冷凍" } },
      { slug: "ftc-co-khi", category: "ky-thuat-cong-nghiep", title: { vi: "Cơ khí", en: "Mechanical engineering", de: "Maschinenbau", ja: "機械工学", ko: "기계 공학", "zh-TW": "機械工程" } },
      { slug: "ftc-cong-nghe-o-to", category: "ky-thuat-cong-nghiep", title: { vi: "Công nghệ ô tô", en: "Automotive technology", de: "Fahrzeugtechnik", ja: "自動車工学", ko: "자동차 공학", "zh-TW": "汽車科技" } },
    ],
  },
  {
    school: "itw-berlin",
    page: 21,
    city: { vi: "Berlin, CHLB Đức", en: "Berlin, Germany", de: "Berlin, Deutschland", ja: "ドイツ連邦共和国ベルリン", ko: "독일 연방공화국 베를린", "zh-TW": "德意志聯邦共和國柏林" },
    note: "Nội dung hợp tác ITW Berlin nêu trong hồ sơ (tr.21). Đây là chương trình liên kết, chưa có mã ngành Việt Nam – cần ITW Berlin và trường thành viên xác nhận chi tiết chương trình trước khi công bố.",
    fields: [
      { slug: "itw-dao-tao-tieng-duc", category: "ngon-ngu", title: { vi: "Đào tạo tiếng Đức chuẩn quốc tế", en: "German language training to international standards", de: "Deutschunterricht nach internationalem Standard", ja: "国際水準のドイツ語教育", ko: "국제 수준의 독일어 교육", "zh-TW": "國際標準德語教學" } },
      { slug: "itw-chuyen-giao-chuong-trinh-nghe", category: "ky-thuat-cong-nghiep", title: { vi: "Chuyển giao chương trình đào tạo nghề chuẩn Đức", en: "Transfer of German-standard vocational programmes", de: "Transfer von Ausbildungsprogrammen nach deutschem Standard", ja: "ドイツ基準の職業教育課程の移転", ko: "독일 기준 직업교육 과정 이전", "zh-TW": "德國標準職業訓練課程移轉" } },
    ],
  },
];
