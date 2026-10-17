"use client";

import { useEffect, useRef } from "react";
import styles from "./DeepSpace.module.css";

/**
 * Nền vũ trụ sâu thẳm cho tấm tròn sau logo. Hai lớp tinh vân (CSS) trôi chậm
 * ở hai tốc độ khác nhau, trên đó là sao bay thẳng về phía người xem: mỗi sao
 * có độ sâu riêng, càng gần càng to, càng sáng và càng nhanh, nên mắt đọc ra
 * chiều sâu thật chứ không phải tấm ảnh phẳng. Chuyển động theo vòng nên lặp vô
 * hạn, không có mối nối.
 */

const STARS = 170;
const SPEED = 0.00022; // phần độ sâu mỗi mili giây: một sao đi hết đường mất ~4,5 s

type Star = { x: number; y: number; z: number; hue: number };

const fresh = (z = 1): Star => ({
  x: (Math.random() - 0.5) * 2,
  y: (Math.random() - 0.5) * 2,
  z,
  hue: Math.random() < 0.3 ? 40 : 0,
});

export function DeepSpace({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let size = 0;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(1, Math.round(cv.clientWidth * dpr));
      cv.width = size;
      cv.height = size;
    };
    fit();

    const stars: Star[] = Array.from({ length: STARS }, () => fresh(Math.random()));
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const draw = (now: number, step: number) => {
      ctx.clearRect(0, 0, size, size);
      const c = size / 2;
      for (const s of stars) {
        s.z -= step;
        if (s.z <= 0.02) Object.assign(s, fresh());
        // Chiếu phối cảnh: chia cho độ sâu, càng gần càng văng ra rìa.
        const px = c + (s.x / s.z) * c * 0.22;
        const py = c + (s.y / s.z) * c * 0.22;
        if (px < 0 || py < 0 || px > size || py > size) {
          Object.assign(s, fresh());
          continue;
        }
        const near = 1 - s.z;
        const r = (0.35 + near * 1.7) * (size / 360);
        const a = Math.min(1, near * 1.5) * (0.35 + 0.65 * near);
        // Vệt ngắn phía sau sao cho cảm giác đang trôi.
        const tail = (near * near * 7 * size) / 360;
        const dx = (px - c) / c;
        const dy = (py - c) / c;
        ctx.strokeStyle = `hsla(${s.hue}, ${s.hue ? 60 : 0}%, ${78 + near * 18}%, ${a * 0.55})`;
        ctx.lineWidth = r * 0.9;
        ctx.beginPath();
        ctx.moveTo(px - dx * tail, py - dy * tail);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.fillStyle = `hsla(${s.hue}, ${s.hue ? 70 : 0}%, ${86 + near * 10}%, ${a})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      void now;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const step = Math.min(now - last, 50) * SPEED;
      last = now;
      draw(now, step);
    };

    if (reduced) {
      draw(last, 0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(cv);
    const ro = new ResizeObserver(fit);
    ro.observe(cv);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <span className={`${styles.space} ${className ?? ""}`} aria-hidden="true">
      <span className={`${styles.cloud} ${styles.cloudFar}`} />
      <span className={`${styles.cloud} ${styles.cloudNear}`} />
      <canvas ref={ref} className={styles.stars} />
      <span className={styles.vignette} />
    </span>
  );
}
