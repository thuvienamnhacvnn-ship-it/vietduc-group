/**
 * Trường Trung cấp Công nghệ Việt Đức: nạp Quyết định 1979/QĐ-SGDĐT.
 *
 * Vì sao có script này: trong `docs/DATA-NOTES.md` mục 5, toàn bộ ngành của
 * trường bị giữ ở trạng thái nháp vì QĐ thành lập ghi rõ trường "chỉ được phép
 * tuyển sinh và tổ chức đào tạo sau khi được cấp Giấy chứng nhận đăng ký hoạt
 * động giáo dục nghề nghiệp". QĐ 1979/QĐ-SGDĐT ngày 23/9/2026 của Sở Giáo dục
 * và Đào tạo tỉnh Quảng Trị CHÍNH LÀ giấy tờ đó - nên điều kiện khoá đã được
 * gỡ, nhưng chỉ gỡ cho đúng 05 ngành có tên trong giấy phép.
 *
 * Nguyên tắc: giấy phép cho gì thì mở đúng cái đó. Tám ngành còn lại KHÔNG có
 * trong QĐ 1979 nên vẫn ở trạng thái nháp - công bố tuyển sinh một ngành chưa
 * được cấp phép là đẩy cả trường vào rủi ro pháp lý, và đẩy người học vào một
 * lời hứa không có cơ sở.
 *
 *   npx tsx scripts/cap-nhat-tcvd-qd1979.ts          # chạy thử, không ghi
 *   npx tsx scripts/cap-nhat-tcvd-qd1979.ts --ghi    # ghi thật
 */
