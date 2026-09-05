import type { L10n } from "@/lib/db/schema";

/**
 * Ảnh trong kho, chia thành từng nhóm có chủ đề.
 *
 * Vì sao cần file này: kho xếp ảnh theo NƠI chúng thuộc về (trường nào, mảng
 * nào), còn trang web cần xếp theo NỘI DUNG trong ảnh. Ba mươi tấm ảnh hoạt
 * động dồn dưới một tiêu đề "Hình ảnh hoạt động" thì người xem không hiểu mình
 * đang nhìn gì — lễ khai giảng, chuyến từ thiện vùng cao và buổi làm việc ở
 * Berlin nằm lẫn vào nhau thành một tấm thảm.
 *
 * Phân nhóm ở đây làm bằng mắt: mở từng tấm, đọc băng rôn, logo và biển hiệu
 * trong ảnh. Không suy từ tên file — tên file toàn "WhatsApp Image" không nói
 * gì. Tấm nào không đọc ra được thuộc nhóm nào thì để ở nhóm cuối, không đoán.
 *
 * Thêm ảnh mới: chạy `npm run media:kho` rồi thêm tên file vào nhóm phù hợp.
 * Ảnh chưa có tên trong file này vẫn hiện, ở mục "khác" cuối trang — không tấm
 * nào bị bỏ rơi vì quên khai báo.
 */

export type AnhNhom = {
  /** Tiêu đề mục, hiện trên trang. */
  title: L10n;
  /** Tên file, không kèm đường dẫn thư mục. */
  files: string[];
};

/* --------------------------------------------------------- hoạt động */

export const NHOM_HOAT_DONG: AnhNhom[] = [
  {
    title: {
      vi: "Lễ kỷ niệm và hội nghị",
      en: "Anniversaries and conferences",
      de: "Jubiläen und Konferenzen",
    },
    files: ["hd-01", "hd-02", "hd-03", "hd-04", "hd-05", "hd-06", "hd-19", "hd-30"],
  },
  {
    title: {
      vi: "Thiện nguyện – Áo ấm cho em",
      en: "Charity – Warm coats for the children",
      de: "Wohltätigkeit – Warme Jacken für die Kinder",
    },
    files: ["hd-12", "hd-13", "hd-14", "hd-15", "hd-16", "hd-17"],
  },
  {
    title: {
      vi: "Hợp tác quốc tế",
      en: "International cooperation",
      de: "Internationale Zusammenarbeit",
    },
    files: [
      "hd-07", "hd-08", "hd-09", "hd-10", "hd-11",
      "hd-21", "hd-22", "hd-23", "hd-24", "hd-25", "hd-26", "hd-27", "hd-28", "hd-29",
    ],
  },
  {
    title: {
      vi: "Hội thảo du học nghề Đức – châu Âu",
      en: "Seminars on vocational study in Germany and Europe",
      de: "Seminare zur Berufsausbildung in Deutschland und Europa",
    },
    files: ["hd-18", "hd-20"],
  },
];

/* ------------------------------------------------------------ đối tác */

export const NHOM_DOI_TAC: AnhNhom[] = [
  {
    title: {
      vi: "Văn phòng tại châu Âu",
      en: "Offices in Europe",
      de: "Büros in Europa",
    },
    files: ["doitac-15", "doitac-16", "doitac-17", "doitac-19"],
  },
  {
    title: {
      vi: "Tư vấn xuất khẩu lao động và việc làm",
      en: "Advice on working abroad",
      de: "Beratung zur Arbeit im Ausland",
    },
    files: ["doitac-09", "doitac-10", "doitac-11", "doitac-12", "doitac-13", "doitac-14"],
  },
  {
    title: {
      vi: "Đào tạo và bàn giao lao động",
      en: "Training and placement",
      de: "Ausbildung und Vermittlung",
    },
    files: ["doitac-18", "doitac-20", "doitac-21", "doitac-22", "doitac-23", "doitac-24"],
  },
  {
    title: {
      vi: "Văn phòng và đội ngũ trong nước",
      en: "The office at home",
      de: "Das Büro im Inland",
    },
    files: ["doitac-01", "doitac-02", "doitac-03", "doitac-04", "doitac-05", "doitac-06", "doitac-07", "doitac-08"],
  },
];

/* ----------------------------------------------------------- ngành nghề */

export const NHOM_NGANH: AnhNhom[] = [
  {
    title: {
      vi: "Xưởng cơ khí và điện tử",
      en: "Machine shop and electronics bench",
      de: "Werkstatt und Elektroniklabor",
    },
    files: ["nghe-05", "nghe-06", "nghe-07", "nghe-08", "nghe-09", "nghe-10", "nghe-12"],
  },
  {
    title: {
      vi: "Phòng học và phòng máy",
      en: "Classrooms and computer rooms",
      de: "Unterrichts- und Rechnerräume",
    },
    files: ["nghe-01", "nghe-02", "nghe-03", "nghe-04", "nghe-11"],
  },
];

/**
 * Ghép nhóm với danh sách ảnh thật trong kho.
 *
 * Trả về các nhóm đã khai, cộng một nhóm "khác" gom những ảnh có trong kho mà
 * chưa nhóm nào nhận. Nhờ thế thêm ảnh vào kho là nó xuất hiện ngay, dù chưa
 * kịp khai vào nhóm nào — không tấm nào bị bỏ rơi vì quên một dòng.
 */
export function ghepNhom(
  nhom: AnhNhom[],
  tatCa: readonly string[],
  khac: L10n,
): { title: L10n; shots: string[] }[] {
  const ten = (src: string) => src.replace(/^.*\//, "").replace(/\.webp$/, "");
  const daDung = new Set<string>();
  const out = nhom
    .map((g) => {
      const shots = g.files
        .map((f) => tatCa.find((src) => ten(src) === f))
        .filter((src): src is string => Boolean(src));
      for (const s of shots) daDung.add(s);
      return { title: g.title, shots };
    })
    .filter((g) => g.shots.length);

  const conLai = tatCa.filter((src) => !daDung.has(src));
  if (conLai.length) out.push({ title: khac, shots: conLai });
  return out;
}
