import Link from "next/link";
import { DEFAULT_LOCALE, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * A not-found page cannot read the route params, so it speaks the default
 * language and offers the ways back that matter most.
 */
export default function NotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);
  return (
    <div className="shell" style={{ padding: "var(--s-9) 0", textAlign: "center" }}>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          color: "var(--gold)",
          lineHeight: 1,
        }}
      >
        404
      </p>
      <h1 style={{ marginTop: "var(--s-4)" }}>
        Không tìm thấy trang / Seite nicht gefunden / Page not found
      </h1>
      <p style={{ margin: "var(--s-4) auto var(--s-6)", color: "var(--muted)" }}>
        Đường dẫn bạn mở không tồn tại hoặc đã được chuyển.
      </p>
      <div
        style={{
          display: "flex",
          gap: "var(--s-3)",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href={localePath(DEFAULT_LOCALE, "/")}
          style={{
            padding: "0.78rem 1.5rem",
            fontWeight: 600,
            color: "#fff",
            background: "var(--burgundy)",
            borderRadius: "var(--r-pill)",
            textDecoration: "none",
          }}
        >
          {dict.nav.home}
        </Link>
        <Link
          href={localePath(DEFAULT_LOCALE, "/dao-tao/chuong-trinh")}
          style={{
            padding: "0.78rem 1.5rem",
            fontWeight: 600,
            color: "var(--ink)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--r-pill)",
            textDecoration: "none",
          }}
        >
          {dict.nav.explorer}
        </Link>
      </div>
    </div>
  );
}
