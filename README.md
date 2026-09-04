# Việt Đức Group — website

Cổng thông tin giáo dục cho **Việt Đức Group**, hệ thống sáu trường thành viên tại
Việt Nam và CHLB Đức. Nội dung được biên tập từ hồ sơ năng lực và các giấy phép
hoạt động giáo dục nghề nghiệp; mỗi dữ kiện đều giữ nguồn (tên tài liệu + số
trang) để có thể đối chiếu lại bản gốc.

- Website công khai: ba ngôn ngữ `vi` / `de` / `en`
- Course Explorer: lọc và so sánh ngành nghề theo dữ liệu giấy phép
- Trợ lý tư vấn (RAG): chỉ trả lời từ nội dung **đã duyệt**, luôn dẫn nguồn
- Trang quản trị: duyệt nội dung, nhập PDF (có OCR), quản lý lead và cấu hình

---

## 1. Chạy dự án

```bash
npm install
cp .env.example .env.local     # có thể để trống hết, xem mục 6

npm run db:push                # tạo bảng
npm run media                  # bóc ảnh từ PDF nguồn vào /public/media
ADMIN_EMAIL=ban@vidu.vn ADMIN_PASSWORD='...' npm run seed
npm run kb:build               # dựng Knowledge Base cho trợ lý

npm run dev                    # http://localhost:3025
```

Đăng nhập quản trị tại `/admin` bằng `ADMIN_EMAIL` / `ADMIN_PASSWORD` đã dùng khi
seed.

### ⚠️ Một quy tắc bắt buộc khi dùng PGlite

Mặc định dự án chạy trên **PGlite** (Postgres biên dịch sang WASM, lưu ở
`./data/pgdata`) nên không cần cài máy chủ cơ sở dữ liệu. Đây là engine nhúng:
**một thư mục dữ liệu chỉ được một tiến trình mở tại một thời điểm**.

> Hãy **tắt `npm run dev` trước khi** chạy `db:push`, `seed`, `ingest`,
> `kb:build`. Mở đồng thời sẽ làm hỏng cơ sở dữ liệu (lỗi xuất hiện sau đó dưới
> dạng `missing chunk number 0 for toast value ...`).

Dự án có khoá cảnh báo: tiến trình thứ hai sẽ **dừng lại kèm thông báo rõ ràng**
thay vì âm thầm phá dữ liệu. Trên production, đặt `DATABASE_URL` trỏ tới
PostgreSQL thật thì giới hạn này biến mất.

---

## 2. Kiến trúc

Website có **ba khuôn mặt**, mỗi khuôn mặt một lớp vỏ riêng:

| Đường dẫn | Là gì | Vỏ |
|---|---|---|
| `/vi` | Trang cổng: logo 3D, hai vệ tinh, chọn lĩnh vực | `HubBar` + `HubDecor`, nền tối cố định |
| `/vi/dao-tao/…` | Mảng giáo dục & đào tạo | `SiteHeader` + `SiteFooter` (giấy ấm, serif) |
| `/vi/dau-tu/…` | Mảng khách sạn, resort & lữ hành | `VentureHeader` + `VentureFooter` (đá, đất nung) |

Các trang cấp tập đoàn (`/gioi-thieu`, `/tin-tuc`, `/lien-he`, chính sách,
Impressum) dùng chung vỏ của mảng đào tạo.

```
src/
  app/
    [locale]/
      page.tsx           TRANG CỔNG (không dùng vỏ của mảng nào)
      (portal)/          mảng đào tạo + trang cấp tập đoàn
        dao-tao/         landing + chuong-trinh · truong · thu-vien · faq · dang-ky
      (venture)/         mảng đầu tư
        dau-tu/          landing + du-an/[slug]
    admin/               khu quản trị + server actions
    api/                 search · advisor · leads · newsletter · upload PDF
  components/
    hub/                 sân khấu trang cổng (nền, quỹ đạo, dải trang trí)
    venture/             vỏ + bảng màu mảng đầu tư
  content/
    seed/                dữ liệu đào tạo bóc từ PDF, kèm nguồn từng mục
    venture.ts           dữ liệu mảng đầu tư, kèm nguồn + ngày tài liệu
  lib/
    db/                  schema Drizzle + kết nối (PGlite ⇄ node-postgres)
    pdf/                 bóc chữ, OCR, phân loại, chống prompt injection
    rag/                 chunk · truy xuất · trợ lý
    ai/                  lớp provider (Anthropic · OpenAI · Gemini)
    i18n/                cấu hình ngôn ngữ + từ điển giao diện
scripts/                 db-push · media · media-hospitality · seed · ingest · kb-build
tests/                   unit test (node:test)
```

