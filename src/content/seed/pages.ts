import type { SeedPage } from "./types";

/**
 * Static pages. The two "about" pages restate the capability profile; the legal
 * pages describe what this website actually does - they were written against
 * the implementation, not copied from a template, so they stay true as long as
 * the code does not change. Anything that still needs real-world data from the
 * organisation is marked inline with "[CẦN BỔ SUNG]" instead of being invented.
 *
 * Body text is a small Markdown subset: `##` headings, `-` lists, blank-line
 * paragraphs and **bold**. See `components/Prose.tsx`.
 */

export const PAGES: SeedPage[] = [
  {
    slug: "gioi-thieu",
    title: { vi: "Giới thiệu", en: "About us", de: "Über uns" },
    seoDescription: {
      vi: "Việt Đức Group là hệ thống giáo dục đa cấp, đa ngành hoạt động trong lĩnh vực đào tạo nghề, cao đẳng, trung cấp và liên kết quốc tế.",
      en: "Viet Duc Group is a multi-level, multi-field education system operating in vocational, college and intermediate training with international partnerships.",
      de: "Die Viet Duc Group ist ein mehrstufiges, fächerübergreifendes Bildungssystem in der beruflichen Bildung mit internationalen Partnerschaften.",
    },
    body: {
      vi: `VIỆT ĐỨC GROUP là hệ thống giáo dục đa cấp, đa ngành, hoạt động trong lĩnh vực đào tạo nghề, cao đẳng, trung cấp và liên kết quốc tế. Với sứ mệnh "Kiến tạo tri thức – Dẫn lối tương lai", chúng tôi cam kết mang đến môi trường học tập hiện đại, gắn kết thực tiễn, giúp người học phát triển toàn diện và sẵn sàng hội nhập thị trường lao động toàn cầu.

## Quá trình hình thành và phát triển

- **2008** – Khởi đầu với các cơ sở đào tạo nghề chất lượng cao.
- **2013** – Mở rộng hệ thống, đa dạng ngành đào tạo.
- **2018** – Hợp tác quốc tế, nâng tầm chất lượng đào tạo.
- **Hiện tại** – Phát triển bền vững, khẳng định thương hiệu trong lĩnh vực giáo dục nghề nghiệp.

## Giá trị cốt lõi

- **Chất lượng** – Đào tạo thực chất, chú trọng thực hành và kỹ năng nghề.
- **Sáng tạo** – Không ngừng đổi mới chương trình thực tiễn và phương pháp giảng dạy.
- **Hợp tác** – Gắn kết doanh nghiệp, đồng hành cùng người học.
- **Nhân văn** – Phát triển con người toàn diện, sống có trách nhiệm.
- **Hội nhập** – Hướng đến chuẩn quốc tế, mở rộng cơ hội toàn cầu cho người học.

## Ba trụ cột hoạt động

Việt Đức Group là tập đoàn hoạt động đa ngành, lấy **giáo dục, đầu tư và du lịch** làm ba trụ cột phát triển chiến lược. Trong lĩnh vực giáo dục, tập đoàn sở hữu và vận hành hệ thống sáu trường trung cấp, cao đẳng và một viện đào tạo tại CHLB Đức.`,
      en: `VIET DUC GROUP is a multi-level, multi-field education system operating at college, vocational college and intermediate levels, and maintaining international partnerships. With the mission "Creating knowledge – shaping the future", we are committed to building a modern, practical and effective learning environment that contributes to the all-round development of individuals and their integration into the labour market.

## Formation and development journey

- **2008** – Established various colleges and vocational schools.
- **2013** – Opened the system and expanded training programmes.
- **2018** – Expanded international partnerships, upgraded facilities and teaching quality.
- **Present** – Continuously innovating and enhancing training quality as a leading education system.

## Core values

- **Quality** – Delivering practical training and solid professional skills.
- **Creativity** – Encouraging innovative thinking and constantly improving teaching.
- **Collaboration** – Connecting businesses, creating opportunities for learners.
- **Humanity** – Developing individuals comprehensively, with empathy.
- **Integration** – Pursuing international standards and expanding global opportunities.

## Three strategic pillars

Viet Duc Group is a multi-sector corporation built on three strategic pillars: **education, investment and tourism**. In education it owns and operates a system of six intermediate and college-level schools plus a training institute in Germany.`,
      de: `Die VIET DUC GROUP ist ein mehrstufiges, fächerübergreifendes Bildungssystem auf College-, Berufsfachschul- und Fachschulniveau mit internationalen Partnerschaften. Unter dem Leitsatz „Wissen schaffen – die Zukunft weisen" schaffen wir eine moderne, praxisnahe Lernumgebung, die zur umfassenden Entwicklung der Lernenden und zu ihrer Integration in den Arbeitsmarkt beiträgt.

## Entstehung und Entwicklung

- **2008** – Gründung mehrerer Colleges und Berufsschulen.
- **2013** – Ausbau des Verbunds und Erweiterung der Ausbildungsprogramme.
- **2018** – Ausbau internationaler Partnerschaften, bessere Ausstattung und Lehrqualität.
- **Heute** – Fortlaufende Weiterentwicklung als führendes Bildungssystem.

## Grundwerte

- **Qualität** – Praxisnahe Ausbildung und solide berufliche Fertigkeiten.
- **Kreativität** – Innovatives Denken und stetige Verbesserung der Lehre.
- **Zusammenarbeit** – Verbindung zu Unternehmen, Chancen für Lernende.
- **Menschlichkeit** – Umfassende Persönlichkeitsentwicklung mit Empathie.
- **Integration** – Internationale Standards und globale Perspektiven.

## Drei strategische Säulen

Die Viet Duc Group ist ein branchenübergreifender Verbund mit drei strategischen Säulen: **Bildung, Investition und Tourismus**. Im Bildungsbereich betreibt sie sechs Schulen sowie ein Ausbildungsinstitut in Deutschland.`,
    },
  },
  {
    slug: "tam-nhin-su-menh",
    title: { vi: "Tầm nhìn & Sứ mệnh", en: "Vision & mission", de: "Vision & Mission" },
    body: {
      vi: `## Tầm nhìn

Trở thành hệ thống giáo dục nghề nghiệp uy tín hàng đầu Việt Nam, đạt chuẩn quốc tế, là lựa chọn tin cậy của người học và đối tác.

## Sứ mệnh

Mang đến chương trình đào tạo chất lượng cao, gắn kết thực tiễn, tạo cơ hội học tập và việc làm, góp phần phát triển nguồn nhân lực và xã hội.

## Cam kết với người học

- Đào tạo gắn liền thực tiễn.
- Hỗ trợ thực tập tại doanh nghiệp.
- Kết nối việc làm sau tốt nghiệp.
- Đồng hành cùng sinh viên trong sự nghiệp.

> "Không chỉ đào tạo nghề nghiệp, chúng tôi đồng hành cùng hành trình phát triển tương lai của người học."`,
      en: `## Vision

To become a leading multi-field education system in Vietnam, meeting international standards and developing high-quality human resources.

## Mission

To provide high-quality, practical training programmes that help learners build solid careers and contribute to the sustainable development of the country.

## Our commitment to learners

- Practical training closely linked to real work.
- Support for internships in partner businesses.
- Connecting graduates to employment.
- Accompanying students throughout their careers.

> "We do not only train professionals, we accompany the journey to shape a brighter future for learners."`,
      de: `## Vision

Ein führendes, fächerübergreifendes Bildungssystem in Vietnam nach internationalen Standards zu werden.

## Mission

Hochwertige, praxisnahe Ausbildungsprogramme anzubieten, die Lernenden tragfähige Berufswege eröffnen und zur nachhaltigen Entwicklung des Landes beitragen.

## Unser Versprechen

- Praxisnahe Ausbildung mit Bezug zur realen Arbeit.
- Unterstützung bei Praktika in Partnerunternehmen.
- Vermittlung in Beschäftigung nach dem Abschluss.
- Begleitung der Lernenden auf ihrem Berufsweg.

> „Wir bilden nicht nur aus – wir begleiten den Weg in eine bessere Zukunft."`,
    },
  },
  {
    slug: "chinh-sach-bao-mat",
    title: { vi: "Chính sách bảo mật", en: "Privacy policy", de: "Datenschutzerklärung" },
    body: {
      vi: `Chính sách này mô tả chính xác những gì website vietducgroup xử lý. Nếu một mục ghi "[CẦN BỔ SUNG]", tổ chức phải điền thông tin thật trước khi đưa website vào vận hành chính thức.

## 1. Đơn vị chịu trách nhiệm

Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức — Tòa nhà Việt Đức Group, 129 Trần Phú, Hà Nội. Email: info@vietducgroup.com.vn.

Người phụ trách bảo vệ dữ liệu: [CẦN BỔ SUNG].

## 2. Dữ liệu chúng tôi thu thập

**Khi bạn gửi form đăng ký tư vấn:** họ tên, số điện thoại, email, WhatsApp hoặc Zalo (tuỳ bạn cung cấp), lĩnh vực và chương trình quan tâm, trình độ hiện tại, mục tiêu học tập, hình thức và thời gian mong muốn, câu hỏi bạn nhập, ngôn ngữ giao diện, thời điểm gửi và nội dung điều khoản bạn đã đồng ý.

**Khi bạn trò chuyện với trợ lý tư vấn:** nội dung câu hỏi và câu trả lời trong phiên, để cải thiện chất lượng tài liệu. Chúng tôi không lưu thông tin liên hệ của bạn từ hội thoại trừ khi bạn chủ động điền form và tích ô đồng ý.

**Khi bạn tìm kiếm:** từ khoá tìm kiếm và số kết quả, ở dạng thống kê. Không gắn với danh tính của bạn.

**Nhật ký máy chủ:** địa chỉ IP được dùng tạm thời trong bộ nhớ để giới hạn tần suất gửi (chống spam) và không được ghi ra file nhật ký.

## 3. Chúng tôi KHÔNG làm gì

- Không cài Google Analytics, pixel quảng cáo hay bất kỳ công cụ theo dõi bên thứ ba nào.
- Không bán, cho thuê hay chia sẻ dữ liệu của bạn cho bên thứ ba vì mục đích tiếp thị.
- Không ghi thông tin cá nhân vào nhật ký máy chủ hay console trình duyệt.
- Không yêu cầu giấy tờ tùy thân, hồ sơ sức khỏe hay tài liệu cá nhân nhạy cảm ở bước tư vấn đầu tiên.

## 4. Cơ sở pháp lý và mục đích

Dữ liệu liên hệ được xử lý trên cơ sở **sự đồng ý của bạn** (Điều 6(1)(a) GDPR đối với người dùng tại EU), nhằm mục đích duy nhất là tư vấn tuyển sinh. Bạn có thể rút lại sự đồng ý bất cứ lúc nào.

## 5. Thời gian lưu trữ

Thông tin đăng ký tư vấn được lưu tối đa **24 tháng** kể từ lần liên hệ cuối, sau đó bị xoá. Nội dung hội thoại với trợ lý được lưu tối đa **12 tháng**.

## 6. Bên thứ ba

Nếu quản trị viên bật trợ lý AI, câu hỏi của bạn cùng các đoạn tài liệu liên quan sẽ được gửi tới nhà cung cấp mô hình ngôn ngữ đang được cấu hình để sinh câu trả lời. Thông tin liên hệ của bạn **không** được gửi kèm. Nhà cung cấp đang sử dụng được công bố tại trang này: [CẦN BỔ SUNG khi kích hoạt].

## 7. Quyền của bạn

Bạn có quyền yêu cầu truy cập, chỉnh sửa, xoá, hạn chế xử lý, phản đối xử lý và nhận bản sao dữ liệu của mình. Gửi yêu cầu tới info@vietducgroup.com.vn; chúng tôi phản hồi trong vòng 30 ngày. Người dùng tại EU có quyền khiếu nại lên cơ quan bảo vệ dữ liệu có thẩm quyền.

## 8. Cookie

Xem trang Chính sách cookie.`,
      en: `This policy describes exactly what the Viet Duc Group website processes. Where an item reads "[CẦN BỔ SUNG]" the organisation must supply the real information before the site goes into full operation.

## 1. Controller

Viet Duc International Investment and Education Group Joint Stock Company — Viet Duc Group Building, 129 Tran Phu, Hanoi. Email: info@vietducgroup.com.vn. Data protection contact: [CẦN BỔ SUNG].

## 2. Data we collect

**When you submit the advice form:** name, phone, email, WhatsApp or Zalo (whichever you give), field and programme of interest, current level, learning goal, preferred mode and start window, the question you type, interface language, submission time and the consent text you accepted.

**When you use the advisor:** the questions and answers within the session, so we can improve our documents. Contact details are stored only if you fill in the form and tick the consent box.

**When you search:** the query and the number of results, as statistics not linked to your identity.

**Server side:** your IP address is held in memory only, to rate-limit submissions, and is not written to any log file.

## 3. What we do NOT do

- No Google Analytics, advertising pixels or any third-party tracking.
- We do not sell, rent or share your data with third parties for marketing.
- We do not write personal data into server logs or the browser console.
- We do not ask for identity papers, health records or other sensitive documents at the first advice stage.

## 4. Legal basis and purpose

Contact data is processed on the basis of **your consent** (Art. 6(1)(a) GDPR for users in the EU), solely for admissions advice. You may withdraw consent at any time.

## 5. Retention

Advice requests are kept for at most **24 months** after the last contact, then deleted. Advisor conversations are kept for at most **12 months**.

## 6. Third parties

If an administrator enables the AI advisor, your question and the relevant document passages are sent to the configured language-model provider to generate an answer. Your contact details are **not** sent. The provider in use is published here: [CẦN BỔ SUNG once enabled].

## 7. Your rights

You may request access, rectification, erasure, restriction, objection and a copy of your data. Write to info@vietducgroup.com.vn; we respond within 30 days. Users in the EU may lodge a complaint with their supervisory authority.

## 8. Cookies

See the cookie policy page.`,
      de: `Diese Erklärung beschreibt genau, was die Website der Viet Duc Group verarbeitet. Wo „[CẦN BỔ SUNG]" steht, muss die Organisation vor dem Regelbetrieb die tatsächlichen Angaben ergänzen.

## 1. Verantwortliche Stelle

Viet Duc International Investment and Education Group JSC — Viet Duc Group Building, 129 Tran Phu, Hanoi. E-Mail: info@vietducgroup.com.vn. Datenschutzkontakt: [CẦN BỔ SUNG].

## 2. Erhobene Daten

**Beratungsformular:** Name, Telefon, E-Mail, WhatsApp oder Zalo (nach Ihrer Angabe), Fachgebiet und gewünschtes Programm, aktuelles Niveau, Lernziel, gewünschte Lernform und Startzeitpunkt, Ihre Frage, Sprache der Oberfläche, Zeitpunkt der Übermittlung sowie der Einwilligungstext.

**KI-Assistent:** Fragen und Antworten innerhalb der Sitzung, zur Verbesserung unserer Unterlagen. Kontaktdaten werden nur gespeichert, wenn Sie das Formular ausfüllen und einwilligen.

**Suche:** Suchbegriff und Trefferzahl als Statistik, ohne Personenbezug.

**Serverseitig:** Ihre IP-Adresse wird nur im Arbeitsspeicher zur Begrenzung der Anfragefrequenz gehalten und in keine Logdatei geschrieben.

## 3. Was wir NICHT tun

- Kein Google Analytics, keine Werbe-Pixel, kein Tracking Dritter.
- Kein Verkauf, keine Vermietung, keine Weitergabe zu Marketingzwecken.
- Keine personenbezogenen Daten in Serverlogs oder der Browser-Konsole.
- Keine Ausweispapiere, Gesundheitsdaten oder sensiblen Dokumente in der Erstberatung.

## 4. Rechtsgrundlage und Zweck

Kontaktdaten werden auf Grundlage **Ihrer Einwilligung** (Art. 6 Abs. 1 lit. a DSGVO) ausschließlich zur Bildungsberatung verarbeitet. Sie können die Einwilligung jederzeit widerrufen.

## 5. Speicherdauer

Beratungsanfragen: höchstens **24 Monate** nach dem letzten Kontakt. Assistenten-Verläufe: höchstens **12 Monate**.

## 6. Dritte

Ist der KI-Assistent aktiviert, werden Ihre Frage und die passenden Dokumentauszüge an den konfigurierten Sprachmodellanbieter übermittelt. Ihre Kontaktdaten werden **nicht** übermittelt. Der eingesetzte Anbieter wird hier genannt: [CẦN BỔ SUNG nach Aktivierung].

## 7. Ihre Rechte

Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit. Anfragen an info@vietducgroup.com.vn; Antwort binnen 30 Tagen. Beschwerderecht bei der zuständigen Aufsichtsbehörde.

## 8. Cookies

Siehe die Cookie-Richtlinie.`,
    },
  },
  {
    slug: "chinh-sach-cookie",
    title: { vi: "Chính sách cookie", en: "Cookie policy", de: "Cookie-Richtlinie" },
    body: {
      vi: `Website này chỉ đặt cookie và lưu trữ cục bộ ở mức **kỹ thuật, cần thiết**. Không có cookie phân tích, quảng cáo hay theo dõi hành vi, nên không cần cơ chế xin phép trước khi tải trang.

## Danh sách đầy đủ

- **vdg_locale** (cookie, 1 năm) – ghi nhớ ngôn ngữ bạn chọn.
- **vdg_theme** (localStorage) – ghi nhớ bạn chọn giao diện sáng hay tối. Khi bạn để ở chế độ “theo hệ thống”, mục này không được lưu.
- **vdg_session** (cookie, 7 ngày, HttpOnly) – chỉ đặt khi biên tập viên đăng nhập trang quản trị. Người dùng thông thường không bao giờ nhận cookie này.
- **vdg_cookie_notice** (localStorage) – ghi nhớ rằng bạn đã đọc thông báo này.
- **vdg_saved_programs** (localStorage) – danh sách chương trình bạn bấm lưu. Chỉ nằm trên trình duyệt của bạn, không gửi về máy chủ.
- **vdg_recent_programs** (localStorage) – các chương trình bạn vừa xem, dùng để hiển thị mục "Vừa xem".
- **vdg_compare** (localStorage) – các chương trình bạn chọn để so sánh.
- **vdg_advisor_session** (sessionStorage) – mã phiên hội thoại với trợ lý, xoá khi bạn đóng tab.

## Cách xoá

Xoá dữ liệu website trong trình duyệt sẽ xoá toàn bộ các mục trên. Nút "Xoá hội thoại" trong trợ lý xoá riêng lịch sử trò chuyện.

## Nếu sau này bật công cụ đo lường

Nếu tổ chức quyết định bổ sung công cụ phân tích, website sẽ hiển thị hộp xin phép trước khi tải bất kỳ mã bên thứ ba nào, và trang này sẽ được cập nhật.`,
      en: `This website sets only **strictly necessary technical** cookies and local storage. There are no analytics, advertising or behavioural tracking cookies, so no prior-consent banner is required to load the page.

## The complete list

- **vdg_locale** (cookie, 1 year) – remembers your chosen language.
- **vdg_theme** (localStorage) – remembers whether you chose the light or dark appearance. Nothing is stored while you leave it on “system”.
- **vdg_session** (cookie, 7 days, HttpOnly) – set only when an editor signs in to the admin area. Ordinary visitors never receive it.
- **vdg_cookie_notice** (localStorage) – remembers that you read this notice.
- **vdg_saved_programs** (localStorage) – programmes you saved. Stays in your browser, never sent to the server.
- **vdg_recent_programs** (localStorage) – programmes you recently viewed, for the "recently viewed" list.
- **vdg_compare** (localStorage) – programmes selected for comparison.
- **vdg_advisor_session** (sessionStorage) – the advisor conversation id, cleared when you close the tab.

## How to remove them

Clearing site data in your browser removes all of the above. The advisor's "clear conversation" button removes the chat history on its own.

## If measurement tools are added later

Should the organisation add analytics, the site will show a consent dialog before loading any third-party code, and this page will be updated.`,
      de: `Diese Website setzt ausschließlich **technisch notwendige** Cookies und lokalen Speicher. Es gibt keine Analyse-, Werbe- oder Tracking-Cookies, daher ist kein vorheriges Einwilligungsbanner erforderlich.

## Vollständige Liste

- **vdg_locale** (Cookie, 1 Jahr) – merkt sich Ihre Sprachwahl.
- **vdg_theme** (localStorage) – merkt sich, ob Sie helle oder dunkle Darstellung gewählt haben. Bei „Systemeinstellung“ wird nichts gespeichert.
- **vdg_session** (Cookie, 7 Tage, HttpOnly) – nur bei Anmeldung im Redaktionsbereich. Normale Besucher erhalten ihn nie.
- **vdg_cookie_notice** (localStorage) – merkt sich, dass Sie diesen Hinweis gelesen haben.
- **vdg_saved_programs** (localStorage) – gemerkte Programme, nur im Browser.
- **vdg_recent_programs** (localStorage) – zuletzt angesehene Programme.
- **vdg_compare** (localStorage) – zum Vergleich ausgewählte Programme.
- **vdg_advisor_session** (sessionStorage) – Sitzungs-ID des Assistenten, beim Schließen des Tabs gelöscht.

## Entfernen

Das Löschen der Website-Daten im Browser entfernt alle genannten Einträge.

## Falls später Messwerkzeuge hinzukommen

Sollten Analysewerkzeuge ergänzt werden, erscheint vor dem Laden von Drittanbieter-Code ein Einwilligungsdialog und diese Seite wird aktualisiert.`,
    },
  },
  {
    slug: "dieu-khoan-su-dung",
    title: { vi: "Điều khoản sử dụng", en: "Terms of use", de: "Nutzungsbedingungen" },
    body: {
      vi: `## 1. Phạm vi

Điều khoản này áp dụng cho việc truy cập và sử dụng website của Việt Đức Group.

## 2. Giá trị của thông tin trên website

Nội dung website được biên tập từ hồ sơ năng lực và các giấy tờ pháp lý của Việt Đức Group và các trường thành viên. Thông tin về ngành nghề, mã ngành và quy mô tuyển sinh được trích từ giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp có ghi rõ số hiệu và ngày cấp.

Thông tin trên website mang tính tham khảo. **Thông báo tuyển sinh, học phí và điều kiện nhập học chính thức do phòng tuyển sinh của trường thành viên ban hành** và có giá trị cao hơn nội dung hiển thị tại đây.

## 3. Trợ lý tư vấn

Trợ lý tư vấn trả lời dựa trên tài liệu đã được biên tập viên duyệt và luôn kèm nguồn. Trợ lý không đưa ra kết luận về điều kiện trúng tuyển, không cam kết việc làm và không thay thế tư vấn viên. Khi không tìm thấy thông tin trong tài liệu, trợ lý sẽ nói rõ điều đó.

## 4. Sở hữu trí tuệ

Logo, hình ảnh và nội dung trên website thuộc về Việt Đức Group và các trường thành viên, trừ khi có ghi chú khác. Không sao chép cho mục đích thương mại nếu chưa có sự đồng ý bằng văn bản.

## 5. Liên kết ngoài

Website có liên kết tới trang của trường thành viên và đối tác. Chúng tôi không chịu trách nhiệm về nội dung của các trang đó.

## 6. Thay đổi

Điều khoản có thể được cập nhật. Ngày cập nhật gần nhất hiển thị ở cuối trang.`,
      en: `## 1. Scope

These terms apply to access to and use of the Viet Duc Group website.

## 2. Status of the information

Content is edited from the capability profile and the legal documents of Viet Duc Group and its member schools. Occupation names, official codes and intake quotas are transcribed from vocational-education registration certificates whose number and date of issue are shown.

Information here is for reference. **Official admission notices, tuition and entry requirements are issued by the admissions office of the member school** and take precedence over anything displayed here.

## 3. The advisor

The advisor answers from documents approved by an editor and always cites its source. It does not decide eligibility, does not promise employment and does not replace a human counsellor. When it cannot find the information, it says so.

## 4. Intellectual property

Logos, images and content belong to Viet Duc Group and its member schools unless stated otherwise. No commercial reproduction without written permission.

## 5. External links

The site links to member schools and partners. We are not responsible for the content of those sites.

## 6. Changes

These terms may be updated. The last update date is shown at the bottom of the page.`,
      de: `## 1. Geltungsbereich

Diese Bedingungen gelten für den Zugriff auf und die Nutzung der Website der Viet Duc Group.

## 2. Status der Informationen

Die Inhalte stammen aus dem Leistungsprofil und den Rechtsdokumenten der Viet Duc Group und ihrer Mitgliedsschulen. Berufsbezeichnungen, amtliche Codes und Aufnahmekapazitäten sind aus den Zulassungsbescheiden übernommen, deren Nummer und Datum angegeben sind.

Die Angaben dienen der Orientierung. **Verbindliche Zulassungsbescheide, Gebühren und Zugangsvoraussetzungen erlässt das Zulassungsbüro der jeweiligen Schule** und gehen den hier gezeigten Angaben vor.

## 3. Der Assistent

Der Assistent antwortet aus freigegebenen Dokumenten und nennt stets seine Quelle. Er entscheidet nicht über die Zulassung, verspricht keine Beschäftigung und ersetzt keine persönliche Beratung. Findet er nichts, sagt er das ausdrücklich.

## 4. Urheberrecht

Logos, Bilder und Inhalte gehören der Viet Duc Group und ihren Mitgliedsschulen, sofern nicht anders angegeben. Keine kommerzielle Vervielfältigung ohne schriftliche Zustimmung.

## 5. Externe Links

Die Website verlinkt auf Mitgliedsschulen und Partner. Für deren Inhalte übernehmen wir keine Verantwortung.

## 6. Änderungen

Diese Bedingungen können aktualisiert werden. Das Datum der letzten Änderung steht am Seitenende.`,
    },
  },
  {
    slug: "impressum",
    title: { vi: "Impressum", en: "Imprint", de: "Impressum" },
    body: {
      vi: `Trang này dành cho người dùng tại CHLB Đức và châu Âu theo yêu cầu của §5 DDG (Đức).

## Đơn vị vận hành website

Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức
Tòa nhà Việt Đức Group, 129 Trần Phú, Hà Nội, Việt Nam
Email: info@vietducgroup.com.vn
Điện thoại: 024 3 123 6868

## Các mục còn thiếu

Những thông tin sau bắt buộc phải có trong Impressum theo luật Đức và **chưa có trong tài liệu nào của dự án**. Quản trị viên phải bổ sung tại trang quản trị trước khi công bố website cho người dùng tại Đức:

- Người đại diện theo pháp luật (Vertretungsberechtigte Person): **[CẦN BỔ SUNG]**
- Mã số doanh nghiệp / số đăng ký kinh doanh: **[CẦN BỔ SUNG]**
- Mã số thuế GTGT (USt-IdNr., nếu có hoạt động tại EU): **[CẦN BỔ SUNG]**
- Người chịu trách nhiệm nội dung (V.i.S.d.P.): **[CẦN BỔ SUNG]**

## Đối tác tại CHLB Đức

itw – Institut für Aus- und Weiterbildung gGmbH, Berlin, là đơn vị đối tác đào tạo tại Đức. Thông tin pháp lý riêng của itw Berlin do đơn vị này công bố trên website của họ.`,
      en: `This page addresses the German §5 DDG imprint requirement for visitors in Germany and the EU.

## Website operator

Viet Duc International Investment and Education Group Joint Stock Company
Viet Duc Group Building, 129 Tran Phu, Hanoi, Vietnam
Email: info@vietducgroup.com.vn
Phone: +84 24 3 123 6868

## Still missing

German law requires the following, and **no project document contains them**. An administrator must supply them in the admin area before the site is published to visitors in Germany:

- Legal representative: **[CẦN BỔ SUNG]**
- Company / commercial register number: **[CẦN BỔ SUNG]**
- VAT identification number (if operating in the EU): **[CẦN BỔ SUNG]**
- Person responsible for content (V.i.S.d.P.): **[CẦN BỔ SUNG]**

## German partner

itw – Institut für Aus- und Weiterbildung gGmbH, Berlin, is the training partner in Germany. Its own legal notice is published on its website.`,
      de: `Diese Seite dient der Anbieterkennzeichnung nach §5 DDG für Besucherinnen und Besucher in Deutschland und der EU.

## Betreiber der Website

Viet Duc International Investment and Education Group JSC
Viet Duc Group Building, 129 Tran Phu, Hanoi, Vietnam
E-Mail: info@vietducgroup.com.vn
Telefon: +84 24 3 123 6868

## Noch zu ergänzen

Das deutsche Recht verlangt die folgenden Angaben; **in keinem Projektdokument sind sie enthalten**. Eine Administratorin muss sie im Redaktionsbereich ergänzen, bevor die Website in Deutschland veröffentlicht wird:

- Vertretungsberechtigte Person: **[CẦN BỔ SUNG]**
- Handels-/Unternehmensregisternummer: **[CẦN BỔ SUNG]**
- Umsatzsteuer-Identifikationsnummer (bei EU-Tätigkeit): **[CẦN BỔ SUNG]**
- Verantwortlich für den Inhalt (V.i.S.d.P.): **[CẦN BỔ SUNG]**

## Partner in Deutschland

itw – Institut für Aus- und Weiterbildung gGmbH, Berlin, ist der Ausbildungspartner in Deutschland. Das eigene Impressum des itw wird auf dessen Website veröffentlicht.`,
    },
  },
];
