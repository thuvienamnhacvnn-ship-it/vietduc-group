import fs from "node:fs";
import path from "node:path";
import mupdf from "mupdf";
import sharp from "sharp";

/**
 * Bóc bộ logo hệ thống từ tệp Illustrator tập đoàn gửi.
 *
 * NGUỒN: thư mục .ai, không phải tệp PDF tổng hợp.
 *
 * Bản trước lấy từ "LOGO VIỆT ĐỨC GROUP_update 08.06.2026.pdf" và phải làm ba
 * việc chữa cháy: bóc ảnh raster nhúng ra khỏi trang, cắt bỏ dòng nhãn in kèm
 * mỗi logo, rồi lan từ mép vào để gỡ nền trắng. Ba việc ấy nay bỏ hết được —
 * tệp .ai là bản gốc của người thiết kế: nền trong suốt sẵn, không có nhãn, và
 * là vector nên tô ở cỡ nào cũng sắc.
 *
 * Illustrator lưu kèm phần PDF tương thích, nên mupdf mở thẳng được bằng
 * "application/pdf" — không cần Illustrator trên máy.
 *
 * Chạy: npm run media:logo
 */

const DIR = "E:/Works/itw/VD/bo sung";

/**
 * Mỗi tệp .ai ra những đâu.
 *
 * `theWebp`  — logo trên thẻ trường (nền sáng), đường dẫn phải khớp `logoPath`
 *              trong cơ sở dữ liệu.
 * `soDoPng`  — logo trên sơ đồ hệ sinh thái ở trang Giới thiệu (nền tối).
 *
 * Trang Giới thiệu suy đường dẫn sơ đồ từ chính `logoPath`, đổi
 * `/media/schools/logos/X.webp` thành `/media/so-do/truong-X.png`. Đặt sai tên
 * là sơ đồ khuyết một nhánh, nên hai cột dưới đây phải đi cùng nhau.
 *
 * Không bóc ở đây:
 *  - "1. Việt Đức Group.ai": logo tập đoàn đang dùng bản SVG trong /brand,
 *    vector thì nét ở mọi cỡ và nhẹ hơn một tấm ảnh.
 *  - Trường Trung cấp Việt Hàn: bộ .ai không có logo của trường, giữ bản cũ.
 */
const BANG: {
  tep: string;
  ten: string;
  theWebp?: string;
  soDoPng?: string;
  doSang?: true;
}[] = [
  {
    tep: "2. Công ty CP tập đoàn đầu tư và giáo dục quốc tế Việt Đức.ai",
    ten: "VGIE",
    soDoPng: "public/media/so-do/vgie.png",
  },
  {
    tep: "3. Công ty TNHH du lịch và đầu tư Việt Đức.ai",
    ten: "Việt Đức Đầu tư & Du lịch",
    soDoPng: "public/media/so-do/dau-tu-du-lich.png",
  },
  {
    tep: "4. Công ty TNHH khách sạn và dịch vụ Du lịch Việt Đức.ai",
    ten: "Việt Đức Khách sạn & Lữ hành",
    soDoPng: "public/media/so-do/khach-san-lu-hanh.png",
  },
  {
    tep: "5. Công ty Cổ phần khách sạn và dịch vụ du lịch Hoàng Long.ai",
    ten: "Golden Dragon Hotel",
    soDoPng: "public/media/so-do/golden-dragon.png",
  },
  {
    tep: "LOGO SHDC.ai",
    ten: "SHDC Du lịch sinh thái",
    soDoPng: "public/media/so-do/shdc.png",
  },
  {
    tep: "6. Trường Cao đẳng Công nghệ Ngoại thương.ai",
    ten: "CĐ Công nghệ Ngoại thương",
    theWebp: "public/media/schools/logos/cao-dang-cong-nghe-ngoai-thuong.webp",
    soDoPng: "public/media/so-do/truong-cao-dang-cong-nghe-ngoai-thuong.png",
  },
  {
    tep: "7. Trường Trung cấp Bách khoa Vũng Tàu.ai",
    ten: "TC Bách khoa Vũng Tàu",
    theWebp: "public/media/schools/logos/trung-cap-bach-khoa-vung-tau.webp",
    soDoPng: "public/media/so-do/truong-trung-cap-bach-khoa-vung-tau.png",
  },
  {
    tep: "8. Trường Trung cấp Kỹ nghệ Việt Đức.ai",
    ten: "TC Kỹ nghệ Việt Đức",
    theWebp: "public/media/schools/logos/trung-cap-ky-nghe-viet-duc.webp",
    soDoPng: "public/media/so-do/truong-trung-cap-ky-nghe-viet-duc.png",
  },
  {
    tep: "9. Trường Trung cấp công nghệ Việt Đức.ai",
    ten: "TC Công nghệ Việt Đức",
    theWebp: "public/media/schools/logos/trung-cap-cong-nghe-viet-duc.webp",
    soDoPng: "public/media/so-do/truong-trung-cap-cong-nghe-viet-duc.png",
  },
  {
    tep: "10. Trường Cao đẳng công nghệ Việt Đức.ai",
    ten: "CĐ Công nghệ Việt Đức",
    theWebp: "public/media/schools/logos/cao-dang-cong-nghe-viet-duc.webp",
    soDoPng: "public/media/so-do/truong-cao-dang-cong-nghe-viet-duc.png",
  },
  {
    tep: "11. Trường Trung cấp nghề Quốc tế IVS.ai",
    ten: "TC nghề Quốc tế IVS",
    theWebp: "public/media/schools/logos/trung-cap-nghe-quoc-te-ivs.webp",
    soDoPng: "public/media/so-do/truong-trung-cap-nghe-quoc-te-ivs.png",
  },
  {
    // Chữ "itw" màu đen: trên nền tối của sơ đồ là mất hút, phải đảo sáng.
    tep: "LOGO ITW.ai",
    ten: "ITW Berlin",
    theWebp: "public/media/schools/logos/itw-berlin.webp",
    soDoPng: "public/media/so-do/truong-itw-berlin.png",
    doSang: true,
  },
];