`(portal)` và `(venture)` là **route group** — dấu ngoặc không xuất hiện trong
URL, chúng chỉ để mỗi mảng có `layout.tsx` riêng.

**Dữ liệu mảng đầu tư** hiện nằm trong `src/content/venture.ts` (module TypeScript
có kiểu), chưa đưa vào CSDL nên **chưa sửa được từ trang quản trị**. Mỗi dự án có
trường `status`; `publishedProjects()` lọc bỏ bản nháp, sitemap và trang danh sách
đều đi qua hàm này.

**Nguyên tắc dữ liệu.** Trang công khai chỉ đọc bản ghi `status = 'approved'`
(`src/lib/queries.ts`). Trợ lý chỉ đọc `kb_chunks` có `status = 'approved'`
(`src/lib/rag/retrieve.ts`). Hai bộ lọc này nằm ở đúng một chỗ để không thể đi
vòng qua.

---

## 3. Nhập dữ liệu từ PDF

Có hai đường:

**a) CLI — dùng cho tài liệu nguồn ban đầu**

```bash
npm run ingest                 # đọc mọi PDF trong ./content
npm run media                  # bóc ảnh + logo trường ra /public/media
```

**b) Trang quản trị — dùng thường xuyên**

`/admin/tai-lieu` → *Tải lên và bóc tách*. Hệ thống sẽ:

1. Kiểm tra tệp thật sự là PDF (đọc chữ ký `%PDF-`, không tin phần mở rộng)
2. Lưu ra ngoài `/public` nên tệp không bao giờ được phục vụ trực tiếp
3. Bóc text layer từng trang; trang nào không có chữ thì **OCR** (vie+deu+eng)
4. Loại header/footer lặp lại giữa các trang
5. Cắt thành từng đoạn, tự phân loại (giới thiệu / chương trình / đối tác /
   chứng nhận / hoạt động / FAQ / chính sách …)
6. Đánh dấu đoạn nào chứa văn bản trông như **chỉ thị cho AI**

Mọi đoạn đều ở trạng thái **nháp**. Biên tập viên duyệt từng đoạn (hoặc duyệt
hàng loạt), rồi bấm **Cập nhật Knowledge Base** ở trang Tổng quan.

Đoạn bị đánh dấu nghi ngờ prompt injection **không bao giờ vào Knowledge Base**,
kể cả khi được duyệt nhầm.

### Giới hạn upload

- Chỉ nhận PDF, tối đa **40 MB**
- Rate limit 10 lượt / 10 phút cho mỗi biên tập viên
- Tệp lưu tại `DOCUMENT_STORAGE_DIR` (mặc định `./storage/documents`), chỉ tải
  xuống được khi biên tập viên bật *cho tải* và đặt trạng thái *đã duyệt*

---

## 4. Trợ lý tư vấn (RAG)

```
Nội dung đã duyệt ─► chunk (lib/rag/build.ts)
                     ├─ chỉ mục BM25 (không cần dịch vụ ngoài)
                     └─ embedding (khi có cấu hình) ─► cosine
                                    │
câu hỏi ─────────────► truy xuất ───┴─► xếp hạng lai ─► mô hình ─► câu trả lời + nguồn
```

Những gì được đảm bảo bằng code, không phải bằng lời hứa trong prompt:

- Chỉ đọc chunk `approved`
- Dưới ngưỡng tin cậy → trả lời “chưa tìm thấy trong tài liệu chính thức” và mời
  gặp tư vấn viên, **không** đoán
- Nội dung tài liệu được bọc trong thẻ `<source>` và nêu rõ là **dữ liệu**, không
  phải chỉ thị
- Giới hạn độ dài câu hỏi, số lượt hội thoại và rate limit
- Lỗi từ nhà cung cấp mô hình chỉ ghi ở log máy chủ, không lộ ra trình duyệt
- Không cấu hình mô hình → website nói thẳng là chưa bật, vẫn tra cứu và trích
  dẫn tài liệu; **không giả vờ trả lời**

Câu hỏi nào không có dữ liệu sẽ vào `/admin/tro-ly` — đó chính là danh sách nội
dung còn thiếu.

### Cập nhật Knowledge Base

