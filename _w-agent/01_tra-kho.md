# 01 Tra kho - nâng cấp 6 hạng mục (không đổi layout)

Kho: D:\Tool & Libary\ui-library (E:\Tools không tồn tại trên máy này). Skill: ui-ux-pro-max (đọc thẳng data/*.csv vì máy không có Python), aurora-webforge (04_MOTION_EFFECTS.md).
Ràng buộc: chỉ đổi giá trị CSS (token, easing, thời lượng, viền, bo, bóng nông). Không đổi cấu trúc, thứ tự, kích thước ô lưới. Không glow/shine/bóng chữ sáng. Nền tối: chữ nhấn = var(--gold). Mọi chuyển động tôn trọng prefers-reduced-motion (globals.css đã có luật cắt toàn cục).

## Design system đề xuất
Giữ tinh thần hiện có (Editorial Corporate + Warm Premium, navy/gold/burgundy). Tham chiếu: 2-design-system\awesome-design-md\design-md (bóng nông, viền hairline); ui-ux-pro-max typography.csv dòng 1 "Classic Elegant" và 12 "Luxury Serif" khớp hướng serif + sans hiện tại.

## Aurora: tìm thấy gì, dùng gì
- Skill aurora-webforge (C:\Users\tuxee\.claude\skills\aurora-webforge\04_MOTION_EFFECTS.md): mục "Restraint" = chỉ transform, opacity, mask, line motion; cấm bounce, elastic, blur nặng, neon, glow. Dùng làm luật. Mượn: Micro Lift, Staggered Reveal, Clip-Path/Masked Reveal, Center-Out Line Reveal, Image Zoom trong khung cố định.
- Kho magicui (3-component\magicui\apps\www\registry\magicui\): aurora-text.tsx, animated-gradient-text.tsx, shiny-button.tsx, shimmer-button.tsx, animated-shiny-text.tsx, border-beam.tsx = gradient chữ / shine / chùm sáng -> LOẠI. hallmark\skills\hallmark\references\genres\atmospheric.md (theme Aurora) dùng glow + nền radial -> chỉ mượn nguyên tắc "một sắc nhấn ấm".
- Mượn gradient nền khung (không thêm khối):
  - tối: linear-gradient(160deg, var(--paper-raised) 0%, color-mix(in srgb, var(--navy-soft) 55%, var(--paper-raised)) 100%)
  - sáng: linear-gradient(160deg, var(--paper-raised) 0%, var(--gold-tint) 100%)
  - Trôi (tuỳ chọn): background-size 200% 200%; animation 28s ease-in-out infinite alternate đổi background-position 0% 50% -> 100% 50%, chỉ trong @media (prefers-reduced-motion: no-preference).

## (1) Title / heading
- Giữ --font-display; weight h1 700, h2 600, h3/h4 600 (Spectral chỉ có 500/600/700).
- letter-spacing: h1 -0.012em, h2 -0.008em, h3/h4 -0.004em (giữ). Giữ --leading-tight 1.24 (không hạ, vì dấu Ệ/Ộ). text-wrap: balance (đã có). font-kerning: normal; font-feature-settings: "kern","liga".
- Nhãn nhỏ trên tiêu đề (nếu đã có): font-body 600, 0.78rem, letter-spacing 0.14em, uppercase, màu var(--gold-deep) (sáng) / var(--gold) (tối).
- Vạch dưới h2: dùng data-reveal-as="draw" sẵn có, 2px var(--gold), rộng 48px, chỉ khi đã có phần tử vạch; không thêm phần tử.
- Từ nhấn trong tiêu đề: var(--gold-deep) sáng / var(--gold) tối. Không gradient chữ, không text-shadow.
- Nguồn: ui-ux-pro-max typography.csv #1, #12; hallmark atmospheric.md (cấm gradient text).

## (2) Font chữ
- Giữ nguyên Spectral (display) + Be Vietnam Pro (body): cả hai có subset vietnamese, đã chọn sau khi so 9 mặt chữ (docs/thu-font.html, ghi trong layout.tsx). Playfair/Cormorant/Cinzel trong kho: dấu Việt vỡ hoặc quá mỏng ở cỡ nhỏ -> không đổi.
- Nâng cấp không đổi layout: font-optical-sizing: auto; font-variant-numeric: tabular-nums cho số học phí/ngày/bảng.
- Dự phòng nếu Sếp muốn đổi: Newsreader + Be Vietnam Pro (typography.csv #14), Newsreader có vietnamese; phải thử bằng mắt trên thu-font.html trước.

## (3) Animation / chuyển động
Thêm vào tokens.css (không xoá cái cũ):
- --ease-out: cubic-bezier(0.16, 1, 0.3, 1);  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
- --dur-hover: 220ms;  --dur-reveal: 640ms;  --stagger: 70ms;
Áp dụng:
- [data-reveal] (globals.css): easing -> --ease-out; translateY 18px -> 14px; slide 26px -> 20px; duration 640ms.
- Stagger: --reveal-delay = calc(var(--i) * 70ms), tối đa 6 bậc (420ms). Đặt bằng style --i hoặc nth-child, không đổi DOM.
- Unveil tiêu đề: clip-path inset(0 100% 0 0) -> inset(0), 760ms --ease-out.
- Cấm: bounce/back.out/elastic (motion.csv #3, #8 loại), parallax chữ, blur nặng.
- Reduced-motion: giữ khối @media đã có; thêm [data-reveal]{clip-path:none} và tắt animation nền trôi.
- Nguồn: motion.csv #1 (150-200ms power1.out), #4/#5 (scroll reveal 300-600ms power2.out, y 12-24, stagger 0.08), #7; aurora 04 "Fade + Translate", "Staggered", "Clip-Path Reveal".

## (4) Hiệu ứng hover / reveal
Bọc trong @media (hover: hover) and (pointer: fine); cảm ứng không phụ thuộc hover (ux-guidelines #11).
- Card/board: transform: translateY(-3px); transition transform/box-shadow/border-color var(--dur-hover) var(--ease-out); border-color -> var(--gold); shadow -> var(--shadow-2). Không scale (tránh tràn ô lưới).
- Ảnh trong khung cố định (overflow:hidden): img scale(1.03), 600ms --ease-out. Khung không đổi kích thước.
- Link văn bản: gạch chân tự vẽ bằng background: linear-gradient(var(--gold),var(--gold)) 0 100% / 0 1px no-repeat -> hover 100% 1px, 240ms --ease-out (màu phẳng, không sáng).
- Mũi tên/biểu tượng trong link: translateX(3px) khi hover, 200ms.
- Giữ :focus-visible outline 2px var(--focus).
- Nguồn: aurora 04 "Hover systems"; motion.csv #1/#2; magicui blur-fade.tsx chỉ lấy thời lượng (bỏ phần blur).

## (5) Khung board / card / panel
- background var(--surface); border 1px solid var(--line); bo var(--r-4) (14px) cho card lớn, var(--r-3) (8px) cho panel nhỏ. Nếu đổi bo làm lệch nhìn thì giữ bo cũ, chỉ nâng viền/bóng.
- Bóng nghỉ var(--shadow-1); hover var(--shadow-2). Tối: border-color var(--line-strong) khi hover (bóng tối đã mỏng). --shadow-3 chỉ cho modal/menu.
- Panel nổi bật: border-top 2px solid var(--gold) (thay vì thêm khối); nền gradient ở mục Aurora. Card thường giữ phẳng.
- Trong .on-dark: nền var(--surface) (rgba trắng 0.04), viền var(--line-dark), chữ nhấn var(--gold).
- Không đổi padding (đổi padding = đổi layout).
- Nguồn: hallmark references/component-cookbook.md (card elevation), awesome-design-md\design-md, ux-guidelines #29.

## (6) Button
Bo --r-3 (giữ pill nếu hiện đã pill). Không đổi min-height/padding/cỡ chữ.
- Primary: nền var(--navy), chữ #fff; hover nền var(--navy-soft), translateY(-1px), shadow-1 -> shadow-2; active translateY(0) 80ms. Transition background-color/transform/box-shadow/border-color 200ms --ease-out.
- Accent (CTA vàng): nền var(--gold), chữ var(--on-gold); hover color-mix(in srgb, var(--gold) 88%, #000) (đậm hơn, không sáng lên).
- Secondary/outline: viền 1px var(--line-strong), chữ var(--ink); hover viền var(--gold), nền var(--gold-tint). Trên nền tối chữ nhấn var(--gold).
- Burgundy (nếu có): nền var(--burgundy), hover var(--burgundy-deep).
- Press: translateY(1px) scale(0.99) 80ms. Disabled: opacity .5, bỏ hover transform. Loading: giữ chiều rộng, disabled (ux-guidelines #32).
- Loại: shiny-button.tsx, shimmer-button.tsx, animated-shiny-text.tsx, border-beam.tsx (magicui) = shine/chùm sáng.

## Không tìm thấy trong kho (đội tự dựng theo spec trên)
- Stagger thuần CSS theo --i: kho không có, dựng bằng style --i hoặc nth-child.
- Nền khung trôi không glow: kho chỉ có bản glow/blur, dựng từ gradient ở mục Aurora.

## Thứ tự làm gợi ý
tokens.css (easing/dur) -> globals.css (heading, reveal) -> button -> card/board -> hover. Mỗi bước chụp 1440 + 390 so bản trước; lệch vị trí > 1px là lỗi layout.
