import type { L10nMap } from "@/lib/i18n/config";

/**
 * NIBELC Group — mạng lưới đối tác quốc tế.
 *
 * Nguồn: danh sách tập đoàn gửi ngày 11/09/2026, chép nguyên tên doanh nghiệp
 * như trong danh sách; chỉ chuẩn lại chữ hoa ("HUngary-Meat", "Michos GLASS",
 * "Motor Oil (HELLAS S.A.)"). Đây là đối tác
 * trong mạng lưới của NIBELC — đối tác chiến lược của Việt Đức Group — chứ không
 * phải hợp đồng trực tiếp của Việt Đức; trang nào hiện danh sách này phải nói
 * rõ điều đó.
 *
 * Danh sách gửi đến có hai bản cho Nhật Bản; theo bản sau: Chiyoda Singapore và
 * Takada Industries chuyển sang Singapore, thêm Mitsubishi Construction.
 *
 * Mọi con số trên trang (bao nhiêu đối tác, bao nhiêu nước) đếm từ chính danh
 * sách này, không gõ tay — thêm một tên là con số tự đổi theo.
 */

export type QuocGia = {
  /** Mã ISO 3166-1, cũng là khoá chọn lá cờ. */
  ma: "GR" | "DE" | "AT" | "HU" | "RO" | "PL" | "JP" | "SG" | "MY" | "IN" | "QA" | "AE";
  ten: L10nMap;
  /** Kinh độ, vĩ độ của thủ đô (Dubai với UAE) — chỗ đặt chấm trên bản đồ. */
  toaDo: [number, number];
  doiTac: string[];
};

export type KhuVuc = {
  key: "chau-au" | "chau-a" | "trung-dong";
  ten: L10nMap;
  quocGia: QuocGia[];
};