/** Cạnh dài của bản tô trung gian, trước khi thu về cỡ dùng thật. */
const CANH_TO = 2400;

/**
 * Tô một tệp .ai ra ảnh nền trong suốt.
 *
 * Tô ở cỡ lớn rồi mới thu nhỏ, chứ không tô thẳng ra 720: phần thu nhỏ do
 * sharp làm bao giờ cũng mượt hơn, và những logo có lưới chuyển màu (mupdf tô
 * chúng thành ảnh) cũng đỡ vỡ hạt.
 */
function to(tep: string): Buffer {
  const doc = mupdf.Document.openDocument(fs.readFileSync(tep), "application/pdf");
  const trang = doc.loadPage(0);
  const [x0, y0, x1, y1] = trang.getBounds();
  const ti = CANH_TO / Math.max(x1 - x0, y1 - y0);
  const px = trang.toPixmap(mupdf.Matrix.scale(ti, ti), mupdf.ColorSpace.DeviceRGB, true, true);
  return Buffer.from(px.asPNG());
}

/**
 * Gỡ nền trắng đặc, giữ lại phần trắng NẰM TRONG logo.
 *
 * Phần lớn tệp .ai có nền trong suốt sẵn, nhưng hai tệp khổ A4 (ITW, SHDC)
 * được đặt trên một hình chữ nhật trắng phủ kín trang. Để nguyên thì logo đội
 * một mảng trắng giữa sơ đồ nền tối, mà riêng ITW còn hoá mảng ĐEN vì phép đảo
 * sáng phía dưới biến nền trắng thành đen.
 *
 * Không thể cứ thấy pixel trắng là xoá: trang sách của IVS và khoảng hở trong
 * chữ "itw" đều trắng, xoá hết thì logo thủng lỗ chỗ. Nên ở đây LAN TỪ MÉP
 * VÀO: bốn cạnh ảnh chắc chắn là nền, từ đó lan sang các pixel trắng kề nhau
 * và chỉ xoá những gì lan tới được. Phần trắng bị nét logo bao quanh thì không
 * nối ra tới mép nên còn nguyên.
 *
 * Pixel ở ranh giới là xám nhạt do khử răng cưa; chúng được cho độ mờ theo
 * chính mức xám của mình, để mép logo mềm chứ không lởm chởm.
 */
