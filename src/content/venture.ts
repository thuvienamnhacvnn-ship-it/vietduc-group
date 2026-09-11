import type { Locale } from "@/lib/i18n/config";
import type {
  Localised,
  LocalisedList,
  VentureFact,
  VenturePartner,
  VentureProject,
  VentureService,
} from "./venture-types";

export type * from "./venture-types";

/**
 * The hospitality arm's content, transcribed from the project files.
 *
 * Rules this file follows, without exception:
 *
 *  - Every number is quoted from a document, in the units that document used.
 *    Nothing is rounded, converted or averaged.
 *  - Where two documents disagree, both are shown with their dates rather than
 *    one being silently preferred. See the Toki notes below.
 *  - Organisations are described with the role their own paperwork gives them.
 *  - Personal data in the files - the director's ID number, date of birth and
 *    home address, and the shareholder register with each holding - is NOT in
 *    this file and must not be put on a public page.
 *  - Revenue, occupancy and partner-fee projections from the investor deck are
 *    likewise investor material and stay out. The figures that appear in the
 *    official proposal to the province (total investment, projected turnover,
 *    budget contribution) are in, because that document is the basis of a
 *    public administrative decision.
 *
 * Long detail is written in Vietnamese only. `t()` falls back to Vietnamese, so
 * a German or English reader sees the real figure rather than an empty slot;
 * headings, labels and summaries are translated.
 */

const VI_ONLY = (vi: string): Localised => ({ vi });
const LIST_VI = (vi: string[]): LocalisedList => ({ vi });

export const VENTURE_HERO = {
  src: "/media/hospitality/bo-trach-exterior.webp",
  /** The upright frame used on a phone, where the wide one crops to a band. */
  mobileSrc: "/media/hero/venture-valley-portrait.webp",
  /**
   * The banner film and the frame it opens on. The film lives on the group's
   * own server rather than in the deployment: it is three megabytes and changes
   * on its own schedule. See docs/DATA-NOTES.md section 20.
   */
  mobileVideo: "https://itw-berlin.de/vdg-media/vdg-venture.mp4",
  mobilePoster: "/media/hero/vdg-venture-video-poster.webp",
  caption: {
    vi: "Phối cảnh dự án tại Bố Trạch, Quảng Bình – TOAM Studio, 10/2025",
    de: "Visualisierung des Projekts in Bo Trach, Quang Binh – TOAM Studio, 10/2025",
    en: "Rendering of the Bo Trach project, Quang Binh – TOAM Studio, 10/2025",
    ja: "クアンビン省ボチャックの計画パース — TOAM Studio、2025年10月",
    ko: "꽝빈성 보짜익 프로젝트 조감도 — TOAM Studio, 2025년 10월",
    "zh-TW": "廣平省布澤專案透視圖 — TOAM Studio，2025 年 10 月",
  },
};

export const VENTURE_INTRO: {
  title: Localised;
  /** The title broken where it should break, so the banner can animate each
   *  line from a different side. Line one arrives from the right, line two from
   *  the left; keeping the split in the content rather than in the component
   *  means a translator controls where the break falls. */
  titleLines: LocalisedList;
  lead: Localised;
  body: LocalisedList;
} = {
  title: {
    vi: "Đầu tư khách sạn, khu nghỉ dưỡng và du lịch",
    de: "Investition in Hotels, Resorts und Tourismus",
    en: "Hotel, resort and travel investment",
    ja: "ホテル・リゾート・観光への投資",
    ko: "호텔·리조트·관광 투자",
    "zh-TW": "飯店、度假村與旅遊投資",
  },
  titleLines: {
    vi: ["Đầu tư khách sạn, khu", "nghỉ dưỡng và du lịch"],
    de: ["Investition in Hotels,", "Resorts und Tourismus"],
    en: ["Hotel, resort and", "travel investment"],
  },
  lead: {
    vi: "Ba dự án lưu trú ven biển miền Trung, từ hồ sơ chủ trương đầu tư đến thiết kế cơ sở, làm cùng đơn vị quy hoạch, thiết kế và vận hành chuyên nghiệp ngay từ bước đầu.",
    de: "Drei Beherbergungsprojekte an der zentralvietnamesischen Küste – vom Investitionsantrag bis zur Vorplanung, von Anfang an mit spezialisierten Planungs- und Betriebspartnern.",
    en: "Three coastal hospitality projects in central Vietnam, from investment approval to basic design, worked on with specialist planning, design and operating partners from the start.",
    ja: "ベトナム中部沿岸の宿泊プロジェクト三件。投資方針の承認申請から基本設計まで、計画・設計・運営の専門会社と初期段階から組んで進めています。",
    ko: "베트남 중부 해안의 숙박 프로젝트 세 건. 투자 승인 신청부터 기본 설계까지, 계획·설계·운영 전문사와 초기 단계부터 함께 진행합니다.",
    "zh-TW": "越南中部沿海的三項住宿專案，從投資核准文件到基本設計，自始即與專業的規劃、設計與營運單位合作。",
  },
  body: {
    vi: [
      "Mỗi dự án bắt đầu từ một khu đất cụ thể và một mô hình vận hành cụ thể. Quy mô, cơ cấu sử dụng đất, hạng mục công trình và tiến độ đều được xác định trong hồ sơ trình cơ quan nhà nước trước khi triển khai.",
      "Toàn bộ số liệu trên trang này trích nguyên từ hồ sơ dự án, kèm tên văn bản và ngày tháng. Mục nào tài liệu chưa nêu thì trang không nêu.",
    ],
    de: [
      "Jedes Projekt beginnt bei einem konkreten Grundstück und einem konkreten Betriebsmodell. Größe, Flächenaufteilung, Bauteile und Zeitplan stehen in den Behördenunterlagen fest, bevor gebaut wird.",
      "Alle Zahlen hier sind unverändert aus den Projektunterlagen übernommen, mit Dokumentname und Datum. Was dort nicht steht, steht auch hier nicht.",
    ],
    en: [
      "Every project starts from a particular site and a particular operating model. Scale, land use, works and programme are all fixed in the files submitted to the authorities before anything is built.",
      "Every figure on this page is quoted from those files, with the document name and date. Where a document is silent, so is this page.",
    ],
  },
};

export const VENTURE_SERVICES: VentureService[] = [
  {
    key: "boutique-hotel",
    name: { vi: "Khách sạn nghỉ dưỡng", de: "Resorthotels", en: "Resort hotels", ja: "リゾートホテル", ko: "리조트 호텔", "zh-TW": "度假飯店" },
    lead: {
      vi: "Cơ sở lưu trú ven biển, thiết kế riêng theo bối cảnh và văn hoá địa phương thay vì theo mẫu chuỗi.",
      de: "Küstenhäuser, die aus Ort und lokaler Kultur heraus entworfen werden statt nach Kettenschema.",
      en: "Coastal properties designed around their setting and local culture rather than to a chain template.",
      ja: "海辺の宿泊施設。チェーンの型どおりではなく、その土地の風景と文化に合わせて設計します。",
      ko: "해안의 숙박 시설. 체인의 정형이 아니라 그 지역의 풍경과 문화에 맞추어 설계합니다.",
      "zh-TW": "濱海住宿設施，依當地環境與文化量身設計，而非套用連鎖品牌的制式樣板。",
    },
    points: {
      vi: [
        "Thiết kế theo ba giá trị: tối giản, bản địa và nghệ thuật",
        "Đơn vị vận hành tham gia từ bước thiết kế, không chỉ sau khi bàn giao",
        "Quy trình vận hành, nhân sự và sản phẩm dịch vụ được xây dựng trước ngày mở cửa",
      ],
      de: [
        "Entwurf entlang dreier Werte: Reduktion, lokale Prägung, Kunst",
        "Der Betreiber ist ab dem Entwurf beteiligt, nicht erst nach der Übergabe",
        "Betriebsabläufe, Personal und Leistungsangebot stehen vor der Eröffnung",
      ],
      en: [
        "Designed around three values: restraint, local character and art",
        "The operator joins at design stage, not after handover",
        "Operating procedures, staffing and the service offer are in place before opening day",
      ],
    },
    image: "/media/hospitality/bo-trach-exterior.webp",
  },
  {
    key: "resort",
    name: { vi: "Khu nghỉ dưỡng ven biển", de: "Küstenresorts", en: "Coastal resorts", ja: "海辺のリゾート", ko: "해안 리조트", "zh-TW": "濱海度假村" },
    lead: {
      vi: "Quần thể villa thấp tầng trên đất ven biển, giữ tỷ lệ cây xanh và mặt nước cao trong cơ cấu sử dụng đất.",
      de: "Niedrige Villenanlagen an der Küste mit hohem Anteil an Grün- und Wasserflächen.",
      en: "Low-rise villa groups on coastal land, holding a high share of planted and water surface.",
      ja: "海沿いの敷地に低層ヴィラを群として配し、土地利用のうち緑地と水面の割合を高く保ちます。",
      ko: "해안 부지에 저층 빌라를 무리 지어 배치하고, 토지 이용에서 녹지와 수면의 비율을 높게 유지합니다.",
      "zh-TW": "於濱海基地配置低層別墅群，在土地使用中維持較高的綠地與水域比例。",
    },
    points: {
      vi: [
        "Quy hoạch tổng mặt bằng và phân khu chức năng lập trước khi thiết kế chi tiết",
        "Mật độ xây dựng giữ dưới chỉ tiêu quy hoạch được duyệt",
        "Khối dịch vụ (nhà hàng, spa, bar biển) tách khỏi khu lưu trú",
      ],
      de: [
        "Lageplan und Funktionszonierung entstehen vor der Detailplanung",
        "Die Bebauungsdichte bleibt unter dem genehmigten Planwert",
        "Gastronomie, Spa und Strandbar liegen getrennt vom Wohnbereich",
      ],
      en: [
        "Site layout and zoning are set before detailed design",
        "Built density is kept below the approved planning figure",
        "Restaurant, spa and beach bar sit apart from the guest villas",
      ],
    },
    // Phối cảnh Long Beach Resort — khu nghỉ dưỡng ven biển thật trong danh mục, không mượn ảnh dự án 1.
    image: "/media/hospitality/long-beach/long-beach-04.webp",
  },
  {
    key: "travel",
    name: { vi: "Du lịch – Lữ hành", de: "Reisen & Touren", en: "Travel & tours", ja: "旅行・ツアー", ko: "여행·투어", "zh-TW": "旅遊與旅行社業務" },
    lead: {
      vi: "Dịch vụ du lịch gắn với các cơ sở lưu trú của nhóm.",
      de: "Reisedienstleistungen im Verbund mit den eigenen Häusern.",
      en: "Travel services tied to the group's own properties.",
      ja: "自社の宿泊施設と結びついた旅行サービスです。",
      ko: "자사 숙박 시설과 연계한 여행 서비스입니다.",
      "zh-TW": "與集團自有住宿設施結合的旅遊服務。",
    },
    points: {
      vi: [
        "Đón đoàn khách trong nước và quốc tế tại khách sạn Golden Dragon (Hoàng Long), Ninh Bình: lưu trú, ăn uống, tiệc đoàn và tiệc gala — đã phục vụ đoàn của hãng lữ hành H.I.S (Nhật Bản), đoàn công đoàn và sự kiện của VPBank.",
        "Điểm đến quanh khách sạn: Tràng An, chùa Bái Đính, Hang Múa, đầm Vân Long, Nhà thờ đá Phát Diệm, đền Thái Vi.",
        "Dự án Toki đăng ký thêm các mã ngành lưu trú, ăn uống, thể thao và vui chơi giải trí.",
      ],
      de: [
        "Empfang in- und ausländischer Reisegruppen im Hotel Golden Dragon (Hoang Long), Ninh Binh: Unterkunft, Verpflegung, Gruppen- und Galaabende — unter anderem für Gruppen des japanischen Reiseveranstalters H.I.S und eine Veranstaltung der VPBank.",
        "Ziele rund um das Hotel: Trang An, Pagode Bai Dinh, Hang Mua, Lagune Van Long, Steinkathedrale Phat Diem, Tempel Thai Vi.",
        "Das Toki-Projekt registriert zusätzlich Beherbergung, Gastronomie, Sport und Freizeit.",
      ],
      en: [
        "Hosting domestic and international tour groups at the Golden Dragon (Hoang Long) hotel in Ninh Binh: rooms, meals, group dinners and gala evenings — including groups from the Japanese tour operator H.I.S and an event for VPBank.",
        "Destinations around the hotel: Trang An, Bai Dinh pagoda, Hang Mua, Van Long lagoon, Phat Diem stone cathedral and Thai Vi temple.",
        "The Toki project also registers accommodation, food, sport and leisure services.",
      ],
    },
    image: "/media/hospitality/golden-dragon/doan-khach-nha-hang.webp",
  },
];

