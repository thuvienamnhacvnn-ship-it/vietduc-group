import type { QuocGia } from "@/content/mang-luoi-nibelc";

/**
 * Lá cờ 12 nước trong mạng lưới, vẽ tay bằng SVG (khung 30×20).
 *
 * Không dùng emoji cờ: Windows không có cờ trong bộ emoji, nên 🇬🇷 hiện ra
 * thành hai chữ "GR" trơ trọi — đúng trên máy của phần lớn người xem ở văn
 * phòng. Cờ ở đây giản lược cho cỡ 30px: đủ nhận ra, không chép chi tiết huy
 * hiệu.
 */

/** Ngôi sao năm cánh tâm (cx, cy), bán kính ngoài r. */
function sao(cx: number, cy: number, r: number) {
  const diem: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.42 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    diem.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return diem.join(" ");
}

function soc(n: number, mau: [string, string]) {
  const h = 20 / n;
  return Array.from({ length: n }, (_, i) => (
    <rect key={i} x="0" y={i * h} width="30" height={h + 0.05} fill={mau[i % 2]} />
  ));
}

const VE: Record<QuocGia["ma"], React.ReactNode> = {
  GR: (
    <>
      {soc(9, ["#0D5EAF", "#fff"])}
      <rect width="11.11" height="11.11" fill="#0D5EAF" />
      <rect x="4.44" width="2.22" height="11.11" fill="#fff" />
      <rect y="4.44" width="11.11" height="2.22" fill="#fff" />
    </>
  ),
  DE: (
    <>
      <rect width="30" height="6.67" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </>
  ),
  AT: (
    <>
      <rect width="30" height="20" fill="#C8102E" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
    </>
  ),
  HU: (
    <>
      <rect width="30" height="6.67" fill="#CD2A3E" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#436F4D" />
    </>
  ),
  RO: (
    <>
      <rect width="10" height="20" fill="#002B7F" />
      <rect x="10" width="10" height="20" fill="#FCD116" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
    </>
  ),
  PL: (
    <>
      <rect width="30" height="10" fill="#fff" />
      <rect y="10" width="30" height="10" fill="#DC143C" />
    </>
  ),
  JP: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </>
  ),
  SG: (
    <>
      <rect width="30" height="10" fill="#EF3340" />
      <rect y="10" width="30" height="10" fill="#fff" />
      <circle cx="6.6" cy="5" r="3.4" fill="#fff" />
      <circle cx="7.9" cy="5" r="3.1" fill="#EF3340" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return <polygon key={i} points={sao(10.6 + 1.9 * Math.cos(a), 5 + 1.9 * Math.sin(a), 0.75)} fill="#fff" />;
      })}
    </>
  ),
  MY: (
    <>
      {soc(14, ["#CC0001", "#fff"])}
      <rect width="15" height="11.43" fill="#010066" />
      <circle cx="5.6" cy="5.7" r="3.7" fill="#FFCC00" />
      <circle cx="6.7" cy="5.7" r="3.1" fill="#010066" />
      <polygon points={sao(10.9, 5.7, 2.6)} fill="#FFCC00" />
    </>
  ),
  IN: (
    <>
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.5" fill="none" stroke="#000080" strokeWidth="0.6" />
      <circle cx="15" cy="10" r="0.6" fill="#000080" />
    </>
  ),
  QA: (
    <>
      <rect width="30" height="20" fill="#8A1538" />
      <path
        fill="#fff"
        d={`M0 0H7.5${Array.from({ length: 9 }, (_, i) => `L11 ${(i * 2 + 1) * (20 / 18)}L7.5 ${(i + 1) * 2 * (20 / 18)}`).join("")}H0Z`}
      />
    </>
  ),
  AE: (
    <>
      <rect width="30" height="6.67" fill="#00732F" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#000" />
      <rect width="7.5" height="20" fill="#FF0000" />
    </>
  ),
};

export function CoQuocGia({ ma, className }: { ma: QuocGia["ma"]; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      {VE[ma]}
    </svg>
  );
}