export const KHU_VUC: KhuVuc[] = [
  {
    key: "chau-au",
    ten: { vi: "Châu Âu", en: "Europe", de: "Europa", ja: "ヨーロッパ", ko: "유럽", "zh-TW": "歐洲" },
    quocGia: [
      {
        ma: "GR",
        ten: { vi: "Hy Lạp", en: "Greece", de: "Griechenland", ja: "ギリシャ", ko: "그리스", "zh-TW": "希臘" },
        toaDo: [23.7, 38.0],
        doiTac: [
          "Hellenic Hypermarkets Sklavenitis S.A.",
          "Baker Master A.B.E.E",
          "DEAS S.A.",
          "Agricultural Poultry Cooperative Pindos (APSI PINDOS)",
          "National Union of Agricultural Cooperatives of Greece (ETHEAS)",
          "EKME",
          "Royal Hotel and Suites",
          "Hotel Akti Ouranoupoli Beach Resort",
          "Halkidiki Hotel Association",
          "Vamvalis S.A.",
          "ENOSI AGRINIOU",
          "Agrifreda S.A.",
          "Isigonis Group",
          "Frigo Stahl S.A.",
          "Oneiro Kykladon S.A.",
          "Royal Hotel PC",
          "PPC Group",
          "Motor Oil (Hellas) S.A.",
          "iGlass S.A.",
          "Michos Glass",
          "Combotech",
          "Septona S.A.",
        ],
      },
      {
        ma: "DE",
        ten: { vi: "CHLB Đức", en: "Germany", de: "Deutschland", ja: "ドイツ", ko: "독일", "zh-TW": "德國" },
        toaDo: [13.4, 52.5],
        doiTac: ["Tönnies Group", "Petrotec", "M+W Group"],
      },
      {
        ma: "AT",
        ten: { vi: "Áo", en: "Austria", de: "Österreich", ja: "オーストリア", ko: "오스트리아", "zh-TW": "奧地利" },
        toaDo: [16.4, 48.2],
        doiTac: [
          "Kainz & Mayer Marchfeldtomaten",
          "K. Kasehs Qualitätsgemüse GmbH",
          "Gartenbau Wallner GmbH",
          "Gartenbau Mayer GmbH",
          "Perlinger Gemüse GmbH",
          "Mazzucato GmbH & Co KG",
          "Gemüsehof Marchfeld GmbH",
          "Schielleitner Beerengarten GmbH",
          "Maximilian Stelzer",
        ],
      },
      {
        ma: "HU",
        ten: { vi: "Hungary", en: "Hungary", de: "Ungarn", ja: "ハンガリー", ko: "헝가리", "zh-TW": "匈牙利" },
        toaDo: [19.0, 47.5],
        doiTac: [
          "ÁmIa Kft",
          "Karsol Kft",
          "Jonaco Kft",
          "Mangia Kft",
          "Komplet Kft",
          "Agricolae Kft",
          "MB casing Kft",
          "Bio-Fungi Kft",
          "Orha Muvek Kft",
          "Breeze Lake Zrt",
          "Varadi Metal Kft",
          "Gábor Varadi Kft",
          "Farm Tojás Kft",
          "McDonald's Kft",
          "Nibelc Property Kft",
          "Samsung Hungary",
          "Glabál-Plastic Kft",
          "Hungary-Meat Kft",
          "Höplusz Rendszer Kft",
          "Haowei Tasty Food Kft",
          "Chimpex Hungária Kft",
          "Dél-Borsodi Agrár Kft",
          "Villeroy & Boch Magyarország Kft",
          "Costes Downtown Kft",
          "Arany Kaviár Restaurant",
        ],
      },
      {
        ma: "RO",
        ten: { vi: "Romania", en: "Romania", de: "Rumänien", ja: "ルーマニア", ko: "루마니아", "zh-TW": "羅馬尼亞" },
        toaDo: [26.1, 44.4],
        doiTac: ["Sicor Srl", "Donau Casings Srl", "Drugarin Srl", "Anmian Srl"],
      },
      {
        ma: "PL",
        ten: { vi: "Ba Lan", en: "Poland", de: "Polen", ja: "ポーランド", ko: "폴란드", "zh-TW": "波蘭" },
        toaDo: [21.0, 52.2],
        doiTac: ["Hogmax"],
      },
    ],
  },
  {
    key: "chau-a",
    ten: { vi: "Châu Á", en: "Asia", de: "Asien", ja: "アジア", ko: "아시아", "zh-TW": "亞洲" },
    quocGia: [
      {
        ma: "JP",
        ten: { vi: "Nhật Bản", en: "Japan", de: "Japan", ja: "日本", ko: "일본", "zh-TW": "日本" },
        toaDo: [139.7, 35.7],
        doiTac: [
          "Osaka Saiseiki Company Ltd",
          "Hazama Corporation",
          "Kajima Corporation",
          "Kumagai Gumi Co., Ltd",
          "Taisei Corporation",
          "Obayashi Corporation Co., Ltd",
          "Rinkai Construction Co., Ltd",
          "Sankyu (S) Pte Ltd",
          "Toyo Construction Co., Ltd",
          "Saeki Kensetsu Kogyo Co., Ltd",
          "Mitsui Construction Co., Ltd",
          "Cojaal – Haneda",
          "Chiyoda Chemical Engineering & Construction Co., Ltd",
          "Miyama Developments Inc",
          "TH Corporation Guam",
          "Mitsubishi Construction Co., Ltd",
        ],
      },
      {
        ma: "SG",
        ten: { vi: "Singapore", en: "Singapore", de: "Singapur", ja: "シンガポール", ko: "싱가포르", "zh-TW": "新加坡" },
        toaDo: [103.8, 1.35],
        doiTac: ["Chiyoda Singapore (Pte) Ltd", "Takada Industries"],
      },
      {
        ma: "MY",
        ten: { vi: "Malaysia", en: "Malaysia", de: "Malaysia", ja: "マレーシア", ko: "말레이시아", "zh-TW": "馬來西亞" },
        toaDo: [101.7, 3.1],
        doiTac: ["Petronas", "Penang Development Corporation", "Synerlitz"],
      },
      {
        ma: "IN",
        ten: { vi: "Ấn Độ", en: "India", de: "Indien", ja: "インド", ko: "인도", "zh-TW": "印度" },
        toaDo: [77.2, 28.6],
        doiTac: ["Sunshine Group", "Bellas Group", "Pentagon"],
      },
    ],
  },
  {
    key: "trung-dong",
    ten: { vi: "Trung Đông", en: "Middle East", de: "Naher Osten", ja: "中東", ko: "중동", "zh-TW": "中東" },
    quocGia: [
      {
        ma: "QA",
        ten: { vi: "Qatar", en: "Qatar", de: "Katar", ja: "カタール", ko: "카타르", "zh-TW": "卡達" },
        toaDo: [51.5, 25.3],
        doiTac: ["Qatar Airways", "Arabian MEP", "Redco International"],
      },
      {
        ma: "AE",
        ten: { vi: "UAE", en: "UAE", de: "VAE", ja: "アラブ首長国連邦", ko: "아랍에미리트", "zh-TW": "阿拉伯聯合大公國" },
        toaDo: [55.3, 25.2],
        doiTac: ["Dodsal Group", "Spinneys Dubai", "Mowasalat", "Fathima Group"],
      },
    ],
  },
];

