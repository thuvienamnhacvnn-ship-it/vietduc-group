"use client";

import { useEffect } from "react";

/**
 * Một IntersectionObserver cho cả tài liệu.
 *
 * Thành phần chạy trên máy chủ chỉ cần đánh dấu `data-reveal`; chúng không phải
 * biến thành thành phần chạy trên trình duyệt để có hiệu ứng.
 *
 * HAI ĐIỀU ĐÃ TỪNG SAI, ghi lại để đừng ai làm lại:
 *
 * 1. Bản trước quét `[data-reveal]` đúng MỘT LẦN, ngay khi đường dẫn đổi. Từ khi
 *    có màn hình chờ, thứ tự trở thành: đổi đường dẫn → hiện khung chờ → trang
 *    thật mới về. Cú quét rơi vào lúc khung chờ đang hiện nên không thấy phần
 *    tử nào, rồi không bao giờ chạy lại. Trang thật về sau đó với opacity 0 và
 *    nằm im vĩnh viễn — máy chủ vẫn trả trang đầy đủ nên nhìn từ ngoài không
 *    thấy gì sai. Nay có thêm MutationObserver để bắt mọi thứ đến sau.
 *
 * 2. Bản trước để CSS ẩn nội dung ngay từ đầu. Nghĩa là nội dung mặc định vô
 *    hình, chỉ hiện nếu đoạn mã này chạy đúng. Nay CSS chỉ ẩn khi thấy dấu
 *    `data-reveal-ready` do chính đoạn mã này đặt lên thẻ <html>: mã không chạy
 *    thì trang vẫn đọc được, chỉ là không có hiệu ứng.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const show = (element: HTMLElement) => {
      element.dataset.reveal = "in";
    };

    if (reduced) {
      // Không bật cổng ẩn: người dùng đã nói rõ là không muốn thấy chuyển động.
      for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) show(element);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Một cú lướt nhanh — xoay bánh xe, nhảy tới neo, khôi phục vị trí
          // cuộn — có thể đưa một phần tử từ dưới màn hình lên trên đỉnh giữa
          // hai lần gọi. Hiện luôn cả những phần tử đã trôi qua đỉnh thì không
          // phần tử nào bị bỏ lại trong trạng thái vô hình.
          const passed = entry.boundingClientRect.bottom <= 0;
          if (!entry.isIntersecting && !passed) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const take = (element: HTMLElement) => {
      if (element.dataset.reveal === "in") return;
      // Thứ đã nằm trong tầm nhìn thì hiện ngay, không fade vào muộn.
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) show(element);
      else observer.observe(element);
    };

    /*
     * Bật cổng ẩn RỒI xử lý ngay trong cùng một nhịp, không để trình duyệt vẽ
     * xen vào giữa: nếu vẽ xen vào thì phần tử đang hiện sẽ chớp tắt một cái
     * trước khi hiện lại.
     */
    root.dataset.revealReady = "";
    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) take(element);

    /*
     * Nội dung đến sau: khung chờ đổi thành trang thật, router thay cả một
     * nhánh cây, hay một mục được tải dần. Không có bộ này thì tất cả những thứ
     * đó nằm lại vô hình.
     */
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.hasAttribute("data-reveal")) take(node);
          for (const child of node.querySelectorAll<HTMLElement>("[data-reveal]")) take(child);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      delete root.dataset.revealReady;
    };
  }, []);

  return null;
}
