import { fromProfileVi, type SeedCategory, type SeedDocument, type SeedSchool } from "./types";

/** The four distinct source PDFs. Two of the six files on disk are byte-identical duplicates. */
export const DOCUMENTS: SeedDocument[] = [
  {
    slug: "profile-viet-duc-vi",
    title: {
      vi: "PROFILE VIỆT ĐỨC GROUP (bản tiếng Việt)",
      en: "Viet Duc Group profile (Vietnamese edition)",
      de: "Viet Duc Group Profil (vietnamesische Ausgabe)",
    },
    originalName: "PROFILE VIỆT ĐỨC (1).pdf",
    language: "vi",
    pageCount: 25,
    ocrUsed: true,
    note: "Hồ sơ năng lực chính thức. Trang 4–20 là bản chụp các quyết định thành lập và giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp.",
  },
  {
    slug: "profile-viet-duc-en",
    title: {
      vi: "PROFILE VIỆT ĐỨC GROUP (bản tiếng Anh)",
      en: "Viet Duc Group profile (English edition)",
      de: "Viet Duc Group Profil (englische Ausgabe)",
    },
    originalName: "PROFILE VIỆT ĐỨC ENGLISH2.pdf.pdf",
    language: "en",
    pageCount: 25,
    ocrUsed: true,
    note: "Bản tiếng Anh của cùng hồ sơ. Các trang giấy phép giữ nguyên tiếng Việt.",
  },
  {
    slug: "nibelc-profile-vi",
    title: {
      vi: "Hồ sơ năng lực NIBELC Group (bản tiếng Việt)",
      en: "NIBELC Group profile (Vietnamese edition)",
      de: "NIBELC Group Profil (vietnamesische Ausgabe)",
    },
    originalName: "VI_Hồ sơ Năng lực NIBELC Group.pdf",
    language: "vi",
    pageCount: 46,
    ocrUsed: true,
    note: "Hồ sơ của NIBELC Group – đối tác chiến lược, không phải đơn vị thành viên của Việt Đức Group.",
  },
  {
    slug: "nibelc-profile-en",
    title: {
      vi: "Hồ sơ năng lực NIBELC Group (bản tiếng Anh)",
      en: "NIBELC Group profile (English edition)",
      de: "NIBELC Group Profil (englische Ausgabe)",
    },
    originalName: "ENG_NIBELC Group Profile.pdf",
    language: "en",
    pageCount: 65,
    ocrUsed: true,
    note: "Hồ sơ của NIBELC Group – đối tác chiến lược.",
  },
];

/**
 * Fields of study. The first six mirror the structure the organisation already
 * used on its previous site; the last three exist because the licences list
 * occupations that do not fit any of those six.
 */
export const CATEGORIES: SeedCategory[] = [
  {
    slug: "ky-thuat-cong-nghiep",
    order: 1,
    name: {
      vi: "Kỹ thuật – Công nghiệp",
      en: "Engineering & industry",
      de: "Technik & Industrie",
    },
    description: {
      vi: "Ô tô, điện, điện tử, cơ khí, xây dựng và các nghề kỹ thuật gắn với sản xuất.",
      en: "Automotive, electrical, electronics, mechanical engineering, construction and production trades.",
      de: "Fahrzeugtechnik, Elektrotechnik, Elektronik, Maschinenbau, Bau und produktionsnahe Berufe.",
    },
  },
  {
    slug: "cong-nghe-thong-tin",
    order: 2,
    name: { vi: "Công nghệ thông tin", en: "Information technology", de: "Informationstechnik" },
    description: {
      vi: "Phát triển phần mềm, quản trị mạng, thiết kế đồ họa và hệ thống thông tin.",
      en: "Software, network administration, graphic design and information systems.",
      de: "Software, Netzwerkadministration, Grafikdesign und Informationssysteme.",
    },
  },
  {
    slug: "kinh-te-quan-tri",
    order: 3,
    name: { vi: "Kinh tế – Quản trị", en: "Business & management", de: "Wirtschaft & Management" },
    description: {
      vi: "Kinh doanh, kế toán, tài chính, logistics, marketing và quản trị doanh nghiệp.",
      en: "Business, accounting, finance, logistics, marketing and enterprise management.",
      de: "Betriebswirtschaft, Rechnungswesen, Finanzen, Logistik, Marketing und Unternehmensführung.",
    },
  },
  {
    slug: "du-lich-dich-vu",
    order: 4,
    name: { vi: "Du lịch – Dịch vụ", en: "Tourism & hospitality", de: "Tourismus & Gastgewerbe" },
    description: {
      vi: "Lữ hành, khách sạn, nhà hàng, chế biến món ăn và nghiệp vụ dịch vụ.",
      en: "Travel, hotels, restaurants, culinary arts and service operations.",
      de: "Reise, Hotellerie, Gastronomie, Küche und Servicetätigkeiten.",
    },
  },
  {
    slug: "ngon-ngu",
    order: 5,
    name: { vi: "Ngôn ngữ", en: "Languages", de: "Sprachen" },
    description: {
      vi: "Tiếng Anh, Đức, Hàn, Nhật, Trung và biên – phiên dịch chuyên ngành.",
      en: "English, German, Korean, Japanese, Chinese and specialised interpreting.",
      de: "Englisch, Deutsch, Koreanisch, Japanisch, Chinesisch und Fachdolmetschen.",
    },
  },
  {
    slug: "cham-soc-suc-khoe",
    order: 6,
    name: { vi: "Chăm sóc sức khỏe & sắc đẹp", en: "Health & beauty care", de: "Gesundheit & Schönheitspflege" },
    description: {
      vi: "Chăm sóc sắc đẹp và các nghề chăm sóc con người.",
      en: "Beauty care and personal-care occupations.",
      de: "Schönheitspflege und personennahe Dienstleistungsberufe.",
    },
  },
  {
    slug: "su-pham",
    order: 7,
    name: { vi: "Sư phạm", en: "Teacher training", de: "Pädagogik" },
    description: {
      vi: "Giáo dục mầm non và giáo dục tiểu học trình độ trung cấp.",
      en: "Pre-school and primary teaching at intermediate level.",
      de: "Vorschul- und Grundschulpädagogik auf mittlerer Stufe.",
    },
  },
  {
    slug: "truyen-thong",
    order: 8,
    name: { vi: "Báo chí – Truyền thông", en: "Journalism & media", de: "Journalismus & Medien" },
  },
  {
    slug: "luat-hanh-chinh",
    order: 9,
    name: { vi: "Luật – Hành chính", en: "Law & administration", de: "Recht & Verwaltung" },
  },
];

