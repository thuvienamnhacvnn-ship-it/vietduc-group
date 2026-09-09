import fs from "node:fs";
import path from "node:path";
import mupdf from "mupdf";
import sharp from "sharp";

/**
 * Bóc bộ logo hệ thống từ tệp PDF tập đoàn gửi.
 *
 * CÁCH LÀM QUAN TRỌNG: logo trong PDF là ẢNH RASTER nhúng, không phải vector —
 * xuất SVG chỉ được một thẻ `<image>` bọc đúng tấm ảnh ấy. Nên đừng render
 * trang ra ảnh: render là chụp lại một tấm ảnh đã có, và bản chụp ở 1125px thì
 * kém hơn hẳn bản gốc 3125px nằm sẵn bên trong.
 *
 * Đường vòng để lấy ảnh gốc: cho mupdf xuất trang sang SVG, rồi đọc chuỗi
 * base64 trong `<image>` — đó chính là byte gốc của ảnh, chưa qua lần vẽ lại
 * nào.
 *
 * Chạy: npm run media:logo
 */

const PDF = "E:/Works/itw/VD/LOGO VIỆT ĐỨC GROUP_update 08.06.2026.pdf.pdf";

/**
 * Trang (đánh số từ 1) -> nơi ghi ảnh.
 *
 * Tệp PDF có 14 trang: trang 1 là bảng tổng hợp, 13 trang sau mỗi trang một
 * logo kèm nhãn tên đơn vị. Nhãn là chữ ĐÃ CHUYỂN THÀNH ĐƯỜNG VẼ nên không đọc
 * tự động được — bảng dưới đây lập bằng mắt, đối chiếu từng trang.
 *
 * Bộ logo có cả những đơn vị chưa có trên website (Trung cấp Kỹ nghệ Việt Đức,
 * Cao đẳng Công nghệ Việt Đức, các công ty du lịch – khách sạn). Chúng không
 * được bóc ở đây; khi nào website có trang cho chúng thì thêm dòng vào bảng.
 *
 * LOGO TẬP ĐOÀN cũng không bóc, dù trang 2 có. Bản đang dùng là SVG — vector
 * thì nét ở mọi cỡ và nhẹ hơn, nên thay nó bằng một tấm ảnh 720px là đi lùi.
 * Đã đối chiếu: thiết kế trong tệp cập nhật trùng với bản SVG hiện có.
 *
 * Trường Trung cấp Việt Hàn KHÔNG có logo trong bộ này nên giữ bản cũ (320px).
 */
const BANG: { trang: number; ra: string; ten: string }[] = [
  { trang: 6, ra: "public/media/schools/logos/itw-berlin.webp", ten: "ITW Berlin" },
  { trang: 8, ra: "public/media/schools/logos/cao-dang-cong-nghe-ngoai-thuong.webp", ten: "CĐ Công nghệ Ngoại thương" },
  { trang: 9, ra: "public/media/schools/logos/trung-cap-bach-khoa-vung-tau.webp", ten: "TC Bách khoa Vũng Tàu" },
  { trang: 11, ra: "public/media/schools/logos/trung-cap-cong-nghe-viet-duc.webp", ten: "TC Công nghệ Việt Đức" },
  { trang: 12, ra: "public/media/schools/logos/cao-dang-cong-nghe-viet-duc.webp", ten: "CĐ Công nghệ Việt Đức" },
  { trang: 13, ra: "public/media/schools/logos/trung-cap-nghe-quoc-te-ivs.webp", ten: "TC nghề Quốc tế IVS" },
];

/**
 * Bộ logo cho sơ đồ hệ sinh thái ở trang Giới thiệu.
 *
 * Sơ đồ nằm trên nền tối nên logo phải TÁCH NỀN — khác bộ webp ở trên, vốn
 * dùng trong thẻ nền sáng và giữ nguyên nền trắng của tệp gốc.
 *
 * Tên tệp không đặt tuỳ ý: trang Giới thiệu suy đường dẫn từ `logoPath` trong
 * cơ sở dữ liệu bằng cách đổi `/media/schools/logos/X.webp` thành
 * `/media/so-do/truong-X.png`. Đặt sai tên là sơ đồ khuyết một nhánh.
 *
 * Trường Trung cấp Việt Hàn không có logo trong tệp PDF này nên không có dòng
 * cho nó; bản PNG cũ trong thư mục vẫn giữ nguyên.
 */
