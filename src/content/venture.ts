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
  caption: {
    vi: "Phối cảnh dự án tại Bố Trạch, Quảng Bình – TOAM Studio, 10/2025",
    de: "Visualisierung des Projekts in Bo Trach, Quang Binh – TOAM Studio, 10/2025",
    en: "Rendering of the Bo Trach project, Quang Binh – TOAM Studio, 10/2025",
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
    name: { vi: "Khách sạn nghỉ dưỡng", de: "Resorthotels", en: "Resort hotels" },
    lead: {
      vi: "Cơ sở lưu trú ven biển, thiết kế riêng theo bối cảnh và văn hoá địa phương thay vì theo mẫu chuỗi.",
      de: "Küstenhäuser, die aus Ort und lokaler Kultur heraus entworfen werden statt nach Kettenschema.",
      en: "Coastal properties designed around their setting and local culture rather than to a chain template.",
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
    name: { vi: "Khu nghỉ dưỡng ven biển", de: "Küstenresorts", en: "Coastal resorts" },
    lead: {
      vi: "Quần thể villa thấp tầng trên đất ven biển, giữ tỷ lệ cây xanh và mặt nước cao trong cơ cấu sử dụng đất.",
      de: "Niedrige Villenanlagen an der Küste mit hohem Anteil an Grün- und Wasserflächen.",
      en: "Low-rise villa groups on coastal land, holding a high share of planted and water surface.",
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
    image: "/media/hospitality/bo-trach-terrace.webp",
  },
  {
    key: "travel",
    name: { vi: "Du lịch – Lữ hành", de: "Reisen & Touren", en: "Travel & tours" },
    lead: {
      vi: "Dịch vụ du lịch gắn với các cơ sở lưu trú của nhóm.",
      de: "Reisedienstleistungen im Verbund mit den eigenen Häusern.",
      en: "Travel services tied to the group's own properties.",
    },
    points: {
      vi: [
        "Hồ sơ dự án Toki đăng ký các mã ngành dịch vụ lưu trú, ăn uống, thể thao và vui chơi giải trí đi kèm.",
        "Nội dung chi tiết của mảng lữ hành đang được hoàn thiện và sẽ đăng khi có hồ sơ chính thức.",
      ],
      de: [
        "Die Toki-Unterlagen registrieren die Branchencodes für Beherbergung, Gastronomie, Sport und Freizeit.",
        "Die Einzelheiten des Reisegeschäfts werden erarbeitet und erscheinen, sobald Unterlagen vorliegen.",
      ],
      en: [
        "The Toki file registers the industry codes for accommodation, food, sport and leisure services.",
        "The detail of the travel business is being prepared and will be published once the paperwork is in.",
      ],
    },
    image: "/media/hospitality/bo-trach-aerial-fields.webp",
    pending: true,
  },
];

export const VENTURE_PARTNERS: VenturePartner[] = [
  {
    name: "TOKI",
    role: {
      vi: "Tư vấn và quản lý vận hành",
      de: "Beratung und Betriebsführung",
      en: "Advisory and operations management",
    },
    note: {
      vi: "Mỗi cơ sở của TOKI được thiết kế và vận hành theo cùng một tinh thần: tối giản, bản địa và nghệ thuật.",
      de: "Jedes Haus von TOKI folgt derselben Haltung: Reduktion, lokale Prägung, Kunst.",
      en: "Every TOKI property is designed and run to the same idea: restraint, local character and art.",
    },
  },
  {
    name: "TOAM Studio",
    role: {
      vi: "Tư vấn thiết kế và thi công",
      de: "Planung und Ausführung",
      en: "Design and build",
    },
    note: {
      vi: "15 năm kinh nghiệm triển khai các công trình nhà ở và nghỉ dưỡng.",
      de: "15 Jahre Erfahrung mit Wohn- und Resortbauten.",
      en: "Fifteen years of work on housing and resort projects.",
    },
  },
  {
    name: "Công ty CP Tư vấn Kiến trúc và Đầu tư Xây dựng Hà Thành",
    role: {
      vi: "Tư vấn thiết kế cơ sở – Long Beach Resort",
      de: "Vorplanung – Long Beach Resort",
      en: "Basic design – Long Beach Resort",
    },
    note: {
      vi: "Chủ trì thiết kế: KTS. Phạm Quốc Anh. Giám đốc: KTS. Lê Xuân Trường.",
      de: "Planungsleitung: Arch. Pham Quoc Anh. Geschäftsführer: Arch. Le Xuan Truong.",
      en: "Design lead: architect Pham Quoc Anh. Director: architect Le Xuan Truong.",
    },
  },
];

export const VENTURE_PROCESS: { title: Localised; steps: { name: Localised; detail: Localised }[] } = {
  title: {
    vi: "Từ bản vẽ đến ngày mở cửa",
    de: "Vom Entwurf bis zur Eröffnung",
    en: "From drawing to opening day",
  },
  steps: [
    {
      name: { vi: "Thiết kế", de: "Entwurf", en: "Design" },
      detail: {
        vi: "Định hướng thiết kế, quy hoạch sơ bộ, mặt bằng nội thất, phối cảnh 3D kiến trúc và sân vườn, rồi tới thiết kế kiến trúc, kết cấu, M&E và kỹ thuật nội thất.",
        de: "Entwurfsrichtung, Vorplanung, Innenraumlayout, 3D-Visualisierung von Architektur und Garten, danach Architektur-, Tragwerks-, TGA- und Innenausbauplanung.",
        en: "Design direction, outline planning, interior layouts, 3D views of architecture and garden, then architectural, structural, M&E and interior technical design.",
      },
    },
    {
      name: { vi: "Trước vận hành", de: "Vor der Eröffnung", en: "Pre-opening" },
      detail: {
        vi: "Xây dựng quy trình vận hành cho từng bộ phận, hệ thống trang thiết bị, tuyển dụng và đào tạo nhân sự, thiết kế sản phẩm dịch vụ và kế hoạch truyền thông trước ngày mở cửa.",
        de: "Betriebsabläufe je Abteilung, Ausstattung, Rekrutierung und Schulung, Gestaltung des Leistungsangebots und Kommunikationsplanung vor der Eröffnung.",
        en: "Operating procedures per department, equipment, hiring and training, service design and the communications plan before opening.",
      },
    },
    {
      name: { vi: "Sau vận hành", de: "Im Betrieb", en: "In operation" },
      detail: {
        vi: "Quản lý chất lượng trải nghiệm, cơ sở vật chất và nhân sự; theo dõi thu chi và lập báo cáo kết quả kinh doanh theo quý và theo năm.",
        de: "Steuerung von Gästeerlebnis, Gebäude und Personal; Einnahmen- und Ausgabenkontrolle sowie Quartals- und Jahresberichte.",
        en: "Managing guest experience, the building and the team; tracking income and cost, with quarterly and annual reporting.",
      },
    },
  ],
};

const FACT_LABELS = {
  investor: { vi: "Chủ đầu tư", de: "Investor", en: "Investor" },
  land: { vi: "Diện tích khu đất", de: "Grundstücksfläche", en: "Site area" },
  scale: { vi: "Quy mô", de: "Größe", en: "Scale" },
  capital: { vi: "Tổng vốn đầu tư", de: "Investitionsvolumen", en: "Total investment" },
  density: { vi: "Mật độ xây dựng", de: "Bebauungsdichte", en: "Built density" },
  duration: { vi: "Thời hạn hoạt động", de: "Laufzeit", en: "Operating term" },
  approval: { vi: "Chấp thuận chủ trương đầu tư", de: "Investitionsgenehmigung", en: "Investment approval" },
  built: { vi: "Diện tích xây dựng", de: "Bebaute Fläche", en: "Built area" },
  green: { vi: "Cây xanh, mặt nước", de: "Grün- und Wasserfläche", en: "Planting and water" },
  floor: { vi: "Tổng diện tích sàn", de: "Geschossfläche", en: "Gross floor area" },
  designer: { vi: "Đơn vị tư vấn thiết kế", de: "Planungsbüro", en: "Design consultant" },
  stage: { vi: "Giai đoạn hồ sơ", de: "Planungsstand", en: "Document stage" },
} satisfies Record<string, Localised>;

const fact = (label: Localised, value: Localised): VentureFact => ({ label, value });

export const VENTURE_PROJECTS: VentureProject[] = [
  /* ------------------------------------------------------------------ Toki */
  {
    slug: "khach-san-nghi-duong-toki",
    status: "published",
    order: 1,
    name: {
      vi: "Khách sạn nghỉ dưỡng Toki",
      de: "Resorthotel Toki",
      en: "Toki Resort Hotel",
    },
    kind: {
      vi: "Khách sạn nghỉ dưỡng tiêu chuẩn 3 sao",
      de: "Drei-Sterne-Resorthotel",
      en: "Three-star resort hotel",
    },
    location: {
      vi: "Xã Hoàn Lão, tỉnh Quảng Trị",
      de: "Gemeinde Hoan Lao, Provinz Quang Tri",
      en: "Hoan Lao commune, Quang Tri province",
    },
    stage: {
      vi: "Đã được chấp thuận chủ trương đầu tư",
      de: "Investitionsgenehmigung erteilt",
      en: "Investment policy approved",
    },
    lead: {
      vi: "Khách sạn nghỉ dưỡng 200 phòng trên khu đất 16.244,9 m² sát đường ven biển, tổng vốn đầu tư 95 tỷ đồng, đã được UBND tỉnh Quảng Trị chấp thuận chủ trương đầu tư.",
      de: "Ein Resorthotel mit 200 Zimmern auf 16.244,9 m² an der Küstenstraße, Investitionsvolumen 95 Mrd. VND, vom Volkskomitee der Provinz Quang Tri genehmigt.",
      en: "A 200-room resort hotel on a 16,244.9 m² plot by the coastal road, VND 95 billion of investment, approved by the Quang Tri provincial people's committee.",
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
      }),
      fact(FACT_LABELS.scale, {
        vi: "200 phòng ngủ, tiêu chuẩn 3 sao",
        de: "200 Zimmer, Drei-Sterne-Standard",
        en: "200 rooms, three-star standard",
      }),
      fact(FACT_LABELS.capital, {
        vi: "95.000.000.000 đồng",
        de: "95 Mrd. VND",
        en: "VND 95,000,000,000",
      }),
      fact(FACT_LABELS.density, { vi: "40,0%", de: "40,0 %", en: "40.0%" }),
      fact(FACT_LABELS.duration, { vi: "50 năm", de: "50 Jahre", en: "50 years" }),
      fact(FACT_LABELS.approval, VI_ONLY("Quyết định số 3184/QĐ-UBND ngày 19/12/2025, UBND tỉnh Quảng Trị")),
    ],
    blocks: [
      {
        kind: "grid",
        title: { vi: "Hạng mục xây dựng", de: "Bauteile", en: "Schedule of works" },
        columns: [
          { vi: "Hạng mục", de: "Bauteil", en: "Item" },
          { vi: "Diện tích", de: "Fläche", en: "Area" },
          { vi: "Tầng cao", de: "Geschosse", en: "Storeys" },
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
        title: { vi: "Tiến độ thực hiện", de: "Zeitplan", en: "Programme" },
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
        title: { vi: "Vốn đầu tư", de: "Finanzierung", en: "Investment" },
        rows: [
          fact(VI_ONLY("Tổng vốn đầu tư"), VI_ONLY("95.000.000.000 đồng")),
          fact(VI_ONLY("Vốn góp của nhà đầu tư"), VI_ONLY("19.000.000.000 đồng – 20%")),
          fact(VI_ONLY("Vốn huy động"), VI_ONLY("76.000.000.000 đồng – 80%, vay ngân hàng")),
          fact(VI_ONLY("Tiến độ góp vốn"), VI_ONLY("Quý IV/2025: 19.000 triệu · Quý IV/2026: 25.000 triệu · Quý IV/2027: 26.000 triệu · Quý II/2028: 25.000 triệu")),
        ],
      },
      {
        kind: "table",
        title: { vi: "Nhu cầu lao động", de: "Personalbedarf", en: "Staffing" },
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
        title: { vi: "Ranh giới khu đất", de: "Grundstücksgrenzen", en: "Site boundaries" },
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
        },
      },
      {
        src: "/media/hospitality/bo-trach-pool-night.webp",
        caption: {
          vi: "Phối cảnh: bể bơi trong sân lúc chạng vạng, dãy phòng sáng đèn",
          de: "Visualisierung: der Innenhof-Pool in der Dämmerung",
          en: "Rendering: the courtyard pool at dusk, the guest wing lit",
        },
      },
      {
        src: "/media/hospitality/bo-trach-terrace.webp",
        caption: {
          vi: "Phối cảnh: bể bơi vô cực và sân hiên nhìn ra thung lũng",
          de: "Visualisierung: Infinity-Pool und Terrasse mit Blick ins Tal",
          en: "Rendering: the infinity pool and terrace looking down the valley",
        },
      },
    ],
    parties: [
      {
        name: "Công ty Cổ phần Khách sạn Du lịch Hoàng Long",
        role: { vi: "Chủ đầu tư", de: "Investor", en: "Investor" },
      },
      {
        name: "TOKI",
        role: {
          vi: "Tư vấn và quản lý vận hành",
          de: "Beratung und Betriebsführung",
          en: "Advisory and operations",
        },
      },
      {
        name: "TOAM Studio",
        role: {
          vi: "Tư vấn thiết kế và thi công",
          de: "Planung und Ausführung",
          en: "Design and build",
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
    name: { vi: "Khu nghỉ dưỡng Vĩnh Hưng", de: "Resort Vinh Hung", en: "Vinh Hung Resort" },
    kind: { vi: "Khu nghỉ dưỡng ven biển", de: "Küstenresort", en: "Coastal resort" },
    location: {
      vi: "Bố Trạch, tỉnh Quảng Trị",
      de: "Bo Trach, Provinz Quang Tri",
      en: "Bo Trach, Quang Tri province",
    },
    stage: {
      vi: "Phương án quy hoạch đề xuất",
      de: "Entwurfsvorschlag",
      en: "Proposal design",
    },
    lead: {
      vi: "Khu đất 2,1 ha giáp biển Đông, quy hoạch thành quần thể 35 villa thấp tầng với gần một nửa diện tích dành cho cây xanh và mặt nước.",
      de: "Ein 2,1 Hektar großes Grundstück an der Ostsee-Küste, geplant als Anlage mit 35 niedrigen Villen; fast die Hälfte der Fläche bleibt Grün und Wasser.",
      en: "A 2.1 hectare plot on the East Sea shore, laid out as 35 low-rise villas with almost half the area left to planting and water.",
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
      }),
      fact(FACT_LABELS.built, { vi: "11.530,1 m²", de: "11.530,1 m²", en: "11,530.1 m²" }),
      fact(FACT_LABELS.density, {
        vi: "56,1% (chỉ tiêu 65%)",
        de: "56,1 % (Vorgabe 65 %)",
        en: "56.1% (65% permitted)",
      }),
      fact(FACT_LABELS.scale, {
        vi: "35 villa (27 villa 2 tầng, 8 villa 1 tầng)",
        de: "35 Villen (27 zweigeschossig, 8 eingeschossig)",
        en: "35 villas (27 two-storey, 8 single-storey)",
      }),
      fact(FACT_LABELS.green, {
        vi: "6.377 m² – 43,9%",
        de: "6.377 m² – 43,9 %",
        en: "6,377 m² – 43.9%",
      }),
    ],
    blocks: [
      {
        kind: "grid",
        title: { vi: "Cơ cấu sử dụng đất", de: "Flächenaufteilung", en: "Land use" },
        columns: [
          { vi: "Loại đất", de: "Nutzung", en: "Use" },
          { vi: "Quy mô", de: "Umfang", en: "Extent" },
          { vi: "Tỷ lệ", de: "Anteil", en: "Share" },
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
        title: { vi: "Phân khu chức năng", de: "Funktionsbereiche", en: "Functional zones" },
        items: LIST_VI([
          "Sảnh tiếp đón và bãi đỗ xe ở phía đường quy hoạch",
          "Nhà hàng và hồ nước trung tâm",
          "Khu villa 2 tầng và khu villa biển 1 tầng",
          "Khu spa, khu bar – nhà hàng biển giáp bãi biển",
          "Khu phục vụ và hạ tầng kỹ thuật",
        ]),
      },
    ],
    hero: {
      src: "/media/hospitality/bo-trach-terrace.webp",
      caption: {
        vi: "Ảnh minh hoạ mô hình nghỉ dưỡng của nhóm (phối cảnh dự án lân cận tại Bố Trạch, TOAM Studio 10/2025). Bản vẽ và hiện trạng của chính khu đất Vĩnh Hưng ở ngay bên dưới.",
        de: "Illustration des Resortmodells der Gruppe (Visualisierung eines Nachbarprojekts in Bo Trach). Die Pläne des Grundstücks Vinh Hung stehen direkt darunter.",
        en: "An illustrative view of the group's resort model (rendering of a neighbouring project in Bo Trach). Vinh Hung's own drawings are directly below.",
      },
    },
    gallery: [
      {
        src: "/media/hospitality/vinh-hung-mat-bang.webp",
        caption: {
          vi: "Phương án mặt bằng tổng thể, hồ sơ 18/04/2026",
          de: "Gesamtlageplan, Unterlage vom 18.04.2026",
          en: "Overall site layout, file of 18 April 2026",
        },
      },
      {
        src: "/media/hospitality/vinh-hung-vi-tri.webp",
        caption: {
          vi: "Vị trí khu đất 2,1 ha trên ảnh vệ tinh",
          de: "Lage des 2,1 ha großen Grundstücks im Satellitenbild",
          en: "The 2.1 hectare plot on satellite imagery",
        },
      },
      {
        src: "/media/hospitality/vinh-hung-hien-trang.webp",
        caption: {
          vi: "Hiện trạng: bãi cát trống, đang thi công hạ tầng",
          de: "Bestand: offener Sand, Erschließung im Bau",
          en: "As found: open sand, infrastructure under way",
        },
      },
      {
        src: "/media/hospitality/vinh-hung-phan-khu.webp",
        caption: { vi: "Sơ đồ phân khu chức năng", de: "Funktionszonierung", en: "Functional zoning" },
      },
    ],
    parties: [],
    sources: [
      {
        document: {
          vi: "Khu nghỉ dưỡng Vĩnh Hưng – Proposal design",
          de: "Resort Vinh Hung – Entwurfsvorschlag",
          en: "Vinh Hung Resort – proposal design",
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
    name: { vi: "Long Beach Resort", de: "Long Beach Resort", en: "Long Beach Resort" },
    kind: { vi: "Khu nghỉ dưỡng ven biển", de: "Küstenresort", en: "Coastal resort" },
    location: {
      vi: "Đường Trương Pháp, phường Đồng Thuận, tỉnh Quảng Trị",
      de: "Truong-Phap-Straße, Dong Thuan, Provinz Quang Tri",
      en: "Truong Phap road, Dong Thuan, Quang Tri province",
    },
    stage: {
      vi: "Hồ sơ thiết kế cơ sở – giai đoạn lập báo cáo nghiên cứu khả thi",
      de: "Vorplanung – Machbarkeitsphase",
      en: "Basic design – feasibility stage",
    },
    lead: {
      vi: "Khu nghỉ dưỡng 60 phòng trên khu đất 3.180,8 m² mặt đường Trương Pháp, gồm năm block lưu trú, khối nhà hàng – lễ tân – văn phòng và hồ bơi.",
      de: "Ein Resort mit 60 Zimmern auf 3.180,8 m² an der Truong-Phap-Straße: fünf Wohnblöcke, ein Restaurant-, Empfangs- und Bürotrakt sowie ein Pool.",
      en: "A 60-room resort on a 3,180.8 m² plot on Truong Phap road: five accommodation blocks, a restaurant, reception and office building, and a pool.",
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
      fact(FACT_LABELS.land, { vi: "3.180,8 m²", de: "3.180,8 m²", en: "3,180.8 m²" }),
      fact(FACT_LABELS.built, { vi: "1.191 m²", de: "1.191 m²", en: "1,191 m²" }),
      fact(FACT_LABELS.density, { vi: "37,4%", de: "37,4 %", en: "37.4%" }),
      fact(FACT_LABELS.floor, { vi: "3.933,95 m²", de: "3.933,95 m²", en: "3,933.95 m²" }),
      fact(FACT_LABELS.scale, {
        vi: "60 phòng trong 5 block",
        de: "60 Zimmer in 5 Blöcken",
        en: "60 rooms across 5 blocks",
      }),
    ],
    blocks: [
      {
        kind: "grid",
        title: { vi: "Các block lưu trú", de: "Wohnblöcke", en: "Accommodation blocks" },
        columns: [
          { vi: "Block", de: "Block", en: "Block" },
          { vi: "Số phòng", de: "Zimmer", en: "Rooms" },
          { vi: "Tầng cao", de: "Geschosse", en: "Storeys" },
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
        title: { vi: "Hạng mục trong khuôn viên", de: "Anlagen auf dem Gelände", en: "Facilities on site" },
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
        title: { vi: "Cao độ công trình", de: "Gebäudehöhen", en: "Building heights" },
        rows: [
          fact(VI_ONLY("Căn hộ 2 tầng (block 1–4)"), VI_ONLY("8,7 m")),
          fact(VI_ONLY("Căn hộ 5 tầng (block 5)"), VI_ONLY("21,08 m")),
          fact(VI_ONLY("Nhà hàng"), VI_ONLY("12,55 m")),
          fact(VI_ONLY("Chiều cao tầng điển hình"), VI_ONLY("3,2 m")),
          fact(VI_ONLY("Chiều cao tầng nhà hàng"), VI_ONLY("3,6 m")),
        ],
      },
    ],
    hero: {
      src: "/media/hospitality/bo-trach-pool-night.webp",
      caption: VI_ONLY(
        "Ảnh minh hoạ mô hình nghỉ dưỡng của nhóm (phối cảnh dự án lân cận tại Bố Trạch, TOAM Studio 10/2025). Bản vẽ thiết kế cơ sở của chính Long Beach Resort ở ngay bên dưới.",
      ),
    },
    gallery: [
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
        role: { vi: "Chủ đầu tư", de: "Investor", en: "Investor" },
      },
      {
        name: "Công ty CP Tư vấn Kiến trúc và Đầu tư Xây dựng Hà Thành",
        role: {
          vi: "Tư vấn thiết kế cơ sở",
          de: "Vorplanung",
          en: "Basic design consultant",
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
    },
    kind: { vi: "Quy hoạch sơ bộ", de: "Vorentwurf", en: "Outline layout" },
    location: { vi: "Phong Nha, tỉnh Quảng Trị", de: "Phong Nha, Quang Tri", en: "Phong Nha, Quang Tri" },
    stage: { vi: "Phương án sơ bộ", de: "Vorentwurf", en: "Outline stage" },
    lead: {
      vi: "Bản vẽ masterplan sơ bộ chia khu đất thành ba lô, tổng cộng 11.472,6 m².",
      de: "Ein Vorentwurf, der das Gelände in drei Parzellen mit insgesamt 11.472,6 m² teilt.",
      en: "An outline masterplan dividing the site into three plots totalling 11,472.6 m².",
    },
    body: {
      vi: [
        "Bản vẽ ghi diện tích lô 1+2 là 3.851,4 m² và lô 3 là 7.621,2 m². Tài liệu không nêu tên chủ đầu tư, quy mô công trình hay tiến độ, nên trang chỉ đăng đúng những gì bản vẽ ghi.",
      ],
    },
    facts: [
      fact(VI_ONLY("Lô 1 + 2"), VI_ONLY("3.851,4 m²")),
      fact(VI_ONLY("Lô 3"), VI_ONLY("7.621,2 m²")),
      fact(FACT_LABELS.land, VI_ONLY("11.472,6 m² (tổng ba lô)")),
    ],
    blocks: [],
    hero: {
      src: "/media/hospitality/bo-trach-aerial-fields.webp",
      caption: {
        vi: "Ảnh minh hoạ khu vực Bố Trạch – Phong Nha (phối cảnh dự án lân cận, TOAM Studio 10/2025)",
        de: "Illustration der Region Bo Trach – Phong Nha (Visualisierung eines Nachbarprojekts)",
        en: "Illustrative view of the Bo Trach - Phong Nha area (rendering of a nearby project)",
      },
    },
    gallery: [],
    parties: [],
    sources: [
      { document: VI_ONLY("Phương án quy hoạch sơ bộ Phong Nha – masterplan"), date: "2026-08-06" },
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
