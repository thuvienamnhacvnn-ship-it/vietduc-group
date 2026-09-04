import QRCode from "qrcode";

/**
 * Server-rendered QR code.
 *
 * Rendered here rather than in the browser for two reasons: the encoder never
 * reaches the client bundle, and the matrix comes from a maintained
 * implementation instead of a hand-rolled one that could quietly produce a code
 * no phone can read.
 */
export function QrCode({
  value,
  size = 168,
  label,
}: {
  value: string;
  size?: number;
  label: string;
}) {
  let matrix: { size: number; data: Uint8Array | ArrayLike<number> };
  try {
    matrix = QRCode.create(value, { errorCorrectionLevel: "M" }).modules;
  } catch {
    // An unencodable value (absurdly long URL) should drop the QR, not the page.
    return null;
  }

  const n = matrix.size;
  const quiet = 2;
  const total = n + quiet * 2;
  const cells: string[] = [];

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (matrix.data[y * n + x]) cells.push(`M${x + quiet} ${y + quiet}h1v1h-1z`);
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect width={total} height={total} fill="#ffffff" />
      <path d={cells.join("")} fill="#101d2b" />
    </svg>
  );
}