async function goNen(anh: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(anh).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const vt = (x: number, y: number) => (y * width + x) * channels;
  const sang = (i: number) => Math.min(data[i], data[i + 1], data[i + 2]);

  const NEN = 238; // từ mức này trở lên coi là nền
  const MEM = 216; // dưới mức này là nét logo đặc

  const daXet = new Uint8Array(width * height);
  const laNen = new Uint8Array(width * height);
  const hangDoi: number[] = [];

  const nap = (x: number, y: number) => {
    const o = y * width + x;
    if (daXet[o]) return;
    daXet[o] = 1;
    const i = vt(x, y);
    // Chỗ đã trong suốt cũng là nền: phép lan phải đi xuyên qua được.
    if (data[i + 3] !== 0 && sang(i) < NEN) return;
    laNen[o] = 1;
    hangDoi.push(o);
  };

  for (let x = 0; x < width; x++) {
    nap(x, 0);
    nap(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    nap(0, y);
    nap(width - 1, y);
  }

  for (let k = 0; k < hangDoi.length; k++) {
    const o = hangDoi[k];
    const x = o % width;
    const y = (o - x) / width;
    if (x > 0) nap(x - 1, y);
    if (x < width - 1) nap(x + 1, y);
    if (y > 0) nap(x, y - 1);
    if (y < height - 1) nap(x, y + 1);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = y * width + x;
      const i = vt(x, y);
      if (laNen[o]) {
        data[i + 3] = 0;
        continue;
      }
      const m = sang(i);
      if (m <= MEM || data[i + 3] === 0) continue;
      const keNen =
        (x > 0 && laNen[o - 1]) ||
        (x < width - 1 && laNen[o + 1]) ||
        (y > 0 && laNen[o - width]) ||
        (y < height - 1 && laNen[o + width]);
      if (keNen) data[i + 3] = Math.round(((NEN - m) / (NEN - MEM)) * 255);
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

/**
 * Đảo phần chữ đen của logo thành sáng, giữ nguyên phần có màu.
 *
 * Chỉ dùng cho logo một màu đen như ITW. Phép đảo chỉ chạm vào pixel gần như
 * không màu (ba kênh sát nhau) — nên chấm tròn xanh lá của ITW giữ nguyên màu,
 * chỉ có chữ đổi sang trắng ngà.
 *
 * Trắng ngà chứ không trắng tinh (`TRAN`): trắng tinh trên nền navy chói hơn cả
 * logo màu bên cạnh, làm ITW nổi hơn các trường khác một cách vô lý.
 */
async function daoSang(anh: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(anh).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const TRAN = 232;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] === 0) continue;
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (max - min > 40) continue; // pixel có màu: để yên
    const dao = Math.round(((255 - max) / 255) * TRAN);
    data[i] = dao;
    data[i + 1] = dao;
    data[i + 2] = dao;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}

/** Cắt sát mép nét vẽ rồi đặt vào khung vuông, nền trong suốt. */
function vuong(anh: Buffer, canh: number) {
  return sharp(anh)
    .trim({ threshold: 2 })
    .resize(canh, canh, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
}

async function ghi(duongDan: string, anh: ReturnType<typeof sharp>) {
  const dich = path.resolve(process.cwd(), duongDan);
  fs.mkdirSync(path.dirname(dich), { recursive: true });
  await anh.toFile(dich);
  const m = await sharp(dich).metadata();
  console.log(`  ok     ${duongDan}  ${m.width}x${m.height}  ${Math.round(fs.statSync(dich).size / 1024)}KB`);
}

async function main() {
  if (!fs.existsSync(DIR)) {
    console.error(`Khong thay thu muc logo: ${DIR}`);
    process.exit(1);
  }

  for (const { tep, ten, theWebp, soDoPng, doSang } of BANG) {
    const nguon = path.join(DIR, tep);
    if (!fs.existsSync(nguon)) {
      console.error(`  THIEU  ${ten}: khong co tep ${tep}`);
      continue;
    }
    console.log(ten);
    /*
     * Chạy gỡ nền cho MỌI tệp, không dò trước.
     *
     * Đã thử dò bằng cách xem bốn góc ảnh có đục không, và hỏng: hình nền trắng
     * của ITW và SHDC nằm gọn bên trong trang A4 chứ không chạm mép, nên bốn
     * góc vẫn trong suốt và phép dò báo "không có nền". Tệp vốn đã trong suốt
     * thì chạy qua hàm này cũng không mất gì, nên cứ chạy hết cho chắc.
     */
    const goc = await goNen(to(nguon));

    if (theWebp) {
      /*
       * Thẻ trường nằm trên nền sáng nên dùng logo nguyên màu — kể cả ITW chữ
       * đen, ở đó chữ đen mới là đúng.
       */
      await ghi(theWebp, vuong(goc, 720).webp({ quality: 92, alphaQuality: 100 }));
    }

    if (soDoPng) {
      const dung = doSang ? await daoSang(goc) : goc;
      await ghi(soDoPng, vuong(dung, 720).png({ compressionLevel: 9 }));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
