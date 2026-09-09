import type { SeedPerson } from "./types";

/**
 * Cơ cấu nhân sự Việt Đức Group.
 *
 * NGUỒN: bộ hồ sơ "CƠ CẤU NHÂN SỰ VIỆT ĐỨC GROUP" do tập đoàn gửi ngày
 * 08/09/2026 — 47 tệp hồ sơ cá nhân (executive profile) và bốn quyết định
 * thành lập hội đồng trường. 47 tệp ấy chỉ là 18 người: phần lớn giữ chức ở
 * nhiều đơn vị nên hồ sơ được chép sang từng thư mục.
 *
 * Chức vụ lấy theo bốn quyết định (có số hiệu, có nhiệm kỳ, ghi ở
 * `decisionRef`), không lấy theo dòng chức danh in trên trang bìa hồ sơ — hai
 * chỗ này có khi lệch nhau, và quyết định mới là căn cứ.
 *
 * KHÔNG ĐƯA LÊN ĐÂY, dù tài liệu nguồn có: số căn cước, ngày cấp, nơi cấp và
 * ngày sinh đầy đủ. Đó là dữ liệu cá nhân; chúng dừng lại ở tệp nguồn. Năm sinh
 * thì chính các hồ sơ giới thiệu đã tự công bố nên giữ lại.
 *
 * Ảnh chân dung: hồ sơ nào cũng ghi "ẢNH CHÂN DUNG (Bổ sung khi có ảnh)" — tập
 * đoàn sẽ gửi sau, nên `photoPath` để trống và giao diện tự dựng chữ cái đầu.
 *
 * Bản dịch năm thứ tiếng còn lại do `npm run i18n` sinh; ở đây chỉ có tiếng
 * Việt, đúng như tài liệu gốc.
 */
