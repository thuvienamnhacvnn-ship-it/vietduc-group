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
    title: { vi: "Giới thiệu", en: "About us", de: "Über uns", ja: "会社案内", ko: "그룹 소개", "zh-TW": "關於我們" },
    seoDescription: {
      vi: "Việt Đức Group là hệ thống giáo dục đa cấp, đa ngành hoạt động trong lĩnh vực đào tạo nghề, cao đẳng, trung cấp và liên kết quốc tế.",
      en: "Viet Duc Group is a multi-level, multi-field education system operating in vocational, college and intermediate training with international partnerships.",
      de: "Die Viet Duc Group ist ein mehrstufiges, fächerübergreifendes Bildungssystem in der beruflichen Bildung mit internationalen Partnerschaften.",
      ja: "Viet Duc Group は、職業訓練・短期大学・中級課程および国際連携を手がける多段階・多分野の教育体系です。",
      ko: "Viet Duc Group은 직업훈련·전문대·중급 과정과 국제 협력을 아우르는 다단계·다분야 교육 체계입니다.",
      "zh-TW": "Viet Duc Group 是涵蓋職業訓練、專科、中級課程與國際合作的多層級、多領域教育體系。",
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

Việt Đức Group là tập đoàn hoạt động đa ngành, lấy **giáo dục, đầu tư và du lịch** làm ba trụ cột phát triển chiến lược. Trong lĩnh vực giáo dục, tập đoàn sở hữu và vận hành hệ thống bảy trường trung cấp, cao đẳng tại Việt Nam và một viện đào tạo tại CHLB Đức.`,
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

Viet Duc Group is a multi-sector corporation built on three strategic pillars: **education, investment and tourism**. In education it owns and operates seven intermediate and college-level schools in Vietnam plus a training institute in Germany.`,
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

Die Viet Duc Group ist ein branchenübergreifender Verbund mit drei strategischen Säulen: **Bildung, Investition und Tourismus**. Im Bildungsbereich betreibt sie sieben Schulen in Vietnam sowie ein Ausbildungsinstitut in Deutschland.`,
      ja: "VIET DUC GROUP は、職業訓練・短期大学・中級課程および国際連携を手がける多段階・多分野の教育体系です。「知を創り、未来を拓く」という使命のもと、現代的で実務に根ざした学びの場をつくり、学ぶ人が全人的に育ち、世界の労働市場に踏み出せるよう努めています。\n\n## 歩んできた道\n\n- **2008年** — 質の高い職業訓練機関の設立から始まりました。\n- **2013年** — 体系を広げ、教育分野を多様にしました。\n- **2018年** — 国際連携を進め、教育の質を高めました。\n- **現在** — 職業教育の分野で着実に歩み、名を築いています。\n\n## 大切にしていること\n\n- **質** — 中身のある教育。実習と職業技能を重んじます。\n- **創造** — 実務に即した課程と教え方を、絶えず新しくします。\n- **協働** — 企業と結び、学ぶ人と歩みをともにします。\n- **人間性** — 人を丸ごと育て、責任をもって生きられるように。\n- **国際性** — 国際水準を目指し、学ぶ人に世界への道を広げます。\n\n## 三つの柱\n\nViet Duc Group は多分野にわたる企業グループで、**教育・投資・観光**を三つの戦略的な柱としています。教育の分野では、ベトナム国内の七つの中級・短期大学課程の学校と、ドイツ連邦共和国に置く教育研究所を自ら所有し運営しています。",
      ko: "VIET DUC GROUP은 직업훈련과 전문대, 중급 과정 및 국제 협력을 아우르는 다단계·다분야 교육 체계입니다. \"지식을 세우고 미래를 연다\"는 사명 아래, 현대적이고 실무에 밀착한 배움의 자리를 마련하여 배우는 이가 온전히 성장하고 세계 노동시장으로 나아갈 수 있도록 힘쓰고 있습니다.\n\n## 지나온 길\n\n- **2008년** — 수준 높은 직업훈련 기관의 설립으로 출발했습니다.\n- **2013년** — 체계를 넓히고 교육 분야를 다양하게 했습니다.\n- **2018년** — 국제 협력을 넓히고 교육의 질을 높였습니다.\n- **현재** — 직업교육 분야에서 꾸준히 성장하며 이름을 쌓고 있습니다.\n\n## 우리가 지키는 가치\n\n- **품질** — 내실 있는 교육. 실습과 직업 기능을 중히 여깁니다.\n- **창의** — 실무에 맞는 과정과 가르치는 방법을 끊임없이 새롭게 합니다.\n- **협력** — 기업과 손잡고, 배우는 이와 함께 걷습니다.\n- **인간다움** — 사람을 온전히 길러 내고, 책임 있게 살아가도록 합니다.\n- **국제성** — 국제 수준을 지향하며 배우는 이에게 세계로 가는 길을 넓힙니다.\n\n## 세 개의 기둥\n\nViet Duc Group은 여러 분야에 걸친 기업 그룹으로 **교육, 투자, 관광**을 세 가지 전략적 기둥으로 삼습니다. 교육 분야에서는 베트남 내 일곱 개의 중급·전문대 학교와 독일 연방공화국에 둔 교육 연구원을 직접 소유하고 운영합니다.",
      "zh-TW": "VIET DUC GROUP 是涵蓋職業訓練、專科、中級課程與國際合作的多層級、多領域教育體系。秉持「創造知識，引領未來」的使命，我們致力打造貼近實務的現代化學習環境，協助學習者全面成長，走向全球勞動市場。\n\n## 一路走來\n\n- **2008 年** — 從設立優質的職業訓練機構起步。\n- **2013 年** — 擴展體系，豐富培訓領域。\n- **2018 年** — 拓展國際合作，提升培訓品質。\n- **現在** — 在技職教育領域穩健成長，樹立品牌。\n\n## 核心價值\n\n- **品質** — 扎實的教學，重視實作與職業技能。\n- **創新** — 不斷更新貼近實務的課程與教學方法。\n- **合作** — 與企業連結，與學習者同行。\n- **人文** — 培育完整的人，並使其負責任地生活。\n- **接軌國際** — 以國際標準為目標，為學習者開拓全球機會。\n\n## 三大支柱\n\nViet Duc Group 為多角化經營的企業集團，以**教育、投資與觀光**為三大策略支柱。在教育方面，集團自有並經營越南境內七所中級與專科學校，以及一所設於德意志聯邦共和國的教育學院。",
    },
  },
  {
    slug: "tam-nhin-su-menh",
    title: { vi: "Tầm nhìn & Sứ mệnh", en: "Vision & mission", de: "Vision & Mission", ja: "ビジョンと使命", ko: "비전과 사명", "zh-TW": "願景與使命" },
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
      ja: "## ビジョン\n\nベトナムで最も信頼される職業教育の体系となり、国際水準を満たし、学ぶ人と提携先に選ばれる存在であること。\n\n## 使命\n\n実務に根ざした質の高い教育課程を提供し、学びと就業の機会をつくり、人材と社会の発展に寄与すること。\n\n## 学ぶ人への約束\n\n- 実務に結びついた教育を行います。\n- 企業での実習を支えます。\n- 修了後の就職につなぎます。\n- 職業人生のあいだ、ともに歩みます。\n\n> 「私たちは職業を教えるだけではありません。学ぶ人が未来を築いていく道のりに、ともに寄り添います。」",
      ko: "## 비전\n\n베트남에서 가장 신뢰받는 직업교육 체계로서 국제 수준을 갖추고, 배우는 이와 협력사가 믿고 선택하는 곳이 되는 것.\n\n## 사명\n\n실무에 밀착한 수준 높은 교육 과정을 제공하고 배움과 일자리의 기회를 만들어, 인재와 사회의 발전에 이바지하는 것.\n\n## 배우는 이에게 드리는 약속\n\n- 실무와 이어진 교육을 합니다.\n- 기업 현장 실습을 지원합니다.\n- 졸업 후 취업으로 이어 드립니다.\n- 직업 인생 내내 함께 걷습니다.\n\n> \"우리는 직업을 가르치는 데서 그치지 않습니다. 배우는 이가 미래를 만들어 가는 길에 함께합니다.\"",
      "zh-TW": "## 願景\n\n成為越南最具公信力的技職教育體系，達到國際標準，成為學習者與夥伴信賴的選擇。\n\n## 使命\n\n提供貼近實務的高品質培訓課程，創造學習與就業機會，為人才培育與社會發展盡一份力。\n\n## 對學習者的承諾\n\n- 教學緊扣實務。\n- 協助安排企業實習。\n- 銜接畢業後的就業。\n- 在職涯路上長期同行。\n\n> 「我們不只教一門職業，更陪伴學習者走完打造未來的整段路。」",
    },
  },
  {
    slug: "chinh-sach-bao-mat",
    title: { vi: "Chính sách bảo mật", en: "Privacy policy", de: "Datenschutzerklärung", ja: "プライバシーポリシー", ko: "개인정보 처리방침", "zh-TW": "隱私權政策" },
    body: {
      vi: `Chính sách này mô tả chính xác những gì website vietducgroup xử lý. Nếu một mục ghi "[CẦN BỔ SUNG]", tổ chức phải điền thông tin thật trước khi đưa website vào vận hành chính thức.

## 1. Đơn vị chịu trách nhiệm

Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức — Tầng 4, Toà nhà Rainbow, số 79 Đường 19/5, KĐTM Văn Quán, Phường Hà Đông, Thành phố Hà Nội, Việt Nam. Email: info@vietducgroup.com.vn.

Đầu mối về dữ liệu cá nhân: mọi yêu cầu xin gửi tới info@vietducgroup.com.vn hoặc 024 3 123 6868. Công ty chưa bổ nhiệm một cán bộ bảo vệ dữ liệu riêng.

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

Viet Duc International Investment and Education Group Joint Stock Company — 4th Floor, Rainbow Building, No. 79, 19/5 Street, Van Quan New Urban Area, Ha Dong Ward, Hanoi, Vietnam. Email: info@vietducgroup.com.vn. Data protection contact: write to info@vietducgroup.com.vn or call +84 24 3 123 6868. The company has not appointed a separate data protection officer.

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

Viet Duc International Investment and Education Group JSC — 4th Floor, Rainbow Building, No. 79, 19/5 Street, Van Quan New Urban Area, Ha Dong Ward, Hanoi, Vietnam. E-Mail: info@vietducgroup.com.vn. Datenschutzkontakt: info@vietducgroup.com.vn oder +84 24 3 123 6868. Ein eigener Datenschutzbeauftragter ist nicht bestellt.

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
      ja: "このポリシーは、vietducgroup のウェブサイトが実際に何を扱っているかをそのまま記したものです。「[CẦN BỔ SUNG]」とある項目は、正式運用の前に組織が本当の情報を記入する必要があります。\n\n## 1. 管理する主体\n\nベトドゥック国際投資教育グループ株式会社 — ハノイ市チャンフー通り129番地、Viet Duc Group ビル。メール：info@vietducgroup.com.vn。\n\nデータ保護責任者：[CẦN BỔ SUNG]。\n\n## 2. お預かりする情報\n\n**相談申込フォームを送信されたとき：** お名前、電話番号、メールアドレス、WhatsApp または Zalo(ご記入いただいたもの)、関心のある分野と課程、現在の学歴、学習の目的、希望する受講形態と時期、ご記入の質問、画面の言語、送信の日時、そして同意いただいた条項の内容。\n\n**アドバイザーとお話しされたとき：** その回のやり取りの内容を、資料の質を高めるために保管します。フォームに記入して同意欄にチェックされない限り、会話からご連絡先を保管することはありません。\n\n**検索されたとき：** 検索語と結果件数を、統計としてのみ。個人と結びつけることはありません。\n\n**サーバーの記録：** IP アドレスは送信の頻度を抑える(迷惑送信を防ぐ)ためにメモリ上で一時的に用いるだけで、記録ファイルには書き出しません。\n\n## 3. 行わないこと\n\n- Google Analytics、広告ピクセル、その他いかなる第三者の追跡ツールも設置しません。\n- 営業目的でお客様のデータを売る、貸す、第三者と共有することはしません。\n- 個人情報をサーバーの記録やブラウザーのコンソールに書き出しません。\n- 最初の相談段階で、身分証明書、健康記録、その他の機微な書類をお求めすることはありません。\n\n## 4. 法的根拠と目的\n\nご連絡先は**お客様の同意**にもとづいて扱い(EU域内の利用者については GDPR 第6条1項(a))、その目的は入学相談に限られます。同意はいつでも撤回できます。\n\n## 5. 保管期間\n\n相談のお申し込みは、最後のご連絡から最長**24か月**保管し、その後は削除します。アドバイザーとの会話は最長**12か月**です。\n\n## 6. 第三者\n\n管理者が AI アドバイザーを有効にしている場合、ご質問と関連する資料の抜粋が、設定された言語モデルの提供者へ回答生成のために送られます。ご連絡先は**送られません**。利用中の提供者はこのページに公表します：[有効にした時点で CẦN BỔ SUNG]。\n\n## 7. お客様の権利\n\nご自身のデータについて、開示・訂正・削除・利用制限・異議申立て、および写しの交付を求めることができます。info@vietducgroup.com.vn 宛にご請求ください。30日以内に回答します。EU域内の利用者は、所管の個人情報保護機関へ申し立てる権利があります。\n\n## 8. Cookie\n\nCookie ポリシーのページをご覧ください。",
      ko: "이 방침은 vietducgroup 웹사이트가 실제로 무엇을 처리하는지 그대로 적은 것입니다. \"[CẦN BỔ SUNG]\"이라고 적힌 항목은 정식 운영 전에 조직이 실제 정보를 채워 넣어야 합니다.\n\n## 1. 관리 주체\n\n베트득 국제투자교육그룹 주식회사 — 하노이 쩐푸 129번지 Viet Duc Group 빌딩. 이메일: info@vietducgroup.com.vn.\n\n개인정보 보호 담당자: [CẦN BỔ SUNG].\n\n## 2. 수집하는 정보\n\n**상담 신청 양식을 보내실 때:** 이름, 전화번호, 이메일, WhatsApp 또는 Zalo(적어 주신 것), 관심 분야와 과정, 현재 학력, 학습 목표, 원하시는 수업 방식과 시기, 적어 주신 질문, 화면 언어, 보낸 시각, 그리고 동의하신 약관의 내용.\n\n**상담 도우미와 대화하실 때:** 그 회차의 문답 내용을 자료의 질을 높이기 위해 보관합니다. 양식을 작성하고 동의란에 표시하지 않는 한, 대화에서 연락처를 보관하지 않습니다.\n\n**검색하실 때:** 검색어와 결과 수를 통계로만 남기며, 신원과 연결하지 않습니다.\n\n**서버 기록:** IP 주소는 전송 빈도를 제한(스팸 방지)하기 위해 메모리에서만 잠시 쓰이며, 기록 파일에 남기지 않습니다.\n\n## 3. 하지 않는 일\n\n- Google Analytics, 광고 픽셀, 그 밖의 어떤 제삼자 추적 도구도 설치하지 않습니다.\n- 마케팅 목적으로 데이터를 팔거나 빌려주거나 제삼자와 공유하지 않습니다.\n- 개인정보를 서버 기록이나 브라우저 콘솔에 남기지 않습니다.\n- 첫 상담 단계에서 신분증, 건강 기록, 그 밖의 민감한 서류를 요구하지 않습니다.\n\n## 4. 법적 근거와 목적\n\n연락처는 **본인의 동의**에 근거하여(EU 이용자는 GDPR 제6조 1항 (a)) 오직 입학 상담 목적으로만 처리합니다. 동의는 언제든지 철회하실 수 있습니다.\n\n## 5. 보관 기간\n\n상담 신청 정보는 마지막 연락일로부터 최대 **24개월** 보관한 뒤 삭제합니다. 상담 도우미와의 대화는 최대 **12개월**입니다.\n\n## 6. 제삼자\n\n관리자가 AI 상담 도우미를 켠 경우, 질문과 관련 자료 발췌가 설정된 언어 모델 제공자에게 답변 생성을 위해 전송됩니다. 연락처는 **전송되지 않습니다**. 사용 중인 제공자는 이 페이지에 공개합니다: [사용 시 CẦN BỔ SUNG].\n\n## 7. 이용자의 권리\n\n본인의 데이터에 대해 열람·정정·삭제·처리 제한·이의 제기 및 사본 제공을 요구하실 수 있습니다. info@vietducgroup.com.vn 으로 요청해 주시면 30일 안에 답변드립니다. EU 이용자는 관할 개인정보 감독기관에 진정할 권리가 있습니다.\n\n## 8. 쿠키\n\n쿠키 정책 페이지를 참고해 주세요.",
      "zh-TW": "本政策如實說明 vietducgroup 網站實際處理哪些資料。凡標示「[CẦN BỔ SUNG]」的項目，機構須於網站正式營運前填入真實資訊。\n\n## 1. 資料管理者\n\n越德國際投資與教育集團股份公司 — 河內市陳富路 129 號 Viet Duc Group 大樓。電子郵件：info@vietducgroup.com.vn。\n\n個人資料保護負責人：[CẦN BỔ SUNG]。\n\n## 2. 我們蒐集的資料\n\n**當您送出諮詢申請表時：** 姓名、電話、電子郵件、WhatsApp 或 Zalo（依您填寫者）、感興趣的領域與課程、目前學歷、學習目標、希望的上課方式與時間、您輸入的問題、介面語言、送出時間，以及您所同意的條款內容。\n\n**當您與輔導助理對話時：** 該次對話的問答內容，用以改善文件品質。除非您主動填寫表單並勾選同意，否則我們不會從對話中留存您的聯絡資訊。\n\n**當您使用搜尋時：** 僅以統計形式記錄關鍵字與結果筆數，不與您的身分連結。\n\n**伺服器紀錄：** IP 位址僅暫存於記憶體中，用於限制送出頻率（防止濫發），不會寫入任何紀錄檔。\n\n## 3. 我們不做的事\n\n- 不安裝 Google Analytics、廣告像素或任何第三方追蹤工具。\n- 不為行銷目的販售、出租或分享您的資料給第三方。\n- 不將個人資料寫入伺服器紀錄或瀏覽器主控台。\n- 在初次諮詢階段，不要求身分證件、健康紀錄或其他敏感文件。\n\n## 4. 法律依據與目的\n\n聯絡資料依**您的同意**處理（歐盟使用者適用 GDPR 第 6 條第 1 項 (a) 款），且僅用於招生諮詢。您可隨時撤回同意。\n\n## 5. 保存期限\n\n諮詢申請資料自最後一次聯繫起最多保存 **24 個月**，之後即刪除。與輔導助理的對話最多保存 **12 個月**。\n\n## 6. 第三方\n\n若管理者啟用 AI 輔導助理，您的問題與相關文件段落會傳送至所設定的語言模型服務商以產生回覆，您的**聯絡資料不會**一併傳送。使用中的服務商將公布於本頁：[啟用時 CẦN BỔ SUNG]。\n\n## 7. 您的權利\n\n您有權要求查閱、更正、刪除、限制處理、反對處理，並取得您資料的副本。請來信 info@vietducgroup.com.vn，我們將於 30 日內回覆。歐盟使用者有權向主管的資料保護機關提出申訴。\n\n## 8. Cookie\n\n請參閱 Cookie 政策頁面。",
    },
  },
  {
    slug: "chinh-sach-cookie",
    title: { vi: "Chính sách cookie", en: "Cookie policy", de: "Cookie-Richtlinie", ja: "Cookie ポリシー", ko: "쿠키 정책", "zh-TW": "Cookie 政策" },
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
      ja: "本サイトが置く Cookie とローカル保存は、**技術上どうしても必要なもの**だけです。分析用も広告用も行動追跡用もありませんので、ページを読み込む前に同意を求める仕組みは要りません。\n\n## すべての一覧\n\n- **vdg_locale**(Cookie、1年) — お選びの言語を覚えます。\n- **vdg_theme**(localStorage) — 明るい表示か暗い表示かを覚えます。「端末の設定に合わせる」のままなら何も保存しません。\n- **vdg_session**(Cookie、7日、HttpOnly) — 編集者が管理画面にログインしたときだけ置かれます。通常の閲覧者に渡ることはありません。\n- **vdg_cookie_notice**(localStorage) — このお知らせをお読みになったことを覚えます。\n- **vdg_saved_programs**(localStorage) — 保存された課程の一覧。お使いのブラウザーの中だけにあり、サーバーへは送られません。\n- **vdg_recent_programs**(localStorage) — 最近ご覧になった課程。「最近見た課程」の表示に使います。\n- **vdg_compare**(localStorage) — 比較のために選ばれた課程。\n- **vdg_advisor_session**(sessionStorage) — アドバイザーとの会話の識別子。タブを閉じると消えます。\n\n## 消し方\n\nブラウザーでサイトデータを消去すると、上のすべてが消えます。アドバイザーの「会話を消去」ボタンは、会話の履歴だけを消します。\n\n## 今後もし計測ツールを入れる場合\n\n組織が分析ツールを追加すると決めた場合は、第三者のコードを読み込む前に同意を求める画面を表示し、このページも書き改めます。",
      ko: "이 사이트가 두는 쿠키와 로컬 저장은 **기술적으로 꼭 필요한 것**뿐입니다. 분석용도, 광고용도, 행동 추적용도 없으므로 페이지를 불러오기 전에 동의를 받는 절차가 필요하지 않습니다.\n\n## 전체 목록\n\n- **vdg_locale**(쿠키, 1년) — 고르신 언어를 기억합니다.\n- **vdg_theme**(localStorage) — 밝은 화면인지 어두운 화면인지 기억합니다. '기기 설정에 따름'으로 두시면 아무것도 저장하지 않습니다.\n- **vdg_session**(쿠키, 7일, HttpOnly) — 편집자가 관리자 화면에 로그인할 때만 설정됩니다. 일반 방문자는 결코 받지 않습니다.\n- **vdg_cookie_notice**(localStorage) — 이 안내를 읽으셨다는 사실을 기억합니다.\n- **vdg_saved_programs**(localStorage) — 저장하신 과정 목록. 브라우저 안에만 있으며 서버로 보내지 않습니다.\n- **vdg_recent_programs**(localStorage) — 최근에 보신 과정. '최근 본 과정' 표시에 씁니다.\n- **vdg_compare**(localStorage) — 비교하려고 고르신 과정.\n- **vdg_advisor_session**(sessionStorage) — 상담 도우미와의 대화 식별자. 탭을 닫으면 사라집니다.\n\n## 지우는 방법\n\n브라우저에서 사이트 데이터를 지우면 위의 모든 항목이 함께 지워집니다. 상담 도우미의 '대화 지우기' 버튼은 대화 기록만 지웁니다.\n\n## 나중에 측정 도구를 넣게 된다면\n\n조직이 분석 도구를 추가하기로 정하면, 제삼자 코드를 불러오기 전에 동의 창을 띄우고 이 페이지도 갱신하겠습니다.",
      "zh-TW": "本網站僅使用**技術上必要**的 Cookie 與本機儲存，沒有分析、廣告或行為追蹤用途，因此不需要在載入頁面前徵求同意。\n\n## 完整清單\n\n- **vdg_locale**（Cookie，1 年）— 記住您選擇的語言。\n- **vdg_theme**（localStorage）— 記住您選擇淺色或深色外觀。維持「跟隨系統」時不會儲存任何內容。\n- **vdg_session**（Cookie，7 天，HttpOnly）— 僅在編輯者登入管理後台時設定，一般訪客絕不會取得。\n- **vdg_cookie_notice**（localStorage）— 記住您已讀過本說明。\n- **vdg_saved_programs**（localStorage）— 您收藏的課程，僅留在您的瀏覽器，不會傳送至伺服器。\n- **vdg_recent_programs**（localStorage）— 您最近瀏覽的課程，用於「最近瀏覽」清單。\n- **vdg_compare**（localStorage）— 您選來比較的課程。\n- **vdg_advisor_session**（sessionStorage）— 與輔導助理的對話識別碼，關閉分頁即清除。\n\n## 如何清除\n\n在瀏覽器中清除網站資料，即可移除上述所有項目。輔導助理的「清除對話」按鈕僅會清除聊天紀錄。\n\n## 若日後加入分析工具\n\n倘若機構決定加入分析工具，網站將在載入任何第三方程式碼前顯示同意視窗，並同步更新本頁。",
    },
  },
  {
    slug: "dieu-khoan-su-dung",
    title: { vi: "Điều khoản sử dụng", en: "Terms of use", de: "Nutzungsbedingungen", ja: "利用規約", ko: "이용약관", "zh-TW": "使用條款" },
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
      ja: "## 1. 適用範囲\n\n本規約は、Viet Duc Group のウェブサイトへのアクセスおよび利用に適用されます。\n\n## 2. 掲載情報の位置づけ\n\n本サイトの内容は、Viet Duc Group および加盟各校の会社案内と法的書類をもとに編集したものです。職種名、職種コード、募集定員は、証明書番号と交付日の記載された技能教育立案証明書から書き写しています。\n\n本サイトの情報は参考です。**正式な募集要項、学費、入学条件は加盟校の入学窓口が発行するもの**であり、ここに表示された内容より優先します。\n\n## 3. 相談アドバイザー\n\nアドバイザーは編集者が承認した資料にもとづいて回答し、必ず出典を示します。出願資格の判断はせず、就職を約束せず、担当者の代わりにもなりません。資料の中に見当たらないときは、その旨をはっきり申し上げます。\n\n## 4. 知的財産\n\n本サイトのロゴ、画像、内容は、別段の記載がない限り Viet Duc Group および加盟各校に帰属します。書面による許諾なく商業目的で複製することはできません。\n\n## 5. 外部リンク\n\n本サイトは加盟校や提携先のページへリンクしています。それらのページの内容について当方は責任を負いません。\n\n## 6. 変更\n\n本規約は改定されることがあります。最終更新日はページ下部に表示します。",
      ko: "## 1. 적용 범위\n\n본 약관은 Viet Duc Group 웹사이트에 접속하고 이를 이용하는 데 적용됩니다.\n\n## 2. 게재 정보의 성격\n\n본 사이트의 내용은 Viet Duc Group과 회원 학교들의 역량 소개서 및 법적 문서를 바탕으로 편집한 것입니다. 직종명과 직종 코드, 모집 정원은 문서 번호와 발급일이 명시된 직업교육 인가증에서 옮겨 적었습니다.\n\n본 사이트의 정보는 참고용입니다. **정식 모집 공고와 학비, 입학 조건은 회원 학교의 입학 부서가 발행**하며, 여기에 표시된 내용보다 우선합니다.\n\n## 3. 상담 도우미\n\n상담 도우미는 편집자가 승인한 자료에 근거해 답하며 언제나 출처를 함께 밝힙니다. 지원 자격을 판단하지 않고, 취업을 약속하지 않으며, 상담 직원을 대신하지도 않습니다. 자료에서 찾지 못한 경우에는 그렇다고 분명히 말씀드립니다.\n\n## 4. 지식재산\n\n본 사이트의 로고와 이미지, 내용은 별도 표시가 없는 한 Viet Duc Group과 회원 학교들에 귀속됩니다. 서면 허락 없이 상업적 목적으로 복제할 수 없습니다.\n\n## 5. 외부 링크\n\n본 사이트는 회원 학교와 협력사의 페이지로 연결됩니다. 해당 페이지의 내용에 대해서는 책임지지 않습니다.\n\n## 6. 변경\n\n본 약관은 갱신될 수 있습니다. 최종 수정일은 페이지 하단에 표시됩니다.",
      "zh-TW": "## 1. 適用範圍\n\n本條款適用於對 Viet Duc Group 網站的瀏覽與使用。\n\n## 2. 網站資訊的性質\n\n本網站內容係依 Viet Duc Group 及各成員學校的能力簡介與法律文件編輯而成。職類名稱、職類代碼與招生名額，均抄錄自載明文號與核發日期的技職教育立案證明書。\n\n本網站資訊僅供參考。**正式的招生公告、學費與入學條件由成員學校招生單位發布**，其效力優先於此處所顯示的內容。\n\n## 3. 輔導助理\n\n輔導助理僅依編輯者審核過的文件作答，並一律註明出處。它不判定入學資格、不承諾就業，也不取代真人輔導人員。若文件中查無該項資訊，它會明白告知。\n\n## 4. 智慧財產\n\n除另有註明外，本網站的標誌、圖片與內容均屬 Viet Duc Group 及各成員學校所有。未經書面同意，不得為商業目的重製。\n\n## 5. 外部連結\n\n本網站設有通往成員學校與合作夥伴頁面的連結。對於該等頁面的內容，本站不負責任。\n\n## 6. 變更\n\n本條款可能更新，最後更新日期顯示於頁面下方。",
    },
  },
  {
    slug: "impressum",
    title: { vi: "Impressum", en: "Imprint", de: "Impressum", ja: "運営者情報(Impressum)", ko: "운영자 정보(Impressum)", "zh-TW": "營運者資訊（Impressum）" },
    body: {
      vi: `Trang này dành cho người dùng tại CHLB Đức và châu Âu theo yêu cầu của §5 DDG (Đức).

## Đơn vị vận hành website

Công ty Cổ phần Tập đoàn Đầu tư và Giáo dục Quốc tế Việt Đức
Tầng 4, Toà nhà Rainbow, số 79 Đường 19/5, KĐTM Văn Quán, Phường Hà Đông, Thành phố Hà Nội, Việt Nam
Email: info@vietducgroup.com.vn
Điện thoại: 024 3 123 6868

## Thông tin đăng ký doanh nghiệp

- Người đại diện theo pháp luật (Vertretungsberechtigte Person): Ông Phan Phương Nguyên, Tổng Giám đốc
- Mã số doanh nghiệp: 3101147607 — đăng ký lần đầu ngày 20/08/2025, đăng ký thay đổi lần thứ nhất ngày 23/01/2026, do Phòng Đăng ký kinh doanh, Sở Tài chính tỉnh Quảng Trị cấp
- Mã số thuế: trùng mã số doanh nghiệp 3101147607. Công ty không đăng ký thuế giá trị gia tăng tại EU nên không có USt-IdNr.
- Người chịu trách nhiệm nội dung (V.i.S.d.P.): Ông Phan Phương Nguyên

## Đối tác tại CHLB Đức

itw – Institut für Aus- und Weiterbildung gGmbH, Berlin, là đơn vị đối tác đào tạo tại Đức. Thông tin pháp lý riêng của itw Berlin do đơn vị này công bố trên website của họ.`,
      en: `This page addresses the German §5 DDG imprint requirement for visitors in Germany and the EU.

## Website operator

Viet Duc International Investment and Education Group Joint Stock Company
4th Floor, Rainbow Building, No. 79, 19/5 Street, Van Quan New Urban Area, Ha Dong Ward, Hanoi, Vietnam
Email: info@vietducgroup.com.vn
Phone: +84 24 3 123 6868

## Company registration

- Legal representative: Mr Phan Phuong Nguyen, General Director
- Company registration number: 3101147607 — first registered 20 August 2025, first amendment 23 January 2026, issued by the Business Registration Office, Department of Finance of Quang Tri Province
- Tax number: the same as the company registration number, 3101147607. The company is not registered for VAT in the EU and therefore holds no USt-IdNr.
- Person responsible for content (V.i.S.d.P.): Mr Phan Phuong Nguyen

## German partner

itw – Institut für Aus- und Weiterbildung gGmbH, Berlin, is the training partner in Germany. Its own legal notice is published on its website.`,
      de: `Diese Seite dient der Anbieterkennzeichnung nach §5 DDG für Besucherinnen und Besucher in Deutschland und der EU.

## Betreiber der Website

Viet Duc International Investment and Education Group JSC
4th Floor, Rainbow Building, No. 79, 19/5 Street, Van Quan New Urban Area, Ha Dong Ward, Hanoi, Vietnam
E-Mail: info@vietducgroup.com.vn
Telefon: +84 24 3 123 6868

## Registerangaben

- Vertretungsberechtigte Person: Herr Phan Phuong Nguyen, Generaldirektor
- Unternehmensregisternummer: 3101147607 — Ersteintragung am 20.08.2025, erste Änderung am 23.01.2026, ausgestellt vom Amt für Unternehmensregistrierung der Finanzbehörde der Provinz Quang Tri
- Steuernummer: identisch mit der Unternehmensregisternummer 3101147607. Das Unternehmen ist in der EU nicht umsatzsteuerlich registriert und führt daher keine USt-IdNr.
- Verantwortlich für den Inhalt (V.i.S.d.P.): Herr Phan Phuong Nguyen

## Partner in Deutschland

itw – Institut für Aus- und Weiterbildung gGmbH, Berlin, ist der Ausbildungspartner in Deutschland. Das eigene Impressum des itw wird auf dessen Website veröffentlicht.`,
      ja: "このページは、ドイツ連邦共和国およびヨーロッパの利用者に向けて、ドイツ DDG 第5条の求めに応じて掲げるものです。\n\n## サイトの運営者\n\nベトドゥック国際投資教育グループ株式会社\nベトナム国ハノイ市チャンフー通り129番地、Viet Duc Group ビル\nメール：info@vietducgroup.com.vn\n電話：024 3 123 6868\n\n## まだ足りない項目\n\n以下はドイツの法律が Impressum に必ず求めるもので、**本プロジェクトのどの資料にもまだありません**。ドイツの利用者へ公開する前に、管理者が管理画面から補う必要があります。\n\n- 法定代表者(Vertretungsberechtigte Person)：**[CẦN BỔ SUNG]**\n- 事業者番号／商業登記番号：**[CẦN BỔ SUNG]**\n- 付加価値税番号(USt-IdNr.、EU 域内で事業を行う場合)：**[CẦN BỔ SUNG]**\n- 内容に責任を負う者(V.i.S.d.P.)：**[CẦN BỔ SUNG]**\n\n## ドイツ連邦共和国の提携先\n\nitw – Institut für Aus- und Weiterbildung gGmbH(ベルリン)が、ドイツにおける教育の提携先です。itw ベルリン自身の法的情報は、同社のウェブサイトに掲載されています。",
      ko: "이 페이지는 독일 연방공화국과 유럽의 이용자를 위해 독일 DDG 제5조의 요구에 따라 게시합니다.\n\n## 사이트 운영자\n\n베트득 국제투자교육그룹 주식회사\n베트남 하노이시 쩐푸 129번지 Viet Duc Group 빌딩\n이메일: info@vietducgroup.com.vn\n전화: 024 3 123 6868\n\n## 아직 채우지 못한 항목\n\n다음은 독일 법이 Impressum에 반드시 요구하는 사항이며, **본 프로젝트의 어떤 자료에도 아직 없습니다**. 독일 이용자에게 공개하기 전에 관리자가 관리자 화면에서 채워 넣어야 합니다.\n\n- 법정 대표자(Vertretungsberechtigte Person): **[CẦN BỔ SUNG]**\n- 사업자 번호 / 상업 등기 번호: **[CẦN BỔ SUNG]**\n- 부가가치세 번호(USt-IdNr., EU 내에서 사업하는 경우): **[CẦN BỔ SUNG]**\n- 내용 책임자(V.i.S.d.P.): **[CẦN BỔ SUNG]**\n\n## 독일 연방공화국의 협력 기관\n\nitw – Institut für Aus- und Weiterbildung gGmbH(베를린)가 독일에서의 교육 협력 기관입니다. itw 베를린 자체의 법적 정보는 해당 기관의 웹사이트에 공개되어 있습니다.",
      "zh-TW": "本頁依德國 DDG 第 5 條之要求，向德意志聯邦共和國與歐洲的使用者揭露。\n\n## 網站營運者\n\n越德國際投資與教育集團股份公司\n越南河內市陳富路 129 號 Viet Duc Group 大樓\n電子郵件：info@vietducgroup.com.vn\n電話：024 3 123 6868\n\n## 尚待補齊的項目\n\n以下為德國法律要求 Impressum 必須載明，而**本專案現有文件皆未提供**者。在向德國使用者公開網站前，管理者須於管理後台補上：\n\n- 法定代表人（Vertretungsberechtigte Person）：**[CẦN BỔ SUNG]**\n- 統一編號／商業登記號碼：**[CẦN BỔ SUNG]**\n- 加值稅識別號（USt-IdNr.，若於歐盟境內營業）：**[CẦN BỔ SUNG]**\n- 內容負責人（V.i.S.d.P.）：**[CẦN BỔ SUNG]**\n\n## 德意志聯邦共和國的合作機構\n\nitw – Institut für Aus- und Weiterbildung gGmbH（柏林）為本集團在德國的培訓合作機構。itw 柏林自身的法律資訊由該機構公布於其網站。",
    },
  },
];