process.loadEnvFile(".env.local"); // tsx KHÔNG tự đọc .env.local; thiếu dòng này là ghi nhầm vào PGlite máy
import { and, eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { programs, schools } from "../src/lib/db/schema";
import type { L10n, Provenance } from "../src/lib/db/schema";

const GHI = process.argv.includes("--ghi");
const SLUG_TRUONG = "trung-cap-cong-nghe-viet-duc";

/** Mọi dữ liệu dưới đây đọc trực tiếp từ bản scan QĐ 1979, không suy diễn. */
const QD = {
  so: "1979/QĐ-SGDĐT",
  ngay: "2026-09-23",
  coQuan: "Sở Giáo dục và Đào tạo tỉnh Quảng Trị",
  dienThoai: "0232.3816888",
  email: "tcvietduc@gmail.com",
  website: "https://vietducgroup.com.vn",
  truSo: "Tổ dân phố 15, phường Đồng Thuận, tỉnh Quảng Trị",
  diaDiemThucHanh: [
    "Số 86, đường Hồng Chương, phường Đồng Thuận, tỉnh Quảng Trị",
    "Khu đô thị Trường Thịnh, phường Đồng Thuận, tỉnh Quảng Trị",
    "Số 35, đường Trần Quang Khải, phường Đồng Hới, tỉnh Quảng Trị",
  ],
  tongQuyMo: 175,
} as const;

const nguon: Provenance = {
  source: "qd-1979-sgddt-quang-tri",
  sourceTitle: "QĐ 1979/QĐ-SGDĐT ngày 23/9/2026 — cấp phép hoạt động giáo dục nghề nghiệp",
  documentDate: "23/9/2026",
  importedAt: new Date().toISOString().slice(0, 10),
  method: "manual",
  page: 1,
};

/** 05 ngành trong Điều 1 khoản 7. Mã ngành chép đúng từ bảng trong quyết định. */
const NGANH: { slug: string; ma: string; quyMo: number; cat: number; title: L10n }[] = [
  {
    slug: "vdct-tieng-han-quoc",
    ma: "5220211",
    quyMo: 35,
    cat: 5,
    title: {
      vi: "Tiếng Hàn Quốc",
      en: "Korean language",
      de: "Koreanisch",
      ja: "韓国語",
      ko: "한국어",
      "zh-TW": "韓語",
    },
  },
  {
    slug: "vdct-ky-thuat-che-bien-mon-an",
    ma: "5810207",
    quyMo: 35,
    cat: 4,
    title: {
      vi: "Kỹ thuật chế biến món ăn",
      en: "Culinary arts",
      de: "Küchentechnik",
      ja: "調理技術",
      ko: "조리 기술",
      "zh-TW": "餐飲製備技術",
    },
  },
  {
    slug: "vdct-cong-nghe-thong-tin",
    ma: "5480202",
    quyMo: 35,
    cat: 2,
    // Giấy phép ghi rõ phạm vi "(Ứng dụng phần mềm)" chứ không phải CNTT nói
    // chung - giữ nguyên chữ của giấy phép để không hứa rộng hơn giấy tờ.
    title: {
      vi: "Công nghệ thông tin (Ứng dụng phần mềm)",
      en: "Information technology (Software applications)",
      de: "Informationstechnik (Softwareanwendungen)",
      ja: "情報技術（ソフトウェア応用）",
      ko: "정보기술(소프트웨어 응용)",
      "zh-TW": "資訊科技（軟體應用）",
    },
  },
  {
    slug: "vdct-dien-cong-nghiep",
    ma: "5520227",
    quyMo: 35,
    cat: 1,
    title: {
      vi: "Điện công nghiệp",
      en: "Industrial electricity",
      de: "Industrieelektrik",
      ja: "産業電気",
      ko: "산업 전기",
      "zh-TW": "工業電機",
    },
  },
  {
    slug: "vdct-ky-thuat-may-lanh-dieu-hoa",
    ma: "5520205",
    quyMo: 35,
    cat: 1,
    title: {
      vi: "Kỹ thuật máy lạnh và điều hòa không khí",
      en: "Refrigeration and air-conditioning engineering",
      de: "Kälte- und Klimatechnik",
      ja: "冷凍空調技術",
      ko: "냉동공조 기술",
      "zh-TW": "冷凍空調技術",
    },
  },
];

const GHI_CHU_BIEN_TAP = [
  `Đã có GCN hoạt động GDNN: ${QD.so} ngày 23/9/2026 (${QD.coQuan}).`,
  `Giấy phép cho 05 ngành trình độ trung cấp, tổng quy mô ${QD.tongQuyMo} học sinh/năm (mỗi ngành 35).`,
  "CÁC NGÀNH KHÁC của trường KHÔNG có trong giấy phép này nên vẫn để nháp, hiển thị như định hướng đào tạo, không công bố chỉ tiêu.",
  `HAI QUYẾT ĐỊNH KHÁC NHAU, KHÔNG PHẢI MỘT: 2500/QĐ-UBND (cho phép thành lập, do QĐ 1979 dẫn) và 2567/QĐ-UBND, cùng ngày 26/6/2026, khác loại - chủ dự án đã xác nhận. Cả hai đều liệt kê trên trang. Nhãn của 2567 giữ nguyên như bản nhập tay ban đầu; nếu nhãn đó chưa đúng tên thật của quyết định thì sửa lại ở đây.`,
  `VÊNH ĐIỆN THOẠI: giấy phép ghi ${QD.dienThoai}; website đang để 0911 762 666 (giữ nguyên số đang dùng, chờ trường xác nhận số nào để công bố).`,
  `Địa điểm đào tạo thực hành (đã đưa lên trang, theo Điều 1 khoản 6): ${QD.diaDiemThucHanh.join(" | ")}`,
].join(" ");

async function main() {
  const db = await getDb();
  const [truong] = await db.select().from(schools).where(eq(schools.slug, SLUG_TRUONG)).limit(1);
  if (!truong) throw new Error(`không thấy trường ${SLUG_TRUONG}`);

  console.log(`Trường id=${truong.id} — ${GHI ? "GHI THẬT" : "CHẠY THỬ (không ghi)"}\n`);

  /* ---------------------------------------------------------- 1. hồ sơ trường */

  const refCu = truong.legalRefs ?? [];

  /**
   * QĐ 2500/QĐ-UBND: quyết định cho phép thành lập, do chính QĐ 1979 dẫn ở
   * Điều 1 khoản 5. Trong cơ sở dữ liệu đang có sẵn QĐ 2567/QĐ-UBND cùng ngày
   * 26/6/2026 - ban đầu tôi tưởng hai số là một tờ bị đọc nhầm, nhưng chủ dự án
   * xác nhận đây là HAI GIẤY KHÁC NHAU, khác loại. Nên giữ cả hai, không hợp
   * nhất, không sửa nhãn của tờ đã có sẵn vì nhãn đó do người nhập tay đặt từ
   * nguồn tôi không có trong kho.
   */
  const REF_2500 = {
    number: "2500/QĐ-UBND",
    date: "2026-06-26",
    label: {
      vi: "Quyết định cho phép thành lập trường",
      en: "Decision permitting establishment of the school",
      de: "Bescheid über die Gründungsgenehmigung der Schule",
      ja: "学校設立許可決定",
      ko: "학교 설립 허가 결정",
      "zh-TW": "核准設立學校之決定",
    } as L10n,
    issuer: {
      vi: "Chủ tịch UBND tỉnh Quảng Trị",
      en: "Chairman of Quang Tri Provincial People's Committee",
      de: "Vorsitzender des Volkskomitees der Provinz Quang Tri",
      ja: "クアンチ省人民委員会委員長",
      ko: "꽝찌성 인민위원회 위원장",
      "zh-TW": "廣治省人民委員會主席",
    } as L10n,
  };

  const co2500 = refCu.some((r) => r.number === REF_2500.number);
  const refVoi2500 = co2500 ? refCu : [...refCu, REF_2500];

  const daCo = refVoi2500.some((r) => r.number === QD.so);
  const refMoi = daCo
    ? refVoi2500
    : [
        ...refVoi2500,
        {
          number: QD.so,
          date: QD.ngay,
          label: {
            vi: "Quyết định cấp phép hoạt động giáo dục nghề nghiệp",
            en: "Decision granting the vocational education operating licence",
            de: "Genehmigungsbescheid für den Betrieb der Berufsbildung",
            ja: "職業教育活動許可決定",
            ko: "직업교육 활동 허가 결정",
            "zh-TW": "核准職業教育辦學之決定",
          } as L10n,
          issuer: {
            vi: QD.coQuan,
            en: "Quang Tri Department of Education and Training",
            de: "Amt für Bildung und Ausbildung der Provinz Quang Tri",
            ja: "クアンチ省教育訓練局",
            ko: "꽝찌성 교육훈련국",
            "zh-TW": "廣治省教育與培訓廳",
          } as L10n,
        },
      ];

  console.log("TRƯỜNG:");
  console.log(`  email   : ${truong.email ?? "(trống)"}  ->  ${QD.email}`);
  console.log(`  website : ${truong.website ?? "(trống)"}  ->  ${QD.website}`);
  console.log(`  địa chỉ : ${truong.address === QD.truSo ? "khớp giấy phép, giữ nguyên" : `${truong.address} -> ${QD.truSo}`}`);
  // Xếp theo ngày ký: người đọc lần theo được trường đã đi qua những bước pháp
  // lý nào, theo đúng thứ tự đã xảy ra.
  refMoi.sort((a, b) => a.date.localeCompare(b.date));

  console.log(`  legalRefs: ${refCu.length} -> ${refMoi.length} (${refMoi.map((r) => r.number).join(", ")})`);
  console.log(`  địa điểm đào tạo: ${truong.trainingSites?.length ?? 0} -> ${QD.diaDiemThucHanh.length}`);
  console.log(`  điện thoại: GIỮ NGUYÊN ${truong.phone} (giấy phép ghi ${QD.dienThoai} — ghi vào editorNote)`);

  if (GHI) {
    await db
      .update(schools)
      .set({
        email: QD.email,
        website: QD.website,
        address: QD.truSo,
        trainingSites: [...QD.diaDiemThucHanh],
        legalRefs: refMoi,
        editorNote: GHI_CHU_BIEN_TAP,
        provenance: nguon,
        updatedAt: new Date(),
      })
      .where(eq(schools.id, truong.id));
  }

  /* ------------------------------------------------------------- 2. các ngành */

  console.log("\nNGÀNH TRONG GIẤY PHÉP:");
  for (const n of NGANH) {
    const [cu] = await db
      .select()
      .from(programs)
      .where(and(eq(programs.slug, n.slug), eq(programs.schoolId, truong.id)))
      .limit(1);

    if (cu) {
      console.log(`  [sửa]  ${n.slug.padEnd(34)} mã ${n.ma}  quy mô ${n.quyMo}  ${cu.status} -> approved`);
      if (GHI) {
        await db
          .update(programs)
          .set({
            title: n.title,
            officialCode: n.ma,
            intakeQuota: n.quyMo,
            level: "trung_cap",
            status: "approved",
            categoryId: n.cat,
            provenance: nguon,
            updatedAt: new Date(),
          })
          .where(eq(programs.id, cu.id));
      }
    } else {
      console.log(`  [thêm] ${n.slug.padEnd(34)} mã ${n.ma}  quy mô ${n.quyMo}  -> approved`);
      if (GHI) {
        await db.insert(programs).values({
          slug: n.slug,
          title: n.title,
          schoolId: truong.id,
          categoryId: n.cat,
          officialCode: n.ma,
          intakeQuota: n.quyMo,
          level: "trung_cap",
          mode: "offline",
          languages: ["vi"],
          status: "approved",
          provenance: nguon,
        });
      }
    }
  }

  /* --------------------------------------- 3. ngành ngoài giấy phép: giữ nháp */

  const chinhChu = new Set(NGANH.map((n) => n.slug));
  const khac = await db.select().from(programs).where(eq(programs.schoolId, truong.id));
  const ngoai = khac.filter((p) => !chinhChu.has(p.slug));
  console.log(`\nNGOÀI GIẤY PHÉP (giữ nháp, không chỉ tiêu): ${ngoai.length} ngành`);
  for (const p of ngoai) {
    const sai = p.status !== "draft" || p.officialCode || p.intakeQuota;
    console.log(`  ${p.slug.padEnd(34)} ${p.status}${sai ? "  << cần trả về nháp" : ""}`);
    if (GHI && sai) {
      await db
        .update(programs)
        .set({ status: "draft", officialCode: null, intakeQuota: null, updatedAt: new Date() })
        .where(eq(programs.id, p.id));
    }
  }

  console.log(GHI ? "\nĐã ghi xong." : "\nChưa ghi gì. Thêm --ghi để ghi thật.");
}

main();