const BANG_SO_DO: { trang: number; ra: string; ten: string; doSang?: true }[] = [
  { trang: 3, ra: "public/media/so-do/vgie.png", ten: "VGIE" },
  { trang: 4, ra: "public/media/so-do/dau-tu-du-lich.png", ten: "Việt Đức Đầu tư & Du lịch" },
  { trang: 5, ra: "public/media/so-do/khach-san-lu-hanh.png", ten: "Việt Đức Khách sạn & Lữ hành" },
  { trang: 7, ra: "public/media/so-do/golden-dragon.png", ten: "Golden Dragon Hotel" },
  { trang: 14, ra: "public/media/so-do/shdc.png", ten: "SHDC Du lịch sinh thái" },
    // Chữ "itw" màu đen, đặt trên nền tối của sơ đồ là mất hút — phải đảo sáng.
  { trang: 6, ra: "public/media/so-do/truong-itw-berlin.png", ten: "ITW Berlin", doSang: true },
  { trang: 8, ra: "public/media/so-do/truong-cao-dang-cong-nghe-ngoai-thuong.png", ten: "CĐ Công nghệ Ngoại thương" },
  { trang: 9, ra: "public/media/so-do/truong-trung-cap-bach-khoa-vung-tau.png", ten: "TC Bách khoa Vũng Tàu" },
  { trang: 11, ra: "public/media/so-do/truong-trung-cap-cong-nghe-viet-duc.png", ten: "TC Công nghệ Việt Đức" },
  { trang: 12, ra: "public/media/so-do/truong-cao-dang-cong-nghe-viet-duc.png", ten: "CĐ Công nghệ Việt Đức" },
  { trang: 13, ra: "public/media/so-do/truong-trung-cap-nghe-quoc-te-ivs.png", ten: "TC nghề Quốc tế IVS" },
];

/** Lấy byte gốc của ảnh nhúng trong một trang. */
function anhGoc(doc: ReturnType<typeof mupdf.Document.openDocument>, chiSoTrang: number): Buffer | null {
  const p = doc.loadPage(chiSoTrang);
  const buf = new mupdf.Buffer();
  const w = new mupdf.DocumentWriter(buf, "svg", "");
  const dev = w.beginPage(p.getBounds());
  p.run(dev, mupdf.Matrix.identity);
  w.endPage();
  w.close();

  const khop = [...buf.asString().matchAll(/xlink:href="data:image\/[a-z]+;base64,([^"]+)"/g)];
  if (!khop.length) return null;
  // Trang nào cũng chỉ có một ảnh; nếu có nhiều thì lấy tấm nặng nhất.
  return khop
    .map((m) => Buffer.from(m[1], "base64"))
    .sort((a, b) => b.length - a.length)[0];
}

/**
 * Bỏ dòng nhãn ở đầu ảnh.
 *
 * Đọc ảnh thành pixel thô, quét từng hàng từ trên xuống và đánh dấu hàng nào có
 * nội dung. Thứ tự luôn là: trống → nhãn → trống → logo. Nên chỗ cần cắt là
 * điểm bắt đầu của dải trống THỨ HAI.
 *
 * Nếu không tìm thấy đúng hình ấy (ảnh nào đó không có nhãn) thì trả nguyên ảnh
 * — thà giữ cả tấm còn hơn cắt nhầm mất một phần logo.
 */
async function catNhan(raw: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(raw)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const coNoiDung = (y: number) => {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const alpha = channels === 4 ? data[i + 3] : 255;
      if (alpha < 24) continue; // trong suốt
      // Gần trắng cũng coi là nền: ảnh gốc có nền trắng đặc.
      if (data[i] > 236 && data[i + 1] > 236 && data[i + 2] > 236) continue;
      return true;
    }
    return false;
  };

  const day = Array.from({ length: height }, (_, y) => coNoiDung(y));

  // Dải nội dung đầu tiên = nhãn; tìm điểm kết thúc của nó.
  let y = 0;
  while (y < height && !day[y]) y++; // bỏ khoảng trống đầu
  const nhanBatDau = y;
  while (y < height && day[y]) y++; // hết dòng nhãn
  const nhanKetThuc = y;
  while (y < height && !day[y]) y++; // khoảng trống giữa nhãn và logo
  const logoBatDau = y;

  // Nhãn phải mỏng (dưới 15% chiều cao) và phải còn nội dung bên dưới nó.
  const dayNhan = nhanKetThuc - nhanBatDau;
  if (logoBatDau >= height || dayNhan === 0 || dayNhan > height * 0.15) return raw;

  return sharp(raw)
    .extract({ left: 0, top: logoBatDau, width, height: height - logoBatDau })
    .png()
    .toBuffer();
}

/**
 * Bỏ nền trắng, giữ lại phần trắng NẰM TRONG logo.
 *
 * Không thể cứ thấy pixel trắng là xoá: mái vòm Golden Dragon, trang sách của
 * IVS và khoảng hở trong chữ "itw" đều trắng, xoá hết thì logo thủng lỗ chỗ.
 *
 * Nên thay vì lọc theo màu, ở đây LAN TỪ MÉP VÀO: bốn cạnh ảnh chắc chắn là
 * nền, từ đó lan sang các pixel trắng kề nhau và chỉ xoá những gì lan tới
 * được. Phần trắng bị nét logo bao quanh thì không nối ra tới mép, nên còn
 * nguyên.
 *
 * Viền răng cưa: pixel ở ranh giới là xám nhạt do khử răng cưa của tệp gốc.
 * Những pixel ấy được cho độ mờ theo mức xám của chính nó, để mép logo mềm
 * chứ không lởm chởm.
 */
