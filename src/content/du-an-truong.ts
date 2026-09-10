import type { VentureBlock } from "./venture-types";

/**
 * Số liệu hồ sơ dự án của những trường đang trong giai đoạn đầu tư.
 *
 * Bản ghi trường trong cơ sở dữ liệu chỉ có tên, địa chỉ, vài con số và mấy
 * dòng giới thiệu — vừa đủ cho một trường ĐANG HOẠT ĐỘNG. Trường đang xây thì
 * thứ đáng nói lại là hồ sơ dự án: bảng hạng mục, cơ cấu sử dụng đất, vốn, tiến
 * độ, nhân sự dự kiến. Chỗ ấy để ở đây chứ không nhét thêm cột vào bảng trường:
 * đây là bản chép từ MỘT tài liệu cụ thể, không phải trường nào cũng có, và
 * cũng không phải thứ biên tập viên sửa hằng ngày.
 *
 * Mọi con số chép nguyên từ hồ sơ, không làm tròn, không suy diễn. Hạng mục nào
 * hồ sơ để trống thì ở đây cũng để trống bằng một dấu gạch.
 */

const VI = (vi: string) => ({ vi });

export const KHOI_DU_AN_TRUONG: Record<string, VentureBlock[]> = {
  /*
   * Trường Cao đẳng Công nghệ Việt Đức — dự án đầu tư xây dựng tại xã Quảng
   * Ninh, tỉnh Quảng Trị. Nguồn: văn bản 06/CV-CTy ngày 03/09/2026 của Công ty
   * Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức.
   */
  "cao-dang-cong-nghe-viet-duc": [
    {
      kind: "table",
      title: {
        vi: "Quy mô dự án",
        en: "Project size",
        de: "Projektumfang",
        ja: "事業規模",
        ko: "사업 규모",
        "zh-TW": "專案規模",
      },
      rows: [
        { label: VI("Địa điểm"), value: VI("Xã Quảng Ninh, tỉnh Quảng Trị") },
        { label: VI("Diện tích đất"), value: VI("122.300 m² (không có mặt nước)") },
        { label: VI("Công suất đào tạo"), value: VI("5.200 học viên/năm") },
        { label: VI("Tổng diện tích sàn xây dựng"), value: VI("33.028 m²") },
        { label: VI("Mật độ xây dựng"), value: VI("11,59%") },
        { label: VI("Hệ số sử dụng đất"), value: VI("0,27") },
        { label: VI("Thời hạn hoạt động"), value: VI("50 năm") },
      ],
      note: VI(
        "Trích văn bản số 06/CV-CTy ngày 03/09/2026 gửi UBND tỉnh Quảng Trị và Sở Tài chính tỉnh Quảng Trị.",
      ),
    },
    {
      kind: "grid",
      title: {
        vi: "Cơ cấu sử dụng đất",
        en: "Land use",
        de: "Flächenaufteilung",
        ja: "土地利用の内訳",
        ko: "토지 이용 구성",
        "zh-TW": "土地使用結構",
      },
      columns: [VI("Loại đất"), VI("Diện tích"), VI("Tỷ lệ")],
      rows: [
        [VI("Tổng diện tích phục vụ dự án"), VI("122.300,0 m²"), VI("100%")],
        [VI("Đất xây dựng công trình"), VI("14.179,0 m²"), VI("11,59%")],
        [VI("Sân, đường nội bộ và bãi xe"), VI("43.023,5 m²"), VI("35,18%")],
        [VI("Cây xanh cảnh quan, sân thể thao và mặt nước"), VI("65.097,5 m²"), VI("53,23%")],
      ],
    },
    {
      kind: "grid",
      title: {
        vi: "Hạng mục xây dựng",
        en: "Schedule of works",
        de: "Bauteile",
        ja: "工事項目一覧",
        ko: "공사 항목",
        "zh-TW": "建設項目明細",
      },
      columns: [VI("Hạng mục"), VI("Diện tích xây dựng"), VI("Diện tích sàn")],
      rows: [
        [VI("Cổng và tường rào"), VI("275,0 m²"), VI("–")],
        [
          VI("Cổng chào, biểu tượng trường và nhà thường trực bảo vệ"),
          VI("310,0 m²"),
          VI("310,0 m²"),
        ],
        [VI("Lán để xe giảng viên"), VI("324,0 m²"), VI("324,0 m²")],
        [VI("Lán để xe sinh viên"), VI("936,0 m²"), VI("936,0 m²")],
        [VI("Nhà hiệu bộ (5 tầng và tum mái)"), VI("910,0 m²"), VI("4.750,0 m²")],
        [VI("Nhà đa năng, hội trường lớn"), VI("1.450,0 m²"), VI("1.450,0 m²")],
        [VI("Nhà thư viện (3 tầng)"), VI("492,0 m²"), VI("1.476,0 m²")],
        [VI("Hành lang khối học (3 tầng)"), VI("400,0 m²"), VI("1.200,0 m²")],
        [VI("Nhà lớp học (3 tầng, 4 nhà)"), VI("2.960,0 m²"), VI("8.880,0 m²")],
        [VI("Nhà thực hành (3 tầng, 2 nhà)"), VI("1.480,0 m²"), VI("4.440,0 m²")],
        [VI("Giảng đường"), VI("720,0 m²"), VI("720,0 m²")],
        [VI("Nhà ăn và bếp (2 tầng)"), VI("1.060,0 m²"), VI("2.120,0 m²")],
        [VI("Sân thể thao (bóng đá, bóng chuyền, cầu lông…)"), VI("3.200,0 m²"), VI("–")],
        [VI("Khán đài"), VI("400,0 m²"), VI("400,0 m²")],
        [VI("Nhà nội trú sinh viên (3 tầng, 2 nhà)"), VI("1.480,0 m²"), VI("4.440,0 m²")],
        [VI("Nhà nội trú giảng viên (3 tầng)"), VI("360,0 m²"), VI("1.080,0 m²")],
        [VI("Lán xe khu nội trú"), VI("432,0 m²"), VI("432,0 m²")],
        [VI("Nhà thường trực bảo vệ"), VI("18,0 m²"), VI("18,0 m²")],
        [VI("Khu tập kết chất thải rắn"), VI("30,0 m²"), VI("–")],
        [VI("Khu xử lý nước thải tập trung"), VI("90,0 m²"), VI("–")],
        [VI("Trạm biến áp và máy phát"), VI("52,0 m²"), VI("52,0 m²")],
        [VI("Bãi đỗ xe"), VI("1.224,0 m²"), VI("–")],
        [VI("Bể cảnh, hồ điều hoà và phòng cháy chữa cháy"), VI("1.014,0 m²"), VI("–")],
        [VI("Sân và đường nội bộ"), VI("41.799,5 m²"), VI("–")],
        [VI("Cây xanh cảnh quan"), VI("60.883,5 m²"), VI("–")],
        [VI("Tổng"), VI("122.300,0 m²"), VI("33.028,0 m²")],
      ],
      note: VI(
        "Dấu gạch là hạng mục hồ sơ không ghi diện tích sàn — thường vì đó là sân bãi hoặc cây xanh.",
      ),
    },
    {
      kind: "table",
      title: {
        vi: "Vốn đầu tư",
        en: "Investment",
        de: "Investition",
        ja: "投資額",
        ko: "투자액",
        "zh-TW": "投資額",
      },
      rows: [
        {
          label: VI("Tổng vốn đầu tư"),
          value: VI("328.000.000.000 đồng (≈ 12.580.308,80 USD)"),
        },
        {
          label: VI("Vốn góp của nhà đầu tư"),
          value: VI("65.600.000.000 đồng · 20% · góp bằng tiền mặt"),
        },
        { label: VI("Vốn huy động"), value: VI("262.400.000.000 đồng · 80%") },
        {
          label: VI("Nguồn vay trong nước"),
          value: VI("Ngân hàng TMCP Ngoại thương Việt Nam – Chi nhánh Quảng Bình"),
        },
      ],
      note: VI("Tỷ giá quy đổi đô la Mỹ lấy theo ngày 03/09/2026, đúng như hồ sơ ghi."),
    },
    {
      kind: "steps",
      title: {
        vi: "Tiến độ thực hiện",
        en: "Programme",
        de: "Zeitplan",
        ja: "実施スケジュール",
        ko: "추진 일정",
        "zh-TW": "實施進度",
      },
      steps: [
        {
          when: VI("Quý III/2026"),
          what: VI(
            "Lập hồ sơ dự án xin chấp thuận chủ trương đầu tư và cấp giấy chứng nhận đăng ký đầu tư. Nhà đầu tư góp 65,6 tỷ đồng vốn tự có.",
          ),
        },
        {
          when: VI("Quý II – Quý IV/2027"),
          what: VI(
            "Hoàn thành thủ tục về môi trường; bàn giao mặt bằng, ký hợp đồng thuê đất và cấp giấy chứng nhận quyền sử dụng đất.",
          ),
        },
        {
          when: VI("Quý IV/2027"),
          what: VI(
            "Lập hồ sơ bản vẽ thi công các hạng mục; hoàn thành thủ tục cấp phép xây dựng và thẩm duyệt phòng cháy chữa cháy.",
          ),
        },
        {
          when: VI("Quý I/2028 – Quý III/2030"),
          what: VI(
            "Xây dựng các hạng mục công trình, hoàn thiện dự án và đưa vào hoạt động.",
          ),
        },
      ],
    },
    {
      kind: "grid",
      title: {
        vi: "Nhân sự dự kiến",
        en: "Planned staffing",
        de: "Geplantes Personal",
        ja: "予定人員",
        ko: "예정 인력",
        "zh-TW": "預計人力",
      },
      columns: [VI("Vị trí"), VI("Bộ phận"), VI("Số người")],
      rows: [
        [VI("Hiệu trưởng"), VI("Quản lý"), VI("1")],
        [VI("Phó giám đốc phụ trách"), VI("Quản lý"), VI("3")],
        [VI("Cán bộ các phòng, khoa chuyên môn"), VI("Quản lý"), VI("30")],
        [VI("Cán bộ hành chính, kế toán"), VI("Quản lý"), VI("21")],
        [VI("Giảng viên nghề"), VI("Lao động trực tiếp"), VI("160")],
        [VI("Chuyên gia"), VI("Lao động trực tiếp"), VI("20")],
        [VI("Đầu bếp và phụ bếp"), VI("Lao động trực tiếp"), VI("9")],
        [VI("Bảo vệ và nhân viên vệ sinh"), VI("Lao động trực tiếp"), VI("11")],
        [VI("Tổng"), VI("Quản lý 55, lao động trực tiếp 200"), VI("255")],
      ],
    },
    {
      kind: "list",
      title: {
        vi: "Thiết bị đầu tư",
        en: "Equipment",
        de: "Ausstattung",
        ja: "設備",
        ko: "설비",
        "zh-TW": "設備",
      },
      items: {
        vi: [
          "120 máy tính và 80 máy chiếu",
          "2.600 bộ bàn ghế sinh viên; 80 bộ bàn ghế giáo viên và nhân viên",
          "80 tủ đựng tài liệu và 80 bảng chống loá",
          "100 điều hoà và 100 bộ hệ thống quạt",
          "120 bộ giường, tủ khu nội trú",
          "Mô hình thực hành: sửa chữa cơ khí động lực, điều hoà – máy lạnh, điện lạnh ô tô",
          "Dụng cụ nghề: thẩm mỹ – làm đẹp, may",
        ],
      },
      note: VI("Hồ sơ ghi thiết bị là hàng liên doanh, mới 100% tại thời điểm lắp đặt."),
    },
  ],
};
