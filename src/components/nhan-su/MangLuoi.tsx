"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./MangLuoi.module.css";

export type NutNguoi = {
  slug: string;
  ten: string;
  hocVi: string | null;
  chuCai: string;
  /** Ảnh chân dung; rỗng thì nút hiện chữ cái đầu. */
  anh?: string | null;
  /** Khoá của các đơn vị người này giữ chức. */
  donVi: string[];
  /** Chức danh cao nhất, dùng làm nhãn khi rê chuột. */
  chuc: string;
};

export type NutDonVi = {
  khoa: string;
  ten: string;
  loai: "tapdoan" | "ban" | "truong";
  logo?: string | null;
};

/**
 * Mạng lưới nhân sự.
 *
 * Dữ liệu ở đây VỐN là một mạng lưới chứ không phải một danh sách: 18 người nối
 * vào 7 đơn vị bằng 48 chức vụ, và người giữ chức ở nhiều nơi thì có nhiều
 * đường. Vẽ nó ra thì thấy ngay điều mà một bảng danh sách không nói được — ai
 * là đầu mối nối các đơn vị lại với nhau.
 *
 * Hình học: tâm là tập đoàn, vòng trong là các đơn vị, vòng ngoài là người.
 * Toạ độ tính bằng lượng giác trên một khung 100×100 rồi để CSS co giãn, nên
 * thêm hay bớt người không phải vẽ lại gì.
 *
 * Rê vào một người: chỉ những đường của người ấy sáng lên, phần còn lại mờ đi.
 * Đó là cách duy nhất đọc được một mạng lưới 48 cạnh — hiện hết cùng lúc thì
 * nó chỉ là một mớ chỉ rối.
 */