async function tachNen(anh: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(anh).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = (x: number, y: number) => (y * width + x) * channels;
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
    if (sang(px(x, y)) < NEN) return;
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

  for (let i = 0; i < hangDoi.length; i++) {
    const o = hangDoi[i];
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
      const i = px(x, y);
      if (laNen[o]) {
        data[i + 3] = 0;
        continue;
      }
      // Pixel xám nhạt kề nền: cho mờ dần thay vì để nguyên đục.
      const m = sang(i);
      if (m <= MEM) continue;
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
 * Chỉ dùng cho logo một màu đen như ITW: trên nền tối của sơ đồ nó gần như
 * biến mất. Phép đảo chỉ chạm vào pixel gần như không màu (ba kênh sát nhau) —
 * nên chấm tròn xanh lá của ITW giữ nguyên màu, chỉ có chữ đổi sang trắng ngà.
 *
 * Trắng ngà chứ không trắng tinh (`TRAN`): trắng tinh trên nền navy chói hơn
 * cả logo màu bên cạnh, làm ITW nổi hơn các trường khác một cách vô lý.
 */
function daoSang(data: Buffer, kenh: number): void {
  const TRAN = 232;
  for (let i = 0; i < data.length; i += kenh) {
    if (kenh === 4 && data[i + 3] === 0) continue;
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (max - min > 40) continue; // pixel có màu: để yên
    const dao = Math.round(((255 - max) / 255) * TRAN);
    data[i] = dao;
    data[i + 1] = dao;
    data[i + 2] = dao;
  }
}

async function main() {
  if (!fs.existsSync(PDF)) {
    console.error(`Khong thay tep logo: ${PDF}`);
    process.exit(1);
  }
  const doc = mupdf.Document.openDocument(fs.readFileSync(PDF), "application/pdf");

  for (const { trang, ra, ten } of BANG) {
    const raw = anhGoc(doc, trang - 1);
    if (!raw) {
      console.error(`  THIEU  trang ${trang} (${ten}): khong tim thay anh nhung`);
      continue;
    }
    const goc = await sharp(raw).metadata();

    /*
     * Cắt bỏ dòng nhãn, rồi cắt sát mép logo.
     *
     * Nhãn ("11. Trường Trung cấp nghề Quốc tế IVS") nằm NGAY TRONG ảnh raster
     * chứ không phải chữ vẽ riêng của trang, nên bóc thẳng ra là logo đội một
     * dòng chữ trên đầu.
     *
     * Không cắt theo tỉ lệ cố định: mỗi logo cao thấp khác nhau, cắt 12% thì
     * chỗ thừa chỗ thiếu. Thay vào đó tìm DẢI TRỐNG ngang đầu tiên bên dưới
     * nhãn — giữa dòng chữ và logo luôn có một khoảng trắng — rồi cắt từ đó.
     */
    const duongDan = path.resolve(process.cwd(), ra);
    fs.mkdirSync(path.dirname(duongDan), { recursive: true });
    const daCatNhan = await catNhan(raw);
    await sharp(daCatNhan)
      .trim({ threshold: 12 })
      .resize(720, 720, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(duongDan);

    const sau = await sharp(duongDan).metadata();
    console.log(`  ok     ${ten}: goc ${goc.width}x${goc.height} -> ${sau.width}x${sau.height}  ${ra}`);
  }

  console.log();
  console.log("So do he sinh thai (tach nen):");
  for (const { trang, ra, ten, doSang } of BANG_SO_DO) {
    const raw = anhGoc(doc, trang - 1);
    if (!raw) {
      console.error(`  THIEU  trang ${trang} (${ten}): khong tim thay anh nhung`);
      continue;
    }
    const duongDan = path.resolve(process.cwd(), ra);
    fs.mkdirSync(path.dirname(duongDan), { recursive: true });

    /*
     * Thu nhỏ TRƯỚC khi tách nền.
     *
     * Ảnh gốc 3125x3125 là hơn chín triệu pixel; lan từ mép trên cỡ ấy vừa chậm
     * vừa chẳng để làm gì, vì đằng nào cũng xuất ra 720. Thu nhỏ trước rồi mới
     * tách thì phép lan chạy trong tích tắc và mép logo lại mượt hơn, do lần
     * thu nhỏ đã hoà sẵn các pixel biên.
     */
    const vua = await sharp(await catNhan(raw))
      .trim({ threshold: 12 })
      .resize(720, 720, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();

    let daTach = await tachNen(vua);
    if (doSang) {
      const { data, info } = await sharp(daTach).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      daoSang(data, info.channels);
      daTach = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
        .png()
        .toBuffer();
    }

    await sharp(daTach)
      .trim({ threshold: 2 })
      .resize(720, 720, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(duongDan);

    const sau = await sharp(duongDan).metadata();
    console.log(`  ok     ${ten}: ${sau.width}x${sau.height}  ${ra}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