export const VENTURE_PARTNERS: VenturePartner[] = [
  {
    name: "TOKI",
    role: {
      vi: "Tư vấn và quản lý vận hành",
      de: "Beratung und Betriebsführung",
      en: "Advisory and operations management",
      ja: "運営コンサルティングと管理",
      ko: "운영 컨설팅 및 관리",
      "zh-TW": "營運顧問與管理",
    },
    note: {
      vi: "Mỗi cơ sở của TOKI được thiết kế và vận hành theo cùng một tinh thần: tối giản, bản địa và nghệ thuật.",
      de: "Jedes Haus von TOKI folgt derselben Haltung: Reduktion, lokale Prägung, Kunst.",
      en: "Every TOKI property is designed and run to the same idea: restraint, local character and art.",
      ja: "TOKI の各施設は同じ精神で設計・運営されています — 簡素であること、土地に根ざすこと、そして芸術性。",
      ko: "TOKI의 모든 시설은 같은 정신으로 설계하고 운영합니다 — 간결함, 지역성, 그리고 예술성.",
      "zh-TW": "TOKI 旗下每一處據點，皆依同一精神設計與經營：簡約、在地、藝術。",
    },
  },
  {
    name: "TOAM Studio",
    role: {
      vi: "Tư vấn thiết kế và thi công",
      de: "Planung und Ausführung",
      en: "Design and build",
      ja: "設計・施工",
      ko: "설계·시공",
      "zh-TW": "設計與施工",
    },
    note: {
      vi: "15 năm kinh nghiệm triển khai các công trình nhà ở và nghỉ dưỡng.",
      de: "15 Jahre Erfahrung mit Wohn- und Resortbauten.",
      en: "Fifteen years of work on housing and resort projects.",
      ja: "住宅およびリゾート施設の実績 15 年。",
      ko: "주거 및 리조트 시설 시공 경력 15년.",
      "zh-TW": "十五年住宅與度假設施的實作經驗。",
    },
  },
  {
    name: "Công ty CP Tư vấn Kiến trúc và Đầu tư Xây dựng Hà Thành",
    role: {
      vi: "Tư vấn thiết kế cơ sở – Long Beach Resort",
      de: "Vorplanung – Long Beach Resort",
      en: "Basic design – Long Beach Resort",
      ja: "基本設計 — Long Beach Resort",
      ko: "기본 설계 — Long Beach Resort",
      "zh-TW": "基本設計 — Long Beach Resort",
    },
    note: {
      vi: "Chủ trì thiết kế: KTS. Phạm Quốc Anh. Giám đốc: KTS. Lê Xuân Trường.",
      de: "Planungsleitung: Arch. Pham Quoc Anh. Geschäftsführer: Arch. Le Xuan Truong.",
      en: "Design lead: architect Pham Quoc Anh. Director: architect Le Xuan Truong.",
      ja: "設計統括：建築家 Phạm Quốc Anh。代表：建築家 Lê Xuân Trường。",
      ko: "설계 총괄: 건축가 Phạm Quốc Anh. 대표: 건축가 Lê Xuân Trường.",
      "zh-TW": "設計主持：建築師 Phạm Quốc Anh。負責人：建築師 Lê Xuân Trường。",
    },
  },
];

export const VENTURE_PROCESS: { title: Localised; steps: { name: Localised; detail: Localised }[] } = {
  title: {
    vi: "Từ bản vẽ đến ngày mở cửa",
    de: "Vom Entwurf bis zur Eröffnung",
    en: "From drawing to opening day",
    ja: "図面から開業の日まで",
    ko: "도면에서 개관하는 날까지",
    "zh-TW": "從圖面到開幕日",
  },
  steps: [
    {
      name: { vi: "Thiết kế", de: "Entwurf", en: "Design", ja: "設計", ko: "설계", "zh-TW": "設計" },
      detail: {
        vi: "Định hướng thiết kế, quy hoạch sơ bộ, mặt bằng nội thất, phối cảnh 3D kiến trúc và sân vườn, rồi tới thiết kế kiến trúc, kết cấu, M&E và kỹ thuật nội thất.",
        de: "Entwurfsrichtung, Vorplanung, Innenraumlayout, 3D-Visualisierung von Architektur und Garten, danach Architektur-, Tragwerks-, TGA- und Innenausbauplanung.",
        en: "Design direction, outline planning, interior layouts, 3D views of architecture and garden, then architectural, structural, M&E and interior technical design.",
        ja: "デザインの方向づけ、概略計画、内装の平面計画、建築と庭園の 3D パース。そののち建築・構造・設備(M&E)・内装技術の設計へ進みます。",
        ko: "디자인 방향 설정, 개략 계획, 실내 평면, 건축과 정원의 3D 투시도. 이어서 건축·구조·설비(M&E)·실내 기술 설계로 넘어갑니다.",
        "zh-TW": "設計方向、初步規劃、室內平面、建築與庭園 3D 透視，接續進行建築、結構、機電（M&E）與室內技術設計。",
      },
    },
    {
      name: { vi: "Trước vận hành", de: "Vor der Eröffnung", en: "Pre-opening", ja: "開業準備", ko: "개관 준비", "zh-TW": "開幕前準備" },
      detail: {
        vi: "Xây dựng quy trình vận hành cho từng bộ phận, hệ thống trang thiết bị, tuyển dụng và đào tạo nhân sự, thiết kế sản phẩm dịch vụ và kế hoạch truyền thông trước ngày mở cửa.",
        de: "Betriebsabläufe je Abteilung, Ausstattung, Rekrutierung und Schulung, Gestaltung des Leistungsangebots und Kommunikationsplanung vor der Eröffnung.",
        en: "Operating procedures per department, equipment, hiring and training, service design and the communications plan before opening.",
        ja: "部門ごとの運営手順の整備、設備システム、人材の採用と教育、サービス商品の設計、そして開業前の広報計画。",
        ko: "부서별 운영 절차 수립, 설비 시스템, 인력 채용과 교육, 서비스 상품 설계, 그리고 개관 전 홍보 계획.",
        "zh-TW": "建立各部門作業流程、設備系統、人員招募與訓練、服務商品設計，以及開幕前的宣傳計畫。",
      },
    },
    {
      name: { vi: "Sau vận hành", de: "Im Betrieb", en: "In operation", ja: "開業後の運営", ko: "개관 후 운영", "zh-TW": "營運期間" },
      detail: {
        vi: "Quản lý chất lượng trải nghiệm, cơ sở vật chất và nhân sự; theo dõi thu chi và lập báo cáo kết quả kinh doanh theo quý và theo năm.",
        de: "Steuerung von Gästeerlebnis, Gebäude und Personal; Einnahmen- und Ausgabenkontrolle sowie Quartals- und Jahresberichte.",
        en: "Managing guest experience, the building and the team; tracking income and cost, with quarterly and annual reporting.",
        ja: "宿泊体験の質、施設、人員の管理。収支を把握し、四半期および年度の業績報告を作成します。",
        ko: "고객 경험의 질과 시설, 인력 관리. 수입과 지출을 관리하고 분기·연간 실적 보고서를 작성합니다.",
        "zh-TW": "管理住宿體驗品質、硬體設施與人力；追蹤收支，並編製季度與年度營運報告。",
      },
    },
  ],
};

const FACT_LABELS = {
  investor: { vi: "Chủ đầu tư", de: "Investor", en: "Investor", ja: "事業主", ko: "사업주", "zh-TW": "投資方" },
  land: { vi: "Diện tích khu đất", de: "Grundstücksfläche", en: "Site area", ja: "敷地面積", ko: "대지 면적", "zh-TW": "基地面積" },
  scale: { vi: "Quy mô", de: "Größe", en: "Scale", ja: "規模", ko: "규모", "zh-TW": "規模" },
  capital: { vi: "Tổng vốn đầu tư", de: "Investitionsvolumen", en: "Total investment", ja: "総投資額", ko: "총 투자액", "zh-TW": "投資總額" },
  density: { vi: "Mật độ xây dựng", de: "Bebauungsdichte", en: "Built density", ja: "建蔽率", ko: "건폐율", "zh-TW": "建蔽率" },
  duration: { vi: "Thời hạn hoạt động", de: "Laufzeit", en: "Operating term", ja: "事業期間", ko: "사업 기간", "zh-TW": "營運期限" },
  approval: { vi: "Chấp thuận chủ trương đầu tư", de: "Investitionsgenehmigung", en: "Investment approval", ja: "投資方針の承認", ko: "투자 방침 승인", "zh-TW": "投資方針核准" },
  built: { vi: "Diện tích xây dựng", de: "Bebaute Fläche", en: "Built area", ja: "建築面積", ko: "건축 면적", "zh-TW": "建築面積" },
  green: { vi: "Cây xanh, mặt nước", de: "Grün- und Wasserfläche", en: "Planting and water", ja: "緑地・水面", ko: "녹지·수면", "zh-TW": "綠地與水域" },
  floor: { vi: "Tổng diện tích sàn", de: "Geschossfläche", en: "Gross floor area", ja: "延床面積", ko: "연면적", "zh-TW": "總樓地板面積" },
  designer: { vi: "Đơn vị tư vấn thiết kế", de: "Planungsbüro", en: "Design consultant", ja: "設計コンサルタント", ko: "설계 컨설턴트", "zh-TW": "設計顧問單位" },
  stage: { vi: "Giai đoạn hồ sơ", de: "Planungsstand", en: "Document stage", ja: "書類の段階", ko: "서류 단계", "zh-TW": "文件階段" },
} satisfies Record<string, Localised>;

const fact = (label: Localised, value: Localised): VentureFact => ({ label, value });

