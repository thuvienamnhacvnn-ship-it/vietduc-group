import fs from "node:fs";
import path from "node:path";
import mupdf from "mupdf";
import sharp from "sharp";

/**
 * Gói ảnh chụp giấy tờ thành một tệp PDF.
 *
 * Kho tài liệu chỉ nhận PDF (cả trang quản trị lẫn `npm run ingest`), trong khi
 * giấy tờ pháp lý thường tới tay qua WhatsApp dưới dạng ảnh chụp. Script này là
 * cái cầu giữa hai thứ đó — không phải để chỉnh sửa gì tấm ảnh.
 *
 * Ảnh giữ nguyên pixel gốc, chỉ đặt vừa khung A4 và căn giữa. Không nén lại,
 * không xoay, không "làm đẹp": đây là giấy tờ, đọc được và đúng bản gốc quan
 * trọng hơn nhẹ tệp.
 *
 * Chạy: npm run anh:pdf -- "<ảnh 1>" ["<ảnh 2>" …] --ra "<tệp .pdf>"
 * Nhiều ảnh thì mỗi ảnh một trang, theo đúng thứ tự đưa vào.
 */

/** Khổ A4 dọc, tính bằng point (1/72 inch). */
const A4 = { w: 595, h: 842 };

async function main() {
  const args = process.argv.slice(2);
  const iRa = args.indexOf("--ra");
  if (iRa === -1 || !args[iRa + 1] || iRa === 0) {
    console.error('Dung: npm run anh:pdf -- "<anh 1>" ["<anh 2>" ...] --ra "<tep .pdf>"');
    process.exit(1);
  }
  const ra = args[iRa + 1];
  const anh = args.slice(0, iRa);

  const thieu = anh.filter((f) => !fs.existsSync(f));
  if (thieu.length) {
    console.error(`Khong thay: ${thieu.join(", ")}`);
    process.exit(1);
  }

  const doc = new mupdf.PDFDocument();

  for (const tep of anh) {
    /*
     * Qua sharp một vòng dù không đổi gì.
     *
     * Ảnh điện thoại hay mang thẻ EXIF "xoay 90 độ" mà không xoay pixel thật;
     * mupdf không đọc thẻ ấy nên trang PDF sẽ nằm ngang. `rotate()` không tham
     * số của sharp áp đúng thẻ đó vào pixel rồi bỏ thẻ đi.
     */
    const goc = await sharp(fs.readFileSync(tep)).rotate().jpeg({ quality: 92 }).toBuffer();
    const { width = 0, height = 0 } = await sharp(goc).metadata();

    const ti = Math.min(A4.w / width, A4.h / height);
    const w = width * ti;
    const h = height * ti;
    const x = (A4.w - w) / 2;
    const y = (A4.h - h) / 2;

    const nhung = doc.addImage(new mupdf.Image(goc));
    const taiNguyen = doc.addObject({ XObject: { I0: nhung } });
    // Ma trận `cm` đặt ảnh (vốn là ô vuông đơn vị) vào đúng chỗ trên trang.
    const noiDung = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /I0 Do Q`;
    doc.insertPage(-1, doc.addPage([0, 0, A4.w, A4.h], 0, taiNguyen, noiDung));
    console.log(`  + ${path.basename(tep)}  ${width}x${height}`);
  }

  fs.mkdirSync(path.dirname(path.resolve(ra)), { recursive: true });
  fs.writeFileSync(ra, doc.saveToBuffer("compress").asUint8Array());
  console.log(`\n${ra}  ${anh.length} trang  ${Math.round(fs.statSync(ra).size / 1024)}KB`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