/** Việt Nam — tâm của bản đồ, nơi mọi đường nối xuất phát (Hà Nội). */
export const VIET_NAM: [number, number] = [105.8, 21.0];

export type NhomChienLuoc = {
  key: "xay-dung" | "nang-luong" | "san-xuat" | "hang-khong";
  ten: L10nMap;
  ten_dn: string[];
};

/** Nhóm đối tác chiến lược nổi bật — theo đúng bốn nhóm trong danh sách tập đoàn gửi. */
export const NHOM_CHIEN_LUOC: NhomChienLuoc[] = [
  {
    key: "xay-dung",
    ten: { vi: "Xây dựng & hạ tầng", en: "Construction & infrastructure", de: "Bau & Infrastruktur", ja: "建設・インフラ", ko: "건설·인프라", "zh-TW": "營建與基礎建設" },
    ten_dn: ["Kajima", "Taisei", "Obayashi", "Hazama", "Mitsubishi Construction"],
  },
  {
    key: "nang-luong",
    ten: { vi: "Năng lượng – dầu khí", en: "Energy – oil & gas", de: "Energie – Öl & Gas", ja: "エネルギー・石油ガス", ko: "에너지·석유가스", "zh-TW": "能源與油氣" },
    ten_dn: ["Petronas", "Motor Oil", "PPC", "GS E&C"],
  },
  {
    key: "san-xuat",
    ten: { vi: "Sản xuất & công nghiệp", en: "Manufacturing & industry", de: "Produktion & Industrie", ja: "製造・産業", ko: "제조·산업", "zh-TW": "製造與工業" },
    ten_dn: ["Tönnies", "Samsung", "Villeroy & Boch", "Chiyoda"],
  },
  {
    key: "hang-khong",
    ten: { vi: "Hàng không – dịch vụ", en: "Aviation – services", de: "Luftfahrt & Dienstleistungen", ja: "航空・サービス", ko: "항공·서비스", "zh-TW": "航空與服務" },
    ten_dn: ["Qatar Airways", "McDonald's", "Spinneys Dubai"],
  },
];

/** Số đếm dùng cho dải số liệu — đếm từ danh sách, không gõ tay. */
export function demMangLuoi() {
  const quocGia = KHU_VUC.flatMap((k) => k.quocGia);
  return {
    doiTac: quocGia.reduce((s, q) => s + q.doiTac.length, 0),
    quocGia: quocGia.length,
    khuVuc: KHU_VUC.length,
  };
}
