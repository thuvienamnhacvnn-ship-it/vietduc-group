"use client";

import { useEffect, useId, useRef, useState } from "react";
import { pick, type Locale } from "@/lib/i18n/config";
import { MUC_LUC } from "@/content/tam-nhin-cach-lam";
import styles from "./TamNhin.module.css";

/**
 * Thanh mục lục trong phạm vi mục Tầm nhìn.
 *
 * Bám dưới thanh trên khi cuộn qua mục, và đánh dấu chặng đang đọc. Chặng đang
 * đọc nhận diện bằng IntersectionObserver chứ không bằng sự kiện cuộn: trình
 * duyệt tự báo khi một khối vào vùng nhìn, nên không có hàm nào chạy trên mỗi
 * điểm ảnh cuộn — đây là mục dài, một trình nghe cuộn ở đây sẽ thấy rõ độ giật.
 *
 * Vùng quan sát thu về một dải mỏng gần đỉnh màn hình (`rootMargin` âm ở dưới):
 * chặng "đang đọc" nên là chặng vừa chạm mép trên, không phải chặng đang chiếm
 * nhiều diện tích nhất — hai cách cho kết quả khác nhau khi các khối dài ngắn
 * chênh lệch, và cách đầu khớp với cảm giác của người đọc hơn.
 */
export function MucLuc({ locale }: { locale: Locale }) {
  const [dangDoc, setDangDoc] = useState<string>(MUC_LUC[0].id);
  const [mo, setMo] = useState(false);
  const dsId = useId();
  const boQua = useRef(false);

  useEffect(() => {
    const cacKhoi = MUC_LUC.map((m) => document.getElementById(m.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!cacKhoi.length) return;

    const theoDoi = new IntersectionObserver(
      (entries) => {
        /* Trong lúc cuộn theo lệnh bấm mục lục thì đừng để bộ theo dõi đổi dấu
           liên tục qua từng khối bay qua — nó nhấp nháy và rất khó chịu. */
        if (boQua.current) return;
        const vao = entries.filter((e) => e.isIntersecting);
        if (!vao.length) return;
        vao.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setDangDoc(vao[0].target.id);
      },
      { rootMargin: "-12% 0px -78% 0px", threshold: 0 },
    );

    for (const el of cacKhoi) theoDoi.observe(el);
    return () => theoDoi.disconnect();
  }, []);

  const chon = (id: string) => {
    setDangDoc(id);
    setMo(false);
    boQua.current = true;
    window.setTimeout(() => {
      boQua.current = false;
    }, 800);
  };

  const nhanDangDoc = MUC_LUC.find((m) => m.id === dangDoc)?.nhan ?? MUC_LUC[0].nhan;

  return (
    <nav
      className={styles.mucLuc}
      aria-label={pick(
        {
          vi: "Mục lục phần Tầm nhìn",
          en: "Contents of the vision section",
          de: "Inhalt des Abschnitts Vision",
          ja: "ビジョンの節の目次",
          ko: "비전 절의 차례",
          "zh-TW": "願景章節目錄",
        },
        locale,
      )}
    >
      <div className={`shell ${styles.mucLucTrong}`}>
        <span className={styles.mucLucNhan}>
          {pick(
            {
              vi: "Trong phần này",
              en: "In this section",
              de: "In diesem Abschnitt",
              ja: "この節の中で",
              ko: "이 절에서",
              "zh-TW": "本節內容",
            },
            locale,
          )}
        </span>

        {/* Trên điện thoại, bảy chặng bày hết ra sẽ chiếm hai hàng màn hình.
            Gói vào một nút, và nút ấy nói luôn đang đọc tới đâu. */}
        <button
          type="button"
          className={styles.mucLucNut}
          aria-expanded={mo}
          aria-controls={dsId}
          onClick={() => setMo((v) => !v)}
        >
          <span>
            {pick(
              {
                vi: "Trong phần này",
                en: "In this section",
                de: "In diesem Abschnitt",
                ja: "この節の中で",
                ko: "이 절에서",
                "zh-TW": "本節內容",
              },
              locale,
            )}
            {" · "}
            <span className={styles.mucLucDangDoc}>{pick(nhanDangDoc, locale)}</span>
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul
          className={`${styles.mucLucDs} ${mo ? styles.mucLucDsMo : ""}`}
          id={dsId}
        >
          {MUC_LUC.map((m) => (
            <li key={m.id}>
              <a
                href={`#${m.id}`}
                aria-current={m.id === dangDoc ? "true" : undefined}
                onClick={() => chon(m.id)}
              >
                {pick(m.nhan, locale)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