export const SCHOOLS: SeedSchool[] = [
  {
    slug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 1,
    name: {
      vi: "Trường Cao đẳng Công nghệ – Ngoại thương",
      en: "Foreign Trade Technology College",
      de: "Foreign Trade Technology College",
    },
    shortName: { vi: "Cao đẳng Công nghệ Ngoại thương", en: "Foreign Trade Technology College" },
    tagline: {
      vi: "Hội nhập – Sáng tạo – Thành công",
      en: "Integration – Creativity – Success",
      de: "Integration – Kreativität – Erfolg",
    },
    summary: {
      vi: "Trường Cao đẳng Công nghệ Ngoại thương là cơ sở đào tạo trực thuộc hệ thống Việt Đức Group, với sứ mệnh cung cấp nguồn nhân lực có tay nghề cao; sáng tạo, đột phá tư duy và có thể nghiên cứu ứng dụng trong thực tế, mang đến cơ hội học tập, phát triển con người toàn diện, hướng đến sự thành công. Góp phần phát triển nguồn nhân lực phục vụ sự nghiệp hội nhập quốc tế.",
      en: "Foreign Trade Technology College is a reputable training institution within the Viet Duc Group system. Its mission is to provide highly skilled human resources with innovative, breakthrough thinking and the ability to apply research in practice, offering opportunities for learning and all-round personal development on the way to success, and contributing to the human resources that serve international integration.",
      de: "Das Foreign Trade Technology College gehört zum Verbund der Viet Duc Group. Sein Auftrag ist die Ausbildung hoch qualifizierter Fachkräfte mit innovativem Denken und praktischer Anwendungsfähigkeit – für die persönliche Entwicklung der Lernenden und für Fachkräfte, die die internationale Integration des Landes tragen.",
    },
    legalNameEn: "Foreign Trade & Technology College",
    city: { vi: "Đà Nẵng", en: "Da Nang", de: "Da Nang" },
    address: "Số 42–46 Phan Châu Trinh, quận Hải Châu, thành phố Đà Nẵng",
    phone: "0818 42 44 46",
    email: "ngoaithuongeducation@gmail.com",
    website: "http://www.ntg.edu.vn",
    coverPath: "/media/schools/cao-dang-cong-nghe-ngoai-thuong.webp",
    logoPath: "/media/schools/logos/cao-dang-cong-nghe-ngoai-thuong.webp",
    highlights: {
      vi: [
        "Đào tạo đa ngành, đa nghề ở hệ cao đẳng, trung cấp và 9+",
        "Chú trọng thực hành, gắn kết doanh nghiệp",
        "Định hướng ứng dụng, hội nhập quốc tế",
      ],
      en: [
        "Multi-disciplinary education at college, intermediate and 9+ levels",
        "Practice-oriented training closely connected with enterprises",
        "Career-focused programmes with international integration",
      ],
      de: [
        "Fächerübergreifende Ausbildung auf College-, Fachschul- und 9+-Niveau",
        "Praxisorientierte Ausbildung in enger Verbindung mit Unternehmen",
        "Berufsbezogene Programme mit internationaler Ausrichtung",
      ],
    },
    legalRefs: [
      {
        label: { vi: "Quyết định thành lập Trường Cao đẳng Lạc Việt", en: "Decision establishing Lac Viet College" },
        number: "5996/QĐ-BGDĐT",
        date: "2008-09-10",
        issuer: { vi: "Bộ Giáo dục và Đào tạo", en: "Ministry of Education and Training" },
      },
      {
        label: {
          vi: "Quyết định đổi tên thành Trường Cao đẳng Công nghệ – Ngoại thương",
          en: "Decision renaming to Foreign Trade Technology College",
        },
        number: "1279/QĐ-LĐTBXH",
        date: "2023-08-30",
        issuer: {
          vi: "Bộ Lao động – Thương binh và Xã hội",
          en: "Ministry of Labour, Invalids and Social Affairs",
        },
      },
      {
        label: {
          vi: "Giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp",
          en: "Certificate of vocational education activity registration",
        },
        number: "69/2023/GCNĐKHĐ-TCGDNN",
        date: "2023-09-14",
        issuer: { vi: "Tổng cục Giáo dục nghề nghiệp", en: "Directorate of Vocational Education and Training" },
      },
    ],
    stats: [
      { value: "15+", label: { vi: "năm hình thành và phát triển", en: "years of formation and development", de: "Jahre Aufbau und Entwicklung" } },
      { value: "5.000+", label: { vi: "học sinh, sinh viên đang theo học", en: "students enrolled", de: "eingeschriebene Lernende" } },
      { value: "200+", label: { vi: "doanh nghiệp đối tác", en: "partner enterprises", de: "Partnerunternehmen" } },
      { value: "98%", label: { vi: "sinh viên có việc làm sau tốt nghiệp", en: "graduates employed after graduation", de: "Absolventen in Beschäftigung" } },
    ],
    provenance: fromProfileVi(4),
    editorNote:
      "Trang thiết kế (tr.4) nêu ngành 'Cử nhân Điều dưỡng' và 'Cao đẳng Điều dưỡng' nhưng giấy chứng nhận 69/2023 KHÔNG có mã ngành điều dưỡng. Chưa đưa hai ngành này lên website – cần trường cung cấp giấy phép bổ sung.",
  },
  {
    slug: "trung-cap-nghe-quoc-te-ivs",
    order: 2,
    name: {
      vi: "Trường Trung cấp nghề Quốc tế (IVS)",
      en: "International Vocational School (IVS)",
      de: "International Vocational School (IVS)",
    },
    shortName: { vi: "Trung cấp nghề Quốc tế (IVS)", en: "IVS" },
    tagline: {
      vi: "Đào tạo chuẩn quốc tế – Cơ hội toàn cầu",
      en: "International standard education – a solid foundation for a global future",
      de: "Ausbildung nach internationalem Standard – Grundlage für eine globale Zukunft",
    },
    summary: {
      vi: "Trung cấp nghề Quốc tế (IVS) là đơn vị thành viên của Việt Đức Group, cung cấp chương trình đào tạo đạt chuẩn quốc tế, liên kết với các đối tác uy tín trong và ngoài nước. IVS định hướng đào tạo nguồn nhân lực chất lượng cao, thành thạo kỹ năng nghề nghiệp, ngoại ngữ và tác phong công nghiệp, sẵn sàng làm việc tại Việt Nam và trên thế giới.",
      en: "IVS is a member of Viet Duc Group, offering international standard education programmes closely aligned with reputable global institutions. IVS aims to train high-quality human resources, develop professional skills, enhance creative thinking, meet the needs of businesses, and brighten career opportunities for Vietnamese youth in the era of globalisation.",
      de: "Die IVS gehört zur Viet Duc Group und bietet Programme nach internationalem Standard in Zusammenarbeit mit renommierten Partnern im In- und Ausland. Ziel ist die Ausbildung qualifizierter Fachkräfte mit beruflichen Fertigkeiten, Fremdsprachenkenntnissen und industrietauglicher Arbeitshaltung – für den Einsatz in Vietnam und weltweit.",
    },
    legalNameEn: "International Vocational School (IVS)",
    city: { vi: "Ninh Bình", en: "Ninh Binh", de: "Ninh Binh" },
    address: "Km10 Quốc lộ 1A, Ninh Bình – Hà Nội, xã Gia Trấn, huyện Gia Viễn, tỉnh Ninh Bình",
    phone: "030 3868231",
    email: "nguyenphan@vietmc.vn",
    website: "http://ivs.edu.vn",
    coverPath: "/media/schools/trung-cap-nghe-quoc-te-ivs.webp",
    logoPath: "/media/schools/logos/trung-cap-nghe-quoc-te-ivs.webp",
    highlights: {
      vi: [
        "Đào tạo đa ngành, đa nghề ở hệ trung cấp và 9+",
        "Chương trình đào tạo chuẩn quốc tế",
        "Liên kết với đối tác nước ngoài, cơ hội học tập và làm việc toàn cầu",
        "Phát triển kỹ năng và năng lực công dân toàn cầu",
      ],
      en: [
        "Multi-disciplinary vocational education at intermediate and 9+ levels",
        "International-standard training programmes",
        "Partnerships with overseas institutions, creating global study and employment opportunities",
        "Developing professional competence and globally competitive skills",
      ],
      de: [
        "Fächerübergreifende Berufsausbildung auf Fachschul- und 9+-Niveau",
        "Programme nach internationalem Standard",
        "Partnerschaften mit Einrichtungen im Ausland für Studium und Beschäftigung",
        "Entwicklung beruflicher und global wettbewerbsfähiger Kompetenzen",
      ],
    },
    legalRefs: [
      {
        label: { vi: "Quyết định cho phép thành lập Trường Trung cấp nghề Quốc tế", en: "Decision permitting establishment of IVS" },
        number: "470/QĐ-UBND",
        date: "2016-09-15",
        issuer: { vi: "UBND tỉnh Ninh Bình", en: "Ninh Binh Provincial People's Committee" },
      },
      {
        label: {
          vi: "Giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp",
          en: "Certificate of vocational education activity registration",
        },
        number: "01/GCNĐKHĐ-LĐTBXH",
        date: "2017-02-06",
        issuer: {
          vi: "Sở Lao động – Thương binh và Xã hội tỉnh Ninh Bình",
          en: "Ninh Binh Department of Labour, Invalids and Social Affairs",
        },
      },
      {
        label: { vi: "Giấy chứng nhận đăng ký bổ sung hoạt động giáo dục nghề nghiệp", en: "Supplementary registration certificate" },
        number: "01/GCNĐKBS-LĐTBXH",
        date: "2017-04-14",
        issuer: {
          vi: "Sở Lao động – Thương binh và Xã hội tỉnh Ninh Bình",
          en: "Ninh Binh Department of Labour, Invalids and Social Affairs",
        },
      },
      {
        label: { vi: "Giấy chứng nhận đăng ký bổ sung hoạt động giáo dục nghề nghiệp", en: "Supplementary registration certificate" },
        number: "04/GCNĐKBSHĐ-LĐTBXH",
        date: "2018-01-19",
        issuer: {
          vi: "Sở Lao động – Thương binh và Xã hội tỉnh Ninh Bình",
          en: "Ninh Binh Department of Labour, Invalids and Social Affairs",
        },
      },
      {
        label: { vi: "Giấy chứng nhận đăng ký bổ sung hoạt động giáo dục nghề nghiệp", en: "Supplementary registration certificate" },
        number: "05/GCNĐKBSHĐ-LĐTBXH",
        date: "2018-05-30",
        issuer: {
          vi: "Sở Lao động – Thương binh và Xã hội tỉnh Ninh Bình",
          en: "Ninh Binh Department of Labour, Invalids and Social Affairs",
        },
      },
    ],
    stats: [
      { value: "10+", label: { vi: "năm hình thành và phát triển", en: "years of experience and development", de: "Jahre Erfahrung und Entwicklung" } },
      { value: "12+", label: { vi: "ngành nghề đào tạo", en: "training majors", de: "Ausbildungsrichtungen" } },
      { value: "95%", label: { vi: "sinh viên có việc làm sau tốt nghiệp", en: "students employed after graduation", de: "Absolventen in Beschäftigung" } },
      { value: "50+", label: { vi: "đối tác quốc tế uy tín", en: "international partners", de: "internationale Partner" } },
    ],
    provenance: fromProfileVi(6),
    editorNote:
      "Các giấy chứng nhận 2017–2018 ghi 'có hiệu lực 05 năm kể từ ngày ký' – cần trường cung cấp giấy chứng nhận gia hạn/cấp lại còn hiệu lực trước khi công bố chỉ tiêu tuyển sinh.",
  },
  {
    slug: "trung-cap-bach-khoa-vung-tau",
    order: 3,
    name: {
      vi: "Trường Trung cấp Bách khoa Vũng Tàu",
      en: "Bach Khoa Vung Tau Vocational School",
      de: "Bach Khoa Vung Tau Berufsfachschule",
    },
    shortName: { vi: "Trung cấp Bách khoa Vũng Tàu", en: "Bach Khoa Vung Tau" },
    tagline: {
      vi: "Kỹ thuật vững vàng – Nghề nghiệp tương lai",
      en: "Solid technical skills – shaping the future",
      de: "Solide Technik – Beruf mit Zukunft",
    },
    summary: {
      vi: "Trung cấp Bách khoa Vũng Tàu là đơn vị thành viên của Việt Đức Group, chuyên đào tạo nhóm ngành kỹ thuật – công nghệ. Nhà trường chú trọng thực hành, trang bị kiến thức và kỹ năng chuyên môn vững chắc, đáp ứng nhu cầu của doanh nghiệp và thị trường lao động.",
      en: "Bach Khoa Vung Tau is a member of Viet Duc Group specialising in technical and technological fields. The school focuses on practical training, modern facilities and professional subjects, building the skills that businesses and the labour market need.",
      de: "Die Bach Khoa Vung Tau gehört zur Viet Duc Group und ist auf technische und technologische Fachrichtungen spezialisiert. Im Mittelpunkt stehen praktische Ausbildung, moderne Werkstätten und fachliche Tiefe entsprechend dem Bedarf der Unternehmen.",
    },
    legalNameEn: "Vung Tau College of Technology",
    city: { vi: "Vũng Tàu", en: "Vung Tau", de: "Vung Tau" },
    address: "Số 565 Trương Công Định, phường 7, thành phố Vũng Tàu, tỉnh Bà Rịa – Vũng Tàu",
    phone: "0254 3572 505",
    coverPath: "/media/schools/trung-cap-bach-khoa-vung-tau.webp",
    logoPath: "/media/schools/logos/trung-cap-bach-khoa-vung-tau.webp",
    highlights: {
      vi: [
        "Đào tạo đa ngành, đa nghề ở hệ trung cấp và 9+",
        "Đào tạo các ngành kỹ thuật, công nghệ, cơ khí, điện – điện tử, công nghệ thông tin",
        "Thực hành chuyên sâu, đáp ứng nhu cầu doanh nghiệp",
        "Nền tảng vững chắc cho sự nghiệp bền vững",
      ],
      en: [
        "Multi-disciplinary vocational education at intermediate and 9+ levels",
        "Technical training in mechanical engineering, electrical, electronics, automotive and information technology",
        "Intensive practical training aligned with industry demands",
        "A strong foundation for sustainable career development",
      ],
      de: [
        "Fächerübergreifende Berufsausbildung auf Fachschul- und 9+-Niveau",
        "Technische Ausbildung in Maschinenbau, Elektro-, Elektronik-, Fahrzeug- und Informationstechnik",
        "Intensive Praxisausbildung entlang der Anforderungen der Industrie",
        "Solide Grundlage für eine nachhaltige Berufslaufbahn",
      ],
    },
    legalRefs: [
      {
        label: {
          vi: "Quyết định cho phép thành lập Trường Trung cấp Công nghệ thông tin TM.COMPUTER",
          en: "Decision establishing TM.COMPUTER Information Technology Vocational School",
        },
        number: "3181/QĐ-UBND",
        date: "2006-10-09",
        issuer: { vi: "UBND tỉnh Bà Rịa – Vũng Tàu", en: "Ba Ria – Vung Tau Provincial People's Committee" },
      },
      {
        label: { vi: "Quyết định đổi tên trường", en: "Decision renaming the school" },
        number: "1461/QĐ-UBND",
        date: "2013-07-25",
        issuer: { vi: "UBND tỉnh Bà Rịa – Vũng Tàu", en: "Ba Ria – Vung Tau Provincial People's Committee" },
      },
      {
        label: {
          vi: "Quyết định đổi tên thành Trường Trung cấp Bách khoa Vũng Tàu",
          en: "Decision renaming to Bach Khoa Vung Tau Vocational School",
        },
        number: "3802/QĐ-UBND",
        date: "2017-12-29",
        issuer: { vi: "UBND tỉnh Bà Rịa – Vũng Tàu", en: "Ba Ria – Vung Tau Provincial People's Committee" },
      },
      {
        label: {
          vi: "Giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp",
          en: "Certificate of vocational education activity registration",
        },
        number: "71/GCNĐKHĐ-SLĐTBXH",
        date: "2021-05-26",
        issuer: {
          vi: "Sở Lao động – Thương binh và Xã hội tỉnh Bà Rịa – Vũng Tàu",
          en: "Ba Ria – Vung Tau Department of Labour, Invalids and Social Affairs",
        },
      },
    ],
    stats: [
      { value: "15+", label: { vi: "năm hình thành và phát triển", en: "years of formation and development", de: "Jahre Aufbau und Entwicklung" } },
      { value: "10+", label: { vi: "ngành nghề đào tạo", en: "training majors", de: "Ausbildungsrichtungen" } },
      { value: "98%", label: { vi: "sinh viên có việc làm sau tốt nghiệp", en: "students employed after graduation", de: "Absolventen in Beschäftigung" } },
      { value: "200+", label: { vi: "doanh nghiệp đối tác", en: "partner enterprises", de: "Partnerunternehmen" } },
    ],
    provenance: fromProfileVi(7),
    editorNote:
      "Trang thiết kế trong hồ sơ ghi địa chỉ '565 Trương Công Định, TP HCM'. Giấy chứng nhận 71/GCNĐKHĐ-SLĐTBXH ghi rõ 'phường 7, thành phố Vũng Tàu, tỉnh Bà Rịa – Vũng Tàu'. Đã lấy theo giấy chứng nhận; đề nghị sửa lại hồ sơ in.",
  },
  {
    slug: "trung-cap-viet-han",
    order: 4,
    name: {
      vi: "Trường Trung cấp Việt Hàn",
      en: "Viet Han Vocational School",
      de: "Viet Han Berufsfachschule",
    },
    shortName: { vi: "Trung cấp Việt Hàn", en: "Viet Han" },
    tagline: {
      vi: "Công nghệ hiện đại – Hội nhập quốc tế",
      en: "Modern technology – international integration",
      de: "Moderne Technik – internationale Integration",
    },
    summary: {
      vi: "Trung cấp Việt Hàn là đơn vị thành viên của Việt Đức Group, định hướng đào tạo nguồn nhân lực chất lượng cao theo mô hình hợp tác Việt Nam – Hàn Quốc. Nhà trường chú trọng đào tạo kỹ năng nghề nghiệp, ngoại ngữ, tác phong công nghiệp và khả năng hội nhập quốc tế.",
      en: "Viet Han Vocational School is a member institution of Viet Duc Group, oriented toward training high-quality human resources under the Vietnam–Korea cooperation model. The school focuses on vocational skills, foreign languages, industrial working style and international integration.",
      de: "Die Viet Han Berufsfachschule gehört zur Viet Duc Group und bildet Fachkräfte nach dem vietnamesisch-koreanischen Kooperationsmodell aus. Schwerpunkte sind berufliche Fertigkeiten, Fremdsprachen, industrielle Arbeitshaltung und internationale Anschlussfähigkeit.",
    },
    city: { vi: "Đồng Xoài, Đồng Nai", en: "Dong Xoai, Dong Nai", de: "Dong Xoai, Dong Nai" },
    address: "Khu phố Thanh Bình, phường Tân Bình, thành phố Đồng Xoài",
    coverPath: "/media/schools/trung-cap-viet-han.webp",
    logoPath: "/media/schools/logos/trung-cap-viet-han.webp",
    highlights: {
      vi: [
        "Đào tạo đa ngành, đa nghề ở hệ trung cấp và 9+",
        "Đào tạo theo mô hình hợp tác Việt Nam – Hàn Quốc",
        "Ngôn ngữ, kỹ năng và tác phong chuẩn Hàn Quốc",
        "Cơ hội việc làm tại các doanh nghiệp Hàn Quốc trong và ngoài nước",
      ],
      en: [
        "Multi-disciplinary vocational education at intermediate and 9+ levels",
        "Vietnam–South Korea collaborative training programmes",
        "Korean language training and Korean-standard vocational skills",
        "Employment opportunities with Korean enterprises both in Vietnam and abroad",
      ],
      de: [
        "Fächerübergreifende Berufsausbildung auf Fachschul- und 9+-Niveau",
        "Ausbildungsprogramme in vietnamesisch-koreanischer Kooperation",
        "Koreanischunterricht und Fertigkeiten nach koreanischem Standard",
        "Beschäftigungsmöglichkeiten bei koreanischen Unternehmen im In- und Ausland",
      ],
    },
    legalRefs: [
      {
        label: {
          vi: "Quyết định thành lập Trường Trung học Dân lập Kinh tế – Kỹ thuật Bình Phước",
          en: "Decision establishing Binh Phuoc Economics – Technology People-founded Secondary School",
        },
        number: "09/2004/QĐ-UB",
        date: "2004-02-03",
        issuer: { vi: "UBND tỉnh Bình Phước", en: "Binh Phuoc Provincial People's Committee" },
      },
      {
        label: {
          vi: "Quyết định cho phép hoạt động giáo dục nghề nghiệp đào tạo giáo viên mầm non, tiểu học trình độ trung cấp",
          en: "Decision permitting intermediate-level pre-school and primary teacher training",
        },
        number: "561/QĐ-SGDĐT",
        date: "2019-03-07",
        issuer: { vi: "Sở Giáo dục và Đào tạo tỉnh Bình Phước", en: "Binh Phuoc Department of Education and Training" },
      },
      {
        label: {
          vi: "Quyết định đổi tên Trường Trung cấp Kinh tế – Kỹ thuật Bình Phước thành Trường Trung cấp Việt Hàn",
          en: "Decision renaming to Viet Han Vocational School",
        },
        number: "1219/QĐ-UBND",
        date: "2020-06-04",
        issuer: { vi: "UBND tỉnh Bình Phước", en: "Binh Phuoc Provincial People's Committee" },
      },
    ],
    stats: [
      { value: "12+", label: { vi: "ngành nghề đào tạo", en: "training majors", de: "Ausbildungsrichtungen" } },
      { value: "95%", label: { vi: "sinh viên có việc làm sau tốt nghiệp", en: "students employed after graduation", de: "Absolventen in Beschäftigung" } },
      { value: "100+", label: { vi: "doanh nghiệp đối tác", en: "partner enterprises", de: "Partnerunternehmen" } },
    ],
    provenance: fromProfileVi(18),
    editorNote:
      "Hồ sơ in gọi trường là 'Trung cấp Việt Hàn Đồng Nai'; các quyết định gốc ghi địa chỉ tại Bình Phước (nay thuộc tỉnh Đồng Nai sau sáp nhập 2025). Đã dùng tên pháp lý 'Trường Trung cấp Việt Hàn' theo QĐ 1219/QĐ-UBND. Ngoài hai mã ngành sư phạm, hồ sơ chưa kèm giấy chứng nhận đăng ký hoạt động GDNN liệt kê mã ngành nghề khác – các ngành còn lại đang để ở dạng định hướng đào tạo, chưa công bố chỉ tiêu.",
  },
  {
    slug: "trung-cap-cong-nghe-viet-duc",
    order: 5,
    name: {
      vi: "Trường Trung cấp Công nghệ Việt Đức",
      en: "Viet Duc Vocational School of Technology",
      de: "Viet Duc Berufsfachschule für Technik",
    },
    shortName: { vi: "Trung cấp Công nghệ Việt Đức", en: "Viet Duc College of Technology" },
    tagline: {
      vi: "Đào tạo thực chất – Kỹ năng vững chắc – Việc làm bền vững – Tương lai rộng mở",
      en: "Practical training – solid skills – bright futures",
      de: "Praxisnahe Ausbildung – solide Fertigkeiten – offene Zukunft",
    },
    summary: {
      vi: "Trung cấp Công nghệ Việt Đức là đơn vị thành viên của Việt Đức Group, đào tạo đa ngành, đa nghề ở hệ trung cấp. Nhà trường chú trọng thực hành, trang bị kỹ năng nghề nghiệp vững vàng, đáp ứng nhu cầu của doanh nghiệp và thị trường lao động.",
      en: "Viet Duc College of Technology is a member school of Viet Duc Group, offering multi-disciplinary education at intermediate level. The school focuses on hands-on training, equipping students with solid professional skills to meet the needs of businesses and the labour market.",
      de: "Die Viet Duc Berufsfachschule für Technik gehört zur Viet Duc Group und bildet fächerübergreifend auf Fachschulniveau aus. Der Schwerpunkt liegt auf praktischer Ausbildung und soliden beruflichen Fertigkeiten entsprechend dem Bedarf der Unternehmen.",
    },
    city: { vi: "Quảng Trị", en: "Quang Tri", de: "Quang Tri" },
    address: "Tổ dân phố 15, phường Đồng Thuận, tỉnh Quảng Trị",
    coverPath: "/media/schools/trung-cap-cong-nghe-viet-duc.webp",
    logoPath: "/media/schools/logos/trung-cap-cong-nghe-viet-duc.webp",
    highlights: {
      vi: [
        "Đào tạo đa ngành, đa nghề ở hệ trung cấp và 9+",
        "Trang thiết bị hiện đại, đội ngũ giảng viên giàu kinh nghiệm",
        "Chú trọng thực hành – 70% thời lượng",
      ],
      en: [
        "Multi-disciplinary education at intermediate and 9+ levels",
        "Modern facilities and highly experienced faculty",
        "Practice-first curriculum – 70% hands-on",
      ],
      de: [
        "Fächerübergreifende Ausbildung auf Fachschul- und 9+-Niveau",
        "Moderne Ausstattung und erfahrenes Lehrpersonal",
        "Praxis zuerst – 70 % der Ausbildungszeit",
      ],
    },
    legalRefs: [
      {
        label: {
          vi: "Quyết định cho phép thành lập Trường Trung cấp Công nghệ Việt Đức",
          en: "Decision permitting establishment of Viet Duc Vocational School of Technology",
        },
        number: "2567/QĐ-UBND",
        date: "2026-06-26",
        issuer: { vi: "UBND tỉnh Quảng Trị", en: "Quang Tri Provincial People's Committee" },
      },
    ],
    stats: [
      { value: "10+", label: { vi: "ngành nghề đào tạo", en: "training majors", de: "Ausbildungsrichtungen" } },
      { value: "200+", label: { vi: "doanh nghiệp đối tác", en: "partner enterprises", de: "Partnerunternehmen" } },
    ],
    provenance: fromProfileVi(8),
    editorNote:
      "QUAN TRỌNG: Điều 2 khoản 4 của QĐ 2567/QĐ-UBND ghi rõ 'Trường chỉ được phép tuyển sinh và tổ chức đào tạo sau khi được cấp Giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp'. Vì vậy các ngành của trường này chỉ hiển thị dưới dạng ĐỊNH HƯỚNG ĐÀO TẠO, không có mã ngành và không công bố chỉ tiêu tuyển sinh, cho tới khi trường cung cấp GCN đăng ký hoạt động GDNN. Hồ sơ in ghi 'Đồng Hới, tỉnh Quảng Trị'; quyết định ghi 'phường Đồng Thuận, tỉnh Quảng Trị'.",
  },
  {
    slug: "itw-berlin",
    order: 6,
    name: {
      vi: "Viện Đào tạo và Giáo dục ITW Berlin",
      en: "ITW Berlin Institute of Training and Education",
      de: "itw – Institut für Aus- und Weiterbildung gGmbH",
    },
    shortName: { vi: "ITW Berlin", en: "ITW Berlin", de: "itw Berlin" },
    tagline: {
      vi: "Chuẩn Đức – Bằng cấp có giá trị tại Đức và EU",
      en: "German standards – qualifications valued in Germany and the EU",
      de: "Deutscher Standard – Abschlüsse mit Geltung in Deutschland und der EU",
    },
    summary: {
      vi: "Học viện ITW Berlin là tổ chức giáo dục tại Đức, chuyển giao chương trình đào tạo, các mã ngành và triển khai hệ thống đào tạo chuẩn quốc tế tại Việt Nam. ITW Berlin không chỉ phát triển tại Đức mà còn trực tiếp chuyển giao mô hình đào tạo, chuẩn hoá bằng cấp từ Việt Nam theo tiêu chuẩn quốc tế, giúp học sinh – sinh viên được trang bị đầy đủ kiến thức, kỹ năng và ngoại ngữ để sẵn sàng gia nhập thị trường lao động Đức và toàn cầu.",
      en: "ITW Berlin is an educational institution in Germany specialising in training programmes and vocational codes, and in building a world-class standard education system in Vietnam. ITW Berlin not only develops programmes in Germany but also transfers modern education models directly, accrediting them to Vietnamese standards so that students gain the knowledge, skills and languages needed for the German and global labour market.",
      de: "Das itw Berlin ist eine deutsche Bildungseinrichtung, die Ausbildungsprogramme und Berufsprofile überträgt und ein Bildungssystem nach internationalem Standard in Vietnam aufbaut. Neben der Arbeit in Deutschland überträgt das itw moderne Ausbildungsmodelle direkt und richtet sie an vietnamesischen Standards aus, damit Lernende Wissen, Fertigkeiten und Sprachkenntnisse für den deutschen und globalen Arbeitsmarkt erwerben.",
    },
    legalNameEn: "itw – Institut für Aus- und Weiterbildung gGmbH",
    city: { vi: "Berlin, CHLB Đức", en: "Berlin, Germany", de: "Berlin, Deutschland" },
    country: "DE",
    coverPath: "/media/schools/itw-berlin.webp",
    logoPath: "/media/schools/logos/itw-berlin.webp",
    highlights: {
      vi: [
        "Liên kết đào tạo theo tiêu chuẩn Quốc tế tại Đức",
        "Đào tạo ngôn ngữ Đức, kỹ năng chuyên môn và nghề nghiệp",
        "Cơ hội học tập, thực tập và làm việc tại CHLB Đức và Châu Âu",
        "Mở rộng tương lai toàn cầu cho người học",
      ],
      en: [
        "Educational partnerships based on German standards",
        "German language training, professional skills and vocational education",
        "Opportunities to study, practise and work in Germany and across Europe",
        "Expanding international learning opportunities for students",
      ],
      de: [
        "Bildungspartnerschaften nach deutschen Standards",
        "Deutschunterricht, Fachkompetenz und berufliche Bildung",
        "Möglichkeiten für Studium, Praktikum und Arbeit in Deutschland und Europa",
        "Erweiterte internationale Lernwege für Studierende",
      ],
    },
    stats: [
      { value: "1967", label: { vi: "năm thành lập tại Berlin", en: "founded in Berlin", de: "gegründet in Berlin" } },
      { value: "50+", label: { vi: "năm hoạt động trong lĩnh vực giáo dục", en: "years in vocational education and training", de: "Jahre in der beruflichen Bildung" } },
      { value: "2006", label: { vi: "chuyển đổi thành công ty phi lợi nhuận (gGmbH)", en: "converted to a non-profit gGmbH", de: "Umwandlung in eine gGmbH" } },
    ],
    provenance: fromProfileVi(21),
    editorNote:
      "Bản tiếng Việt (tr.21) ghi ITW được thành lập năm 1967 với tên Viện Giáo dục Kỹ thuật Liên tục Berlin, theo sáng kiến của cộng đồng doanh nghiệp Berlin và các hiệp hội. Bản tiếng Anh cùng hồ sơ lại ghi do 'Vietnam Education & Technology Association in Berlin' thành lập. Hai bản mâu thuẫn – đã dùng bản tiếng Việt, cần ITW Berlin xác nhận trước khi dịch sang tiếng Đức cho thị trường Đức.",
  },
];
