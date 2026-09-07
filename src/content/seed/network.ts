import { fromProfileVi, type SeedActivity, type SeedFaq, type SeedPartner } from "./types";

/**
 * Partner network as printed in the group profile.
 *
 * Two caveats are recorded here rather than smoothed over:
 *
 *  1. Pages 22 and 24 present these under "VIỆT ĐỨC GROUP hợp tác chiến lược
 *     cùng NIBELC". Most of the country lists are NIBELC's network, reached
 *     through that partnership - not direct contracts of Viet Duc Group. Each
 *     record says which it is.
 *  2. The logo strips are images. Names read from them are marked
 *     `needsVerification` and seeded as draft; the country lists were set as
 *     text in the source and are far more reliable.
 */

type PartnerSeed = SeedPartner & { needsVerification?: boolean };

const VIA_NIBELC = {
  vi: "Đối tác trong mạng lưới của NIBELC Group – đối tác chiến lược của Việt Đức Group.",
  en: "Partner within the network of NIBELC Group, a strategic partner of Viet Duc Group.",
  de: "Partner im Netzwerk der NIBELC Group, eines strategischen Partners der Viet Duc Group.",
  ja: "Viet Duc Group の戦略的パートナーである NIBELC Group のネットワークに属する提携先です。",
  ko: "Viet Duc Group의 전략적 파트너인 NIBELC Group 네트워크에 속한 협력사입니다.",
  "zh-TW": "隸屬於 Viet Duc Group 策略夥伴 NIBELC Group 網絡的合作夥伴。",
};

const LOGO_STRIP = {
  vi: "Đối tác nêu trong hồ sơ năng lực Việt Đức Group.",
  en: "Partner named in the Viet Duc Group capability profile.",
  de: "Im Leistungsprofil der Viet Duc Group genannter Partner.",
  ja: "Viet Duc Group の会社案内に記載された提携先です。",
  ko: "Viet Duc Group 역량 소개서에 실린 협력사입니다.",
  "zh-TW": "載於 Viet Duc Group 能力簡介中的合作夥伴。",
};

let order = 0;
const next = () => (order += 1);

