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
};

const LOGO_STRIP = {
  vi: "Đối tác nêu trong hồ sơ năng lực Việt Đức Group.",
  en: "Partner named in the Viet Duc Group capability profile.",
  de: "Im Leistungsprofil der Viet Duc Group genannter Partner.",
};

let order = 0;
const next = () => (order += 1);

export const PARTNERS: PartnerSeed[] = [
  // --- named on the partner logo strips (pages 6, 22) --------------------
  { slug: "nibelc-group", name: "NIBELC Group", kind: "group", country: "VN", note: {
      vi: "Tập đoàn hơn 20 năm kinh nghiệm trong lĩnh vực nhân lực và thực thi các dự án hạ tầng, công nghiệp tại hơn 15 quốc gia. Đối tác chiến lược của Việt Đức Group.",
      en: "A corporation with more than 20 years of experience in workforce deployment and in delivering infrastructure and industrial projects in more than 15 countries. Strategic partner of Viet Duc Group.",
      de: "Ein Konzern mit über 20 Jahren Erfahrung in der Personalvermittlung und in Infrastruktur- und Industrieprojekten in mehr als 15 Ländern. Strategischer Partner der Viet Duc Group.",
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
    title: { vi: "Chào tân sinh viên", en: "Freshman welcome", de: "Begrüßung der Erstsemester" },
    description: {
      vi: "Lễ đón tân học sinh – sinh viên đầu năm học, giới thiệu chương trình đào tạo, quy chế và các câu lạc bộ.",
      en: "The start-of-year welcome for new students, introducing the programmes, regulations and student clubs.",
      de: "Begrüßung der neuen Lernenden zu Jahresbeginn mit Vorstellung der Programme, Regeln und Clubs.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "hoi-thao-sinh-vien",
    kind: "sports",
    order: 2,
    title: { vi: "Hội thao sinh viên", en: "Student sports festival", de: "Sportfest der Studierenden" },
    description: {
      vi: "Giải thể thao thường niên với bóng đá, bóng chuyền, cầu lông và các nội dung tập thể.",
      en: "The annual sports meeting: football, volleyball, badminton and team events.",
      de: "Jährliches Sportfest mit Fußball, Volleyball, Badminton und Teamwettbewerben.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "cuoc-thi-tay-nghe",
    kind: "career",
    order: 3,
    title: { vi: "Cuộc thi tay nghề", en: "Skills competition", de: "Wettbewerb der beruflichen Fertigkeiten" },
    description: {
      vi: "Thi kỹ năng nghề giữa các lớp và các trường thành viên, chấm theo tiêu chí thực hành nghề nghiệp.",
      en: "A hands-on skills contest between classes and member schools, judged on practical criteria.",
      de: "Praktischer Fertigkeitswettbewerb zwischen Klassen und Mitgliedsschulen nach beruflichen Kriterien.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "cuoc-thi-van-nghe",
    kind: "culture",
    order: 4,
    title: { vi: "Cuộc thi văn nghệ", en: "Arts competition", de: "Kunstwettbewerb" },
    description: {
      vi: "Các chương trình biểu diễn, giao lưu nghệ thuật và hội diễn sinh viên.",
      en: "Performances, arts exchanges and student talent shows.",
      de: "Aufführungen, künstlerischer Austausch und Talentwettbewerbe.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "ngay-hoi-viec-lam",
    kind: "career",
    order: 5,
    title: { vi: "Ngày hội việc làm", en: "Job fair", de: "Jobmesse" },
    description: {
      vi: "Doanh nghiệp đối tác tham gia phỏng vấn và tuyển dụng trực tiếp tại trường.",
      en: "Partner employers interview and recruit on campus.",
      de: "Partnerunternehmen führen Bewerbungsgespräche und rekrutieren direkt an der Schule.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "hoat-dong-thien-nguyen",
    kind: "volunteer",
    order: 6,
    title: { vi: "Hoạt động thiện nguyện", en: "Volunteer activities", de: "Freiwilligenarbeit" },
    description: {
      vi: "Chương trình thiện nguyện, mùa hè xanh và hỗ trợ cộng đồng.",
      en: "Charity programmes, green summer campaigns and community support.",
      de: "Wohltätigkeitsprogramme, Sommeraktionen und Unterstützung der Gemeinschaft.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "team-building",
    kind: "soft_skills",
    order: 7,
    title: { vi: "Team building", en: "Team building", de: "Teambuilding" },
    description: {
      vi: "Rèn luyện khả năng làm việc nhóm và tinh thần trách nhiệm.",
      en: "Developing teamwork skills and a sense of responsibility.",
      de: "Entwicklung von Teamfähigkeit und Verantwortungsbewusstsein.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "tham-quan-doanh-nghiep",
    kind: "career",
    order: 8,
    title: { vi: "Tham quan doanh nghiệp", en: "Company visits", de: "Betriebsbesichtigungen" },
    description: {
      vi: "Sinh viên trải nghiệm môi trường làm việc chuyên nghiệp ngay từ khi còn đi học.",
      en: "Students experience a professional working environment while still studying.",
      de: "Lernende erleben ein professionelles Arbeitsumfeld bereits während der Ausbildung.",
    },
    provenance: fromProfileVi(23),
  },
  {
    slug: "giao-luu-quoc-te",
    kind: "international",
    order: 9,
    title: { vi: "Giao lưu quốc tế", en: "International exchange", de: "Internationaler Austausch" },
    description: {
      vi: "Chương trình giao lưu với đối tác nước ngoài, mở rộng tư duy quốc tế cho người học.",
      en: "Exchange programmes with overseas partners that broaden students' international outlook.",
      de: "Austauschprogramme mit ausländischen Partnern, die den internationalen Horizont erweitern.",
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
    },
    answer: {
      vi: "Hệ thống gồm 6 trường thành viên: Trường Cao đẳng Công nghệ – Ngoại thương, Trường Trung cấp nghề Quốc tế (IVS), Trường Trung cấp Bách khoa Vũng Tàu, Trường Trung cấp Việt Hàn, Trường Trung cấp Công nghệ Việt Đức và Viện Đào tạo và Giáo dục ITW Berlin (CHLB Đức).",
      en: "The system has six member schools: Foreign Trade Technology College, International Vocational School (IVS), Bach Khoa Vung Tau Vocational School, Viet Han Vocational School, Viet Duc Vocational School of Technology, and the ITW Berlin Institute of Training and Education in Germany.",
      de: "Der Verbund umfasst sechs Mitgliedsschulen: Foreign Trade Technology College, International Vocational School (IVS), Bach Khoa Vung Tau, Viet Han, Viet Duc Berufsfachschule für Technik sowie das itw Berlin in Deutschland.",
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
    },
    answer: {
      vi: "Tầm nhìn: trở thành hệ thống giáo dục nghề nghiệp uy tín hàng đầu Việt Nam, đạt chuẩn quốc tế, là lựa chọn tin cậy của người học và đối tác. Sứ mệnh: mang đến chương trình đào tạo chất lượng cao, gắn kết thực tiễn, tạo cơ hội học tập và việc làm, góp phần phát triển nguồn nhân lực và xã hội.",
      en: "Vision: to become a leading multi-field education system in Vietnam, with international standards, developing high-quality human resources. Mission: to provide high-quality, practical training programmes, helping learners build solid careers and contribute to the sustainable development of the country.",
      de: "Vision: ein führendes, fächerübergreifendes Bildungssystem in Vietnam nach internationalen Standards zu werden. Mission: hochwertige, praxisnahe Ausbildungsprogramme anzubieten, die Lernenden tragfähige Berufswege eröffnen.",
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
    },
    answer: {
      vi: "Có. Hồ sơ năng lực nêu các trường thành viên đào tạo ở hệ cao đẳng, trung cấp và hệ 9+ (dành cho học sinh tốt nghiệp trung học cơ sở). Điều kiện tuyển sinh cụ thể từng ngành do phòng tuyển sinh của trường thành viên xác nhận.",
      en: "Yes. The capability profile states that member schools train at college, intermediate and 9+ levels, the last of which is for students who have completed lower secondary school. Exact entry requirements per programme are confirmed by each school's admissions office.",
      de: "Ja. Das Leistungsprofil nennt Ausbildung auf College-, Fachschul- und 9+-Niveau; letzteres richtet sich an Absolventinnen und Absolventen der Sekundarstufe I. Die genauen Zugangsvoraussetzungen bestätigt das Zulassungsbüro der jeweiligen Schule.",
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
    },
    answer: {
      vi: "Hồ sơ năng lực nêu định hướng thực hành chiếm khoảng 70% thời lượng đào tạo tại các trường thành viên chú trọng kỹ thuật – công nghệ. Tỷ lệ cụ thể của từng ngành do chương trình đào tạo của trường quy định.",
      en: "The profile states that practice accounts for around 70% of training time at the technically oriented member schools. The exact share for each programme is set by the school's curriculum.",
      de: "Das Profil nennt einen Praxisanteil von rund 70 % der Ausbildungszeit an den technisch ausgerichteten Mitgliedsschulen. Der genaue Anteil je Programm ergibt sich aus dem Curriculum der Schule.",
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
    },
    answer: {
      vi: "ITW Berlin (Institut für Aus- und Weiterbildung gGmbH) là tổ chức giáo dục tại Đức, chuyển giao chương trình đào tạo, phương pháp giảng dạy và thiết bị theo chuẩn Đức về Việt Nam, đồng thời đào tạo tiếng Đức và kỹ năng nghề để người học sẵn sàng cho thị trường lao động Đức và châu Âu.",
      en: "ITW Berlin (Institut für Aus- und Weiterbildung gGmbH) is a German educational institution that transfers training programmes, teaching methods and equipment to German standards into Vietnam, and provides German language and vocational skills training for the German and European labour markets.",
      de: "Das itw Berlin (Institut für Aus- und Weiterbildung gGmbH) überträgt Ausbildungsprogramme, Lehrmethoden und Ausstattung nach deutschem Standard nach Vietnam und vermittelt Deutschkenntnisse sowie berufliche Fertigkeiten für den deutschen und europäischen Arbeitsmarkt.",
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
    },
    answer: {
      vi: "Các tài liệu chính thức hiện có của Việt Đức Group không công bố mức học phí. Vui lòng liên hệ phòng tuyển sinh của trường thành viên để nhận thông báo học phí chính thức cho từng ngành và từng khoá.",
      en: "The official Viet Duc Group documents currently available do not publish tuition figures. Please contact the admissions office of the member school for the official fee notice for each programme and intake.",
      de: "Die derzeit vorliegenden offiziellen Unterlagen der Viet Duc Group enthalten keine Gebührenangaben. Bitte wenden Sie sich an das Zulassungsbüro der jeweiligen Schule.",
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
    },
    answer: {
      vi: "Hồ sơ năng lực không nêu lịch khai giảng cụ thể. Lịch khai giảng do từng trường thành viên thông báo theo năm học; bạn có thể để lại thông tin để được báo khi có lịch mới.",
      en: "The capability profile does not state a specific intake calendar. Each member school announces intakes by academic year; leave your details and we will notify you when a new intake opens.",
      de: "Das Leistungsprofil nennt keinen konkreten Terminplan. Jede Mitgliedsschule gibt die Kursstarts pro Schuljahr bekannt; hinterlassen Sie Ihre Daten für eine Benachrichtigung.",
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
    },
    answer: {
      vi: "Hồ sơ nêu bốn hình thức hợp tác: liên kết đào tạo (phối hợp doanh nghiệp xây dựng chương trình), thực tập doanh nghiệp, tuyển dụng trực tiếp qua ngày hội việc làm, và định hướng nghề nghiệp – hỗ trợ kỹ năng mềm, phỏng vấn.",
      en: "The profile names four forms of cooperation: co-developing training programmes with employers, internships in real workplaces, direct recruitment through job fairs, and career orientation covering soft skills and interviews.",
      de: "Das Profil nennt vier Formen: gemeinsame Programmentwicklung mit Unternehmen, Praktika im Betrieb, Direktrekrutierung über Jobmessen sowie Berufsorientierung mit Soft-Skills- und Bewerbungstraining.",
    },
    provenance: fromProfileVi(22),
  },
];