export const VENTURE_PROJECTS: VentureProject[] = [
  /* ------------------------------------------------------------------ Toki */
  {
    slug: "khach-san-nghi-duong-toki",
    status: "published",
    order: 1,
    name: {
      vi: "Khu nghỉ dưỡng cao cấp Toki Boutique Phong Nha",
      de: "Luxusresort Toki Boutique Phong Nha",
      en: "Toki Boutique Phong Nha luxury resort",
      ja: "高級リゾート Toki Boutique フォンニャ",
      ko: "고급 리조트 Toki Boutique 퐁냐",
      "zh-TW": "Toki Boutique 峰牙高級度假村",
    },
    kind: {
      vi: "Khách sạn nghỉ dưỡng tiêu chuẩn 3 sao",
      de: "Drei-Sterne-Resorthotel",
      en: "Three-star resort hotel",
      ja: "3 つ星基準のリゾートホテル",
      ko: "3성급 기준 리조트 호텔",
      "zh-TW": "三星級度假飯店",
    },
    location: {
      vi: "Xã Hoàn Lão, tỉnh Quảng Trị",
      de: "Gemeinde Hoan Lao, Provinz Quang Tri",
      en: "Hoan Lao commune, Quang Tri province",
      ja: "クアンチ省ホアンラオ社",
      ko: "꽝찌성 호안라오 사",
      "zh-TW": "廣治省完老社",
    },
    stage: {
      vi: "Đã được chấp thuận chủ trương đầu tư",
      de: "Investitionsgenehmigung erteilt",
      en: "Investment policy approved",
      ja: "投資方針の承認済み",
      ko: "투자 방침 승인 완료",
      "zh-TW": "投資方針已獲核准",
    },
    lead: {
      vi: "Khách sạn nghỉ dưỡng 200 phòng trên khu đất 16.244,9 m² sát đường ven biển, tổng vốn đầu tư 95 tỷ đồng, đã được UBND tỉnh Quảng Trị chấp thuận chủ trương đầu tư.",
      de: "Ein Resorthotel mit 200 Zimmern auf 16.244,9 m² an der Küstenstraße, Investitionsvolumen 95 Mrd. VND, vom Volkskomitee der Provinz Quang Tri genehmigt.",
      en: "A 200-room resort hotel on a 16,244.9 m² plot by the coastal road, VND 95 billion of investment, approved by the Quang Tri provincial people's committee.",
      ja: "海岸道路に面した 16,244.9 m² の敷地に建つ 200 室のリゾートホテル。総投資額 950 億ドン。クアンチ省人民委員会から投資方針の承認を得ています。",
      ko: "해안 도로에 면한 16,244.9 m² 부지에 들어서는 200실 규모 리조트 호텔. 총 투자액 950억 동. 꽝찌성 인민위원회의 투자 방침 승인을 받았습니다.",
      "zh-TW": "位於濱海道路旁、基地面積 16,244.9 平方公尺的 200 房度假飯店，投資總額 950 億越南盾，已獲廣治省人民委員會核准投資方針。",
    },
    body: {
      vi: [
        "Dự án nằm trong khu dịch vụ ven biển xã Hoàn Lão, trước sáp nhập là thôn 5, xã Trung Trạch, huyện Bố Trạch, tỉnh Quảng Bình. Khu đất hiện trạng là đất rừng sản xuất thuộc quản lý của UBND xã Trung Trạch, hình thức lựa chọn nhà đầu tư là đấu giá quyền sử dụng đất.",
        "UBND tỉnh Quảng Trị đã chấp thuận chủ trương đầu tư tại Quyết định số 3184/QĐ-UBND ngày 19/12/2025, trong đó giao Trung tâm phát triển quỹ đất tỉnh hoàn thành thủ tục đấu giá quyền sử dụng đất trong vòng 12 tháng kể từ ngày có quyết định.",
        "Nhà đầu tư đang lập Quy hoạch tổng mặt bằng tỷ lệ 1/500 và lấy ý kiến Sở Xây dựng, Sở Nông nghiệp và Môi trường tỉnh Quảng Trị cùng cộng đồng dân cư trong khu vực.",
      ],
    },
    facts: [
      fact(FACT_LABELS.investor, VI_ONLY("Công ty Cổ phần Khách sạn Du lịch Hoàng Long")),
      fact(FACT_LABELS.land, {
        vi: "16.244,9 m²",
        de: "16.244,9 m²",
        en: "16,244.9 m²",
        ja: "16,244.9 m²",
        ko: "16,244.9 m²",
        "zh-TW": "16,244.9 m²",
      }),
      fact(FACT_LABELS.scale, {
        vi: "200 phòng ngủ, tiêu chuẩn 3 sao",
        de: "200 Zimmer, Drei-Sterne-Standard",
        en: "200 rooms, three-star standard",
        ja: "客室 200 室、3 つ星基準",
        ko: "객실 200실, 3성급 기준",
        "zh-TW": "200 間客房，三星級標準",
      }),
      fact(FACT_LABELS.capital, {
        vi: "95.000.000.000 đồng",
        de: "95 Mrd. VND",
        en: "VND 95,000,000,000",
        ja: "950 億ドン",
        ko: "950억 동",
        "zh-TW": "950 億越南盾",
      }),
      fact(FACT_LABELS.density, { vi: "40,0%", de: "40,0 %", en: "40.0%", ja: "40.0%", ko: "40.0%", "zh-TW": "40.0%" }),
      fact(FACT_LABELS.duration, { vi: "50 năm", de: "50 Jahre", en: "50 years", ja: "50 年", ko: "50년", "zh-TW": "50 年" }),
      fact(FACT_LABELS.approval, VI_ONLY("Quyết định số 3184/QĐ-UBND ngày 19/12/2025, UBND tỉnh Quảng Trị")),
    ],
    blocks: [
      {
        kind: "grid",
        title: { vi: "Hạng mục xây dựng", de: "Bauteile", en: "Schedule of works", ja: "工事項目一覧", ko: "공사 항목", "zh-TW": "建設項目明細" },
        columns: [
          { vi: "Hạng mục", de: "Bauteil", en: "Item", ja: "項目", ko: "항목", "zh-TW": "項目" },
          { vi: "Diện tích", de: "Fläche", en: "Area", ja: "面積", ko: "면적", "zh-TW": "面積" },
          { vi: "Tầng cao", de: "Geschosse", en: "Storeys", ja: "階数", ko: "층수", "zh-TW": "樓層數" },
        ],
        rows: [
          [VI_ONLY("Khu nhà đón tiếp"), VI_ONLY("600 m² · 3,7%"), VI_ONLY("1")],
          [VI_ONLY("Khu khách sạn nghỉ dưỡng (200 phòng ngủ)"), VI_ONLY("2.500 m² · 15,4%"), VI_ONLY("5")],
          [VI_ONLY("Khu dịch vụ"), VI_ONLY("2.600 m² · 16,0%"), VI_ONLY("1")],
          [VI_ONLY("Khu hành chính"), VI_ONLY("800 m² · 4,9%"), VI_ONLY("1")],
          [VI_ONLY("Khu thể thao và giải trí ngoài trời"), VI_ONLY("500 m² · 3,1%"), VI_ONLY("–")],
          [
            VI_ONLY("Bãi đỗ xe, đường nội bộ, cổng, hàng rào, cây xanh và hạ tầng kỹ thuật"),
            VI_ONLY("9.244,9 m² · 56,9%"),
            VI_ONLY("–"),
          ],
          [VI_ONLY("Tổng cộng"), VI_ONLY("16.244,9 m² · 100%"), VI_ONLY("–")],
        ],
        note: VI_ONLY("Loại đất: thương mại dịch vụ (TMD). Thời hạn sử dụng đất: 50 năm."),
      },
      {
        kind: "steps",
        title: { vi: "Tiến độ thực hiện", de: "Zeitplan", en: "Programme", ja: "実施スケジュール", ko: "추진 일정", "zh-TW": "執行進度" },
        steps: [
          {
            when: VI_ONLY("Quý IV/2026"),
            what: VI_ONLY("Hoàn thành thủ tục đầu tư để được bàn giao mặt bằng, và khởi công công trình"),
          },
          { when: VI_ONLY("Quý I/2027"), what: VI_ONLY("Xây dựng các hạng mục công trình") },
          { when: VI_ONLY("Quý IV/2028"), what: VI_ONLY("Hoàn thành dự án, đưa vào sử dụng và hoạt động") },
        ],
      },
      {
        kind: "table",
        title: { vi: "Vốn đầu tư", de: "Finanzierung", en: "Investment", ja: "投資額", ko: "투자액", "zh-TW": "投資金額" },
        rows: [
          fact(VI_ONLY("Tổng vốn đầu tư"), VI_ONLY("95.000.000.000 đồng")),
          fact(VI_ONLY("Vốn góp của nhà đầu tư"), VI_ONLY("19.000.000.000 đồng – 20%")),
          fact(VI_ONLY("Vốn huy động"), VI_ONLY("76.000.000.000 đồng – 80%, vay ngân hàng")),
          fact(VI_ONLY("Tiến độ góp vốn"), VI_ONLY("Quý IV/2025: 19.000 triệu · Quý IV/2026: 25.000 triệu · Quý IV/2027: 26.000 triệu · Quý II/2028: 25.000 triệu")),
        ],
      },
      {
        kind: "table",
        title: { vi: "Nhu cầu lao động", de: "Personalbedarf", en: "Staffing", ja: "必要人員", ko: "필요 인력", "zh-TW": "人力需求" },
        rows: [
          fact(VI_ONLY("Tổng số"), VI_ONLY("khoảng 50 lao động")),
          fact(VI_ONLY("Giám đốc điều hành"), VI_ONLY("1 người")),
          fact(VI_ONLY("Phó giám đốc điều hành"), VI_ONLY("2 người")),
          fact(VI_ONLY("Lễ tân – kế toán"), VI_ONLY("10 người")),
          fact(VI_ONLY("Bộ phận nhà hàng"), VI_ONLY("15 người")),
          fact(VI_ONLY("Bảo vệ, tạp vụ, kỹ thuật"), VI_ONLY("22 người")),
        ],
      },
      {
        kind: "table",
        title: {
          vi: "Hiệu quả kinh tế – xã hội dự kiến",
          de: "Erwartete wirtschaftliche Wirkung",
          en: "Projected economic impact",
          ja: "見込まれる経済・社会効果",
          ko: "예상되는 경제·사회적 효과",
          "zh-TW": "預期的經濟與社會效益",
        },
        rows: [
          fact(VI_ONLY("Doanh thu"), VI_ONLY("28.000.000.000 đồng")),
          fact(VI_ONLY("Lợi nhuận"), VI_ONLY("2.820.000.000 đồng")),
          fact(
            VI_ONLY("Đóng góp ngân sách nhà nước hàng năm"),
            VI_ONLY("3.240.000.000 đồng (VAT, thuê đất, điện, rác…)"),
          ),
        ],
        note: VI_ONLY("Số liệu dự kiến trong hồ sơ đề xuất dự án gửi cơ quan nhà nước, không phải kết quả kinh doanh."),
      },
      {
        kind: "list",
        title: { vi: "Ranh giới khu đất", de: "Grundstücksgrenzen", en: "Site boundaries", ja: "敷地の境界", ko: "대지 경계", "zh-TW": "基地界線" },
        items: LIST_VI([
          "Phía Bắc giáp đường quy hoạch 25 m",
          "Phía Nam giáp quy hoạch đất thương mại dịch vụ",
          "Phía Đông giáp đường quy hoạch 27 m",
          "Phía Tây giáp quy hoạch đường ven biển",
        ]),
      },
      {
        kind: "list",
        title: {
          vi: "Mục tiêu hoạt động và mã ngành",
          de: "Geschäftszweck und Branchencodes",
          en: "Business objectives and industry codes",
          ja: "事業目的と業種コード",
          ko: "사업 목적과 업종 코드",
          "zh-TW": "營運目標與行業代碼",
        },
        items: LIST_VI([
          "Dịch vụ lưu trú ngắn ngày – 5510",
          "Nhà hàng và các dịch vụ ăn uống phục vụ lưu động – 5610",
          "Dịch vụ ăn uống khác – 5629",
          "Dịch vụ phục vụ đồ uống – 5630",
          "Hoạt động chiếu phim – 5914",
          "Dịch vụ tắm hơi, massage và các dịch vụ tăng cường sức khoẻ tương tự – 9610",
          "Hoạt động của các cơ sở thể thao – 9311",
          "Hoạt động vui chơi giải trí khác chưa được phân vào đâu – 9329",
        ]),
        note: VI_ONLY("Mã ngành cấp 4 theo hệ thống ngành kinh tế Việt Nam (VSIC)."),
      },
      {
        kind: "list",
        title: {
          vi: "Căn cứ quy hoạch và pháp lý",
          de: "Planungs- und Rechtsgrundlagen",
          en: "Planning and legal basis",
          ja: "計画上および法的な根拠",
          ko: "계획적·법적 근거",
          "zh-TW": "規劃與法律依據",
        },
        items: LIST_VI([
          "Quyết định số 3184/QĐ-UBND ngày 19/12/2025 của UBND tỉnh Quảng Trị – chấp thuận chủ trương đầu tư dự án",
          "Quyết định số 1015/QĐ-UBND ngày 04/4/2025 của UBND tỉnh Quảng Bình – phê duyệt Quy hoạch phân khu Khu vực phát triển đô thị xã Trung Trạch, huyện Bố Trạch, tỷ lệ 1/2000",
          "Quyết định số 2541/QĐ-UBND ngày 29/6/2025 của UBND tỉnh Quảng Bình – phê duyệt Điều chỉnh Quy hoạch sử dụng đất đến năm 2030 huyện Bố Trạch",
          "Quyết định số 1231/QĐ-UBND ngày 10/5/2024 của UBND tỉnh Quảng Bình – phê duyệt điều chỉnh Quy hoạch chung đô thị Hoàn Lão đến năm 2035",
          "Điều 122 Luật Đất đai năm 2024 – điều kiện giao đất, cho thuê đất, chuyển mục đích sử dụng đất",
        ]),
        note: VI_ONLY("Từ 01/7/2025, tỉnh Quảng Bình sáp nhập vào tỉnh Quảng Trị; các quyết định ban hành trước đó vẫn giữ nguyên tên cơ quan ban hành."),
      },
      {
        kind: "list",
        title: {
          vi: "Quá trình thẩm định hồ sơ",
          de: "Verlauf der Prüfung",
          en: "How the file has progressed",
          ja: "申請書類の審査経過",
          ko: "서류 심사 경과",
          "zh-TW": "文件審查歷程",
        },
        items: LIST_VI([
          "03/3/2025 – nộp hồ sơ đề xuất chủ trương đầu tư tới Sở Tài chính tỉnh Quảng Bình",
          "03/4/2025 – Công văn số 643/STC-QLTCĐT của Sở Tài chính tỉnh Quảng Bình",
          "03/4/2025 – Công văn số 1373/BCH-TM của Bộ Chỉ huy Quân sự tỉnh",
          "14/4/2025 – Công văn số 945/SXD-QHKT của Sở Xây dựng",
          "Nhà đầu tư hiệu chỉnh diện tích từ 18.415,2 m² xuống 16.244,9 m² cho phù hợp đồ án quy hoạch phân khu tỷ lệ 1/2000",
          "19/12/2025 – UBND tỉnh Quảng Trị chấp thuận chủ trương đầu tư",
          "2026 – lập và xin ý kiến Quy hoạch tổng mặt bằng tỷ lệ 1/500",
        ]),
      },
      {
        kind: "prose",
        title: {
          vi: "Định hướng thiết kế và vận hành",
          de: "Gestaltung und Betrieb",
          en: "Design and operating direction",
          ja: "設計と運営の方向",
          ko: "설계와 운영의 방향",
          "zh-TW": "設計與營運方向",
        },
        paragraphs: LIST_VI([
          "Hồ sơ định hướng do TOKI và TOAM Studio lập (28/11/2024) mô tả một mô hình boutique hotel với ba giá trị xuyên suốt: tối giản, bản địa và nghệ thuật. Thiết kế phản ánh câu chuyện riêng của cơ sở thay vì lặp lại một khuôn mẫu; tác phẩm nghệ thuật, đồ thủ công và vật liệu địa phương được đưa vào không gian ngay từ khâu thiết kế.",
          "TOAM Studio đảm nhận thiết kế sơ bộ, phối cảnh 3D kiến trúc – nội thất, thiết kế kiến trúc, kết cấu, M&E và kỹ thuật nội thất. TOKI đảm nhận xây dựng quy trình vận hành, hệ thống nhân sự và đào tạo, thiết kế sản phẩm trải nghiệm, kế hoạch marketing trước và sau vận hành, quản lý tài chính và báo cáo kết quả kinh doanh theo quý/năm.",
          "Lưu ý về quy mô: hồ sơ định hướng 11/2024 mô tả phương án 32 phòng với tổng mức đầu tư 33 tỷ đồng. Hồ sơ đề xuất dự án nộp cơ quan nhà nước năm 2025 và quyết định chấp thuận chủ trương đầu tư 12/2025 ghi quy mô 200 phòng, tổng vốn 95 tỷ đồng. Trang này lấy theo hồ sơ mới nhất.",
        ]),
      },
    ],
    hero: {
      src: "/media/hospitality/bo-trach-exterior.webp",
      caption: {
        vi: "Phối cảnh ban ngày, TOAM Studio 10/2025",
        de: "Tagesansicht, TOAM Studio 10/2025",
        en: "Daytime rendering, TOAM Studio 10/2025",
        ja: "昼のパース、TOAM Studio 2025年10月",
        ko: "주간 조감도, TOAM Studio 2025년 10월",
        "zh-TW": "日間透視圖，TOAM Studio 2025 年 10 月",
      },
    },
    gallery: [
      {
        src: "/media/hospitality/toki-tong-mat-bang.webp",
        caption: VI_ONLY("Bản đồ quy hoạch tổng mặt bằng sử dụng đất, tỷ lệ 1/500"),
      },
      {
        src: "/media/hospitality/toki-quy-hoach-phan-khu.webp",
        caption: VI_ONLY("Trích quy hoạch phân khu khu vực phát triển đô thị xã Trung Trạch, tỷ lệ 1/2000"),
      },
      {
        src: "/media/hospitality/toki-quy-hoach-su-dung-dat.webp",
        caption: VI_ONLY("Trích quy hoạch sử dụng đất: vị trí dự án nằm trong đất thương mại dịch vụ"),
      },
      {
        src: "/media/hospitality/toki-vi-tri.webp",
        caption: VI_ONLY("Vị trí đề xuất dự án trên ảnh vệ tinh, giáp đường ven biển"),
      },
      {
        src: "/media/hospitality/toki-ban-do-hien-trang.webp",
        caption: VI_ONLY("Bản đồ chỉnh lý địa chính khu đất, tỷ lệ 1/2000"),
      },
      {
        src: "/media/hospitality/toki-thong-ke-su-dung-dat.webp",
        caption: VI_ONLY("Bảng thống kê chỉnh lý địa chính: tổng 16.244,9 m²"),
      },
      {
        src: "/media/hospitality/bo-trach-aerial-fields.webp",
        caption: {
          vi: "Phối cảnh: công trình nằm giữa đồng, mái phủ cây xanh",
          de: "Visualisierung: der Bau zwischen Feldern, mit begrüntem Dach",
          en: "Rendering: the building among the fields, under a planted roof",
          ja: "パース — 田畑のなかに建つ、緑に覆われた屋根の建物",
          ko: "조감도 — 들판 가운데 자리한, 녹지로 덮인 지붕의 건물",
          "zh-TW": "透視圖：建築座落於田野之間，屋頂覆以綠植",
        },
      },
      {
        src: "/media/hospitality/bo-trach-pool-night.webp",
        caption: {
          vi: "Phối cảnh: bể bơi trong sân lúc chạng vạng, dãy phòng sáng đèn",
          de: "Visualisierung: der Innenhof-Pool in der Dämmerung",
          en: "Rendering: the courtyard pool at dusk, the guest wing lit",
          ja: "パース — 夕暮れの中庭プールと、灯りのともる客室棟",
          ko: "조감도 — 해 질 녘 안뜰 수영장과 불이 켜진 객실동",
          "zh-TW": "透視圖：暮色中的中庭泳池，客房區燈火通明",
        },
      },
      {
        src: "/media/hospitality/bo-trach-terrace.webp",
        caption: {
          vi: "Phối cảnh: bể bơi vô cực và sân hiên nhìn ra thung lũng",
          de: "Visualisierung: Infinity-Pool und Terrasse mit Blick ins Tal",
          en: "Rendering: the infinity pool and terrace looking down the valley",
          ja: "パース — 谷を見晴らすインフィニティプールとテラス",
          ko: "조감도 — 계곡을 내려다보는 인피니티 풀과 테라스",
          "zh-TW": "透視圖：無邊際泳池與可俯瞰山谷的露臺",
        },
      },
    ],
    parties: [
      {
        name: "Công ty Cổ phần Khách sạn Du lịch Hoàng Long",
        role: { vi: "Chủ đầu tư", de: "Investor", en: "Investor", ja: "事業主", ko: "사업주", "zh-TW": "投資方" },
      },
      {
        name: "TOKI",
        role: {
          vi: "Tư vấn và quản lý vận hành",
          de: "Beratung und Betriebsführung",
          en: "Advisory and operations",
          ja: "運営コンサルティングと管理",
          ko: "운영 컨설팅 및 관리",
          "zh-TW": "營運顧問與管理",
        },
      },
      {
        name: "TOAM Studio",
        role: {
          vi: "Tư vấn thiết kế và thi công",
          de: "Planung und Ausführung",
          en: "Design and build",
          ja: "設計・施工",
          ko: "설계·시공",
          "zh-TW": "設計與施工",
        },
      },
    ],
    sources: [
      { document: VI_ONLY("Văn bản đề nghị thực hiện dự án đầu tư và Đề xuất dự án đầu tư (Luật Đầu tư 2020)"), date: "2025-03-03" },
      { document: VI_ONLY("Công văn xin nộp lại hồ sơ đề xuất dự án"), date: "2025-04-03" },
      { document: VI_ONLY("Quyết định số 1015/QĐ-UBND – phê duyệt Quy hoạch phân khu xã Trung Trạch, tỷ lệ 1/2000"), date: "2025-04-04" },
      { document: VI_ONLY("Quyết định số 2541/QĐ-UBND – Điều chỉnh Quy hoạch sử dụng đất đến năm 2030 huyện Bố Trạch"), date: "2025-06-29" },
      { document: VI_ONLY("Quyết định số 3184/QĐ-UBND – chấp thuận chủ trương đầu tư"), date: "2025-12-19" },
      { document: VI_ONLY("Hồ sơ Quy hoạch tổng mặt bằng tỷ lệ 1/500 và tờ trình xin ý kiến"), date: "2026-01-01" },
      { document: VI_ONLY("TOKI Boutique Hotel Quảng Bình – hồ sơ định hướng thiết kế và vận hành"), date: "2024-11-28" },
    ],
  },

  /* ------------------------------------------------------------ Vĩnh Hưng */
  {
    slug: "khu-nghi-duong-vinh-hung",
    status: "published",
    order: 2,
    name: {
      vi: "Khu nghỉ dưỡng cao cấp ven biển Toki Ecolodge",
      de: "Luxus-Küstenresort Toki Ecolodge",
      en: "Toki Ecolodge coastal luxury resort",
      ja: "海辺の高級リゾート Toki Ecolodge",
      ko: "해안 고급 리조트 Toki Ecolodge",
      "zh-TW": "Toki Ecolodge 濱海高級度假村",
    },
    kind: { vi: "Khu nghỉ dưỡng ven biển", de: "Küstenresort", en: "Coastal resort", ja: "海辺のリゾート", ko: "해안 리조트", "zh-TW": "濱海度假村" },
    location: {
      vi: "Bố Trạch, tỉnh Quảng Trị",
      de: "Bo Trach, Provinz Quang Tri",
      en: "Bo Trach, Quang Tri province",
      ja: "クアンチ省ボチャック",
      ko: "꽝찌성 보짜익",
      "zh-TW": "廣治省布澤",
    },
    stage: {
      vi: "Phương án quy hoạch đề xuất",
      de: "Entwurfsvorschlag",
      en: "Proposal design",
      ja: "提案段階の計画案",
      ko: "제안 단계의 계획안",
      "zh-TW": "提案階段之規劃方案",
    },
    lead: {
      vi: "Khu đất 2,1 ha giáp biển Đông, quy hoạch thành quần thể 35 villa thấp tầng với gần một nửa diện tích dành cho cây xanh và mặt nước.",
      de: "Ein 2,1 Hektar großes Grundstück an der Ostsee-Küste, geplant als Anlage mit 35 niedrigen Villen; fast die Hälfte der Fläche bleibt Grün und Wasser.",
      en: "A 2.1 hectare plot on the East Sea shore, laid out as 35 low-rise villas with almost half the area left to planting and water.",
      ja: "東海(ビエンドン)に面した 2.1 ヘクタールの敷地。低層ヴィラ 35 棟の集合として計画し、敷地のほぼ半分を緑地と水面に充てます。",
      ko: "동해(비엔동)에 면한 2.1헥타르 부지. 저층 빌라 35동의 집합으로 계획하며, 부지의 거의 절반을 녹지와 수면에 할애합니다.",
      "zh-TW": "面東海、面積 2.1 公頃的基地，規劃為 35 棟低層別墅群，近半面積留作綠地與水域。",
    },
    body: {
      vi: [
        "Khu đất hiện là bãi cát trống, đang thi công hạ tầng, xung quanh chưa có khu dân cư hiện hữu. Ranh giới tiếp giáp biển Đông ở hướng Đông Bắc và khu dân cư ở các hướng Tây Bắc, Tây Nam, Bắc, Nam.",
        "Phương án quy hoạch giữ mật độ xây dựng 56,1%, thấp hơn chỉ tiêu 65% được duyệt. Phần còn lại là cây xanh và mặt nước.",
      ],
      de: [
        "Das Gelände ist heute offener Sand, die Erschließung läuft, angrenzende Wohnbebauung besteht noch nicht. Im Nordosten grenzt es an die Ostsee.",
        "Der Entwurf hält eine Bebauungsdichte von 56,1 %, unter dem genehmigten Wert von 65 %.",
      ],
      en: [
        "The site today is open sand with infrastructure work under way and no neighbouring housing yet built. It meets the East Sea to the north-east.",
        "The layout holds built density at 56.1%, below the approved 65%.",
      ],
    },
    facts: [
      fact(FACT_LABELS.land, {
        vi: "20.552,7 m² (2,1 ha)",
        de: "20.552,7 m² (2,1 ha)",
        en: "20,552.7 m² (2.1 ha)",
        ja: "20,552.7 m²（2.1 ha）",
        ko: "20,552.7 m² (2.1 ha)",
        "zh-TW": "20,552.7 m²（2.1 公頃）",
      }),
      fact(FACT_LABELS.built, { vi: "11.530,1 m²", de: "11.530,1 m²", en: "11,530.1 m²", ja: "11,530.1 m²", ko: "11,530.1 m²", "zh-TW": "11,530.1 m²" }),
      fact(FACT_LABELS.density, {
        vi: "56,1% (chỉ tiêu 65%)",
        de: "56,1 % (Vorgabe 65 %)",
        en: "56.1% (65% permitted)",
        ja: "56.1%（上限 65%）",
        ko: "56.1% (기준 65%)",
        "zh-TW": "56.1%（上限 65%）",
      }),
      fact(FACT_LABELS.scale, {
        vi: "35 villa (27 villa 2 tầng, 8 villa 1 tầng)",
        de: "35 Villen (27 zweigeschossig, 8 eingeschossig)",
        en: "35 villas (27 two-storey, 8 single-storey)",
        ja: "ヴィラ 35 棟（2 階建 27 棟、平屋 8 棟）",
        ko: "빌라 35동 (2층 27동, 단층 8동)",
        "zh-TW": "別墅 35 棟（雙層 27 棟、單層 8 棟）",
      }),
      fact(FACT_LABELS.green, {
        vi: "6.377 m² – 43,9%",
        de: "6.377 m² – 43,9 %",
        en: "6,377 m² – 43.9%",
        ja: "6,377 m² — 43.9%",
        ko: "6,377 m² — 43.9%",
        "zh-TW": "6,377 m² — 43.9%",
      }),
    ],
    blocks: [
      {
        kind: "grid",
        title: { vi: "Cơ cấu sử dụng đất", de: "Flächenaufteilung", en: "Land use", ja: "土地利用の内訳", ko: "토지 이용 구성", "zh-TW": "土地使用結構" },
        columns: [
          { vi: "Loại đất", de: "Nutzung", en: "Use", ja: "用途", ko: "용도", "zh-TW": "用途類別" },
          { vi: "Quy mô", de: "Umfang", en: "Extent", ja: "規模", ko: "규모", "zh-TW": "規模" },
          { vi: "Tỷ lệ", de: "Anteil", en: "Share", ja: "割合", ko: "비율", "zh-TW": "比例" },
        ],
        rows: [
          [VI_ONLY("Khối đón tiếp, hành chính và phụ trợ"), VI_ONLY("500 m² · 2 tầng · 1 khối"), VI_ONLY("2,4%")],
          [VI_ONLY("Khối nhà hàng"), VI_ONLY("1.450 m² · 2 tầng · 1 khối"), VI_ONLY("7%")],
          [VI_ONLY("Villa 2 tầng"), VI_ONLY("200 m²/căn · 27 căn · 5.400 m²"), VI_ONLY("26,3%")],
          [VI_ONLY("Villa 1 tầng"), VI_ONLY("300 m²/căn · 8 căn · 2.400 m²"), VI_ONLY("11,7%")],
          [VI_ONLY("Spa và gym"), VI_ONLY("450 m² · 2 tầng"), VI_ONLY("2,1%")],
          [VI_ONLY("Bar và nhà hàng biển"), VI_ONLY("450 m² · 1 tầng"), VI_ONLY("2,1%")],
          [VI_ONLY("Khu xử lý nước, rác thải, máy phát điện"), VI_ONLY("100 m² · 1 tầng"), VI_ONLY("0,4%")],
          [VI_ONLY("Đất cây xanh, mặt nước"), VI_ONLY("6.377 m²"), VI_ONLY("43,9%")],
          [VI_ONLY("Tổng cộng"), VI_ONLY("20.552,7 m²"), VI_ONLY("100%")],
        ],
      },
      {
        kind: "list",
        title: { vi: "Phân khu chức năng", de: "Funktionsbereiche", en: "Functional zones", ja: "機能別ゾーニング", ko: "기능별 구역 구분", "zh-TW": "機能分區" },
        items: LIST_VI([
          "Sảnh tiếp đón và bãi đỗ xe ở phía đường quy hoạch",
          "Nhà hàng và hồ nước trung tâm",
          "Khu villa 2 tầng và khu villa biển 1 tầng",
          "Khu spa, khu bar – nhà hàng biển giáp bãi biển",
          "Khu phục vụ và hạ tầng kỹ thuật",
        ]),
      },
    ],
    /* Ảnh Toki Ecolodge do tập đoàn gửi ngày 11/09/2026, đứng trước các bản vẽ hồ sơ. */
    hero: {
      src: "/media/hospitality/toki-ecolodge/toki-ecolodge-13.webp",
      caption: { vi: "Toki Ecolodge — Hồ bơi dưới chân núi đá vôi", en: "Toki Ecolodge — Pool beneath the limestone hills" },
    },
    gallery: [
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-01.webp", caption: { vi: "Toki Ecolodge — Cầu thang ngoài trời giữa vườn", en: "Toki Ecolodge — Outdoor stair in the garden" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-02.webp", caption: { vi: "Toki Ecolodge — Phòng khách gỗ và đá", en: "Toki Ecolodge — Living room in timber and stone" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-03.webp", caption: { vi: "Toki Ecolodge — Không gian nhìn từ tầng lửng", en: "Toki Ecolodge — Seen from the mezzanine" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-04.webp", caption: { vi: "Toki Ecolodge — Phòng khách mở ra vườn", en: "Toki Ecolodge — Living room opening onto the garden" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-05.webp", caption: { vi: "Toki Ecolodge — Phòng khách tầng trệt", en: "Toki Ecolodge — Ground-floor living room" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-06.webp", caption: { vi: "Toki Ecolodge — Hiên gỗ giữa rừng cây", en: "Toki Ecolodge — Timber veranda among the trees" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-07.webp", caption: { vi: "Toki Ecolodge — Bồn tắm ngoài trời dưới mái lá", en: "Toki Ecolodge — Outdoor bathtub under the thatch" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-08.webp", caption: { vi: "Toki Ecolodge — Phòng ngủ nhìn ra thung lũng", en: "Toki Ecolodge — Bedroom looking out over the valley" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-09.webp", caption: { vi: "Toki Ecolodge — Phòng ngủ", en: "Toki Ecolodge — Bedroom" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-10.webp", caption: { vi: "Toki Ecolodge — Phòng khách nhìn từ trên cao", en: "Toki Ecolodge — Living room from above" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-11.webp", caption: { vi: "Toki Ecolodge — Quầy bar cạnh hồ bơi", en: "Toki Ecolodge — Poolside bar" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-12.webp", caption: { vi: "Toki Ecolodge — Hồ bơi và nhà hàng lúc chạng vạng", en: "Toki Ecolodge — Pool and restaurant at dusk" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-14.webp", caption: { vi: "Toki Ecolodge — Phòng tắm tường đá", en: "Toki Ecolodge — Stone-walled bathroom" } },
      { src: "/media/hospitality/toki-ecolodge/toki-ecolodge-15.webp", caption: { vi: "Toki Ecolodge — Phòng khách mở ra hiên", en: "Toki Ecolodge — Living room opening onto the terrace" } },
      {
        src: "/media/hospitality/vinh-hung-mat-bang.webp",
        caption: {
          vi: "Phương án mặt bằng tổng thể, hồ sơ 18/04/2026",
          de: "Gesamtlageplan, Unterlage vom 18.04.2026",
          en: "Overall site layout, file of 18 April 2026",
          ja: "全体配置計画案、2026年4月18日付書類",
          ko: "전체 배치 계획안, 2026년 4월 18일 자 서류",
          "zh-TW": "整體配置規劃方案，2026 年 4 月 18 日文件",
        },
      },
      {
        src: "/media/hospitality/vinh-hung-vi-tri.webp",
        caption: {
          vi: "Vị trí khu đất 2,1 ha trên ảnh vệ tinh",
          de: "Lage des 2,1 ha großen Grundstücks im Satellitenbild",
          en: "The 2.1 hectare plot on satellite imagery",
          ja: "衛星画像で見る 2.1 ヘクタールの敷地",
          ko: "위성 사진으로 본 2.1헥타르 부지",
          "zh-TW": "衛星影像上的 2.1 公頃基地位置",
        },
      },
      {
        src: "/media/hospitality/vinh-hung-hien-trang.webp",
        caption: {
          vi: "Hiện trạng: bãi cát trống, đang thi công hạ tầng",
          de: "Bestand: offener Sand, Erschließung im Bau",
          en: "As found: open sand, infrastructure under way",
          ja: "現況 — 更地の砂浜、インフラ工事中",
          ko: "현황 — 빈 모래밭, 기반 시설 공사 중",
          "zh-TW": "現況：空曠沙地，基礎設施施工中",
        },
      },
      {
        src: "/media/hospitality/vinh-hung-phan-khu.webp",
        caption: { vi: "Sơ đồ phân khu chức năng", de: "Funktionszonierung", en: "Functional zoning", ja: "機能別ゾーニング図", ko: "기능별 구역도", "zh-TW": "機能分區圖" },
      },
    ],
    parties: [],
    sources: [
      {
        document: {
          vi: "Khu nghỉ dưỡng Vĩnh Hưng – Proposal design",
          de: "Resort Vinh Hung – Entwurfsvorschlag",
          en: "Vinh Hung Resort – proposal design",
          ja: "ヴィンフン・リゾート — 提案設計",
          ko: "빈흥 리조트 — 제안 설계",
          "zh-TW": "永興度假村 — 提案設計",
        },
        date: "2026-04-18",
      },
    ],
  },

  /* --------------------------------------------------------- Long Beach */
  {
    slug: "long-beach-resort",
    status: "published",
    order: 3,
    name: { vi: "Long Beach Resort", de: "Long Beach Resort", en: "Long Beach Resort", ja: "Long Beach リゾート", ko: "Long Beach 리조트", "zh-TW": "Long Beach 度假村" },
    kind: { vi: "Khu nghỉ dưỡng ven biển", de: "Küstenresort", en: "Coastal resort", ja: "海辺のリゾート", ko: "해안 리조트", "zh-TW": "濱海度假村" },
    location: {
      vi: "Đường Trương Pháp, phường Đồng Thuận, tỉnh Quảng Trị",
      de: "Truong-Phap-Straße, Dong Thuan, Provinz Quang Tri",
      en: "Truong Phap road, Dong Thuan, Quang Tri province",
      ja: "クアンチ省ドントゥアン坊、チュオンファップ通り",
      ko: "꽝찌성 동투언 방, 쯔엉팝 거리",
      "zh-TW": "廣治省同順坊張法路",
    },
    stage: {
      vi: "Hồ sơ thiết kế cơ sở – giai đoạn lập báo cáo nghiên cứu khả thi",
      de: "Vorplanung – Machbarkeitsphase",
      en: "Basic design – feasibility stage",
      ja: "基本設計図書 — 実行可能性調査報告の作成段階",
      ko: "기본 설계 서류 — 타당성 조사 보고서 작성 단계",
      "zh-TW": "基本設計文件 — 可行性研究報告編製階段",
    },
    lead: {
      vi: "Khu nghỉ dưỡng 60 phòng trên khu đất 3.180,8 m² mặt đường Trương Pháp, gồm năm block lưu trú, khối nhà hàng – lễ tân – văn phòng và hồ bơi.",
      de: "Ein Resort mit 60 Zimmern auf 3.180,8 m² an der Truong-Phap-Straße: fünf Wohnblöcke, ein Restaurant-, Empfangs- und Bürotrakt sowie ein Pool.",
      en: "A 60-room resort on a 3,180.8 m² plot on Truong Phap road: five accommodation blocks, a restaurant, reception and office building, and a pool.",
      ja: "チュオンファップ通りに面した 3,180.8 m² の敷地に建つ 60 室のリゾート。宿泊棟 5 棟、レストラン・フロント・事務棟、そしてプールで構成されます。",
      ko: "쯔엉팝 거리에 면한 3,180.8 m² 부지에 들어서는 60실 리조트. 숙박동 5개 동과 레스토랑·프런트·사무동, 그리고 수영장으로 이루어집니다.",
      "zh-TW": "位於張法路旁、基地面積 3,180.8 平方公尺的 60 房度假村，包含五棟住宿區、餐廳暨櫃檯與辦公棟，以及泳池。",
    },
    body: {
      vi: [
        "Hồ sơ thiết kế cơ sở do Công ty Cổ phần Tư vấn Kiến trúc và Đầu tư Xây dựng Hà Thành lập, chủ đầu tư là Công ty TNHH Dịch vụ Vận tải Thành Nam. Khu đất nằm giữa đường Trương Pháp và đường quy hoạch, cạnh khách sạn Thanh Phúc và khu vực Ban quản lý rừng phòng hộ Đồng Hới và ven biển Quảng Trị.",
        "Bốn block căn hộ hai tầng cao 8,7 m; block 5 cao năm tầng, 21,08 m, kết hợp khu hội thảo và massage. Khối nhà hàng cao 12,55 m. Chiều cao tầng điển hình 3,2 m, riêng tầng nhà hàng 3,6 m.",
      ],
    },
    facts: [
      fact(FACT_LABELS.investor, VI_ONLY("Công ty TNHH Dịch vụ Vận tải Thành Nam")),
      fact(FACT_LABELS.designer, VI_ONLY("Công ty Cổ phần Tư vấn Kiến trúc và Đầu tư Xây dựng Hà Thành")),
      fact(FACT_LABELS.land, { vi: "3.180,8 m²", de: "3.180,8 m²", en: "3,180.8 m²", ja: "3,180.8 m²", ko: "3,180.8 m²", "zh-TW": "3,180.8 m²" }),
      fact(FACT_LABELS.built, { vi: "1.191 m²", de: "1.191 m²", en: "1,191 m²", ja: "1,191 m²", ko: "1,191 m²", "zh-TW": "1,191 m²" }),
      fact(FACT_LABELS.density, { vi: "37,4%", de: "37,4 %", en: "37.4%", ja: "37.4%", ko: "37.4%", "zh-TW": "37.4%" }),
      fact(FACT_LABELS.floor, { vi: "3.933,95 m²", de: "3.933,95 m²", en: "3,933.95 m²", ja: "3,933.95 m²", ko: "3,933.95 m²", "zh-TW": "3,933.95 m²" }),
      fact(FACT_LABELS.scale, {
        vi: "60 phòng trong 5 block",
        de: "60 Zimmer in 5 Blöcken",
        en: "60 rooms across 5 blocks",
        ja: "5 棟に客室 60 室",
        ko: "5개 동에 객실 60실",
        "zh-TW": "五棟共 60 間客房",
      }),
    ],
    blocks: [
      {
        kind: "grid",
        title: { vi: "Các block lưu trú", de: "Wohnblöcke", en: "Accommodation blocks", ja: "宿泊棟", ko: "숙박동", "zh-TW": "住宿棟" },
        columns: [
          { vi: "Block", de: "Block", en: "Block", ja: "棟", ko: "동", "zh-TW": "棟別" },
          { vi: "Số phòng", de: "Zimmer", en: "Rooms", ja: "客室数", ko: "객실 수", "zh-TW": "客房數" },
          { vi: "Tầng cao", de: "Geschosse", en: "Storeys", ja: "階数", ko: "층수", "zh-TW": "樓層數" },
        ],
        rows: [
          [VI_ONLY("Block 01"), VI_ONLY("6"), VI_ONLY("2")],
          [VI_ONLY("Block 02"), VI_ONLY("8"), VI_ONLY("2")],
          [VI_ONLY("Block 03"), VI_ONLY("6"), VI_ONLY("2")],
          [VI_ONLY("Block 04"), VI_ONLY("8"), VI_ONLY("2")],
          [VI_ONLY("Block 05 (kết hợp hội thảo, massage)"), VI_ONLY("32"), VI_ONLY("5")],
          [VI_ONLY("Tổng cộng"), VI_ONLY("60"), VI_ONLY("–")],
        ],
      },
      {
        kind: "list",
        title: { vi: "Hạng mục trong khuôn viên", de: "Anlagen auf dem Gelände", en: "Facilities on site", ja: "敷地内の施設", ko: "부지 내 시설", "zh-TW": "園區內設施" },
        items: LIST_VI([
          "Khu nhà hàng, lễ tân kết hợp văn phòng",
          "Hồ bơi – dung tích 166 m³",
          "Café ngoài trời",
          "Bãi xe và lối vào chính từ đường Trương Pháp",
          "Nhà để máy phát điện và máy bơm",
          "Bể nước ngầm – dung tích 315 m³",
          "Trạm xử lý nước thải",
          "Trạm biến áp 5000 KVA",
          "Lối thoát hiểm và đường cứu hoả",
        ]),
      },
      {
        kind: "table",
        title: { vi: "Cao độ công trình", de: "Gebäudehöhen", en: "Building heights", ja: "建物の高さ", ko: "건물 높이", "zh-TW": "建築高度" },
        rows: [
          fact(VI_ONLY("Căn hộ 2 tầng (block 1–4)"), VI_ONLY("8,7 m")),
          fact(VI_ONLY("Căn hộ 5 tầng (block 5)"), VI_ONLY("21,08 m")),
          fact(VI_ONLY("Nhà hàng"), VI_ONLY("12,55 m")),
          fact(VI_ONLY("Chiều cao tầng điển hình"), VI_ONLY("3,2 m")),
          fact(VI_ONLY("Chiều cao tầng nhà hàng"), VI_ONLY("3,6 m")),
        ],
      },
    ],
    /* Phối cảnh Long Beach Resort do tập đoàn gửi ngày 11/09/2026, đứng trước các bản vẽ. */
    hero: {
      src: "/media/hospitality/long-beach/long-beach-14.webp",
      caption: { vi: "Phối cảnh Long Beach Resort — Toàn cảnh khu nghỉ dưỡng", en: "Rendering, Long Beach Resort — The whole resort from the air" },
    },
    gallery: [
      { src: "/media/hospitality/long-beach/long-beach-01.webp", caption: { vi: "Phối cảnh Long Beach Resort — Lối đi giữa các dãy phòng", en: "Rendering, Long Beach Resort — Walkway between the room wings" } },
      { src: "/media/hospitality/long-beach/long-beach-02.webp", caption: { vi: "Phối cảnh Long Beach Resort — Sân vườn và biển chỉ dẫn", en: "Rendering, Long Beach Resort — Garden court with signposts" } },
      { src: "/media/hospitality/long-beach/long-beach-03.webp", caption: { vi: "Phối cảnh Long Beach Resort — Khối phòng nghỉ nhìn ra hồ bơi", en: "Rendering, Long Beach Resort — Guest wing above the pool" } },
      { src: "/media/hospitality/long-beach/long-beach-04.webp", caption: { vi: "Phối cảnh Long Beach Resort — Hồ bơi trung tâm", en: "Rendering, Long Beach Resort — Central pool" } },
      { src: "/media/hospitality/long-beach/long-beach-05.webp", caption: { vi: "Phối cảnh Long Beach Resort — Sân trong giữa các block", en: "Rendering, Long Beach Resort — Courtyard between the blocks" } },
      { src: "/media/hospitality/long-beach/long-beach-06.webp", caption: { vi: "Phối cảnh Long Beach Resort — Góc cà phê trong sân", en: "Rendering, Long Beach Resort — Café corner in the courtyard" } },
      { src: "/media/hospitality/long-beach/long-beach-07.webp", caption: { vi: "Phối cảnh Long Beach Resort — Lối vào dãy phòng", en: "Rendering, Long Beach Resort — Entrance to a room wing" } },
      { src: "/media/hospitality/long-beach/long-beach-08.webp", caption: { vi: "Phối cảnh Long Beach Resort — Hẻm xanh giữa hai block", en: "Rendering, Long Beach Resort — Green lane between two blocks" } },
      { src: "/media/hospitality/long-beach/long-beach-09.webp", caption: { vi: "Phối cảnh Long Beach Resort — Lối dạo trong khuôn viên", en: "Rendering, Long Beach Resort — Path through the grounds" } },
      { src: "/media/hospitality/long-beach/long-beach-10.webp", caption: { vi: "Phối cảnh Long Beach Resort — Sảnh chính", en: "Rendering, Long Beach Resort — Main entrance" } },
      { src: "/media/hospitality/long-beach/long-beach-11.webp", caption: { vi: "Phối cảnh Long Beach Resort — Đường vào khu nghỉ dưỡng", en: "Rendering, Long Beach Resort — Approach road" } },
      { src: "/media/hospitality/long-beach/long-beach-12.webp", caption: { vi: "Phối cảnh Long Beach Resort — Biển tên Long Beach Resort", en: "Rendering, Long Beach Resort — Long Beach Resort sign" } },
      { src: "/media/hospitality/long-beach/long-beach-13.webp", caption: { vi: "Phối cảnh Long Beach Resort — Toàn cảnh nhìn từ trên xuống", en: "Rendering, Long Beach Resort — Seen from directly above" } },
      { src: "/media/hospitality/long-beach/long-beach-15.webp", caption: { vi: "Phối cảnh Long Beach Resort — Mặt tiền nhìn từ đường", en: "Rendering, Long Beach Resort — Frontage from the road" } },
      { src: "/media/hospitality/long-beach/long-beach-16.webp", caption: { vi: "Phối cảnh Long Beach Resort — Mặt tiền và cổng", en: "Rendering, Long Beach Resort — Frontage and gateway" } },
      { src: "/media/hospitality/long-beach/long-beach-17.webp", caption: { vi: "Phối cảnh Long Beach Resort — Mặt đứng khối chính", en: "Rendering, Long Beach Resort — Main block elevation" } },
      {
        src: "/media/hospitality/long-beach-mat-bang-tong-the.webp",
        caption: VI_ONLY("Mặt bằng tổng thể, tỷ lệ 1/250 – hồ sơ thiết kế cơ sở 01/08/2025"),
      },
      {
        src: "/media/hospitality/long-beach-mat-dung.webp",
        caption: VI_ONLY("Mặt đứng trục 12–1 và trục 1–12"),
      },
      {
        src: "/media/hospitality/long-beach-vi-tri.webp",
        caption: VI_ONLY("Mặt bằng vị trí khu đất, tỷ lệ 1/300"),
      },
    ],
    parties: [
      {
        name: "Công ty TNHH Dịch vụ Vận tải Thành Nam",
        role: { vi: "Chủ đầu tư", de: "Investor", en: "Investor", ja: "事業主", ko: "사업주", "zh-TW": "投資方" },
      },
      {
        name: "Công ty CP Tư vấn Kiến trúc và Đầu tư Xây dựng Hà Thành",
        role: {
          vi: "Tư vấn thiết kế cơ sở",
          de: "Vorplanung",
          en: "Basic design consultant",
          ja: "基本設計コンサルタント",
          ko: "기본 설계 컨설턴트",
          "zh-TW": "基本設計顧問",
        },
      },
    ],
    sources: [
      {
        document: VI_ONLY("Hồ sơ thiết kế cơ sở khu nghỉ dưỡng Long Beach Resort – giai đoạn lập báo cáo nghiên cứu khả thi"),
        date: "2025-08-01",
      },
    ],
  },

  /* ----------------------------------------------------------- Phong Nha */
  {
    slug: "quy-hoach-so-bo-phong-nha",
    status: "published",
    order: 4,
    name: {
      vi: "Phương án quy hoạch sơ bộ Phong Nha",
      de: "Vorentwurf Phong Nha",
      en: "Phong Nha outline layout",
      ja: "フォンニャ概略計画案",
      ko: "퐁냐 개략 계획안",
      "zh-TW": "峰牙初步規劃方案",
    },
    kind: { vi: "Quy hoạch sơ bộ", de: "Vorentwurf", en: "Outline layout", ja: "概略計画", ko: "개략 계획", "zh-TW": "初步規劃" },
    location: { vi: "Phong Nha, tỉnh Quảng Trị", de: "Phong Nha, Quang Tri", en: "Phong Nha, Quang Tri", ja: "クアンチ省フォンニャ", ko: "꽝찌성 퐁냐", "zh-TW": "廣治省峰牙" },
    stage: { vi: "Phương án sơ bộ", de: "Vorentwurf", en: "Outline stage", ja: "概略段階", ko: "개략 단계", "zh-TW": "初步階段" },
    lead: {
      vi: "Bản vẽ masterplan sơ bộ chia khu đất thành ba lô, tổng cộng 11.472,6 m².",
      de: "Ein Vorentwurf, der das Gelände in drei Parzellen mit insgesamt 11.472,6 m² teilt.",
      en: "An outline masterplan dividing the site into three plots totalling 11,472.6 m².",
      ja: "概略マスタープランでは、敷地を三区画に分けます。合計 11,472.6 m²。",
      ko: "개략 마스터플랜은 부지를 세 필지로 나눕니다. 합계 11,472.6 m².",
      "zh-TW": "初步總體規劃將基地劃分為三塊，合計 11,472.6 平方公尺。",
    },
    body: {
      vi: [
        "Bản vẽ ghi diện tích lô 1+2 là 3.851,4 m² và lô 3 là 7.621,2 m². Mặt bằng quy hoạch tổng thể đặt lối vào và điểm đón khách ở một đầu khu đất, rồi dẫn qua đường dạo chính tới các khối lưu trú, spa, nhà hàng và hai hồ sinh học.",
        "Bảng quy mô trên bản vẽ dự kiến 54 căn và phòng: 8 căn nghỉ 1 tầng và 6 căn có bể bơi riêng ở lô 1+2, cùng khối phòng nghỉ 4 tầng 40 phòng ở lô 3. Tổng diện tích sàn và quỹ đất đề xuất 12.990 m², mật độ xây dựng 25,1%, cảnh quan tối thiểu 45% khu đất.",
        "Bản vẽ ở giai đoạn sơ bộ nên chưa nêu tổng mức đầu tư hay tiến độ; trang không nêu những thứ ấy.",
      ],
    },
    facts: [
      fact(VI_ONLY("Lô 1 + 2"), VI_ONLY("3.851,4 m²")),
      fact(VI_ONLY("Lô 3"), VI_ONLY("7.621,2 m²")),
      fact(FACT_LABELS.land, VI_ONLY("11.472,6 m² (tổng ba lô)")),
      fact(VI_ONLY("Quy mô lưu trú"), VI_ONLY("54 căn và phòng")),
      fact(FACT_LABELS.built, VI_ONLY("2.875 m²")),
      fact(FACT_LABELS.density, VI_ONLY("25,1%")),
      fact(VI_ONLY("Tổng sàn và quỹ đất đề xuất"), VI_ONLY("12.990 m²")),
      fact(VI_ONLY("Bản vẽ"), VI_ONLY("MB quy hoạch tổng thể · KT1-03 · tỷ lệ 1/175")),
      fact(VI_ONLY("Ngày bản vẽ"), VI_ONLY("20/07/2026")),
    ],
    blocks: [
      {
        kind: "grid",
        title: {
          vi: "Quy mô dự kiến theo khối",
          de: "Geplanter Umfang nach Baukörpern",
          en: "Planned size by block",
          ja: "棟ごとの予定規模",
          ko: "동별 예정 규모",
          "zh-TW": "各區塊預定規模",
        },
        columns: [VI_ONLY("Hạng mục"), VI_ONLY("Quy mô dự kiến"), VI_ONLY("Sàn / quỹ đất")],
        rows: [
          [VI_ONLY("Căn nghỉ 1 tầng (lô 1+2)"), VI_ONLY("08 căn × 50 m²"), VI_ONLY("400 m²")],
          [VI_ONLY("Căn có bể bơi riêng (lô 1+2)"), VI_ONLY("06 căn × 50 m², 35 m² mặt nước"), VI_ONLY("510 m²")],
          [VI_ONLY("Khối phòng nghỉ 4 tầng (lô 3)"), VI_ONLY("40 phòng × 50 m², 10–15 phòng/tầng"), VI_ONLY("2.400 m²")],
          [VI_ONLY("Lễ tân, lobby, lounge (lô 3)"), VI_ONLY("300–450 m²"), VI_ONLY("300 m²")],
          [VI_ONLY("Nhà hàng, bar, bếp (lô 3)"), VI_ONLY("500–750 m², 1 tầng, gắn với bể bơi chung"), VI_ONLY("550 m²")],
          [VI_ONLY("Bể bơi chung (lô 3)"), VI_ONLY("250–400 m² mặt nước và deck"), VI_ONLY("900 m²")],
          [VI_ONLY("Wellness: spa, gym, yoga deck"), VI_ONLY("Trong khối phòng nghỉ 4 tầng"), VI_ONLY("250 m²")],
          [VI_ONLY("Khu vận hành BOH"), VI_ONLY("300–500 m² sàn"), VI_ONLY("500 m²")],
          [VI_ONLY("Kỹ thuật hạ tầng"), VI_ONLY("Trạm điện, máy phát, bơm, xử lý nước, rác"), VI_ONLY("150 m²")],
          [VI_ONLY("Cổng, nhà bảo vệ"), VI_ONLY("20–40 m²"), VI_ONLY("30 m²")],
          [VI_ONLY("Giao thông, bãi xe"), VI_ONLY("Khoảng 13–18% đất; ~25 chỗ đỗ xe"), VI_ONLY("1.500 m²")],
          [VI_ONLY("Cảnh quan, khoảng mở"), VI_ONLY("Tối thiểu 45% đất"), VI_ONLY("5.200 m²")],
          [VI_ONLY("Sự kiện nhỏ ngoài trời"), VI_ONLY("Sân cỏ, yoga, event deck"), VI_ONLY("300 m²")],
          [VI_ONLY("Tổng"), VI_ONLY("Mật độ xây dựng 25,1% · diện tích xây dựng 2.875 m²"), VI_ONLY("12.990 m²")],
        ],
        note: VI_ONLY("Chép từ bảng trên bản vẽ KT1-03 của TOAM Studio, 20/07/2026."),
      },
      {
        kind: "list",
        title: {
          vi: "Các khối công trình",
          de: "Baukörper",
          en: "Buildings",
          ja: "建物",
          ko: "건물",
          "zh-TW": "建築量體",
        },
        items: LIST_VI([
          "Khu lễ tân, sảnh tiếp đón",
          "Khối phòng nghỉ 4 tầng",
          "Biệt thự",
          "Biệt thự có bể bơi",
          "Nhà hàng cao cấp",
          "Khu cà phê và quầy bar cạnh hồ bơi",
          "Khu lễ tân, nhà hàng dự phòng cho lô 1+2",
          "Spa và chăm sóc sức khoẻ",
          "Khu hậu cần, vận hành và nhân viên (BOH)",
          "Phòng kỹ thuật",
          "Bãi đỗ xe",
        ]),
        note: VI_ONLY(
          "Tên hạng mục chép theo bảng ký hiệu A–K trên bản vẽ. Bản vẽ chưa ghi diện tích và số phòng của từng khối.",
        ),
      },
      {
        kind: "list",
        title: {
          vi: "Tiện ích cảnh quan",
          de: "Landschaft und Außenanlagen",
          en: "Landscape amenities",
          ja: "外構・ランドスケープ",
          ko: "조경 시설",
          "zh-TW": "景觀設施",
        },
        items: LIST_VI([
          "Cổng và lối vào",
          "Điểm đón trả khách",
          "Đường dạo chính",
          "Ao sinh học",
          "Hồ bơi sinh học",
          "Sàn gỗ ngắm cảnh",
          "Vườn hữu cơ",
          "Sân vườn liên thông, dùng cho sự kiện ngoài trời",
        ]),
        note: VI_ONLY("Chép theo bảng ký hiệu 1–8 trên bản vẽ."),
      },
    ],
    hero: {
      src: "/media/hospitality/phong-nha-masterplan.webp",
      caption: {
        vi: "Mặt bằng quy hoạch tổng thể: lô 1+2 bên trái, lô 3 bên phải — TOAM Studio 20/07/2026",
        de: "Gesamtplan: Parzellen 1+2 links, Parzelle 3 rechts — TOAM Studio, 20.07.2026",
        en: "Masterplan: plots 1+2 on the left, plot 3 on the right — TOAM Studio, 20 July 2026",
        ja: "全体配置図：左が第1・2区画、右が第3区画 — TOAM Studio 2026年7月20日",
        ko: "마스터플랜: 왼쪽 1+2 필지, 오른쪽 3 필지 — TOAM Studio 2026년 7월 20일",
        "zh-TW": "總體規劃：左為第1+2地塊，右為第3地塊 — TOAM Studio，2026年7月20日",
      },
    },
    gallery: [
      {
        src: "/media/hospitality/phong-nha-ban-ve.webp",
        caption: VI_ONLY("Nguyên tờ bản vẽ KT1-03, gồm bảng quy mô và khung tên"),
      },
    ],
    parties: [
      {
        name: "Công ty TNHH MTV T.O.A.M Studio",
        role: {
          vi: "Đơn vị thiết kế · 5A/254 Âu Cơ, Tây Hồ, Hà Nội",
          de: "Planungsbüro · Hanoi",
          en: "Design office, Hanoi",
          ja: "設計事務所(ハノイ)",
          ko: "설계 사무소(하노이)",
          "zh-TW": "設計單位（河內）",
        },
      },
      {
        name: "KTS Nguyễn Cao Thái",
        role: {
          vi: "Chủ trì thiết kế và thiết kế chính",
          de: "Entwurfsleitung",
          en: "Design lead",
          ja: "設計主任",
          ko: "설계 총괄",
          "zh-TW": "設計主持",
        },
      },
      {
        name: "KTS Phạm Thành Công",
        role: {
          vi: "Thiết kế triển khai",
          de: "Ausführungsplanung",
          en: "Detail design",
          ja: "実施設計",
          ko: "실시 설계",
          "zh-TW": "施工圖設計",
        },
      },
      {
        name: "KTS Bùi Lệ Quyên",
        role: {
          vi: "Quản lý chất lượng bản vẽ",
          de: "Qualitätsprüfung",
          en: "Drawing check",
          ja: "図面チェック",
          ko: "도면 검토",
          "zh-TW": "圖面審核",
        },
      },
    ],
    sources: [
      { document: VI_ONLY("Phương án quy hoạch sơ bộ Phong Nha – masterplan"), date: "2026-08-06" },
    ],
  },
  /* ------------------------------------------- Hoàng Long / Golden Dragon */
  /*
   * Dự án duy nhất trong danh sách đã hoàn thành và đang vận hành.
   *
   * Nguồn: Hồ sơ năng lực NIBELC Group (bản tiếng Việt tr.3, 4, 14; bản tiếng
   * Anh tr.10, 14) và Giấy chứng nhận đăng ký doanh nghiệp của Công ty CP Khách
   * sạn Du lịch Hoàng Long, thay đổi lần 5 ngày 30/06/2026. Tài liệu không ghi
   * số tầng, diện tích, năm khai trương hay sức chứa hội trường, nên trang không
   * nêu. Ảnh sảnh lấy từ hồ sơ tiếng Anh tr.14 — tấm duy nhất có trong tài liệu,
   * độ phân giải gốc thấp; cần ảnh chụp thật của khách sạn để thay.
   */
  {
    slug: "golden-dragon-hotel-restaurant",
    status: "published",
    order: 5,
    name: {
      vi: "Tổ hợp Hotel – Restaurant Hoàng Long (Golden Dragon Hotel – Restaurant)",
      de: "Hotel- und Restaurantkomplex Hoang Long (Golden Dragon Hotel – Restaurant)",
      en: "Hoang Long hotel and restaurant complex (Golden Dragon Hotel – Restaurant)",
      ja: "ホアンロン・ホテル＆レストラン複合施設（Golden Dragon Hotel – Restaurant）",
      ko: "호앙롱 호텔·레스토랑 복합시설(Golden Dragon Hotel – Restaurant)",
      "zh-TW": "黃龍飯店餐廳綜合設施（Golden Dragon Hotel – Restaurant）",
    },
    kind: {
      vi: "Khách sạn – nhà hàng",
      de: "Hotel und Restaurant",
      en: "Hotel and restaurant",
      ja: "ホテル・レストラン",
      ko: "호텔·레스토랑",
      "zh-TW": "飯店與餐廳",
    },
    location: {
      vi: "Km 10 Quốc lộ 1A (Ninh Bình – Hà Nội), xã Gia Trấn, tỉnh Ninh Bình",
      de: "Km 10, Nationalstraße 1A, Gemeinde Gia Tran, Provinz Ninh Binh",
      en: "Km 10, National Road 1A, Gia Tran commune, Ninh Binh province",
      ja: "ニンビン省ザーチャン社、国道1A号線10キロ地点",
      ko: "닌빈성 자쩐사, 국도 1A호선 10km 지점",
      "zh-TW": "寧平省嘉鎮社，1A國道10公里處",
    },
    stage: {
      vi: "Đã hoàn thành, đang vận hành",
      de: "Fertiggestellt und in Betrieb",
      en: "Completed and in operation",
      ja: "完成・営業中",
      ko: "완공·운영 중",
      "zh-TW": "已完工並營運中",
    },
    lead: {
      vi: "Tổ hợp khách sạn 3 sao 85 phòng và hai nhà hàng 500 chỗ ngồi tại Ninh Bình, đã đưa vào vận hành — đồng thời là nơi thực hành cho học viên ngành nhà hàng – khách sạn của tập đoàn.",
      de: "Ein Drei-Sterne-Hotel mit 85 Zimmern und zwei Restaurants mit 500 Plätzen in Ninh Binh, bereits in Betrieb — zugleich Praxisort für die Auszubildenden der Gruppe im Hotel- und Gastgewerbe.",
      en: "A three-star, 85-room hotel with two restaurants seating 500 in Ninh Binh, already in operation — and the place where the group's hospitality trainees do their practical work.",
      ja: "ニンビンにある85室の3つ星ホテルと500席のレストラン2軒。すでに営業しており、グループのホテル・飲食分野の研修生の実習の場でもあります。",
      ko: "닌빈에 있는 85실 규모의 3성급 호텔과 500석 레스토랑 두 곳. 이미 운영 중이며, 그룹 호텔·외식 분야 연수생의 실습 장소이기도 합니다.",
      "zh-TW": "位於寧平的三星級飯店，85間客房與兩間共500席的餐廳，已開始營運，同時也是集團餐旅科系學員的實習場所。",
    },
    body: {
      vi: [
        "Công ty Cổ phần Khách sạn Du lịch Hoàng Long (Golden Dragon Hotel Travel Services JSC) vận hành tổ hợp khách sạn 3 sao với 85 phòng và hai nhà hàng 500 chỗ ngồi, kinh doanh lưu trú, nhà hàng và quầy bar.",
        "Khách sạn được dùng làm cơ sở thực hành cho học viên của tập đoàn: Trường Trung cấp nghề Quốc tế (IVS) hợp tác với Hoàng Long để tổ chức các chương trình đào tạo kết hợp thực hành trong lĩnh vực dịch vụ, khách sạn và nhà hàng. Học viên vừa học vừa làm, được trả lương thực hành để chi trả chi phí học — mô hình học phí 0 đồng.",
        "Hoàng Long liên kết với các đối tác Đức và Nhật Bản để đào tạo theo chương trình chuẩn quốc tế ngành nhà hàng – khách sạn, cung ứng lao động cho thị trường Nhật Bản, Đức và châu Âu.",
      ],
    },
    facts: [
      fact(VI_ONLY("Hạng"), VI_ONLY("Khách sạn 3 sao")),
      fact(VI_ONLY("Số phòng"), VI_ONLY("85 phòng")),
      fact(VI_ONLY("Nhà hàng"), VI_ONLY("02 nhà hàng · 500 chỗ ngồi")),
      fact(VI_ONLY("Đơn vị vận hành"), VI_ONLY("Công ty CP Khách sạn Du lịch Hoàng Long (GD)")),
      fact(VI_ONLY("Mã số doanh nghiệp"), VI_ONLY("2700836682 · đăng ký lần đầu 07/02/2017")),
      fact(VI_ONLY("Vốn điều lệ"), VI_ONLY("30.000.000.000 đồng")),
      fact(VI_ONLY("Điện thoại"), VI_ONLY("0229 386 8688")),
    ],
    /* Dịch vụ, hạng phòng, đoàn khách và đào tạo nằm trong `dossier` bên dưới. */
    blocks: [],
    dossier: {
      kpis: [
        { value: "3★", label: { vi: "Khách sạn 3 sao", en: "Three-star hotel" } },
        { value: "85", label: { vi: "Phòng nghỉ", en: "Guest rooms" } },
        { value: "02", label: { vi: "Nhà hàng", en: "Restaurants" } },
        { value: "500", label: { vi: "Chỗ ngồi", en: "Seats" } },
      ],
      bodyCards: [
        {
          title: { vi: "Cơ sở thực hành của tập đoàn", en: "The group's training ground" },
          badge: { vi: "Học phí 0 đồng", en: "Zero tuition" },
        },
        {
          title: { vi: "Chuẩn quốc tế Đức – Nhật Bản", en: "German and Japanese standards" },
        },
      ],
      company: {
        name: "Công ty Cổ phần Khách sạn Du lịch Hoàng Long",
        nameEn: "Golden Dragon Hotel Travel Services JSC",
        rows: [
          fact({ vi: "Vai trò", en: "Role" }, { vi: "Chủ đầu tư và đơn vị vận hành", en: "Owner and operator" }),
          fact({ vi: "Mã số doanh nghiệp", en: "Enterprise code" }, VI_ONLY("2700836682")),
          fact({ vi: "Đăng ký lần đầu", en: "First registered" }, VI_ONLY("07/02/2017")),
          fact({ vi: "Vốn điều lệ", en: "Charter capital" }, { vi: "30.000.000.000 đồng", en: "VND 30,000,000,000" }),
          fact({ vi: "Điện thoại", en: "Telephone" }, VI_ONLY("0229 386 8688")),
          fact(
            { vi: "Địa chỉ", en: "Address" },
            { vi: "Km 10 Quốc lộ 1A (Ninh Bình – Hà Nội), xã Gia Trấn, tỉnh Ninh Bình", en: "Km 10, National Road 1A, Gia Tran commune, Ninh Binh province" },
          ),
        ],
      },
      services: [
        { icon: "bed", text: { vi: "Lưu trú khách sạn 3 sao, 85 phòng", en: "Three-star accommodation, 85 rooms" } },
        { icon: "dining", text: { vi: "Hai nhà hàng, 500 chỗ: Nhà hàng A và Nhà hàng B (German Beer Club)", en: "Two restaurants seating 500: Restaurant A and Restaurant B (German Beer Club)" } },
        { icon: "bar", text: { vi: "Golden Dragon Bar", en: "Golden Dragon Bar" } },
        { icon: "mic", text: { vi: "Karaoke", en: "Karaoke" } },
        { icon: "breakfast", text: { vi: "Bữa sáng set menu và buffet", en: "Set-menu and buffet breakfast" } },
        { icon: "party", text: { vi: "Tiệc đoàn, tiệc gala và tiệc nướng BBQ", en: "Group dinners, galas and barbecues" } },
      ],
      roomZones: [
        {
          zone: { vi: "Khu A", en: "Block A" },
          rooms: ["Deluxe Double Room", "Deluxe Double Room có bồn tắm", "Deluxe Twin Room", "Deluxe Family Suite"],
        },
        {
          zone: { vi: "Khu B", en: "Block B" },
          rooms: ["Deluxe King Suite", "Superior King Room", "Superior Queen Room", "Superior Triple Room"],
        },
      ],
      roomsNote: { vi: "Tên hạng phòng theo bộ ảnh khách sạn gửi các hãng lữ hành.", en: "Room names as used in the hotel's photo set for tour operators." },
      timeline: [
        { date: "11/12/2017", text: { vi: "Đoàn khách của hãng lữ hành H.I.S (Nhật Bản)", en: "A group from the Japanese tour operator H.I.S" } },
        { date: "03/12/2017", text: { vi: "Đoàn công đoàn", en: "A trade-union group" } },
        { date: "03/06/2017", text: { vi: "Gala Dinner 2017 \"Mùa Hè Rực Rỡ\" của VPBank tại German Beer Club", en: "VPBank's 2017 summer gala dinner at the German Beer Club" } },
        { text: { vi: "Tiệc nướng BBQ cho đoàn", en: "Barbecues for groups" } },
      ],
      timelineNote: { vi: "Theo thư mục ảnh \"Hình ảnh các đoàn\" của khách sạn.", en: "From the hotel's \"group photos\" folder." },
      training: [
        { vi: "Cơ sở thực hành cho học viên ngành nhà hàng – khách sạn của tập đoàn", en: "Practical training site for the group's hospitality trainees" },
        { vi: "Hợp tác với Trường Trung cấp nghề Quốc tế (IVS) tổ chức đào tạo kết hợp thực hành", en: "Training combined with practice, run with the International Vocational School (IVS)" },
        { vi: "Học viên vừa học vừa làm, có lương thực hành — mô hình học phí 0 đồng", en: "Trainees earn a practice wage while they study — a zero-tuition model" },
        { vi: "Liên kết đối tác Đức và Nhật Bản đào tạo chuẩn quốc tế, cung ứng lao động sang Nhật Bản, Đức và châu Âu", en: "German and Japanese partners bring international curricula and placements in Japan, Germany and Europe" },
      ],
      trainingNote: { vi: "Theo Hồ sơ năng lực NIBELC Group, bản tiếng Việt tr.3, 4 và 14.", en: "From the NIBELC Group capability profile (Vietnamese edition), pp. 3, 4 and 14." },
    },
    hero: {
      src: "/media/hospitality/golden-dragon/sanh-le-tan.webp",
      caption: {
        vi: "Quầy lễ tân khách sạn Hoàng Long",
        de: "Rezeption des Hotels Hoang Long",
        en: "Reception desk, Hoang Long hotel",
        ja: "ホアンロン・ホテルのフロント",
        ko: "호앙롱 호텔 프런트",
        "zh-TW": "黃龍飯店櫃台",
      },
    },
    /* Ảnh của chính khách sạn, lấy từ thư mục Drive "Golden Dragon HOTEL - PICS". */
    gallery: [
      { src: "/media/hospitality/golden-dragon/sanh-cho.webp", caption: { vi: "Sảnh chờ", en: "Lobby lounge" } },
      { src: "/media/hospitality/golden-dragon/family-suite.webp", caption: { vi: "Junior Family Suite", en: "Junior Family Suite" } },
      { src: "/media/hospitality/golden-dragon/phong-deluxe.webp", caption: { vi: "Phòng Junior Family Suite", en: "Junior Family Suite bedroom" } },
      { src: "/media/hospitality/golden-dragon/phong-bon-tam.webp", caption: { vi: "Phòng có bồn tắm", en: "Room with bathtub" } },
      { src: "/media/hospitality/golden-dragon/phong-twin.webp", caption: { vi: "Phòng Superior Triple", en: "Superior Triple room" } },
      { src: "/media/hospitality/golden-dragon/goi-logo.webp", caption: { vi: "Đồ vải thêu logo Golden Dragon Hotel", en: "Linen embroidered with the Golden Dragon Hotel mark" } },
      { src: "/media/hospitality/golden-dragon/nha-hang-a.webp", caption: { vi: "Nhà hàng A", en: "Restaurant A" } },
      { src: "/media/hospitality/golden-dragon/golden-dragon-bar.webp", caption: { vi: "Golden Dragon Bar", en: "Golden Dragon Bar" } },
      { src: "/media/hospitality/golden-dragon/german-beer-club.webp", caption: { vi: "Nhà hàng B — German Beer Club", en: "Restaurant B — German Beer Club" } },
      { src: "/media/hospitality/golden-dragon/tiec-ban-tiec.webp", caption: { vi: "Bàn tiệc đặt trước cho đoàn", en: "Banquet tables laid for a group" } },
      { src: "/media/hospitality/golden-dragon/buffet.webp", caption: { vi: "Quầy buffet", en: "Buffet counter" } },
      { src: "/media/hospitality/golden-dragon/view-tang-thuong.webp", caption: { vi: "Nhìn từ tầng trên của khách sạn", en: "View from the upper floors" } },
    ],
    /*
     * Phần trưng bày: chia tư liệu Drive của khách sạn thành từng khu (video,
     * hạng phòng, sảnh, nhà hàng, tiệc, đoàn khách) thay cho một bộ ảnh chung.
     * Video nằm trên máy chủ media, không nằm trong mã nguồn — xem DATA-NOTES §20.
     */
    showcase: {
      videos: [
        { src: "https://itw-berlin.de/vdg-media/golden-dragon/toan-canh-hoang-long-ivs.mp4", poster: "https://itw-berlin.de/vdg-media/golden-dragon/toan-canh-hoang-long-ivs.jpg", title: { vi: "Toàn cảnh Hoàng Long – IVS", en: "Hoang Long and IVS from above" }, note: { vi: "Khách sạn Hoàng Long và Trường Trung cấp nghề Quốc tế IVS nhìn từ trên cao · 59 giây", en: "The Hoang Long hotel and the International Vocational School from the air · 59 s" } },
        { src: "https://itw-berlin.de/vdg-media/golden-dragon/khach-san-hoang-long.mp4", poster: "https://itw-berlin.de/vdg-media/golden-dragon/khach-san-hoang-long.jpg", title: { vi: "Khách sạn Hoàng Long", en: "Hoang Long hotel" }, note: { vi: "38 giây", en: "38 s" } },
        { src: "https://itw-berlin.de/vdg-media/golden-dragon/phong-nghi.mp4", poster: "https://itw-berlin.de/vdg-media/golden-dragon/phong-nghi.jpg", title: { vi: "Phòng nghỉ", en: "Guest rooms" }, note: { vi: "31 giây", en: "31 s" } },
        { src: "https://itw-berlin.de/vdg-media/golden-dragon/nha-hang.mp4", poster: "https://itw-berlin.de/vdg-media/golden-dragon/nha-hang.jpg", title: { vi: "Nhà hàng", en: "Restaurant" }, note: { vi: "14 giây", en: "14 s" } },
        { src: "https://itw-berlin.de/vdg-media/golden-dragon/am-thuc.mp4", poster: "https://itw-berlin.de/vdg-media/golden-dragon/am-thuc.jpg", title: { vi: "Ẩm thực", en: "Food" }, note: { vi: "12 món trong buổi quay thực đơn ngày 07/05/2019 · 42 giây", en: "Twelve dishes from the menu shoot of 7 May 2019 · 42 s" } },
      ],
      rooms: [
        { name: "Deluxe Double Room có bồn tắm", zone: { vi: "Khu A", en: "Block A" }, cover: "/media/hospitality/golden-dragon/phong-deluxe-double-bon-tam-1.webp", more: ["/media/hospitality/golden-dragon/phong-deluxe-double-bon-tam-2.webp", "/media/hospitality/golden-dragon/phong-deluxe-double-bon-tam-3.webp", "/media/hospitality/golden-dragon/phong-deluxe-double-bon-tam-4.webp"] },
        { name: "Deluxe Double Room", zone: { vi: "Khu A", en: "Block A" }, cover: "/media/hospitality/golden-dragon/phong-deluxe-double-1.webp", more: ["/media/hospitality/golden-dragon/phong-deluxe-double-2.webp"] },
        { name: "Deluxe Family Suite", zone: { vi: "Khu A", en: "Block A" }, cover: "/media/hospitality/golden-dragon/phong-deluxe-family-suite-1.webp", more: ["/media/hospitality/golden-dragon/phong-deluxe-family-suite-2.webp", "/media/hospitality/golden-dragon/phong-deluxe-family-suite-3.webp", "/media/hospitality/golden-dragon/phong-deluxe-family-suite-4.webp"] },
        { name: "Deluxe Twin Room", zone: { vi: "Khu A", en: "Block A" }, cover: "/media/hospitality/golden-dragon/phong-deluxe-twin-1.webp", more: ["/media/hospitality/golden-dragon/phong-deluxe-twin-2.webp", "/media/hospitality/golden-dragon/phong-deluxe-twin-3.webp", "/media/hospitality/golden-dragon/phong-deluxe-twin-4.webp"] },
        { name: "Deluxe King Suite", zone: { vi: "Khu B", en: "Block B" }, cover: "/media/hospitality/golden-dragon/phong-deluxe-king-suite-1.webp", more: ["/media/hospitality/golden-dragon/phong-deluxe-king-suite-2.webp", "/media/hospitality/golden-dragon/phong-deluxe-king-suite-3.webp", "/media/hospitality/golden-dragon/phong-deluxe-king-suite-4.webp"] },
        { name: "Superior King Room", zone: { vi: "Khu B", en: "Block B" }, cover: "/media/hospitality/golden-dragon/phong-superior-king-1.webp", more: ["/media/hospitality/golden-dragon/phong-superior-king-2.webp", "/media/hospitality/golden-dragon/phong-superior-king-3.webp"] },
        { name: "Superior Queen Room", zone: { vi: "Khu B", en: "Block B" }, cover: "/media/hospitality/golden-dragon/phong-superior-queen-1.webp", more: ["/media/hospitality/golden-dragon/phong-superior-queen-2.webp", "/media/hospitality/golden-dragon/phong-superior-queen-3.webp"] },
        { name: "Superior Triple Room", zone: { vi: "Khu B", en: "Block B" }, cover: "/media/hospitality/golden-dragon/phong-superior-triple-1.webp", more: ["/media/hospitality/golden-dragon/phong-superior-triple-2.webp", "/media/hospitality/golden-dragon/phong-superior-triple-3.webp"] },
      ],
      sections: [
        {
          key: "sanh-tien-ich",
          title: { vi: "Sảnh & tiện ích", en: "Lobby & amenities" },
          lead: { vi: "Sảnh lễ tân, khu karaoke và tầm nhìn từ các tầng trên của khách sạn.", en: "The reception lobby, the karaoke rooms and the view from the upper floors." },
          shots: [
            { src: "/media/hospitality/golden-dragon/sanh-01.webp", caption: { vi: "Quầy lễ tân", en: "Reception desk" } },
            { src: "/media/hospitality/golden-dragon/sanh-02.webp", caption: { vi: "Sảnh chờ", en: "Lobby lounge" } },
            { src: "/media/hospitality/golden-dragon/sanh-03.webp", caption: { vi: "Sảnh chờ", en: "Lobby lounge" } },
            { src: "/media/hospitality/golden-dragon/sanh-04.webp", caption: { vi: "Sảnh chờ", en: "Lobby lounge" } },
            { src: "/media/hospitality/golden-dragon/sanh-05.webp", caption: { vi: "Mặt tiền toà nhà", en: "The building frontage" } },
            { src: "/media/hospitality/golden-dragon/sanh-06.webp", caption: { vi: "Mặt tiền toà nhà", en: "The building frontage" } },
            { src: "/media/hospitality/golden-dragon/sanh-07.webp", caption: { vi: "Phòng karaoke", en: "Karaoke room" } },
            { src: "/media/hospitality/golden-dragon/sanh-08.webp", caption: { vi: "Phòng karaoke", en: "Karaoke room" } },
            { src: "/media/hospitality/golden-dragon/sanh-09.webp", caption: { vi: "Phòng karaoke", en: "Karaoke room" } },
            { src: "/media/hospitality/golden-dragon/sanh-10.webp", caption: { vi: "Phòng karaoke", en: "Karaoke room" } },
            { src: "/media/hospitality/golden-dragon/sanh-11.webp", caption: { vi: "Nhìn từ tầng thượng", en: "View from the top floor" } },
            { src: "/media/hospitality/golden-dragon/sanh-12.webp", caption: { vi: "Nhìn từ tầng thượng", en: "View from the top floor" } },
            { src: "/media/hospitality/golden-dragon/sanh-13.webp", caption: { vi: "Hoàng hôn từ tầng thượng", en: "Sunset from the top floor" } },
          ],
        },
        {
          key: "nha-hang-am-thuc",
          title: { vi: "Nhà hàng & ẩm thực", en: "Restaurants & dining" },
          lead: { vi: "Hai nhà hàng, 500 chỗ ngồi: Nhà hàng A cùng Golden Dragon Bar, và Nhà hàng B — German Beer Club. Bữa sáng phục vụ theo set menu hoặc buffet.", en: "Two restaurants seating 500: Restaurant A with the Golden Dragon Bar, and Restaurant B — the German Beer Club. Breakfast is served as a set menu or a buffet." },
          shots: [
            { src: "/media/hospitality/golden-dragon/nhahang-01.webp", caption: { vi: "Nhà hàng A", en: "Restaurant A" } },
            { src: "/media/hospitality/golden-dragon/nhahang-02.webp", caption: { vi: "Nhà hàng A", en: "Restaurant A" } },
            { src: "/media/hospitality/golden-dragon/nhahang-03.webp", caption: { vi: "Quầy bar", en: "Bar counter" } },
            { src: "/media/hospitality/golden-dragon/nhahang-04.webp", caption: { vi: "Golden Dragon Bar", en: "Golden Dragon Bar" } },
            { src: "/media/hospitality/golden-dragon/nhahang-05.webp", caption: { vi: "Nhà hàng A", en: "Restaurant A" } },
            { src: "/media/hospitality/golden-dragon/nhahang-06.webp", caption: { vi: "German Beer Club", en: "German Beer Club" } },
            { src: "/media/hospitality/golden-dragon/nhahang-07.webp", caption: { vi: "German Beer Club", en: "German Beer Club" } },
            { src: "/media/hospitality/golden-dragon/nhahang-08.webp", caption: { vi: "German Beer Club", en: "German Beer Club" } },
            { src: "/media/hospitality/golden-dragon/nhahang-09.webp", caption: { vi: "Bữa sáng set menu", en: "Set-menu breakfast" } },
            { src: "/media/hospitality/golden-dragon/nhahang-10.webp", caption: { vi: "Bữa sáng set menu", en: "Set-menu breakfast" } },
            { src: "/media/hospitality/golden-dragon/nhahang-11.webp", caption: { vi: "Bữa sáng set menu", en: "Set-menu breakfast" } },
            { src: "/media/hospitality/golden-dragon/nhahang-12.webp", caption: { vi: "Quầy buffet", en: "Buffet" } },
            { src: "/media/hospitality/golden-dragon/nhahang-13.webp", caption: { vi: "Quầy buffet", en: "Buffet" } },
            { src: "/media/hospitality/golden-dragon/nhahang-14.webp", caption: { vi: "Quầy buffet", en: "Buffet" } },
          ],
        },
        {
          key: "tiec-su-kien",
          title: { vi: "Tiệc & sự kiện", en: "Banquets & events" },
          lead: { vi: "Tiệc đoàn, tiệc gala và tiệc nướng — trong đó có Gala Dinner 2017 \"Mùa Hè Rực Rỡ\" của VPBank tại German Beer Club ngày 03/06/2017.", en: "Group dinners, galas and barbecues — including VPBank's 2017 summer gala dinner at the German Beer Club on 3 June 2017." },
          shots: [
            { src: "/media/hospitality/golden-dragon/tiec-01.webp", caption: { vi: "Gala Dinner 2017 của VPBank", en: "VPBank Gala Dinner 2017" } },
            { src: "/media/hospitality/golden-dragon/tiec-02.webp", caption: { vi: "Biểu diễn tại gala", en: "Performance at the gala" } },
            { src: "/media/hospitality/golden-dragon/tiec-04.webp", caption: { vi: "Bàn tiệc", en: "Banquet tables" } },
            { src: "/media/hospitality/golden-dragon/tiec-05.webp", caption: { vi: "Bàn tiệc", en: "Banquet tables" } },
            { src: "/media/hospitality/golden-dragon/tiec-06.webp", caption: { vi: "Bàn tiệc", en: "Banquet tables" } },
            { src: "/media/hospitality/golden-dragon/tiec-07.webp", caption: { vi: "Bàn tiệc đặt cho đoàn", en: "Tables laid for a group" } },
            { src: "/media/hospitality/golden-dragon/tiec-08.webp", caption: { vi: "Quầy buffet tiệc", en: "Banquet buffet" } },
            { src: "/media/hospitality/golden-dragon/tiec-09.webp", caption: { vi: "Tiệc nướng BBQ", en: "Barbecue" } },
            { src: "/media/hospitality/golden-dragon/tiec-10.webp", caption: { vi: "Tiệc nướng BBQ", en: "Barbecue" } },
          ],
        },
        {
          key: "doan-khach",
          title: { vi: "Đoàn khách", en: "Tour groups" },
          lead: { vi: "Khách sạn đón đoàn trong nước và quốc tế: đoàn công đoàn tháng 12/2017 và đoàn của hãng lữ hành H.I.S (Nhật Bản) ngày 11/12/2017.", en: "The hotel hosts domestic and international groups: a trade-union group in December 2017 and a group from the Japanese tour operator H.I.S on 11 December 2017." },
          shots: [
            { src: "/media/hospitality/golden-dragon/doan-01.webp", caption: { vi: "Đoàn công đoàn, 12/2017", en: "Trade-union group, Dec 2017" } },
            { src: "/media/hospitality/golden-dragon/doan-02.webp", caption: { vi: "Đoàn công đoàn, 12/2017", en: "Trade-union group, Dec 2017" } },
            { src: "/media/hospitality/golden-dragon/doan-03.webp", caption: { vi: "Đoàn công đoàn dùng bữa", en: "Trade-union group at dinner" } },
            { src: "/media/hospitality/golden-dragon/doan-04.webp", caption: { vi: "Đoàn công đoàn, 12/2017", en: "Trade-union group, Dec 2017" } },
            { src: "/media/hospitality/golden-dragon/doan-05.webp", caption: { vi: "Đoàn khách dùng bữa", en: "Group dining" } },
            { src: "/media/hospitality/golden-dragon/doan-06.webp", caption: { vi: "Đoàn khách tại nhà hàng", en: "Group in the restaurant" } },
            { src: "/media/hospitality/golden-dragon/doan-07.webp", caption: { vi: "Xe đoàn tại khách sạn", en: "Group coaches at the hotel" } },
            { src: "/media/hospitality/golden-dragon/doan-08.webp", caption: { vi: "Đoàn H.I.S (Nhật Bản), 11/12/2017", en: "H.I.S group (Japan), 11 Dec 2017" } },
            { src: "/media/hospitality/golden-dragon/doan-09.webp", caption: { vi: "Đoàn H.I.S (Nhật Bản), 11/12/2017", en: "H.I.S group (Japan), 11 Dec 2017" } },
            { src: "/media/hospitality/golden-dragon/doan-10.webp", caption: { vi: "Đoàn H.I.S (Nhật Bản), 11/12/2017", en: "H.I.S group (Japan), 11 Dec 2017" } },
          ],
        },
      ],
    },
    parties: [
      {
        name: "Công ty CP Khách sạn Du lịch Hoàng Long",
        role: {
          vi: "Chủ đầu tư và đơn vị vận hành · Golden Dragon Hotel Travel Services JSC",
          de: "Eigentümer und Betreiber",
          en: "Owner and operator",
          ja: "所有・運営",
          ko: "소유·운영",
          "zh-TW": "業主暨營運單位",
        },
      },
      {
        name: "Trường Trung cấp nghề Quốc tế (IVS)",
        role: {
          vi: "Đối tác đào tạo thực hành",
          de: "Ausbildungspartner",
          en: "Training partner",
          ja: "研修パートナー",
          ko: "교육 협력 기관",
          "zh-TW": "培訓合作夥伴",
        },
      },
    ],
    sources: [
      { document: VI_ONLY("Hồ sơ năng lực NIBELC Group (tr.3, 4, 14)"), date: "2026-09-05" },
      { document: VI_ONLY("Giấy chứng nhận đăng ký doanh nghiệp Công ty CP Khách sạn Du lịch Hoàng Long, thay đổi lần 5"), date: "2026-06-30" },
    ],
  },
];

/** Only what the documents support showing in public, in listing order. */
export function publishedProjects(): VentureProject[] {
  return VENTURE_PROJECTS.filter((project) => project.status === "published").sort(
    (a, b) => a.order - b.order,
  );
}

export function findProject(slug: string): VentureProject | undefined {
  return publishedProjects().find((project) => project.slug === slug);
}

/** Formats a document date for display, in the reader's language. */
export function documentDate(iso: string, locale: Locale): string {
  const tag = locale === "vi" ? "vi-VN" : locale === "de" ? "de-DE" : "en-GB";
  return new Intl.DateTimeFormat(tag, { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