export const PARTNERS: PartnerSeed[] = [
  // --- named on the partner logo strips (pages 6, 22) --------------------
  { slug: "nibelc-group", name: "NIBELC Group", kind: "group", country: "VN", note: {
      vi: "Tập đoàn hơn 20 năm kinh nghiệm trong lĩnh vực nhân lực và thực thi các dự án hạ tầng, công nghiệp tại hơn 15 quốc gia. Đối tác chiến lược của Việt Đức Group.",
      en: "A corporation with more than 20 years of experience in workforce deployment and in delivering infrastructure and industrial projects in more than 15 countries. Strategic partner of Viet Duc Group.",
      de: "Ein Konzern mit über 20 Jahren Erfahrung in der Personalvermittlung und in Infrastruktur- und Industrieprojekten in mehr als 15 Ländern. Strategischer Partner der Viet Duc Group.",
      ja: "人材派遣とインフラ・産業プロジェクトの遂行において 20 年以上の経験を持ち、15 か国以上で事業を展開する企業グループ。Viet Duc Group の戦略的パートナーです。",
      ko: "인력 파견과 인프라·산업 프로젝트 수행에서 20년 이상의 경험을 쌓았으며 15개국 이상에서 사업을 펼치는 기업 그룹입니다. Viet Duc Group의 전략적 파트너입니다.",
      "zh-TW": "在人力派遣與基礎建設、工業專案執行方面擁有逾 20 年經驗，業務遍及 15 個以上國家的企業集團。為 Viet Duc Group 的策略夥伴。",
    }, order: next(), provenance: fromProfileVi(24) },
  { slug: "samsung", name: "Samsung", kind: "enterprise", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22) },
  { slug: "hyundai", name: "Hyundai", kind: "enterprise", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22) },
  { slug: "cj-group", name: "CJ Group", kind: "group", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22) },
  { slug: "qatar-airways", name: "Qatar Airways", kind: "enterprise", country: "QA", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22) },
  { slug: "toda-corporation", name: "Toda Corporation", kind: "enterprise", country: "JP", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22) },
  { slug: "taisei", name: "Taisei", kind: "enterprise", country: "JP", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "lotte", name: "Lotte", kind: "enterprise", country: "KR", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22) },
  { slug: "hyosung", name: "Hyosung", kind: "enterprise", country: "KR", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "jabil", name: "Jabil", kind: "enterprise", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "kharafi-national", name: "Kharafi National", kind: "enterprise", country: "KW", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "kimabex-international", name: "Kimabex International", kind: "enterprise", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "queen-global", name: "Queen Global", kind: "enterprise", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(6), needsVerification: true },
  { slug: "apex-global-education", name: "Apex Global Education", kind: "institution", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "vinaenter-edu", name: "VinaEnter Edu", kind: "institution", country: "VN", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(22), needsVerification: true },
  { slug: "vonder-tour", name: "Vonder Tour", kind: "enterprise", note: LOGO_STRIP, order: next(), provenance: fromProfileVi(6), needsVerification: true },

  // --- Greece (page 24) ---------------------------------------------------
  { slug: "hellenic-hypermarkets-sklavenitis", name: "Hellenic Hypermarkets Sklavenitis S.A.", kind: "enterprise", country: "GR", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "apsi-pindos", name: "Agricultural Poultry Cooperative Pindos (APSI PINDOS)", kind: "association", country: "GR", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "etheas", name: "National Union of Agricultural Cooperatives of Greece (ETHEAS)", kind: "association", country: "GR", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "royal-hotel-and-suites", name: "Royal Hotel and Suites", kind: "enterprise", country: "GR", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "halkidiki-hotel-association", name: "Halkidiki Hotel Association", kind: "association", country: "GR", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "vamvalis", name: "Vamvalis S.A.", kind: "enterprise", country: "GR", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },

  // --- Germany (page 24) --------------------------------------------------
  { slug: "toennies-group", name: "Tönnies Group", kind: "group", country: "DE", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "peteces", name: "Peteces", kind: "enterprise", country: "DE", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24), needsVerification: true },
  { slug: "m-w-group", name: "M + W Group", kind: "group", country: "DE", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },

  // --- Austria (page 24) --------------------------------------------------
  { slug: "kainz-mayer-marchfeldtomaten", name: "Kainz & Mayer Marchfeldtomaten", kind: "enterprise", country: "AT", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "k-kasehs-qualitaetsgemuese", name: "K. Kasehs Qualitätsgemüse GmbH", kind: "enterprise", country: "AT", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24), needsVerification: true },
  { slug: "gartenbau-wallner", name: "Gartenbau Wallner GmbH", kind: "enterprise", country: "AT", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },

  // --- Hungary (page 24) --------------------------------------------------
  { slug: "samsung-hungary", name: "Samsung Hungary", kind: "enterprise", country: "HU", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "villeroy-boch-magyarorszag", name: "Villeroy & Boch Magyarország Kft", kind: "enterprise", country: "HU", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "gabor-varadi", name: "Gábor Varadi Kft", kind: "enterprise", country: "HU", region: "europe", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24), needsVerification: true },

  // --- Middle East & West Asia (page 24) ----------------------------------
  { slug: "deas", name: "DEAS", kind: "enterprise", region: "middle-east", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24), needsVerification: true },
  { slug: "hilton-abu-dhabi", name: "Hilton Abu Dhabi", kind: "enterprise", country: "AE", region: "middle-east", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24) },
  { slug: "bliss-group", name: "Bliss Group", kind: "group", region: "middle-east", note: VIA_NIBELC, order: next(), provenance: fromProfileVi(24), needsVerification: true },
];

