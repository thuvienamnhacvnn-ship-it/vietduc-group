"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Con số chạy từ 0 lên giá trị thật khi cuộn tới.
 *
 * Ba điều đáng nói:
 *
 *  - Giá trị thật được in ra ngay trong HTML từ máy chủ. Nếu JavaScript không
 *    chạy, hoặc chạy chậm, người đọc vẫn thấy đúng con số chứ không thấy số 0.
 *    Hiệu ứng chỉ bắt đầu sau khi thành phần này gắn vào trang.
 *  - Chỉ chạy một lần. Cuộn lên rồi cuộn xuống lại mà số đếm lại từ đầu thì
 *    thành trò vui, không còn là thông tin.
 *  - `prefers-reduced-motion` thì bỏ hẳn phần chạy. Với người dễ chóng mặt,
 *    một con số nhảy liên tục là thứ gây khó chịu thật sự, không phải chi tiết
 *    trang trí.
 *
 * `so` là phần số; `duoi`/`tren` là chữ đi kèm ("+", "%") — tách ra để phần
 * chạy không phải phân tích chuỗi.
 */
export function SoDem({
  so,
  truoc = "",
  sau = "",
  giay = 1.1,
}: {
  so: number;
  truoc?: string;
  sau?: string;
  /** Thời lượng chạy, tính bằng giây. */
  giay?: number;
}) {
  const [hien, setHien] = useState(so);
  const oRef = useRef<HTMLSpanElement>(null);
  const daChay = useRef(false);

  useEffect(() => {
    const el = oRef.current;
    if (!el) return;

    const it = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (it.matches) return;

    const theoDoi = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || daChay.current) return;
        daChay.current = true;
        theoDoi.disconnect();

        const batDau = performance.now();
        const ms = giay * 1000;
        const buoc = (luc: number) => {
          const t = Math.min(1, (luc - batDau) / ms);
          /* Chậm dần ở cuối: số dừng lại êm thay vì khựng đột ngột. */
          const e = 1 - Math.pow(1 - t, 3);
          setHien(Math.round(so * e));
          if (t < 1) requestAnimationFrame(buoc);
        };
        setHien(0);
        requestAnimationFrame(buoc);
      },
      { threshold: 0.4 },
    );

    theoDoi.observe(el);
    return () => theoDoi.disconnect();
  }, [so, giay]);

  return (
    <span ref={oRef}>
      {truoc}
      {hien.toLocaleString("vi-VN")}
      {sau}
    </span>
  );
}