export const PEOPLE: SeedPerson[] = [
  {
    slug: "phan-phuong-nguyen",
    name: "Phan Phương Nguyên",
    honorific: "ThS.",
    birthYear: 1973,
    headline: { vi: "Chủ tịch Hội đồng quản trị Việt Đức Group" },
    schoolSlug: null,
    order: 1,
    bio: {
      vi: "Ông Phan Phương Nguyên là nhà quản lý có nền tảng chuyên môn liên ngành giữa luật học, kinh tế và quản trị, cùng kinh nghiệm điều hành doanh nghiệp trong nhiều lĩnh vực. Quá trình công tác trải dài từ tư vấn pháp luật, hành chính doanh nghiệp, xuất nhập khẩu - xây dựng đến quản trị nguồn nhân lực, cung ứng lao động và phát triển giáo dục, tạo nên tư duy quản trị tổng thể, thực tiễn và hướng tới mở rộng hợp tác quốc tế.",
    },
    quote: {
      vi: "Kiến tạo hệ sinh thái giáo dục - doanh nghiệp bằng nền tảng pháp lý vững chắc, quản trị thực tiễn và định hướng phát triển dài hạn.",
    },
    overview: {
      vi: [
        "Ông Phan Phương Nguyên là nhà quản lý có nền tảng chuyên môn liên ngành giữa luật học, kinh tế và quản trị, cùng kinh nghiệm điều hành doanh nghiệp trong nhiều lĩnh vực. Quá trình công tác trải dài từ tư vấn pháp luật, hành chính doanh nghiệp, xuất nhập khẩu - xây dựng đến quản trị nguồn nhân lực, cung ứng lao động và phát triển giáo dục, tạo nên tư duy quản trị tổng thể, thực tiễn và hướng tới mở rộng hợp tác quốc tế.",
        "Từ tháng 08/2025 đến nay, ông đảm nhiệm cương vị Chủ tịch Hội đồng quản trị Tập đoàn Việt Đức Group. Đồng thời, ông hiện giữ nhiều vai trò lãnh đạo tại các đơn vị trong hệ sinh thái giáo dục - doanh nghiệp, gồm Chủ tịch Hội đồng quản trị Trường Cao đẳng Công nghệ Ngoại thương, Trường Trung cấp Nghề Quốc tế; Chủ tịch Hội đồng trường Trường Trung cấp Công nghệ Việt Đức; Giám đốc Học viện đào tạo ITW Berlin và Giám đốc Nibelc Germany GmbH. Các vị trí này thể hiện định hướng kết nối quản trị doanh nghiệp, đào tạo nghề và phát triển nguồn nhân lực trong nước - quốc tế.",
      ],
    },
    education: [
      {
        text: {
          vi: "Trình độ: Thạc sĩ Luật học; Thạc sĩ Kinh tế (London - Vương quốc Anh)",
        },
      },
      { text: { vi: "Cử nhân: Luật học - Trường Đại học Tổng hợp Hà Nội" } },
    ],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ CHIẾN LƯỢC" },
        text: {
          vi: "Định hướng mô hình hoạt động, tổ chức nguồn lực và xây dựng nền tảng quản trị cho doanh nghiệp và cơ sở giáo dục.",
        },
      },
      {
        title: { vi: "PHÁP LÝ & TUÂN THỦ" },
        text: {
          vi: "Nền tảng đào tạo luật học hỗ trợ tư duy quản trị rủi ro, pháp lý doanh nghiệp và phát triển bền vững.",
        },
      },
      {
        title: { vi: "NHÂN LỰC & HỢP TÁC" },
        text: {
          vi: "Kinh nghiệm trong lĩnh vực xuất khẩu lao động, thương mại và cung ứng nhân lực, kết nối đào tạo với nhu cầu sử dụng lao động.",
        },
      },
      {
        title: { vi: "KINH TẾ & PHÁT TRIỂN QUỐC TẾ" },
        text: {
          vi: "Nền tảng kinh tế và kinh nghiệm điều hành doanh nghiệp tại Việt Nam - Đức hỗ trợ hoạch định đầu tư, phát triển thị trường và mở rộng hợp tác quốc tế.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Xây dựng một hệ sinh thái trong đó giáo dục tạo ra năng lực, doanh nghiệp tạo ra cơ hội và quản trị tạo ra sự phát triển bền vững.",
    },
    appointments: [
      {
        school: null,
        org: { vi: "Việt Đức Group" },
        body: "hdqt",
        title: { vi: "Chủ tịch Hội đồng quản trị" },
        rank: 10,
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Chủ tịch Hội đồng trường" },
        rank: 10,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Chủ tịch Hội đồng trường" },
        rank: 10,
        term: "2026–2031",
        decisionRef: "Quyết định 2904c/2026/QĐ-IVS ngày 29/04/2026",
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "hdt",
        title: { vi: "Chủ tịch Hội đồng trường" },
        rank: 10,
        term: "2026–2031",
        decisionRef: "Quyết định 0607/2026/QĐ-HĐQT ngày 06/07/2026",
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Quyết định 0805/2026/QĐ-TCBKVT ngày 08/05/2026",
      },
      {
        school: null,
        org: { vi: "NIBELC Group" },
        body: "khac",
        title: { vi: "Chủ tịch Hội đồng quản trị" },
        rank: 60,
      },
      {
        school: "itw-berlin",
        body: "bgh",
        title: { vi: "Giám đốc Học viện đào tạo" },
        rank: 10,
      },
      {
        school: null,
        org: { vi: "Nibelc Germany GmbH" },
        body: "khac",
        title: { vi: "Giám đốc" },
        rank: 60,
      },
    ],
  },
  {
    slug: "pham-van-tung",
    name: "Phạm Văn Tùng",
    honorific: null,
    birthYear: 1981,
    headline: { vi: "Thành viên HĐQT – Phó Tổng Giám đốc Tập đoàn Việt Đức" },
    schoolSlug: "trung-cap-cong-nghe-viet-duc",
    order: 3,
    bio: {
      vi: "Nhà giáo và cán bộ quản lý giáo dục có hơn hai thập kỷ kinh nghiệm, trưởng thành từ thực tiễn giảng dạy và quản trị ở nhiều mô hình đào tạo. Nền tảng Sư phạm Sinh học, kinh nghiệm giáo dục thường xuyên và giáo dục nghề nghiệp giúp ông xây dựng phong cách quản lý kỷ cương, thực chất, gần người học và chú trọng hiệu quả vận hành.",
    },
    quote: {
      vi: "Lấy chất lượng đào tạo làm nền tảng, lấy năng lực đội ngũ làm động lực, lấy sự tiến bộ của người học làm thước đo và lấy hiệu quả quản trị làm điều kiện phát triển bền vững.",
    },
    overview: {
      vi: [
        "Phạm Văn Tùng là cán bộ quản lý giáo dục trưởng thành từ thực tiễn giảng dạy, với hơn 20 năm gắn bó liên tục với ngành giáo dục. Quá trình công tác trải dài từ trường THPT, trung tâm GDNN-GDTX, trường trung cấp đến các vị trí quản lý nhà trường. Từ nền tảng chuyên môn Sư phạm Sinh học, ông từng bước phát triển năng lực tổ chức chuyên môn, quản lý người học, điều phối đội ngũ và quản trị cơ sở giáo dục nghề nghiệp. Hiện nay, ông đồng thời đảm nhiệm vai trò Hiệu trưởng Trường Trung cấp Công nghệ Việt Đức và Chủ tịch Hội đồng trường Trường Trung cấp Bách Khoa Vũng Tàu.",
      ],
    },
    education: [],
    competencies: [],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Lấy chất lượng đào tạo làm nền tảng, lấy năng lực đội ngũ làm động lực, lấy sự tiến bộ của người học làm thước đo và lấy hiệu quả quản trị làm điều kiện phát triển bền vững.",
    },
    appointments: [
      {
        school: null,
        org: { vi: "Việt Đức Group" },
        body: "hdqt",
        title: { vi: "Thành viên Hội đồng quản trị" },
        rank: 30,
      },
      {
        school: null,
        org: {
          vi: "Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức",
        },
        body: "dieuhanh",
        title: { vi: "Phó Tổng Giám đốc" },
        rank: 25,
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "bgh",
        title: { vi: "Hiệu trưởng" },
        rank: 10,
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Chủ tịch Hội đồng trường" },
        rank: 10,
        term: "2026–2031",
        decisionRef: "Quyết định 0805/2026/QĐ-TCBKVT ngày 08/05/2026",
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Quyết định 0607/2026/QĐ-HĐQT ngày 06/07/2026",
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Quyết định 2904c/2026/QĐ-IVS ngày 29/04/2026",
      },
    ],
  },
  {
    slug: "tran-minh-chat",
    name: "Trần Minh Chất",
    honorific: "PGS.TS.",
    birthYear: 1959,
    headline: {
      vi: "Trưởng Ban Kiểm soát Tập đoàn Việt Đức – Phó Chủ tịch Tập đoàn Việt Đức",
    },
    schoolSlug: null,
    order: 2,
    bio: {
      vi: "Nhà quản lý giáo dục có nền tảng pháp luật chuyên sâu, kinh nghiệm lãnh đạo tại Học viện Cảnh sát nhân dân và quản trị cơ sở giáo dục nghề nghiệp; chú trọng kỷ cương, chất lượng và hiệu quả phát triển bền vững.",
    },
    quote: {
      vi: "Phát huy kinh nghiệm quản lý, nền tảng pháp luật và tư duy kỷ cương để xây dựng môi trường giáo dục chất lượng, trách nhiệm và bền vững.",
    },
    overview: {
      vi: [
        "Nhà quản lý giáo dục có nền tảng pháp luật chuyên sâu, kinh nghiệm lãnh đạo tại Học viện Cảnh sát nhân dân và quản trị cơ sở giáo dục nghề nghiệp; chú trọng kỷ cương, chất lượng và hiệu quả phát triển bền vững.",
        "“Quản trị giáo dục hiệu quả bắt đầu từ kỷ cương, nền tảng chuyên môn vững và trách nhiệm với người học.”",
        "PGS.TS. Trần Minh Chất có quá trình công tác lâu năm trong lĩnh vực pháp luật, đào tạo và quản lý. Kinh nghiệm trải dài từ công tác chuyên môn tại Học viện Cảnh sát nhân dân, quản lý học viên, tham gia lãnh đạo học viện đến điều hành cơ sở giáo dục nghề nghiệp. Nền tảng Luật kinh tế, lý luận chính trị và kinh nghiệm quản trị thực tiễn tạo nên thế mạnh nổi bật trong tổ chức, giám sát và định hướng phát triển nhà trường.",
      ],
    },
    education: [
      {
        period: "1976 - 1978",
        text: {
          vi: "Trường Cảnh sát nhân dân • Cảnh sát hình sự hệ trung cấp",
        },
      },
      {
        period: "1983 - 1988",
        text: { vi: "Học viện Bộ Nội vụ Liên Xô • Luật kinh tế • Đại học" },
      },
      {
        period: "1991 - 1998",
        text: { vi: "Đại học Quốc gia Hà Nội • Luật kinh tế • Thạc sĩ" },
      },
      {
        period: "Sau đại học",
        text: { vi: "Đại học Quốc gia Hà Nội • Luật kinh tế • Tiến sĩ" },
      },
      {
        period: "2005 - 2010",
        text: {
          vi: "Học viện Chính trị Quốc gia Hồ Chí Minh • Cao cấp lý luận chính trị",
        },
      },
    ],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ GIÁO DỤC" },
        text: {
          vi: "Tổ chức, điều hành, giám sát hoạt động đào tạo và quản lý nhà trường.",
        },
      },
      {
        title: { vi: "PHÁP LUẬT & CHÍNH SÁCH" },
        text: {
          vi: "Nền tảng Luật kinh tế, tư duy quy phạm và kinh nghiệm quản lý thực tiễn.",
        },
      },
      {
        title: { vi: "PHÁT TRIỂN ĐỘI NGŨ" },
        text: {
          vi: "Kinh nghiệm đào tạo, quản lý học viên và phối hợp phát triển nguồn nhân lực.",
        },
      },
      {
        title: { vi: "QUẢN LÝ NGƯỜI HỌC" },
        text: {
          vi: "Từng giữ vai trò Trưởng phòng Quản lý Học viên, am hiểu tổ chức và kỷ cương học tập.",
        },
      },
    ],
    career: [
      {
        time: "10/1978 - 10/1981",
        role: { vi: "Phòng Công tác chính trị" },
        org: { vi: "Trường Đại học Cảnh sát nhân dân" },
      },
      {
        time: "10/1981 - 10/1982",
        role: { vi: "Học ngoại ngữ" },
        org: { vi: "Trường Đại học Ngoại ngữ" },
      },
      {
        time: "1983 - 1988",
        role: { vi: "Học viên" },
        org: { vi: "Bộ Nội vụ Liên Xô" },
      },
      {
        time: "10/1988 - 2010",
        role: { vi: "Công tác chuyên môn" },
        org: { vi: "Khoa Cảnh sát kinh tế - Học viện Cảnh sát nhân dân" },
      },
      {
        time: "2010 - 2012",
        role: { vi: "Trưởng phòng Quản lý Học viên" },
        org: { vi: "Học viện Cảnh sát nhân dân" },
      },
      {
        time: "2012 - 2019",
        role: { vi: "Phó Giám đốc" },
        org: { vi: "Học viện Cảnh sát nhân dân" },
      },
      {
        time: "03/2023 - 05/2026",
        role: { vi: "Hiệu trưởng" },
        org: { vi: "Trường Trung cấp Nghề Quốc tế IVS" },
      },
      {
        time: "05/2026 - nay",
        role: { vi: "Phó Chủ tịch Hội đồng trường" },
        org: { vi: "Trường Trung cấp Nghề Quốc tế" },
      },
    ],
    highlights: {
      vi: [
        "Lãnh đạo cấp học viện: Giai đoạn 2012 - 2019 giữ chức Phó Giám đốc Học viện Cảnh sát nhân dân, tham gia quản lý và điều hành cơ sở đào tạo thuộc lực lượng Công an nhân dân.",
        "Quản lý người học: Kinh nghiệm Trưởng phòng Quản lý Học viên tạo nền tảng vững về tổ chức, kỷ luật, công tác học viên và phối hợp quản lý đào tạo.",
        "Chuyển tiếp sang giáo dục nghề nghiệp: Từ năm 2023 đảm nhiệm vai trò Hiệu trưởng Trường Trung cấp Nghề Quốc tế IVS, trực tiếp tham gia quản trị và phát triển nhà trường.",
        "Vai trò Hội đồng trường: Từ tháng 05/2026, tham gia định hướng, giám sát và hoàn thiện cơ chế quản trị trong vai trò Phó Chủ tịch Hội đồng trường.",
      ],
    },
    focus: { vi: [] },
    direction: {
      vi: "Phát huy kinh nghiệm quản lý, nền tảng pháp luật và tư duy kỷ cương để xây dựng môi trường giáo dục chất lượng, trách nhiệm và bền vững.",
    },
    appointments: [
      {
        school: null,
        org: { vi: "Việt Đức Group" },
        body: "hdqt",
        title: { vi: "Phó Chủ tịch Hội đồng quản trị" },
        rank: 20,
      },
      {
        school: null,
        org: { vi: "Hệ thống các trường GDNN thuộc Việt Đức Group" },
        body: "bks",
        title: { vi: "Trưởng Ban Kiểm soát" },
        rank: 10,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Quyết định 2904c/2026/QĐ-IVS ngày 29/04/2026",
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Quyết định 0805/2026/QĐ-TCBKVT ngày 08/05/2026",
      },
    ],
  },
  {
    slug: "dam-quang-viet",
    name: "Đàm Quang Việt",
    honorific: null,
    birthYear: 1983,
    headline: { vi: "Phó Chủ tịch Hội đồng trường" },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 4,
    bio: {
      vi: "Ông Đàm Quang Việt là cán bộ quản trị có nền tảng đào tạo chính quy về Quản trị Kinh doanh, đồng thời được bồi dưỡng kiến thức trong lĩnh vực quản lý và môi giới bất động sản. Hiện nay, ông đảm nhiệm vai trò Phó Chủ tịch Hội đồng trường tại hai cơ sở giáo dục nghề nghiệp, tham gia vào công tác quản trị, định hướng và giám sát hoạt động nhà trường.",
    },
    quote: {
      vi: "Giá trị của quản trị không chỉ nằm ở quyết định đúng, mà còn ở khả năng tạo ra một hệ thống minh bạch, hiệu quả và phát triển bền vững.",
    },
    overview: {
      vi: [
        "Ông Đàm Quang Việt là cán bộ quản trị có nền tảng đào tạo chính quy về Quản trị Kinh doanh, đồng thời được bồi dưỡng kiến thức trong lĩnh vực quản lý và môi giới bất động sản. Hiện nay, ông đảm nhiệm vai trò Phó Chủ tịch Hội đồng trường tại hai cơ sở giáo dục nghề nghiệp, tham gia vào công tác quản trị, định hướng và giám sát hoạt động nhà trường.",
      ],
    },
    education: [],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ & GIÁM SÁT" },
        text: {
          vi: "Tham gia định hướng, giám sát và nâng cao tính minh bạch trong hoạt động quản trị nhà trường.",
        },
      },
      {
        title: { vi: "QUẢN TRỊ KINH DOANH" },
        text: {
          vi: "Nền tảng đại học giúp hình thành tư duy về tổ chức, hiệu quả vận hành và sử dụng nguồn lực.",
        },
      },
      {
        title: { vi: "BẤT ĐỘNG SẢN" },
        text: {
          vi: "Có đào tạo chuyên môn về quản lý sàn và từng được cấp chứng chỉ hành nghề môi giới bất động sản.",
        },
      },
      {
        title: { vi: "TƯ DUY PHÁT TRIỂN" },
        text: {
          vi: "Kết hợp góc nhìn quản trị với định hướng phát triển bền vững, chú trọng hiệu quả và khả năng thích ứng.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Hoàn thiện cơ chế phối hợp giữa Hội đồng trường và Ban Giám hiệu; phân định rõ trách nhiệm, quyền hạn và cơ chế giám sát.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Quyết định 0805/2026/QĐ-TCBKVT ngày 08/05/2026",
      },
    ],
  },
  {
    slug: "nguyen-kien-trung",
    name: "Nguyễn Kiên Trung",
    honorific: "TS.",
    birthYear: 1982,
    headline: { vi: "Phó Chủ tịch Hội đồng trường" },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 5,
    bio: null,
    quote: {
      vi: "Hội đồng trường cần là nơi hội tụ của chiến lược, trách nhiệm và dữ liệu — để mọi quyết định đều hướng tới chất lượng và giá trị bền vững.",
    },
    overview: { vi: [] },
    education: [
      {
        text: {
          vi: "Marketing Management • Organization Theory • Human Resource Development • Financial Management • Risk Management",
        },
      },
      {
        text: {
          vi: "Productions / Operations Management • Management Information & Control System • Corporate Planning • Judgment & Decision Making • Business Strategy",
        },
      },
    ],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ CHIẾN LƯỢC" },
        text: {
          vi: "Xác lập ưu tiên, giám sát mục tiêu và thúc đẩy cơ chế phối hợp hiệu quả giữa Hội đồng trường, Ban Giám hiệu và các đơn vị chức năng.",
        },
      },
      {
        title: { vi: "MINH BẠCH & GIÁM SÁT" },
        text: {
          vi: "Đề cao trách nhiệm giải trình, tuân thủ và các chỉ số đánh giá có thể kiểm chứng.",
        },
      },
      {
        title: { vi: "CHẤT LƯỢNG & ĐỘI NGŨ" },
        text: {
          vi: "Tập trung vào chuẩn đầu ra, năng lực giảng viên, văn hóa trách nhiệm và chất lượng đào tạo thực chất.",
        },
      },
      {
        title: { vi: "KẾT NỐI DOANH NGHIỆP" },
        text: {
          vi: "Tăng cường liên kết đào tạo với doanh nghiệp và thị trường lao động để nâng cao tính ứng dụng và cơ hội nghề nghiệp.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Hội đồng trường cần là nơi hội tụ của chiến lược, trách nhiệm và dữ liệu — để mọi quyết định đều hướng tới chất lượng và giá trị bền vững.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Phó Chủ tịch Hội đồng trường" },
        rank: 20,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Quyết định 0805/2026/QĐ-TCBKVT ngày 08/05/2026",
      },
    ],
  },
  {
    slug: "tran-dinh-hung",
    name: "Trần Đình Hùng",
    honorific: "TS.",
    birthYear: 1979,
    headline: { vi: "Hiệu trưởng Trường Cao đẳng Công nghệ Ngoại thương" },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 6,
    bio: {
      vi: "Nhà quản lý giáo dục có nền tảng kỹ thuật và chính sách công, giàu kinh nghiệm trong quản lý nhà nước về giáo dục nghề nghiệp, xây dựng chiến lược và điều hành cơ sở đào tạo.",
    },
    quote: {
      vi: "Lấy chất lượng đào tạo, giá trị người học và nhu cầu của doanh nghiệp làm trọng tâm; xây dựng môi trường giáo dục nghề nghiệp hiện đại, thực tiễn và hội nhập.",
    },
    overview: { vi: [] },
    education: [
      { text: { vi: "Thạc sĩ Chính sách công - Học viện Khoa học xã hội." } },
      {
        text: {
          vi: "Kỹ sư Điện - Điện tử - Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh, hệ chính quy.",
        },
      },
      { text: { vi: "Trình độ lý luận chính trị: Trung cấp." } },
      {
        text: {
          vi: "Nghiệp vụ sư phạm: Hoàn thành chương trình Sư phạm bậc 2 tại Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh.",
        },
      },
    ],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ & ĐIỀU HÀNH" },
        text: {
          vi: "Xây dựng chiến lược, tổ chức bộ máy, quản lý hoạt động đào tạo và phát triển đội ngũ.",
        },
      },
      {
        title: { vi: "GIÁO DỤC NGHỀ NGHIỆP" },
        text: {
          vi: "Kinh nghiệm quản lý nhà nước về dạy nghề và trực tiếp điều hành các trường cao đẳng.",
        },
      },
      {
        title: { vi: "CHÍNH SÁCH CÔNG" },
        text: {
          vi: "Kết hợp nền tảng chính sách công với kinh nghiệm thực tiễn trong quản lý giáo dục và quản lý nhà nước.",
        },
      },
      {
        title: { vi: "CHẤT LƯỢNG & ĐỘI NGŨ" },
        text: {
          vi: "Định hướng môi trường giáo dục hiện đại, gắn đào tạo với nhu cầu thực tiễn và thị trường lao động.",
        },
      },
    ],
    career: [
      {
        time: "06/2009 - 01/2018",
        role: { vi: "Công tác tại Phòng Dạy nghề" },
        org: { vi: "Sở Lao động - Thương binh và Xã hội thành phố Đà Nẵng" },
      },
      {
        time: "02/2018 - 04/2021",
        role: { vi: "Công tác tại Phòng Tổng hợp" },
        org: { vi: "Văn phòng Thành ủy" },
      },
      {
        time: "05/2021 - 06/2022",
        role: { vi: "Công tác tại Phòng Dạy nghề" },
        org: { vi: "Sở Lao động - Thương binh và Xã hội thành phố Đà Nẵng" },
      },
      {
        time: "07/2022 - 04/2023",
        role: { vi: "Phó Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng Nguyễn Văn Trỗi" },
      },
      {
        time: "05/2023 - 06/2026",
        role: { vi: "Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng Bách Khoa Đà Nẵng" },
      },
      {
        time: "Hiện nay",
        role: { vi: "Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng Công nghệ Ngoại thương" },
      },
    ],
    highlights: {
      vi: [
        "Quản trị và điều hành cơ sở giáo dục: Xây dựng chiến lược, tổ chức bộ máy, quản lý hoạt động đào tạo và phát triển đội ngũ.",
        "Giáo dục nghề nghiệp: Có nhiều năm công tác trong lĩnh vực quản lý nhà nước về dạy nghề, đồng thời trực tiếp tham gia quản lý, điều hành các trường cao đẳng.",
        "Quản lý chính sách công: Có nền tảng chuyên môn về chính sách công, kết hợp kinh nghiệm thực tiễn trong quản lý giáo dục và quản lý nhà nước.",
        "Phát triển đội ngũ và chất lượng đào tạo: Định hướng xây dựng môi trường giáo dục hiện đại, gắn đào tạo với nhu cầu thực tiễn và thị trường lao động.",
      ],
    },
    focus: {
      vi: [
        "Chất lượng đào tạo: Chuẩn hóa hoạt động chuyên môn, nâng cao chất lượng giảng dạy và gắn chương trình với nhu cầu thực tế.",
        "Phát triển đội ngũ: Xây dựng đội ngũ có năng lực, tinh thần trách nhiệm và khả năng thích ứng với đổi mới giáo dục nghề nghiệp.",
        "Kết nối doanh nghiệp: Tăng cường hợp tác với doanh nghiệp trong đào tạo, thực hành, tuyển dụng và phát triển chương trình.",
        "Quản trị hiện đại: Đẩy mạnh quản trị dựa trên dữ liệu, hiệu quả vận hành và chất lượng phục vụ người học.",
      ],
    },
    direction: {
      vi: "Lấy chất lượng đào tạo, giá trị người học và nhu cầu của doanh nghiệp làm trọng tâm; xây dựng môi trường giáo dục nghề nghiệp hiện đại, thực tiễn và hội nhập.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "bgh",
        title: { vi: "Hiệu trưởng" },
        rank: 10,
      },
    ],
  },
  {
    slug: "le-cong-hoa",
    name: "Lê Công Hòa",
    honorific: "ThS.",
    birthYear: 1982,
    headline: { vi: "Phó Hiệu trưởng Trường Cao đẳng Công nghệ Ngoại thương" },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 7,
    bio: {
      vi: "Nhà quản lý giáo dục có kinh nghiệm xuyên suốt từ tuyển sinh, truyền thông, công tác người học đến quản trị cấp Ban Giám hiệu; định hướng hoạt động đào tạo theo hướng thực tiễn, linh hoạt và gắn kết doanh nghiệp.",
    },
    quote: {
      vi: "Gắn quản trị giáo dục với hiệu quả tuyển sinh, chất lượng đào tạo, nhu cầu người học và kết nối doanh nghiệp.",
    },
    overview: {
      vi: [
        "ThS. Lê Công Hòa có nền tảng chuyên môn về quản lý kinh tế và nhiều năm kinh nghiệm trong hệ thống giáo dục nghề nghiệp. Quá trình công tác trải rộng từ quản lý trung tâm, tuyển sinh, truyền thông, công tác sinh viên đến điều hành ở cấp Phó Hiệu trưởng và Hiệu trưởng. Sự kết hợp giữa kinh nghiệm quản trị, hiểu biết thị trường tuyển sinh và khả năng kết nối doanh nghiệp tạo nên lợi thế trong tổ chức hoạt động đào tạo theo hướng thực tiễn và hiệu quả.",
      ],
    },
    education: [],
    competencies: [],
    career: [
      {
        time: "05/2010 – 05/2014",
        role: { vi: "Quản lý Trung tâm" },
        org: {
          vi: "Trung tâm Luyện thi Đại học và Bồi dưỡng Văn hóa Tân Việt",
        },
      },
      {
        time: "02/2015 – 12/2016",
        role: { vi: "Nhân viên Trung tâm Tuyển sinh & Truyền thông" },
        org: { vi: "Trường Cao đẳng Công nghệ Cao Đồng An" },
      },
      {
        time: "01/2017 – 10/2017",
        role: { vi: "Phó Giám đốc Trung tâm Tuyển sinh" },
        org: { vi: "Trường Cao đẳng Công nghệ Cao Đồng An" },
      },
      {
        time: "11/2017 – 07/2018",
        role: { vi: "Nhân viên Phòng Công tác HSSV" },
        org: { vi: "Trường Cao đẳng Công nghệ Cao Đồng An" },
      },
      {
        time: "07/2018 – 06/2021",
        role: { vi: "Giám đốc Trung tâm Tuyển sinh & Truyền thông" },
        org: { vi: "Trường Cao đẳng Công nghệ Cao Đồng An" },
      },
      {
        time: "07/2021 – 12/2021",
        role: { vi: "Giám đốc Trung tâm Tuyển sinh" },
        org: { vi: "Trường Cao đẳng Công nghệ Cao Đồng An" },
      },
      {
        time: "02/2021 – 04/2022",
        role: {
          vi: "Phó Hiệu trưởng phụ trách Tuyển sinh, Truyền thông & Công tác sinh viên",
        },
        org: { vi: "Trường Cao đẳng VHNT & Du lịch Sài Gòn" },
      },
      {
        time: "06/2022 – 02/2026",
        role: { vi: "Phó Ban Sự kiện – Truyền thông" },
        org: { vi: "Hội Giáo dục nghề nghiệp TP. Hồ Chí Minh" },
      },
      {
        time: "11/2022 – 05/2024",
        role: { vi: "Phó Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng Công nghệ và Du lịch" },
      },
      {
        time: "05/2024 – 04/2026",
        role: {
          vi: "Phó Hiệu trưởng kiêm Giám đốc Trung tâm Tuyển sinh & Liên kết đào tạo",
        },
        org: { vi: "Trường Cao đẳng Công nghệ và Du lịch" },
      },
      {
        time: "05/2026 – 09/2026",
        role: { vi: "Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng Công nghệ Ngoại thương" },
      },
      {
        time: "Hiện nay",
        role: { vi: "Phó Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng Công nghệ Ngoại thương" },
      },
    ],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Gắn quản trị giáo dục với hiệu quả tuyển sinh, chất lượng đào tạo, nhu cầu người học và kết nối doanh nghiệp.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "bgh",
        title: { vi: "Phó Hiệu trưởng" },
        rank: 20,
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
    ],
  },
  {
    slug: "le-van-tan",
    name: "Lê Văn Tấn",
    honorific: "TS.",
    birthYear: 1977,
    headline: { vi: "Hiệu trưởng Trường Trung cấp Bách Khoa Vũng Tàu" },
    schoolSlug: "trung-cap-bach-khoa-vung-tau",
    order: 8,
    bio: {
      vi: "Nhà quản lý giáo dục có nền tảng đa ngành về công nghệ thông tin, quản trị kinh doanh và quản lý đào tạo; sở hữu kinh nghiệm điều hành tại nhiều cơ sở giáo dục, từ cấp phòng, khoa đến vị trí hiệu trưởng.",
    },
    quote: {
      vi: "Phát triển nhà trường theo hướng thực tiễn, hiện đại; lấy chất lượng đào tạo, năng lực nghề nghiệp và khả năng thích ứng của người học làm trọng tâm.",
    },
    overview: {
      vi: [
        "TS. Lê Văn Tấn là cán bộ quản lý giáo dục có hành trình nghề nghiệp trải rộng từ công nghệ thông tin, quản lý đào tạo, điều hành khoa chuyên môn đến lãnh đạo cơ sở giáo dục. Sự kết hợp giữa nền tảng kỹ thuật, kinh tế - luật và quản trị kinh doanh giúp ông có góc nhìn liên ngành trong tổ chức đào tạo, vận hành nhà trường và hoạch định phát triển.",
        "Qua nhiều vị trí quản lý tại các trường cao đẳng, đại học và cơ sở giáo dục nghề nghiệp, ông tích lũy kinh nghiệm trong quản trị chương trình, tổ chức bộ máy, phát triển đội ngũ, nâng cao chất lượng chuyên môn và thúc đẩy ứng dụng công nghệ trong giáo dục. Đây là nền tảng quan trọng để ông dẫn dắt Trường Trung cấp Bách Khoa Vũng Tàu theo hướng thực tiễn, hiện đại và gắn với nhu cầu doanh nghiệp.",
      ],
    },
    education: [],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ GIÁO DỤC" },
        text: {
          vi: "Tổ chức bộ máy, điều hành hoạt động, xây dựng định hướng phát triển và phối hợp nguồn lực.",
        },
      },
      {
        title: { vi: "QUẢN LÝ ĐÀO TẠO" },
        text: {
          vi: "Quản trị chương trình, kế hoạch đào tạo, tổ chức chuyên môn và kiểm soát chất lượng.",
        },
      },
      {
        title: { vi: "CÔNG NGHỆ & CHUYỂN ĐỔI SỐ" },
        text: {
          vi: "Nền tảng công nghệ thông tin hỗ trợ hiện đại hóa quản trị, giảng dạy và vận hành.",
        },
      },
      {
        title: { vi: "NGHIÊN CỨU & GIẢNG DẠY" },
        text: {
          vi: "Có kinh nghiệm biên soạn tài liệu, nghiên cứu và thỉnh giảng tại các cơ sở giáo dục đại học.",
        },
      },
    ],
    career: [
      {
        time: "2004 - 2005",
        role: { vi: "Giám đốc Trung tâm Tin học và Ngoại ngữ" },
        org: { vi: "Trường Đại học CNTT Gia Định" },
      },
      {
        time: "2005 - 2010",
        role: { vi: "Trưởng phòng Đào tạo" },
        org: { vi: "Trường Cao đẳng nghề Hàng không" },
      },
      {
        time: "2010 - 2014",
        role: { vi: "Trưởng khoa Công nghệ Thông tin" },
        org: { vi: "Trường Đại học Quốc tế Hồng Bàng" },
      },
      {
        time: "2014 - 2016",
        role: { vi: "Hiệu trưởng" },
        org: { vi: "Trường Cao đẳng nghề Kỹ thuật Thiết bị Y tế Bình Dương" },
      },
      {
        time: "2016 - 2018",
        role: { vi: "Quyền Hiệu trưởng; phụ trách Phòng Đào tạo và Khoa CNTT" },
        org: { vi: "Trường Đại học CNTT Gia Định" },
      },
      {
        time: "2016 - nay",
        role: { vi: "Giảng viên, thỉnh giảng" },
        org: { vi: "Một số trường đại học" },
      },
      {
        time: "Hiện nay",
        role: { vi: "Hiệu trưởng" },
        org: { vi: "Trường Trung cấp Bách Khoa Vũng Tàu" },
      },
    ],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Giá trị của giáo dục nghề nghiệp được đo bằng năng lực thực hành, khả năng thích ứng và cơ hội phát triển bền vững của người học.",
    },
    appointments: [
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "bgh",
        title: { vi: "Hiệu trưởng" },
        rank: 10,
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Quyết định 0805/2026/QĐ-TCBKVT ngày 08/05/2026",
      },
    ],
  },
  {
    slug: "nguyen-manh-tuan",
    name: "Nguyễn Mạnh Tuân",
    honorific: null,
    birthYear: 1981,
    headline: { vi: "Hiệu trưởng Trường Trung cấp Nghề Quốc tế IVS" },
    schoolSlug: "trung-cap-nghe-quoc-te-ivs",
    order: 9,
    bio: {
      vi: "Nhà quản lý giáo dục có nền tảng sư phạm Toán - Tin, kinh nghiệm trong quản lý nhà nước, điều hành doanh nghiệp và quản trị cơ sở giáo dục nghề nghiệp.",
    },
    quote: {
      vi: "Xây dựng môi trường giáo dục nghề nghiệp kỷ cương, thực tiễn và hiệu quả; chú trọng chất lượng đào tạo, năng lực nghề nghiệp của người học và sự gắn kết với nhu cầu doanh nghiệp.",
    },
    overview: { vi: [] },
    education: [],
    competencies: [],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Kỷ cương trong quản trị - thực tiễn trong đào tạo - hiệu quả trong kết nối doanh nghiệp.",
    },
    appointments: [
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "bgh",
        title: { vi: "Hiệu trưởng" },
        rank: 10,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Quyết định 2904c/2026/QĐ-IVS ngày 29/04/2026",
      },
    ],
  },
  {
    slug: "do-thi-thuy",
    name: "Đỗ Thị Thùy",
    honorific: null,
    birthYear: 1990,
    headline: { vi: "Phó Hiệu trưởng Trường Trung cấp Nghề Quốc tế" },
    schoolSlug: "trung-cap-nghe-quoc-te-ivs",
    order: 10,
    bio: {
      vi: "Nhà giáo có nền tảng sư phạm đa ngành, kinh nghiệm giảng dạy ở nhiều cấp học và định hướng quản lý giáo dục nghề nghiệp theo hướng thực tiễn, kỷ cương và lấy người học làm trung tâm.",
    },
    quote: {
      vi: "Lấy chất lượng chuyên môn làm nền tảng, lấy sự tiến bộ của người học làm thước đo và lấy hiệu quả phối hợp đội ngũ làm động lực phát triển nhà trường.",
    },
    overview: {
      vi: [
        "Đỗ Thị Thùy là nhà giáo có nền tảng đào tạo chính quy tại Trường Đại học Sư phạm Hà Nội, đồng thời được đào tạo ở cả hai lĩnh vực Sư phạm Kỹ thuật và Sư phạm Toán học. Quá trình nghề nghiệp trải dài từ giáo dục tiểu học, trung học phổ thông đến giáo dục nghề nghiệp, tạo nên góc nhìn liên thông về phương pháp dạy học, quản lý người học và tổ chức hoạt động đào tạo.",
      ],
    },
    education: [],
    competencies: [
      {
        title: { vi: "QUẢN LÝ ĐÀO TẠO" },
        text: {
          vi: "Tổ chức hoạt động giảng dạy, phối hợp chuyên môn, theo dõi nền nếp và chất lượng đào tạo.",
        },
      },
      {
        title: { vi: "SƯ PHẠM & PHƯƠNG PHÁP" },
        text: {
          vi: "Kinh nghiệm giảng dạy ở nhiều cấp học, có nền tảng Toán học và Sư phạm Kỹ thuật.",
        },
      },
      {
        title: { vi: "QUẢN LÝ NGƯỜI HỌC" },
        text: {
          vi: "Hiểu tâm lý và đặc thù người học, chú trọng kỷ luật, sự tiến bộ và khả năng thích ứng nghề nghiệp.",
        },
      },
      {
        title: { vi: "PHỐI HỢP & TỔ CHỨC" },
        text: {
          vi: "Khả năng phối hợp đội ngũ, triển khai công việc theo kế hoạch và duy trì hiệu quả vận hành.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Lấy chất lượng chuyên môn làm nền tảng, lấy sự tiến bộ của người học làm thước đo và lấy hiệu quả phối hợp đội ngũ làm động lực phát triển nhà trường.",
    },
    appointments: [
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "bgh",
        title: { vi: "Phó Hiệu trưởng" },
        rank: 20,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Thư ký Hội đồng trường" },
        rank: 30,
        term: "2026–2031",
        decisionRef: "Quyết định 2904c/2026/QĐ-IVS ngày 29/04/2026",
      },
    ],
  },
  {
    slug: "hoang-dinh-chien",
    name: "Hoàng Đình Chiến",
    honorific: null,
    birthYear: 1979,
    headline: { vi: "Phó Hiệu trưởng Trường Trung cấp Nghề Quốc tế" },
    schoolSlug: "trung-cap-nghe-quoc-te-ivs",
    order: 11,
    bio: {
      vi: "Nhà giáo và cán bộ quản lý có nền tảng kỹ thuật Tự động hóa, kinh nghiệm thực tiễn trong môi trường sản xuất và giáo dục nghề nghiệp; chú trọng kỷ luật, kỹ năng nghề và khả năng ứng dụng của người học.",
    },
    quote: {
      vi: "Lấy kỹ năng nghề làm nền tảng, lấy kỷ luật và trách nhiệm làm chuẩn mực, lấy khả năng làm việc thực tế của người học làm thước đo chất lượng.",
    },
    overview: {
      vi: [
        "Hoàng Đình Chiến có nền tảng kỹ thuật Tự động hóa và nhiều năm trải nghiệm trong cả môi trường doanh nghiệp lẫn cơ sở giáo dục nghề nghiệp. Sự kết hợp giữa tư duy kỹ thuật, kinh nghiệm thực tiễn và quá trình giảng dạy giúp hình thành phong cách quản lý chú trọng tính hệ thống, kỷ luật nghề nghiệp và hiệu quả đào tạo.",
      ],
    },
    education: [
      {
        text: {
          vi: "Kỹ sư Tự động hóa: Trường Đại học Kỹ thuật Công nghiệp - Đại học Thái Nguyên; tốt nghiệp năm 2013.",
        },
      },
      {
        text: {
          vi: "Nghiệp vụ sư phạm dạy nghề: Đã hoàn thành chương trình sư phạm dạy nghề dành cho giáo viên trình độ trung cấp nghề; chứng chỉ cấp năm 2012.",
        },
      },
    ],
    competencies: [],
    career: [],
    highlights: {
      vi: [
        "Kết hợp kỹ thuật và sư phạm: Nền tảng kỹ sư Tự động hóa hỗ trợ việc tiếp cận nội dung đào tạo nghề theo hướng logic, thực hành và có tính ứng dụng.",
        "Kinh nghiệm thực tế doanh nghiệp: Quá trình làm việc trong môi trường sản xuất giúp tăng khả năng kết nối yêu cầu nghề nghiệp thực tế với hoạt động đào tạo.",
        "Kinh nghiệm giảng dạy: Có nhiều năm tham gia giảng dạy, tạo nền tảng để hiểu người học, tổ chức lớp học và phối hợp chuyên môn.",
        "Vai trò quản lý hiện tại: Ở vị trí Phó Hiệu trưởng, trọng tâm là hỗ trợ điều hành, củng cố nền nếp và nâng cao hiệu quả đào tạo nghề.",
      ],
    },
    focus: { vi: [] },
    direction: {
      vi: "Lấy kỹ năng nghề làm nền tảng, lấy kỷ luật và trách nhiệm làm chuẩn mực, lấy khả năng làm việc thực tế của người học làm thước đo chất lượng.",
    },
    appointments: [
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "bgh",
        title: { vi: "Phó Hiệu trưởng" },
        rank: 20,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Quyết định 2904c/2026/QĐ-IVS ngày 29/04/2026",
      },
    ],
  },
  {
    slug: "ho-van-phong",
    name: "Hồ Văn Phong",
    honorific: null,
    birthYear: 1974,
    headline: {
      vi: "Phó Giám đốc Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức",
    },
    schoolSlug: "trung-cap-cong-nghe-viet-duc",
    order: 12,
    bio: {
      vi: "Ông Hồ Văn Phong là nhà quản lý có nền tảng đào tạo về Quản trị kinh doanh và kinh nghiệm thực tiễn trải rộng từ kế hoạch – vật tư, hành chính – nhân sự trong doanh nghiệp đến công tác điều hành ở cấp tập đoàn. Quá trình đảm nhiệm các vị trí quản lý tại doanh nghiệp sản xuất và tổ chức tài chính giúp ông hình thành tư duy quản trị chú trọng kỷ luật vận hành, hiệu quả nguồn lực và sự phối hợp giữa con người với hệ thống.",
    },
    quote: {
      vi: "Quản trị hiệu quả bắt đầu từ mục tiêu rõ ràng, trách nhiệm cụ thể và một đội ngũ cùng hướng tới giá trị bền vững.",
    },
    overview: {
      vi: [
        "Ông Hồ Văn Phong là nhà quản lý có nền tảng đào tạo về Quản trị kinh doanh và kinh nghiệm thực tiễn trải rộng từ kế hoạch – vật tư, hành chính – nhân sự trong doanh nghiệp đến công tác điều hành ở cấp tập đoàn. Quá trình đảm nhiệm các vị trí quản lý tại doanh nghiệp sản xuất và tổ chức tài chính giúp ông hình thành tư duy quản trị chú trọng kỷ luật vận hành, hiệu quả nguồn lực và sự phối hợp giữa con người với hệ thống.",
        "Hiện nay, trên cương vị Phó Giám đốc Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức, đồng thời là Thành viên Hội đồng trường Trường Trung cấp Công nghệ Việt Đức, ông hướng tới việc kết nối kinh nghiệm quản trị doanh nghiệp với yêu cầu phát triển giáo dục nghề nghiệp theo hướng chuyên nghiệp, thực tiễn và bền vững.",
      ],
    },
    education: [],
    competencies: [],
    career: [],
    highlights: { vi: [] },
    focus: {
      vi: [
        "Chuẩn hóa quy trình quản trị và tăng tính minh bạch trong phân công, phối hợp, kiểm soát công việc.",
        "Phát huy hiệu quả nguồn lực con người, gắn trách nhiệm cá nhân với mục tiêu chung của tổ chức.",
        "Tăng cường kết nối giữa nhà trường và doanh nghiệp để hoạt động đào tạo bám sát nhu cầu thực tế của thị trường lao động.",
        "Hỗ trợ xây dựng môi trường giáo dục nghề nghiệp kỷ cương, thực chất và chú trọng năng lực nghề của người học.",
        "Thúc đẩy tinh thần cải tiến liên tục, ưu tiên các giải pháp có thể đo lường và triển khai hiệu quả.",
      ],
    },
    direction: {
      vi: "Trong vai trò quản lý tại Việt Đức Group và Thành viên Hội đồng trường Trường Trung cấp Công nghệ Việt Đức, ông Hồ Văn Phong định hướng đóng góp vào việc xây dựng hệ thống vận hành chuyên nghiệp, tăng tính phối hợp giữa các đơn vị và đưa tư duy quản trị hiệu quả vào hoạt động giáo dục nghề nghiệp.",
    },
    appointments: [
      {
        school: null,
        org: {
          vi: "Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức",
        },
        body: "dieuhanh",
        title: { vi: "Phó Giám đốc" },
        rank: 25,
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Quyết định 0607/2026/QĐ-HĐQT ngày 06/07/2026",
      },
    ],
  },
  {
    slug: "phan-minh-phuong",
    name: "Phan Minh Phương",
    honorific: null,
    birthYear: 1982,
    headline: {
      vi: "Thành viên Hội đồng trường Trường Trung cấp Công nghệ Việt Đức",
    },
    schoolSlug: "trung-cap-cong-nghe-viet-duc",
    order: 13,
    bio: {
      vi: "Ông Phan Minh Phương có nền tảng đào tạo kết hợp giữa quản trị kinh doanh và chuyên môn chăn nuôi thú y, cùng kinh nghiệm thực tiễn trong quản lý doanh nghiệp và phát triển cộng đồng. Việc từng đảm nhiệm vai trò Giám đốc công ty và tham gia các dự án nông nghiệp tại Quảng Bình giúp ông hình thành góc nhìn đa chiều về tổ chức, nguồn lực, sinh kế và nhu cầu phát triển tại địa phương. Trong vai trò Thành viên Hội đồng trường Trường Trung cấp Công nghệ Việt Đức, ông hướng tới việc đóng góp kinh nghiệm thực tiễn cho công tác quản trị, định hướng đào tạo và kết nối giáo dục nghề nghiệp với nhu cầu của cộng đồng và thị trường lao động.",
    },
    quote: {
      vi: "Giáo dục có giá trị nhất khi tri thức được chuyển hóa thành năng lực, cơ hội và sự phát triển bền vững cho cộng đồng.",
    },
    overview: {
      vi: [
        "Ông Phan Minh Phương có nền tảng đào tạo kết hợp giữa quản trị kinh doanh và chuyên môn chăn nuôi thú y, cùng kinh nghiệm thực tiễn trong quản lý doanh nghiệp và phát triển cộng đồng. Việc từng đảm nhiệm vai trò Giám đốc công ty và tham gia các dự án nông nghiệp tại Quảng Bình giúp ông hình thành góc nhìn đa chiều về tổ chức, nguồn lực, sinh kế và nhu cầu phát triển tại địa phương. Trong vai trò Thành viên Hội đồng trường Trường Trung cấp Công nghệ Việt Đức, ông hướng tới việc đóng góp kinh nghiệm thực tiễn cho công tác quản trị, định hướng đào tạo và kết nối giáo dục nghề nghiệp với nhu cầu của cộng đồng và thị trường lao động.",
      ],
    },
    education: [],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ & ĐIỀU HÀNH" },
        text: {
          vi: "Kinh nghiệm quản lý doanh nghiệp, tổ chức nguồn lực và triển khai hoạt động theo mục tiêu.",
        },
      },
      {
        title: { vi: "PHÁT TRIỂN CỘNG ĐỒNG" },
        text: {
          vi: "Kinh nghiệm cán bộ cộng đồng trong các dự án nông nghiệp tại Quảng Bình, chú trọng kết nối và tạo giá trị cho người dân.",
        },
      },
      {
        title: { vi: "NÔNG NGHIỆP & SINH KẾ" },
        text: {
          vi: "Nền tảng kỹ sư chăn nuôi thú y hỗ trợ tư duy về sản xuất nông nghiệp, sinh kế và phát triển bền vững.",
        },
      },
      {
        title: { vi: "KẾT NỐI GIÁO DỤC - THỰC TIỄN" },
        text: {
          vi: "Định hướng đưa kinh nghiệm doanh nghiệp và cộng đồng vào hoạt động quản trị và phát triển giáo dục nghề nghiệp.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "✓  Gắn đào tạo với nhu cầu thực tế — Đóng góp góc nhìn thực tiễn từ doanh nghiệp và cộng đồng để chương trình đào tạo gần hơn với nhu cầu việc làm.",
    },
    appointments: [
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Quyết định 0607/2026/QĐ-HĐQT ngày 06/07/2026",
      },
    ],
  },
  {
    slug: "nguyen-thi-nhu-ngoc",
    name: "Nguyễn Thị Như Ngọc",
    honorific: null,
    birthYear: 1999,
    headline: {
      vi: "Giám đốc NIBELC Manpower Kft (Hungary) – Regional Director for Europe, NIBELC Group",
    },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 14,
    bio: {
      vi: "Nguyễn Thị Như Ngọc là cán bộ quản lý trẻ có nền tảng liên ngành về Luật và Quản trị nhân sự, đồng thời sở hữu kinh nghiệm thực tiễn trong hành chính – nhân sự, pháp chế doanh nghiệp và môi trường pháp lý. Quá trình nghề nghiệp từ thực tập chuyên môn đến trợ lý pháp chế và hiện nay là Giám đốc khu vực Châu Âu của Nibelc Group giúp chị hình thành tư duy làm việc kết hợp giữa tuân thủ pháp lý, quản trị con người và phát triển hoạt động quốc tế.",
    },
    quote: {
      vi: "Kết nối con người, pháp lý và quản trị để tạo nền tảng phát triển bền vững cho tổ chức trong môi trường quốc tế.",
    },
    overview: {
      vi: [
        "Nguyễn Thị Như Ngọc là cán bộ quản lý trẻ có nền tảng liên ngành về Luật và Quản trị nhân sự, đồng thời sở hữu kinh nghiệm thực tiễn trong hành chính – nhân sự, pháp chế doanh nghiệp và môi trường pháp lý. Quá trình nghề nghiệp từ thực tập chuyên môn đến trợ lý pháp chế và hiện nay là Giám đốc khu vực Châu Âu của Nibelc Group giúp chị hình thành tư duy làm việc kết hợp giữa tuân thủ pháp lý, quản trị con người và phát triển hoạt động quốc tế.",
      ],
    },
    education: [
      {
        text: {
          vi: "Thạc sĩ Kinh tế – Buckingham University (Vương quốc Anh)",
        },
      },
      { text: { vi: "Cử nhân Luật học – Học viện Tòa án." } },
      {
        text: {
          vi: "Thạc sĩ Quản trị nhân sự – International Business School Budapest",
        },
      },
      { text: { vi: "Chuyên ngành – Luật; Quản trị nhân sự." } },
    ],
    competencies: [
      {
        title: { vi: "PHÁP LÝ & TUÂN THỦ" },
        text: {
          vi: "Nền tảng Luật học, kinh nghiệm thực tập tại Tòa án và làm việc trong bộ phận pháp chế doanh nghiệp.",
        },
      },
      {
        title: { vi: "QUẢN TRỊ NHÂN SỰ" },
        text: {
          vi: "Kiến thức sau đại học về quản trị nhân sự, hỗ trợ tổ chức đội ngũ và phối hợp nhân sự đa thị trường.",
        },
      },
      {
        title: { vi: "PHÁT TRIỂN THỊ TRƯỜNG QUỐC TẾ" },
        text: {
          vi: "Điều phối hoạt động khu vực Châu Âu, kết nối đối tác và hỗ trợ phát triển mạng lưới của Nibelc Group.",
        },
      },
      {
        title: { vi: "ĐIỀU PHỐI & GIAO TIẾP" },
        text: {
          vi: "Khả năng phối hợp đa bộ phận, làm việc trong môi trường quốc tế và xử lý công việc theo hướng hệ thống.",
        },
      },
    ],
    career: [],
    highlights: {
      vi: [
        "Nền tảng pháp lý thực tiễn: Kinh nghiệm học tập và làm việc trong môi trường Tòa án và doanh nghiệp giúp hình thành tư duy tuân thủ, phân tích vấn đề và hỗ trợ kiểm soát rủi ro pháp lý.",
        "Kết hợp Luật và Quản trị nhân sự: Nền tảng liên ngành tạo lợi thế khi xử lý các vấn đề liên quan đến con người, tổ chức, quy trình và quan hệ lao động trong môi trường doanh nghiệp.",
        "Kinh nghiệm quốc tế: Vai trò phụ trách khu vực Châu Âu giúp mở rộng năng lực điều phối, giao tiếp liên văn hóa và hỗ trợ phát triển hoạt động của doanh nghiệp tại thị trường quốc tế.",
        "Góc nhìn quản trị giáo dục: Việc tham gia Hội đồng trường tạo thêm trải nghiệm trong công tác quản trị, định hướng và kết nối giữa nhà trường với nhu cầu của doanh nghiệp và thị trường lao động.",
      ],
    },
    focus: { vi: [] },
    direction: {
      vi: "Phát triển thị trường quốc tế trên nền tảng pháp lý vững chắc, quản trị con người hiệu quả và hợp tác bền vững.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: null,
        org: { vi: "NIBELC Group" },
        body: "khac",
        title: {
          vi: "Giám đốc NIBELC Manpower Kft (Hungary) – Regional Director for Europe",
        },
        rank: 60,
      },
    ],
  },
  {
    slug: "nguyen-van-linh",
    name: "Nguyễn Văn Linh",
    honorific: "ThS.",
    birthYear: 1989,
    headline: { vi: "Phó Tổng Giám đốc NIBELC Group" },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 15,
    bio: {
      vi: "Nguyễn Văn Linh là cán bộ quản lý có nền tảng chuyên môn về Quản lý Tài nguyên và Môi trường, đồng thời có kinh nghiệm thực tiễn trong đào tạo, kinh doanh, phát triển đội ngũ và triển khai các hoạt động hợp tác quốc tế. Quá trình nghề nghiệp của ông trải rộng từ môi trường đại học, bảo hiểm nhân thọ đến lĩnh vực du học – xuất khẩu lao động và quản trị giáo dục, tạo nên góc nhìn đa chiều về con người, thị trường và phát triển tổ chức.",
    },
    quote: {
      vi: "Tôi tin rằng giá trị của quản trị không chỉ nằm ở việc vận hành tốt một tổ chức, mà còn ở khả năng tạo ra cơ hội phát triển cho con người. Khi giáo dục, doanh nghiệp và hợp tác quốc tế được kết nối đúng hướng, mỗi cá nhân sẽ có thêm lựa chọn để phát triển nghề nghiệp và đóng góp tích cực cho xã hội.",
    },
    overview: {
      vi: [
        "Nguyễn Văn Linh là cán bộ quản lý có nền tảng chuyên môn về Quản lý Tài nguyên và Môi trường, đồng thời có kinh nghiệm thực tiễn trong đào tạo, kinh doanh, phát triển đội ngũ và triển khai các hoạt động hợp tác quốc tế. Quá trình nghề nghiệp của ông trải rộng từ môi trường đại học, bảo hiểm nhân thọ đến lĩnh vực du học – xuất khẩu lao động và quản trị giáo dục, tạo nên góc nhìn đa chiều về con người, thị trường và phát triển tổ chức.",
        "Trong vai trò Phó Tổng Giám đốc Nibelc Group và Thành viên Hội đồng trường, ông định hướng phát huy năng lực quản trị, kinh nghiệm phát triển thị trường và nền tảng giáo dục để thúc đẩy các mô hình hợp tác đào tạo – nhân lực – việc làm theo hướng thực tiễn, hiệu quả và bền vững.",
      ],
    },
    education: [],
    competencies: [
      {
        title: { vi: "QUẢN TRỊ & PHÁT TRIỂN" },
        text: {
          vi: "Tổ chức hoạt động, phát triển đội ngũ, mở rộng thị trường và phối hợp nhiều nhóm chức năng.",
        },
      },
      {
        title: { vi: "ĐÀO TẠO & KỸ NĂNG" },
        text: {
          vi: "Kinh nghiệm giảng dạy chuyên ngành và tổ chức đào tạo kỹ năng, gắn kiến thức với khả năng ứng dụng.",
        },
      },
      {
        title: { vi: "HỢP TÁC QUỐC TẾ" },
        text: {
          vi: "Tham gia các chương trình trao đổi sinh viên và hoạt động kết nối giáo dục với đối tác Đức, Nhật Bản.",
        },
      },
      {
        title: { vi: "MÔI TRƯỜNG & DỰ ÁN" },
        text: {
          vi: "Nền tảng chuyên môn về tài nguyên – môi trường, đánh giá tác động và tham gia các đề tài, dự án thực tế.",
        },
      },
    ],
    career: [],
    highlights: {
      vi: [
        "Dự án VNEN (Vietnam Escuela Nueva): Tham gia với vai trò cán bộ dự án, có trải nghiệm trong triển khai mô hình giáo dục và phối hợp hoạt động thực địa.",
        "Trao đổi sinh viên Đức – Việt Nam: Tham gia chương trình trao đổi sinh viên giữa Trường Hanover (Đức) và Đại học Huế, góp phần mở rộng trải nghiệm hợp tác giáo dục quốc tế.",
        "Trao đổi sinh viên Nhật Bản – Việt Nam: Tham gia chương trình trao đổi giữa Trường Tottori (Nhật Bản) và Đại học Huế.",
        "Đánh giá tác động môi trường: Tham gia hoạt động đánh giá tác động môi trường của một số dự án, trong đó có các dự án thủy điện tại Huế.",
        "Nghiên cứu & bản đồ du lịch: Thành viên đề tài xây dựng bản đồ du lịch cho TP. Huế và TP. Hồ Chí Minh.",
        "Quản trị thị trường & kinh doanh: Nhiều năm ở vị trí quản lý cấp cao trong lĩnh vực bảo hiểm nhân thọ, tích lũy kinh nghiệm phát triển thị trường, đội ngũ và hiệu quả kinh doanh.",
        "Du học & xuất khẩu lao động: Kinh nghiệm điều hành lĩnh vực kết nối giáo dục quốc tế, cung ứng nhân lực và phát triển cơ hội học tập – việc làm ở nước ngoài.",
        "Giáo dục & đào tạo: Có nền tảng giảng dạy chuyên ngành, đào tạo kỹ năng và kinh nghiệm tham gia hoạt động quản trị nhà trường.",
      ],
    },
    focus: { vi: [] },
    direction: {
      vi: "Phát triển con người bằng giáo dục thực tiễn; phát triển tổ chức bằng quản trị hiệu quả; mở rộng cơ hội bằng hợp tác quốc tế.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Thư ký Hội đồng trường" },
        rank: 30,
        term: "2026–2031",
        decisionRef: "Nghị quyết 0605/NQ-FT ngày 06/05/2026",
      },
      {
        school: null,
        org: { vi: "NIBELC Group" },
        body: "khac",
        title: { vi: "Phó Tổng Giám đốc" },
        rank: 60,
      },
    ],
  },
  {
    slug: "bui-van-phuong",
    name: "Bùi Văn Phượng",
    honorific: null,
    birthYear: 1980,
    headline: {
      vi: "Phó Thường trực Ban Kiểm soát Tập đoàn Việt Đức – Thành viên HĐQT Tập đoàn",
    },
    schoolSlug: null,
    order: 16,
    bio: null,
    quote: {
      vi: "Quản trị tài chính minh bạch, kiểm soát nguồn lực chặt chẽ và đồng hành cùng hoạt động sản xuất - kinh doanh bằng tư duy thực tiễn.",
    },
    overview: { vi: [] },
    education: [
      {
        text: {
          vi: "Chức vụ hiện nay: Trưởng Ban Kiểm soát hệ thống các trường GDNN thuộc Việt Đức Group; Giám đốc Công ty Cổ phần Nền móng Hạ tầng và Cơ khí Xây dựng ; Thành viên Hội Đồng Trường",
        },
      },
      { text: { vi: "Trình độ: Cử nhân Kinh tế - chuyên ngành Kế toán" } },
      { text: { vi: "Chứng chỉ: Kế toán trưởng" } },
      { text: { vi: "Lý luận chính trị: Sơ cấp" } },
    ],
    competencies: [
      {
        title: { vi: "TÀI CHÍNH - KẾ TOÁN" },
        text: {
          vi: "Kinh nghiệm tổ chức, điều hành công tác kế toán - tài chính, kiểm soát dòng tiền và hỗ trợ các quyết định tài chính của doanh nghiệp.",
        },
      },
      {
        title: { vi: "KIỂM SOÁT & TUÂN THỦ" },
        text: {
          vi: "Kinh nghiệm làm việc với các đoàn thanh tra và xử lý các vấn đề liên quan đến xây dựng cơ bản, đào tạo nghề và công tác quản trị.",
        },
      },
      {
        title: { vi: "QUAN HỆ TÍN DỤNG" },
        text: {
          vi: "Thiết lập và duy trì quan hệ với các tổ chức tín dụng, hỗ trợ bảo đảm nguồn vốn phục vụ hoạt động sản xuất - kinh doanh.",
        },
      },
      {
        title: { vi: "QUẢN TRỊ DOANH NGHIỆP" },
        text: {
          vi: "Kinh nghiệm điều hành, phân bổ nguồn lực và phối hợp các bộ phận nhằm nâng cao hiệu quả hoạt động và năng lực thực thi.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Quản trị con người và nguồn lực phải đi cùng kỷ luật tài chính, phân công rõ ràng và nâng cao năng lực chuyên môn của đội ngũ.",
    },
    appointments: [
      {
        school: null,
        org: { vi: "Hệ thống các trường GDNN thuộc Việt Đức Group" },
        body: "bks",
        title: { vi: "Phó Thường trực Ban Kiểm soát" },
        rank: 20,
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "bks",
        title: { vi: "Trưởng Ban Kiểm soát" },
        rank: 10,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "bks",
        title: { vi: "Trưởng Ban Kiểm soát" },
        rank: 10,
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "bks",
        title: { vi: "Trưởng Ban Kiểm soát" },
        rank: 10,
      },
      {
        school: "trung-cap-viet-han",
        body: "bks",
        title: { vi: "Trưởng Ban Kiểm soát" },
        rank: 10,
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "bks",
        title: { vi: "Trưởng Ban Kiểm soát" },
        rank: 10,
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "hdt",
        title: { vi: "Thư ký Hội đồng trường" },
        rank: 30,
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "hdt",
        title: { vi: "Thư ký Hội đồng trường" },
        rank: 30,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
      },
      {
        school: null,
        org: { vi: "Công ty Cổ phần Nền móng Hạ tầng và Cơ khí Xây dựng" },
        body: "khac",
        title: { vi: "Giám đốc" },
        rank: 60,
      },
    ],
  },
  {
    slug: "ha-thi-men",
    name: "Hà Thị Mến",
    honorific: null,
    birthYear: null,
    headline: { vi: "Thành viên Ban Kiểm soát" },
    schoolSlug: null,
    order: 17,
    bio: {
      vi: "Chuyên viên kế toán có kinh nghiệm hơn một thập kỷ trong lĩnh vực tài chính - kế toán doanh nghiệp, hiện tham gia công tác kiểm soát hệ thống các cơ sở giáo dục nghề nghiệp thuộc Việt Đức Group.",
    },
    quote: {
      vi: "Tăng cường tính minh bạch, chuẩn hóa quy trình và hỗ trợ hệ thống vận hành hiệu quả trên cơ sở dữ liệu chính xác.",
    },
    overview: { vi: [] },
    education: [],
    competencies: [
      {
        title: { vi: "KẾ TOÁN DOANH NGHIỆP" },
        text: {
          vi: "Theo dõi, tổng hợp và kiểm soát số liệu kế toán; phối hợp xử lý chứng từ và báo cáo phục vụ quản trị.",
        },
      },
      {
        title: { vi: "KIỂM SOÁT NỘI BỘ" },
        text: {
          vi: "Rà soát tính tuân thủ, đối chiếu số liệu và hỗ trợ nhận diện rủi ro trong quy trình tài chính - kế toán.",
        },
      },
      {
        title: { vi: "PHỐI HỢP HỆ THỐNG" },
        text: {
          vi: "Có kinh nghiệm làm việc với nhiều đơn vị thành viên, hỗ trợ chuẩn hóa thông tin và phối hợp nghiệp vụ.",
        },
      },
      {
        title: { vi: "TÍNH CHÍNH XÁC & TRÁCH NHIỆM" },
        text: {
          vi: "Đề cao tính cẩn trọng, minh bạch và trách nhiệm trong xử lý số liệu và kiểm soát tài chính.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Tăng cường tính minh bạch, chuẩn hóa quy trình và hỗ trợ hệ thống vận hành hiệu quả trên cơ sở dữ liệu chính xác.",
    },
    appointments: [
      {
        school: null,
        org: { vi: "Hệ thống các trường GDNN thuộc Việt Đức Group" },
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-viet-han",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
    ],
  },
  {
    slug: "nguyen-thi-phuong-lan",
    name: "Nguyễn Thị Phương Lan",
    honorific: null,
    birthYear: 1979,
    headline: { vi: "Thành viên Ban Kiểm soát" },
    schoolSlug: null,
    order: 18,
    bio: {
      vi: "Bà Nguyễn Thị Phương Lan có hơn 20 năm kinh nghiệm làm việc trong các lĩnh vực kế toán, kiểm soát, hành chính tổng hợp và công tác công đoàn. Quá trình công tác liên tục tại các doanh nghiệp hoạt động trong lĩnh vực xây dựng và cung ứng lao động giúp bà tích lũy nền tảng thực tiễn vững chắc về quản trị hồ sơ, phối hợp nội bộ, kiểm soát quy trình và tổ chức vận hành. Từ tháng 05/2026, bà tham gia Ban Kiểm soát hệ thống các trường giáo dục nghề nghiệp thuộc Việt Đức Group, góp phần tăng cường tính tuân thủ, minh bạch và hiệu quả trong hoạt động quản trị.",
    },
    quote: {
      vi: "Kiểm soát hiệu quả không chỉ là phát hiện sai lệch, mà còn là tạo nền tảng để hệ thống vận hành minh bạch, thống nhất và bền vững.",
    },
    overview: { vi: [] },
    education: [],
    competencies: [
      {
        title: { vi: "VỊ TRÍ CÔNG TÁC" },
        text: {
          vi: "Hơn hai thập kỷ kinh nghiệm trong kế toán, kiểm soát và quản trị hành chính",
        },
      },
      {
        title: { vi: "MINH BẠCH & TUÂN THỦ" },
        text: {
          vi: "Hỗ trợ theo dõi quy trình, hồ sơ và các nguyên tắc quản trị nhằm tăng tính minh bạch và trách nhiệm.",
        },
      },
      {
        title: { vi: "CHUẨN HÓA VẬN HÀNH" },
        text: {
          vi: "Góp phần thống nhất cách thức phối hợp, báo cáo và kiểm soát giữa các đơn vị trong hệ thống.",
        },
      },
      {
        title: { vi: "QUẢN TRỊ RỦI RO" },
        text: {
          vi: "Phát hiện sớm điểm bất hợp lý trong quy trình, đề xuất biện pháp phòng ngừa và cải thiện.",
        },
      },
      {
        title: { vi: "PHỐI HỢP HỆ THỐNG" },
        text: {
          vi: "Kết nối kinh nghiệm hành chính - tài chính - công đoàn để hỗ trợ vận hành đồng bộ, hiệu quả và ổn định.",
        },
      },
      {
        title: { vi: "NGUYỄN THỊ PHƯƠNG LAN" },
        text: {
          vi: "Thành viên Ban Kiểm soát hệ thống các trường GDNN thuộc Việt Đức Group",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: { vi: [] },
    direction: {
      vi: "Kiểm soát hiệu quả không chỉ là phát hiện sai lệch, mà còn là tạo nền tảng để hệ thống vận hành minh bạch, thống nhất và bền vững.",
    },
    appointments: [
      {
        school: "trung-cap-nghe-quoc-te-ivs",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
    ],
  },
  {
    slug: "tran-thi-lan",
    name: "Trần Thị Lan",
    honorific: null,
    birthYear: 1995,
    headline: { vi: "Phụ trách Hành chính – Pháp lý Tập đoàn Việt Đức" },
    schoolSlug: null,
    order: 19,
    bio: {
      vi: "Trần Thị Lan là cán bộ phụ trách hành chính pháp lý có nền tảng đào tạo Luật và kinh nghiệm thực tiễn trong công tác hành chính, pháp lý doanh nghiệp và hỗ trợ hoạt động của các cơ sở thuộc hệ thống giáo dục nghề nghiệp.",
    },
    quote: {
      vi: "Chuẩn hóa quy trình – kiểm soát pháp lý – đồng hành cùng vận hành hiệu quả.",
    },
    overview: {
      vi: [
        "Trần Thị Lan là cán bộ phụ trách hành chính pháp lý có nền tảng đào tạo Luật và kinh nghiệm thực tiễn trong công tác hành chính, pháp lý doanh nghiệp và hỗ trợ hoạt động của các cơ sở thuộc hệ thống giáo dục nghề nghiệp. Công việc tập trung vào tính tuân thủ, tính hệ thống và khả năng phối hợp giữa pháp lý với vận hành.",
        "Ở vai trò hiện nay, Trần Thị Lan tập trung hỗ trợ hệ thống về hành chính, hồ sơ pháp lý, chuẩn hóa văn bản và phối hợp xử lý các yêu cầu tuân thủ phát sinh trong hoạt động của doanh nghiệp và các đơn vị giáo dục nghề nghiệp.",
      ],
    },
    education: [
      { text: { vi: "Cử nhân Luật – Hệ dân sự, Học viện An ninh Nhân dân" } },
      { text: { vi: "Kinh nghiệm hành chính – pháp lý doanh nghiệp" } },
      {
        text: {
          vi: "Kinh nghiệm hỗ trợ pháp lý trong hệ thống các cơ sở giáo dục nghề nghiệp",
        },
      },
    ],
    competencies: [
      {
        title: { vi: "HÀNH CHÍNH – PHÁP LÝ DOANH NGHIỆP" },
        text: {
          vi: "Phối hợp hồ sơ, văn bản, thủ tục và công việc pháp lý phục vụ vận hành doanh nghiệp.",
        },
      },
      {
        title: { vi: "TUÂN THỦ & KIỂM SOÁT HỒ SƠ" },
        text: {
          vi: "Chú trọng tính đầy đủ, nhất quán, đúng thẩm quyền và khả năng truy xuất của tài liệu.",
        },
      },
      {
        title: { vi: "PHÁP LÝ TRONG GIÁO DỤC NGHỀ NGHIỆP" },
        text: {
          vi: "Có kinh nghiệm làm việc với các nội dung hành chính – pháp lý liên quan đến các trường thuộc hệ thống GDNN.",
        },
      },
      {
        title: { vi: "QUẢN TRỊ VĂN BẢN & QUY TRÌNH" },
        text: {
          vi: "Hướng tới chuẩn hóa biểu mẫu, hồ sơ, luồng phê duyệt và lưu trữ thông tin.",
        },
      },
    ],
    career: [],
    highlights: { vi: [] },
    focus: {
      vi: [
        "Chuẩn hóa hồ sơ hành chính – pháp lý, bảo đảm sự thống nhất giữa các đơn vị trong hệ thống.",
        "Theo dõi, rà soát và hỗ trợ hoàn thiện văn bản, hồ sơ, thủ tục phục vụ hoạt động quản trị và vận hành.",
        "Hỗ trợ các cơ sở GDNN trong các công việc hành chính – pháp lý theo phạm vi được phân công.",
        "Tăng cường phối hợp giữa pháp lý, hành chính và các bộ phận nghiệp vụ nhằm giảm rủi ro và rút ngắn thời gian xử lý.",
      ],
    },
    direction: {
      vi: "Trần Thị Lan định hướng phát triển chuyên môn theo hướng kết hợp chặt chẽ giữa pháp lý, hành chính và quản trị hệ thống. Trọng tâm là nâng cao năng lực kiểm soát tuân thủ, chuẩn hóa quy trình, quản trị hồ sơ và hỗ trợ các đơn vị vận hành trên nền tảng pháp lý rõ ràng, nhất quán và hiệu quả.",
    },
    appointments: [
      {
        school: null,
        org: { vi: "Việt Đức Group" },
        body: "dieuhanh",
        title: { vi: "Phụ trách Hành chính – Pháp lý" },
        rank: 40,
      },
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-bach-khoa-vung-tau",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-viet-han",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
      {
        school: "trung-cap-cong-nghe-viet-duc",
        body: "bks",
        title: { vi: "Thành viên Ban Kiểm soát" },
        rank: 40,
      },
    ],
  },
  {
    slug: "nguyen-duc-tinh",
    name: "Nguyễn Đức Tịnh",
    honorific: "ThS.",
    birthYear: 1959,
    headline: {
      vi: "Thành viên Hội đồng trường Trường Cao đẳng Công nghệ Ngoại thương",
    },
    schoolSlug: "cao-dang-cong-nghe-ngoai-thuong",
    order: 20,
    bio: {
      vi: "Nhà giáo có nền tảng chuyên môn Toán học, hơn bốn thập niên gắn với môi trường giáo dục, quản trị và đào tạo; kinh nghiệm kết hợp giữa giảng dạy đại học, quản trị doanh nghiệp và quản trị cơ sở giáo dục.",
    },
    quote: {
      vi: "Giáo dục bền vững bắt đầu từ nền tảng chuyên môn, kinh nghiệm thực tiễn và trách nhiệm với người học.",
    },
    overview: {
      vi: [
        "Nền tảng chuyên môn Toán học kết hợp kinh nghiệm quản lý và giảng dạy lâu năm tạo nên góc nhìn hệ thống, kỷ luật và thực tiễn trong giáo dục.",
        "Với nền tảng chuyên môn sư phạm, kinh nghiệm quản trị và quá trình công tác lâu năm trong giáo dục, ThS. Nguyễn Đức Tịnh có điều kiện đóng góp góc nhìn thực tiễn vào hoạt động của Hội đồng trường, đặc biệt ở các nội dung liên quan đến chất lượng đào tạo, quản trị và phát triển đội ngũ.",
      ],
    },
    education: [
      { text: { vi: "Thạc sĩ – Đại học Trà Vinh" } },
      {
        text: {
          vi: "Đại học Sư phạm, chuyên ngành Toán – Đại học Sư phạm Huế",
        },
      },
      {
        text: {
          vi: "Chứng chỉ phương pháp giảng dạy đại học – Viện Giáo dục cấp",
        },
      },
      { text: { vi: "Chứng chỉ quản lý – Tổng cục Giáo dục nghề nghiệp cấp" } },
    ],
    competencies: [
      {
        title: { vi: "NỀN TẢNG TOÁN HỌC" },
        text: {
          vi: "Tư duy logic, hệ thống; giảng dạy Giải tích, Xác suất thống kê và Quy hoạch tuyến tính.",
        },
      },
      {
        title: { vi: "GIẢNG DẠY" },
        text: { vi: "Kinh nghiệm giảng dạy đại học và giáo dục nghề nghiệp." },
      },
      {
        title: { vi: "QUẢN TRỊ" },
        text: {
          vi: "Kinh nghiệm quản trị doanh nghiệp và quản trị cơ sở giáo dục.",
        },
      },
      {
        title: { vi: "KẾT NỐI CHUYÊN MÔN" },
        text: {
          vi: "Khả năng kết nối chuyên môn, quản lý và thực tiễn đào tạo.",
        },
      },
    ],
    career: [
      {
        time: "Hiện nay",
        role: { vi: "Thành viên Hội đồng trường" },
        org: { vi: "Trường Cao đẳng Công nghệ Ngoại thương" },
      },
    ],
    highlights: {
      vi: [
        "Hơn bốn thập niên gắn với môi trường giáo dục, quản trị và đào tạo.",
        "Kinh nghiệm kết hợp giữa giảng dạy đại học, quản trị doanh nghiệp và quản trị cơ sở giáo dục.",
        "2016: Bằng khen của Ủy ban nhân dân Thành phố Đà Nẵng.",
        "2020: Giấy khen của Ủy ban nhân dân Thành phố Đà Nẵng.",
      ],
    },
    focus: {
      vi: [
        "Đồng hành nâng cao chất lượng đào tạo gắn với chuẩn đầu ra và nhu cầu thực tiễn.",
        "Góp phần hoàn thiện quản trị nhà trường theo hướng kỷ cương, hiệu quả và bền vững.",
        "Chia sẻ kinh nghiệm chuyên môn, quản lý và giảng dạy cho đội ngũ giáo viên, giảng viên.",
        "Thúc đẩy môi trường học tập coi trọng tư duy, năng lực nghề nghiệp và trách nhiệm xã hội.",
      ],
    },
    direction: {
      vi: "Tri thức tạo nền tảng – Kinh nghiệm tạo chiều sâu – Trách nhiệm tạo giá trị.",
    },
    appointments: [
      {
        school: "cao-dang-cong-nghe-ngoai-thuong",
        body: "hdt",
        title: { vi: "Thành viên Hội đồng trường" },
        rank: 40,
        term: "2026–2031",
      },
    ],
  },
];