export const ACTIVITIES: SeedActivity[] = [
  {
    slug: "chao-tan-sinh-vien",
    kind: "culture",
    order: 1,
    title: { vi: "Chào tân sinh viên", en: "Freshman welcome", de: "Begrüßung der Erstsemester", ja: "新入生歓迎", ko: "신입생 환영", "zh-TW": "迎新" },
    description: {
      vi: "Lễ đón tân học sinh – sinh viên đầu năm học, giới thiệu chương trình đào tạo, quy chế và các câu lạc bộ.",
      en: "The start-of-year welcome for new students, introducing the programmes, regulations and student clubs.",
      de: "Begrüßung der neuen Lernenden zu Jahresbeginn mit Vorstellung der Programme, Regeln und Clubs.",
      ja: "学年はじめの新入生歓迎式。教育課程、学則、そしてクラブ活動を紹介します。",
      ko: "학년 초에 열리는 신입생 환영식. 교육 과정과 학칙, 동아리를 소개합니다.",
      "zh-TW": "學年初的新生歡迎典禮，介紹課程、校規與各社團。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "hoi-thao-sinh-vien",
    kind: "sports",
    order: 2,
    title: { vi: "Hội thao sinh viên", en: "Student sports festival", de: "Sportfest der Studierenden", ja: "学生スポーツ大会", ko: "학생 체육대회", "zh-TW": "學生運動會" },
    description: {
      vi: "Giải thể thao thường niên với bóng đá, bóng chuyền, cầu lông và các nội dung tập thể.",
      en: "The annual sports meeting: football, volleyball, badminton and team events.",
      de: "Jährliches Sportfest mit Fußball, Volleyball, Badminton und Teamwettbewerben.",
      ja: "サッカー、バレーボール、バドミントン、団体競技を行う毎年恒例の大会です。",
      ko: "축구와 배구, 배드민턴, 단체 종목을 겨루는 해마다 열리는 대회입니다.",
      "zh-TW": "每年舉辦的運動賽會，項目包含足球、排球、羽球與團體競賽。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "cuoc-thi-tay-nghe",
    kind: "career",
    order: 3,
    title: { vi: "Cuộc thi tay nghề", en: "Skills competition", de: "Wettbewerb der beruflichen Fertigkeiten", ja: "技能コンテスト", ko: "기능 경진대회", "zh-TW": "技能競賽" },
    description: {
      vi: "Thi kỹ năng nghề giữa các lớp và các trường thành viên, chấm theo tiêu chí thực hành nghề nghiệp.",
      en: "A hands-on skills contest between classes and member schools, judged on practical criteria.",
      de: "Praktischer Fertigkeitswettbewerb zwischen Klassen und Mitgliedsschulen nach beruflichen Kriterien.",
      ja: "クラス対抗・加盟校対抗の技能競技会。実務基準にもとづいて採点します。",
      ko: "학급과 회원 학교가 겨루는 기능 경기로, 실무 기준에 따라 채점합니다.",
      "zh-TW": "班際與各成員學校之間的技能競賽，依實務標準評分。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "cuoc-thi-van-nghe",
    kind: "culture",
    order: 4,
    title: { vi: "Cuộc thi văn nghệ", en: "Arts competition", de: "Kunstwettbewerb", ja: "文化芸術コンテスト", ko: "예술 경연", "zh-TW": "藝文競賽" },
    description: {
      vi: "Các chương trình biểu diễn, giao lưu nghệ thuật và hội diễn sinh viên.",
      en: "Performances, arts exchanges and student talent shows.",
      de: "Aufführungen, künstlerischer Austausch und Talentwettbewerbe.",
      ja: "公演、芸術交流、そして学生の発表会です。",
      ko: "공연과 예술 교류, 학생 발표회입니다.",
      "zh-TW": "各式演出、藝術交流與學生成果發表。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "ngay-hoi-viec-lam",
    kind: "career",
    order: 5,
    title: { vi: "Ngày hội việc làm", en: "Job fair", de: "Jobmesse", ja: "就職フェア", ko: "취업 박람회", "zh-TW": "就業博覽會" },
    description: {
      vi: "Doanh nghiệp đối tác tham gia phỏng vấn và tuyển dụng trực tiếp tại trường.",
      en: "Partner employers interview and recruit on campus.",
      de: "Partnerunternehmen führen Bewerbungsgespräche und rekrutieren direkt an der Schule.",
      ja: "提携企業が学校で直接、面接と採用を行います。",
      ko: "협력 기업이 학교에서 직접 면접과 채용을 진행합니다.",
      "zh-TW": "合作企業直接到校面試與招募。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "hoat-dong-thien-nguyen",
    kind: "volunteer",
    order: 6,
    title: { vi: "Hoạt động thiện nguyện", en: "Volunteer activities", de: "Freiwilligenarbeit", ja: "ボランティア活動", ko: "봉사 활동", "zh-TW": "志工服務" },
    description: {
      vi: "Chương trình thiện nguyện, mùa hè xanh và hỗ trợ cộng đồng.",
      en: "Charity programmes, green summer campaigns and community support.",
      de: "Wohltätigkeitsprogramme, Sommeraktionen und Unterstützung der Gemeinschaft.",
      ja: "慈善活動、「緑の夏」キャンペーン、そして地域支援です。",
      ko: "자선 활동과 '푸른 여름' 캠페인, 지역사회 지원입니다.",
      "zh-TW": "公益活動、綠色暑期營隊與社區服務。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "team-building",
    kind: "soft_skills",
    order: 7,
    title: { vi: "Team building", en: "Team building", de: "Teambuilding", ja: "チームビルディング", ko: "팀 빌딩", "zh-TW": "團隊建立活動" },
    description: {
      vi: "Rèn luyện khả năng làm việc nhóm và tinh thần trách nhiệm.",
      en: "Developing teamwork skills and a sense of responsibility.",
      de: "Entwicklung von Teamfähigkeit und Verantwortungsbewusstsein.",
      ja: "チームで働く力と責任感を養います。",
      ko: "협업 능력과 책임감을 기릅니다.",
      "zh-TW": "培養團隊合作能力與責任感。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "tham-quan-doanh-nghiep",
    kind: "career",
    order: 8,
    title: { vi: "Tham quan doanh nghiệp", en: "Company visits", de: "Betriebsbesichtigungen", ja: "企業見学", ko: "기업 견학", "zh-TW": "企業參訪" },
    description: {
      vi: "Sinh viên trải nghiệm môi trường làm việc chuyên nghiệp ngay từ khi còn đi học.",
      en: "Students experience a professional working environment while still studying.",
      de: "Lernende erleben ein professionelles Arbeitsumfeld bereits während der Ausbildung.",
      ja: "在学中から本物の職場の空気に触れます。",
      ko: "재학 중에 실제 직장의 분위기를 직접 겪습니다.",
      "zh-TW": "學生在學期間即親身體驗專業職場環境。",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "giao-luu-quoc-te",
    kind: "international",
    order: 9,
    title: { vi: "Giao lưu quốc tế", en: "International exchange", de: "Internationaler Austausch", ja: "国際交流", ko: "국제 교류", "zh-TW": "國際交流" },
    description: {
      vi: "Chương trình giao lưu với đối tác nước ngoài, mở rộng tư duy quốc tế cho người học.",
      en: "Exchange programmes with overseas partners that broaden students' international outlook.",
      de: "Austauschprogramme mit ausländischen Partnern, die den internationalen Horizont erweitern.",
      ja: "海外の提携先との交流を通じて、学生の国際的な視野を広げます。",
      ko: "해외 협력사와의 교류를 통해 학생의 국제적 시야를 넓힙니다.",
      "zh-TW": "與海外夥伴的交流計畫，拓展學員的國際視野。",
    },
    provenance: fromProfileVi(23),
  },
];

/**
 * Every answer restates something the source documents say, with the page it
 * came from. No question here is answered from general knowledge.
 */
export const FAQS: SeedFaq[] = [
  {
    topic: "organisation",
    order: 1,
    question: {
      vi: "Việt Đức Group gồm những trường nào?",
      en: "Which schools make up Viet Duc Group?",
      de: "Aus welchen Schulen besteht die Viet Duc Group?",
      ja: "Viet Duc Group にはどの学校が含まれますか。",
      ko: "Viet Duc Group에는 어떤 학교들이 있나요?",
      "zh-TW": "Viet Duc Group 由哪些學校組成？",
    },
    answer: {
      vi: "Hệ thống gồm 6 trường thành viên: Trường Cao đẳng Công nghệ – Ngoại thương, Trường Trung cấp nghề Quốc tế (IVS), Trường Trung cấp Bách khoa Vũng Tàu, Trường Trung cấp Việt Hàn, Trường Trung cấp Công nghệ Việt Đức và Viện Đào tạo và Giáo dục ITW Berlin (CHLB Đức).",
      en: "The system has six member schools: Foreign Trade Technology College, International Vocational School (IVS), Bach Khoa Vung Tau Vocational School, Viet Han Vocational School, Viet Duc Vocational School of Technology, and the ITW Berlin Institute of Training and Education in Germany.",
      de: "Der Verbund umfasst sechs Mitgliedsschulen: Foreign Trade Technology College, International Vocational School (IVS), Bach Khoa Vung Tau, Viet Han, Viet Duc Berufsfachschule für Technik sowie das itw Berlin in Deutschland.",
      ja: "六つの加盟校で構成されます — 貿易技術短期大学、国際職業訓練学校(IVS)、ブンタウ工科中級学校、越韓中級学校、越独技術中級学校、そして ITW ベルリン教育訓練研究所(ドイツ連邦共和国)。",
      ko: "여섯 개 회원 학교로 이루어집니다 — 무역기술전문대학, 국제직업학교(IVS), 붕따우 공과중급학교, 베트남·한국 중급학교, 베트남·독일 기술중급학교, 그리고 ITW 베를린 교육훈련원(독일 연방공화국).",
      "zh-TW": "體系由六所成員學校組成：外貿科技專科學校、國際職業學校（IVS）、頭頓百科中級學校、越韓中級學校、越德科技中級學校，以及設於德意志聯邦共和國的 ITW 柏林教育訓練學院。",
    },
    provenance: fromProfileVi(3),
  },
  {
    topic: "organisation",
    order: 2,
    question: {
      vi: "Sứ mệnh và tầm nhìn của Việt Đức Group là gì?",
      en: "What are Viet Duc Group's vision and mission?",
      de: "Was sind Vision und Mission der Viet Duc Group?",
      ja: "Viet Duc Group のビジョンと使命は何ですか。",
      ko: "Viet Duc Group의 비전과 사명은 무엇인가요?",
      "zh-TW": "Viet Duc Group 的願景與使命是什麼？",
    },
    answer: {
      vi: "Tầm nhìn: trở thành hệ thống giáo dục nghề nghiệp uy tín hàng đầu Việt Nam, đạt chuẩn quốc tế, là lựa chọn tin cậy của người học và đối tác. Sứ mệnh: mang đến chương trình đào tạo chất lượng cao, gắn kết thực tiễn, tạo cơ hội học tập và việc làm, góp phần phát triển nguồn nhân lực và xã hội.",
      en: "Vision: to become a leading multi-field education system in Vietnam, with international standards, developing high-quality human resources. Mission: to provide high-quality, practical training programmes, helping learners build solid careers and contribute to the sustainable development of the country.",
      de: "Vision: ein führendes, fächerübergreifendes Bildungssystem in Vietnam nach internationalen Standards zu werden. Mission: hochwertige, praxisnahe Ausbildungsprogramme anzubieten, die Lernenden tragfähige Berufswege eröffnen.",
      ja: "ビジョン — ベトナムで最も信頼される職業教育の体系となり、国際水準を満たし、学ぶ人と提携先に選ばれる存在であること。使命 — 実務に根ざした質の高い教育課程を提供し、学びと就業の機会をつくり、人材と社会の発展に寄与すること。",
      ko: "비전 — 베트남에서 가장 신뢰받는 직업교육 체계로서 국제 수준을 갖추고, 배우는 이와 협력사가 믿고 선택하는 곳이 되는 것. 사명 — 실무에 밀착한 수준 높은 교육 과정을 제공하고 배움과 일자리의 기회를 만들어, 인재와 사회의 발전에 이바지하는 것.",
      "zh-TW": "願景：成為越南最具公信力的技職教育體系，達到國際標準，成為學習者與夥伴信賴的選擇。使命：提供貼近實務的高品質培訓課程，創造學習與就業機會，為人才培育與社會發展盡一份力。",
    },
    provenance: fromProfileVi(2),
  },
  {
    topic: "admissions",
    order: 3,
    question: {
      vi: "Học sinh tốt nghiệp lớp 9 có học được không?",
      en: "Can students who finished grade 9 enrol?",
      de: "Können Jugendliche nach der 9. Klasse aufgenommen werden?",
      ja: "中学校（9年生）を卒業した生徒でも入学できますか。",
      ko: "9학년(중학교)을 마친 학생도 입학할 수 있나요?",
      "zh-TW": "國中（九年級）畢業的學生可以就讀嗎？",
    },
    answer: {
      vi: "Có. Hồ sơ năng lực nêu các trường thành viên đào tạo ở hệ cao đẳng, trung cấp và hệ 9+ (dành cho học sinh tốt nghiệp trung học cơ sở). Điều kiện tuyển sinh cụ thể từng ngành do phòng tuyển sinh của trường thành viên xác nhận.",
      en: "Yes. The capability profile states that member schools train at college, intermediate and 9+ levels, the last of which is for students who have completed lower secondary school. Exact entry requirements per programme are confirmed by each school's admissions office.",
      de: "Ja. Das Leistungsprofil nennt Ausbildung auf College-, Fachschul- und 9+-Niveau; letzteres richtet sich an Absolventinnen und Absolventen der Sekundarstufe I. Die genauen Zugangsvoraussetzungen bestätigt das Zulassungsbüro der jeweiligen Schule.",
      ja: "できます。会社案内によれば、加盟各校は短期大学課程・中級課程に加え、中学校卒業者向けの「9+」課程を設けています。課程ごとの詳しい出願条件は、各校の入学窓口が確認します。",
      ko: "가능합니다. 역량 소개서에 따르면 회원 학교들은 전문대 과정과 중급 과정 외에 중학교 졸업자를 위한 '9+' 과정을 운영합니다. 과정별 구체적인 지원 자격은 각 학교 입학 부서가 확인해 드립니다.",
      "zh-TW": "可以。能力簡介載明，各成員學校除專科與中級課程外，另設有供國中畢業生就讀的「9+」學制。各課程的具體入學條件，由所屬學校招生單位確認。",
    },
    provenance: fromProfileVi(3),
  },
  {
    topic: "programs",
    order: 4,
    question: {
      vi: "Tỷ lệ thực hành trong chương trình là bao nhiêu?",
      en: "How much of the programme is hands-on?",
      de: "Wie hoch ist der Praxisanteil?",
      ja: "課程のうち実習はどれくらいの割合ですか。",
      ko: "과정에서 실습이 차지하는 비중은 얼마나 되나요?",
      "zh-TW": "課程中實作所占的比例是多少？",
    },
    answer: {
      vi: "Hồ sơ năng lực nêu định hướng thực hành chiếm khoảng 70% thời lượng đào tạo tại các trường thành viên chú trọng kỹ thuật – công nghệ. Tỷ lệ cụ thể của từng ngành do chương trình đào tạo của trường quy định.",
      en: "The profile states that practice accounts for around 70% of training time at the technically oriented member schools. The exact share for each programme is set by the school's curriculum.",
      de: "Das Profil nennt einen Praxisanteil von rund 70 % der Ausbildungszeit an den technisch ausgerichteten Mitgliedsschulen. Der genaue Anteil je Programm ergibt sich aus dem Curriculum der Schule.",
      ja: "会社案内では、技術・工学を重んじる加盟校において実習が訓練時間のおよそ 70% を占めるとされています。課程ごとの正確な割合は、各校の教育課程が定めます。",
      ko: "역량 소개서는 기술·공학 중심 회원 학교에서 실습이 훈련 시간의 약 70%를 차지한다고 밝히고 있습니다. 과정별 정확한 비율은 각 학교의 교육 과정이 정합니다.",
      "zh-TW": "能力簡介指出，在著重技術與工程的成員學校中，實作約占訓練時數的 70%。各課程的確切比例，由學校的課程規劃訂定。",
    },
    provenance: fromProfileVi(8),
  },
  {
    topic: "international",
    order: 5,
    question: {
      vi: "ITW Berlin có vai trò gì trong hệ thống?",
      en: "What is ITW Berlin's role in the system?",
      de: "Welche Rolle spielt das itw Berlin im Verbund?",
      ja: "体系のなかで ITW ベルリンはどんな役割を担っていますか。",
      ko: "체계 안에서 ITW 베를린은 어떤 역할을 하나요?",
      "zh-TW": "ITW 柏林在體系中扮演什麼角色？",
    },
    answer: {
      vi: "ITW Berlin (Institut für Aus- und Weiterbildung gGmbH) là tổ chức giáo dục tại Đức, chuyển giao chương trình đào tạo, phương pháp giảng dạy và thiết bị theo chuẩn Đức về Việt Nam, đồng thời đào tạo tiếng Đức và kỹ năng nghề để người học sẵn sàng cho thị trường lao động Đức và châu Âu.",
      en: "ITW Berlin (Institut für Aus- und Weiterbildung gGmbH) is a German educational institution that transfers training programmes, teaching methods and equipment to German standards into Vietnam, and provides German language and vocational skills training for the German and European labour markets.",
      de: "Das itw Berlin (Institut für Aus- und Weiterbildung gGmbH) überträgt Ausbildungsprogramme, Lehrmethoden und Ausstattung nach deutschem Standard nach Vietnam und vermittelt Deutschkenntnisse sowie berufliche Fertigkeiten für den deutschen und europäischen Arbeitsmarkt.",
      ja: "ITW ベルリン(Institut für Aus- und Weiterbildung gGmbH)はドイツの教育機関で、ドイツ基準の教育課程・指導法・設備をベトナムへ移転するとともに、ドイツおよびヨーロッパの労働市場に備えたドイツ語教育と職業技能訓練を行っています。",
      ko: "ITW 베를린(Institut für Aus- und Weiterbildung gGmbH)은 독일의 교육 기관으로, 독일 기준의 교육 과정과 교수법, 설비를 베트남으로 이전하는 한편 독일과 유럽 노동시장에 대비한 독일어 교육과 직업 기능 훈련을 제공합니다.",
      "zh-TW": "ITW 柏林（Institut für Aus- und Weiterbildung gGmbH）為德國的教育機構，將德國標準的課程、教學方法與設備移轉至越南，同時提供德語教學與職業技能訓練，協助學員為德國及歐洲勞動市場做好準備。",
    },
    provenance: fromProfileVi(21),
  },
  {
    topic: "admissions",
    order: 6,
    question: {
      vi: "Học phí các ngành là bao nhiêu?",
      en: "How much is tuition?",
      de: "Wie hoch sind die Gebühren?",
      ja: "各課程の学費はいくらですか。",
      ko: "과정별 학비는 얼마인가요?",
      "zh-TW": "各課程的學費是多少？",
    },
    answer: {
      vi: "Các tài liệu chính thức hiện có của Việt Đức Group không công bố mức học phí. Vui lòng liên hệ phòng tuyển sinh của trường thành viên để nhận thông báo học phí chính thức cho từng ngành và từng khoá.",
      en: "The official Viet Duc Group documents currently available do not publish tuition figures. Please contact the admissions office of the member school for the official fee notice for each programme and intake.",
      de: "Die derzeit vorliegenden offiziellen Unterlagen der Viet Duc Group enthalten keine Gebührenangaben. Bitte wenden Sie sich an das Zulassungsbüro der jeweiligen Schule.",
      ja: "現在ある Viet Duc Group の正式資料に学費の記載はありません。課程ごと・期ごとの正式な学費のご案内は、加盟校の入学窓口へお問い合わせください。",
      ko: "현재 확보된 Viet Duc Group의 공식 자료에는 학비가 실려 있지 않습니다. 과정별·기수별 공식 학비 안내는 회원 학교의 입학 부서로 문의해 주세요.",
      "zh-TW": "Viet Duc Group 現有的正式文件並未公布學費金額。各課程與各期的正式學費通知，請洽成員學校的招生單位。",
    },
    provenance: fromProfileVi(1),
  },
  {
    topic: "admissions",
    order: 7,
    question: {
      vi: "Lịch khai giảng khi nào?",
      en: "When do courses start?",
      de: "Wann beginnen die Kurse?",
      ja: "開講はいつですか。",
      ko: "개강은 언제인가요?",
      "zh-TW": "什麼時候開課？",
    },
    answer: {
      vi: "Hồ sơ năng lực không nêu lịch khai giảng cụ thể. Lịch khai giảng do từng trường thành viên thông báo theo năm học; bạn có thể để lại thông tin để được báo khi có lịch mới.",
      en: "The capability profile does not state a specific intake calendar. Each member school announces intakes by academic year; leave your details and we will notify you when a new intake opens.",
      de: "Das Leistungsprofil nennt keinen konkreten Terminplan. Jede Mitgliedsschule gibt die Kursstarts pro Schuljahr bekannt; hinterlassen Sie Ihre Daten für eine Benachrichtigung.",
      ja: "会社案内に具体的な開講日程の記載はありません。開講は各加盟校が学年ごとに告知します。ご連絡先をお預けいただければ、新しい日程が決まりしだいお知らせします。",
      ko: "역량 소개서에는 구체적인 개강 일정이 없습니다. 개강은 회원 학교마다 학년 단위로 공지합니다. 연락처를 남겨 주시면 새 일정이 나오는 대로 알려 드립니다.",
      "zh-TW": "能力簡介並未載明具體開課時程。開課日期由各成員學校依學年公告；您可留下聯絡方式，新梯次確定時我們會通知您。",
    },
    provenance: fromProfileVi(1),
  },
  {
    topic: "partners",
    order: 8,
    question: {
      vi: "Việt Đức Group hợp tác với doanh nghiệp như thế nào?",
      en: "How does Viet Duc Group work with employers?",
      de: "Wie arbeitet die Viet Duc Group mit Unternehmen zusammen?",
      ja: "Viet Duc Group は企業とどのように連携していますか。",
      ko: "Viet Duc Group은 기업과 어떻게 협력하나요?",
      "zh-TW": "Viet Duc Group 如何與企業合作？",
    },
    answer: {
      vi: "Hồ sơ nêu bốn hình thức hợp tác: liên kết đào tạo (phối hợp doanh nghiệp xây dựng chương trình), thực tập doanh nghiệp, tuyển dụng trực tiếp qua ngày hội việc làm, và định hướng nghề nghiệp – hỗ trợ kỹ năng mềm, phỏng vấn.",
      en: "The profile names four forms of cooperation: co-developing training programmes with employers, internships in real workplaces, direct recruitment through job fairs, and career orientation covering soft skills and interviews.",
      de: "Das Profil nennt vier Formen: gemeinsame Programmentwicklung mit Unternehmen, Praktika im Betrieb, Direktrekrutierung über Jobmessen sowie Berufsorientierung mit Soft-Skills- und Bewerbungstraining.",
      ja: "会社案内は四つの形を挙げています — 企業と共同で教育課程をつくる連携教育、企業での実習、就職フェアでの直接採用、そしてソフトスキルや面接を支える職業指導です。",
      ko: "역량 소개서는 네 가지 형태를 듭니다 — 기업과 함께 교육 과정을 만드는 연계 교육, 기업 현장 실습, 취업 박람회를 통한 직접 채용, 그리고 소프트 스킬과 면접을 돕는 진로 지도입니다.",
      "zh-TW": "能力簡介列出四種合作方式：與企業共同規劃課程的合作辦學、企業實習、透過就業博覽會直接招募，以及涵蓋軟實力與面試輔導的職涯輔導。",
    },
    provenance: fromProfileVi(22),
  },
];