export function MangLuoi({
  nguoi,
  donVi,
  locale,
  nhanTam,
}: {
  nguoi: NutNguoi[];
  donVi: NutDonVi[];
  locale: string;
  nhanTam: string;
}) {
  const [dangRe, setDangRe] = useState<string | null>(null);

  const viTri = useMemo(() => {
    const dv = new Map<string, { x: number; y: number }>();
    // Vòng đơn vị bắt đầu từ 12 giờ (-90°) để khối trên cùng nằm ngay ngắn.
    donVi.forEach((d, i) => {
      const goc = (i / donVi.length) * Math.PI * 2 - Math.PI / 2;
      dv.set(d.khoa, { x: 50 + Math.cos(goc) * 25, y: 50 + Math.sin(goc) * 25 });
    });

    const ng = new Map<string, { x: number; y: number }>();
    nguoi.forEach((p, i) => {
      const goc = (i / nguoi.length) * Math.PI * 2 - Math.PI / 2;
      // Vòng người hơi dẹt theo chiều dọc: khung rộng hơn cao nên hình tròn
      // hoàn hảo sẽ chạm mép trên dưới trước khi lấp đầy hai bên.
      ng.set(p.slug, { x: 50 + Math.cos(goc) * 44, y: 50 + Math.sin(goc) * 41 });
    });
    return { dv, ng };
  }, [nguoi, donVi]);

  const canh = useMemo(
    () =>
      nguoi.flatMap((p) =>
        p.donVi
          .map((k) => {
            const a = viTri.ng.get(p.slug);
            const b = viTri.dv.get(k);
            if (!a || !b) return null;
            return { id: `${p.slug}-${k}`, slug: p.slug, khoa: k, a, b };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null),
      ),
    [nguoi, viTri],
  );

  const sang = (slug: string, khoa?: string) =>
    dangRe === null || dangRe === slug || (khoa !== undefined && nguoi.find((p) => p.slug === dangRe)?.donVi.includes(khoa));

  return (
    <div className={styles.boc}>
      {/* Nền chuyển động, nằm dưới cùng và không nhận chuột. */}
      <div className={styles.nen} aria-hidden="true" />
      <div className={styles.luoiMo} aria-hidden="true" />

      <div className={styles.khung} onMouseLeave={() => setDangRe(null)}>
        <svg className={styles.day} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {donVi.map((d) => {
            const b = viTri.dv.get(d.khoa)!;
            return (
              <line
                key={`tam-${d.khoa}`}
                x1={50}
                y1={50}
                x2={b.x}
                y2={b.y}
                className={`${styles.duong} ${styles.duongTam}`}
              />
            );
          })}

          {canh.map((c) => (
            <line
              key={c.id}
              x1={c.a.x}
              y1={c.a.y}
              x2={c.b.x}
              y2={c.b.y}
              className={`${styles.duong} ${dangRe === c.slug ? styles.duongSang : ""} ${
                dangRe !== null && dangRe !== c.slug ? styles.duongMo : ""
              }`}
            />
          ))}

          {/* Vệt sáng chạy dọc vài đường, đủ để mạng lưới có nhịp thở. */}
          {canh.slice(0, 8).map((c, i) => (
            <line
              key={`vet-${c.id}`}
              x1={c.a.x}
              y1={c.a.y}
              x2={c.b.x}
              y2={c.b.y}
              className={styles.vet}
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </svg>

        {/*
          Tâm: logo tập đoàn.

          Dùng bản DỌC của logo (`-doc.svg`) chứ không phải bản ngang: nút tâm
          là hình tròn, mà logo ngang đặt vào đó chỉ lấp được một dải giữa vòng,
          hai đầu trên dưới trống hoác. Cùng lý do như nút tâm của sơ đồ hệ sinh
          thái ở trang Giới thiệu.

          `unoptimized` vì đây là SVG: cho qua bộ tối ưu ảnh của Next chỉ tốn
          một vòng xử lý mà không nhỏ đi được byte nào.
        */}
        <div className={`${styles.nut} ${styles.nutTam}`} style={{ left: "50%", top: "50%" }}>
          <Image
            src="/brand/viet-duc-group-doc.svg"
            alt={nhanTam}
            width={220}
            height={220}
            unoptimized
            className={styles.tamLogo}
          />
        </div>

        {/* Vòng đơn vị */}
        {donVi.map((d) => {
          const p = viTri.dv.get(d.khoa)!;
          const noiBat = dangRe !== null && nguoi.find((x) => x.slug === dangRe)?.donVi.includes(d.khoa);
          return (
            <div
              key={d.khoa}
              className={`${styles.nut} ${styles.nutDonVi} ${d.loai === "ban" ? styles.nutBan : ""} ${
                noiBat ? styles.nutSang : ""
              } ${dangRe !== null && !noiBat ? styles.nutMo : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span>{d.ten}</span>
            </div>
          );
        })}

        {/* Vòng người */}
        {nguoi.map((p) => {
          const v = viTri.ng.get(p.slug)!;
          const ben = v.x > 50;
          return (
            <Link
              key={p.slug}
              href={`/${locale}/doi-ngu/${p.slug}`}
              className={`${styles.nut} ${styles.nutNguoi} ${dangRe === p.slug ? styles.nutSang : ""} ${
                dangRe !== null && !sang(p.slug) ? styles.nutMo : ""
              }`}
              style={{ left: `${v.x}%`, top: `${v.y}%` }}
              onMouseEnter={() => setDangRe(p.slug)}
              onFocus={() => setDangRe(p.slug)}
              onBlur={() => setDangRe(null)}
            >
              {p.anh ? (
                <Image src={p.anh} alt="" width={160} height={160} className={styles.anhNut} />
              ) : (
                <span className={styles.chuCai}>{p.chuCai}</span>
              )}
              <span className={`${styles.nhan} ${ben ? styles.nhanTrai : ""}`}>
                <strong>
                  {p.hocVi ? <em>{p.hocVi} </em> : null}
                  {p.ten}
                </strong>
                <span>{p.chuc}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