- Trong admin: **Tổng quan → Cập nhật Knowledge Base**
- Hoặc CLI: `npm run kb:build` (nhớ tắt dev server trước)

Cần chạy lại sau mỗi lần duyệt nội dung mới, sửa nội dung, hoặc gỡ tài liệu.

---

## 5. Mạng xã hội

Vào **Admin → Cấu hình → Mạng xã hội**. Nhập URL đầy đủ (Facebook, Instagram,
TikTok, YouTube, LinkedIn) hoặc số điện thoại (Zalo, WhatsApp).

Kênh nào để trống thì **icon tương ứng biến mất** khỏi header, footer, trang liên
hệ và thanh thao tác trên mobile. Website không bao giờ tự sinh liên kết.

Giá trị mặc định đang **để trống hết**: cả bộ PDF lẫn website cũ đều không nêu
một tài khoản mạng xã hội nào.

---

## 6. Biến môi trường

Xem `.env.example` để biết đầy đủ. Không có biến nào là bắt buộc để chạy — mỗi
tính năng cần dịch vụ ngoài đều tự tắt một cách trung thực:

| Nhóm | Biến | Không cấu hình thì sao |
|---|---|---|
| Cơ sở dữ liệu | `DATABASE_URL` | dùng PGlite trong `./data/pgdata` |
| Trợ lý AI | `AI_PROVIDER`, `*_API_KEY` | vẫn tra cứu + trích dẫn, không sinh câu trả lời |
| Vector | `EMBEDDING_PROVIDER` | truy xuất bằng BM25 |
| Email | `EMAIL_PROVIDER`, `RESEND_API_KEY` | newsletter báo “chờ xác nhận”, không báo lead qua email |
| Địa chỉ site | `NEXT_PUBLIC_SITE_URL` | canonical/sitemap dùng localhost |

Khoá API **chỉ đọc ở phía máy chủ** (`src/lib/ai/index.ts`, `src/lib/notify.ts`).
Không biến nào có tiền tố `NEXT_PUBLIC_` ngoài `NEXT_PUBLIC_SITE_URL`.

---

## 7. Kiểm tra

```bash
npm run typecheck    # tsc --noEmit
npm run lint
npm test             # unit test
npm run build        # production build
```

---

## 8. Vai trò quản trị

| Vai trò | Quyền |
|---|---|
| `administrator` | toàn quyền, kể cả gỡ tài liệu, sửa cấu hình, quản lý người dùng |
| `content_editor` | sửa & xuất bản nội dung, tải PDF, cập nhật Knowledge Base |
| `admissions_staff` | xem nội dung, xử lý đăng ký tư vấn, xem hội thoại AI |

Quyền được kiểm tra ngay trong từng server action (`requireCapability`), không
chỉ ẩn nút trên giao diện.

---

## 9. Những chỗ cần tổ chức bổ sung

Các mục dưới đây **cố tình để trống** vì không tài liệu nào của dự án nêu:

- Liên kết mạng xã hội chính thức
- Người đại diện pháp luật, mã số doanh nghiệp, mã số thuế GTGT và người chịu
  trách nhiệm nội dung trong trang **Impressum** (bắt buộc theo §5 DDG nếu công
  bố cho người dùng tại Đức)
- Học phí, lịch khai giảng, loại chứng nhận của từng ngành
- Ảnh và tiểu sử đội ngũ, giảng viên
- Tin tức thật (mục Tin tức hiện trống, không dùng tin mẫu)

Riêng mảng đầu tư:

- **Vai trò của Việt Đức Group tại Long Beach Resort** — hồ sơ ghi chủ đầu tư là
  một công ty khác, nên dự án để `draft` và không hiển thị
- **Bộ 20 ảnh phối cảnh Bố Trạch** chỉ ghi tên studio và địa danh, không ghi tên
  dự án; đang xếp vào trang TOKI, cần xác nhận
- **Nội dung lữ hành** chưa có tài liệu nào
- **Logo vector** — logo trong bộ nhận diện chỉ là ảnh 236×240 px; có file
  `.ai/.svg/.eps` thì logo trang cổng sẽ nét hơn nhiều
- Số liệu dự phóng doanh thu/công suất trong hồ sơ TOKI **không đăng** (xem
  DATA-NOTES mục 14)

Xem thêm `docs/DATA-NOTES.md` để biết các điểm dữ liệu mâu thuẫn giữa hồ sơ in và
giấy phép gốc, và toàn bộ nguồn của mảng đầu tư (phần II).
