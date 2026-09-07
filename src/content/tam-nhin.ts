import type { L10nMap } from "@/lib/i18n/config";

/**
 * Nội dung mục "Tầm nhìn & Triết lý giáo dục" trên trang Giới thiệu.
 *
 * Để riêng khỏi thành phần dựng giao diện vì hai lý do. Một: chín khối này là
 * chữ nghĩa biên tập, người sửa nội dung không nên phải mở một file JSX. Hai:
 * mỗi câu đều có sáu thứ tiếng, trộn vào mã dựng thì không còn đọc được.
 *
 * BA RÀNG BUỘC BIÊN TẬP, giữ nguyên khi sửa về sau:
 *
 *  - Đây là ĐỊNH HƯỚNG, không phải thành tích. Không viết số trường, số học
 *    viên, tỷ lệ việc làm, số doanh nghiệp đối tác hay cam kết đầu ra ở đây.
 *    Những con số có thật đã nằm ở các mục khác, lấy thẳng từ cơ sở dữ liệu.
 *  - Không khẳng định AI thay thế người hướng dẫn trong công việc thực hành có
 *    yêu cầu an toàn. AI hỗ trợ việc học; tay nghề vẫn cần xưởng và người dạy.
 *  - Những nhận định định lượng chưa có nguồn thì diễn đạt định tính. Ví dụ:
 *    "chu kỳ cập nhật kỹ năng ngày càng ngắn", KHÔNG viết "vòng đời kỹ năng
 *    2–3 năm" chừng nào chưa có tài liệu dẫn nguồn.
 */

export type Anh = { src: string; alt: L10nMap };

/* ------------------------------------------------------------ khối 01 */

export const MO_DAU = {
  nhan: {
    vi: "Tầm nhìn & Triết lý giáo dục",
    en: "Vision & educational philosophy",
    de: "Vision & Bildungsphilosophie",
    ja: "ビジョンと教育理念",
    ko: "비전과 교육 철학",
    "zh-TW": "願景與教育理念",
  } satisfies L10nMap,
  tieuDe: {
    vi: "Tái định nghĩa giáo dục nghề nghiệp trong thời đại AI",
    en: "Redefining vocational education in the age of AI",
    de: "Berufsbildung im Zeitalter der KI neu denken",
    ja: "AI の時代に、職業教育を定義しなおす",
    ko: "AI 시대, 직업교육을 다시 정의합니다",
    "zh-TW": "在 AI 時代，重新定義技職教育",
  } satisfies L10nMap,
  moTa: {
    vi: "Kết nối thực hành, công nghệ và doanh nghiệp để giúp người học liên tục phát triển năng lực trong một thế giới luôn thay đổi.",
    en: "Connecting hands-on practice, technology and employers so that learners keep growing their capability in a world that keeps changing.",
    de: "Praxis, Technologie und Unternehmen verbinden, damit Lernende ihre Fähigkeiten in einer sich stetig wandelnden Welt weiterentwickeln.",
    ja: "実習と技術と企業をつなぎ、変わりつづける世界のなかで学ぶ人が力を伸ばしつづけられるように。",
    ko: "실습과 기술, 기업을 잇대어 끊임없이 달라지는 세상에서 배우는 이가 역량을 계속 키워 가도록 합니다.",
    "zh-TW": "串連實作、技術與企業，讓學習者在不斷變動的世界中持續累積能力。",
  } satisfies L10nMap,
  /*
   * Ảnh nền của khối mở đầu.
   *
   * Chọn được bức này vì một phần ba bên trái của nó là mảng tường tối trơn:
   * chữ đặt lên đó không rơi vào mặt ai, mà vẫn thấy dây chuyền và kỹ thuật
   * viên ở nửa phải. Lời chú nằm ở góc, ghi rõ đây là ảnh minh hoạ.
   */
  anhNen: {
    src: "/media/vision/nha-may-thong-minh.webp",
    alt: {
      vi: "Minh hoạ nhà máy thông minh: dây chuyền tự động và kỹ thuật viên vận hành trong cùng một không gian",
      en: "An illustration of a smart factory: automated lines and the technicians running them share one floor",
      de: "Illustration einer intelligenten Fabrik: automatisierte Linien und das Fachpersonal, das sie steuert, teilen sich eine Halle",
      ja: "スマート工場のイメージ図。自動化されたラインと、それを動かす技術者が同じフロアにいる",
      ko: "스마트 공장을 그린 그림. 자동화된 라인과 그것을 운용하는 기술자가 같은 공간에 있습니다",
      "zh-TW": "智慧工廠示意圖：自動化產線與操作產線的技術人員同處一個廠區",
    },
  },
  cauDan: {
    vi: "Liệu trường nghề sẽ thích nghi để dẫn đầu, hay trở thành “Nokia” của thời đại AI?",
    en: "Will vocational schools adapt and lead — or become the “Nokia” of the age of AI?",
    de: "Werden Berufsschulen sich anpassen und vorangehen – oder zum „Nokia“ des KI-Zeitalters?",
    ja: "職業学校は適応して先頭に立つのか、それとも AI 時代の「ノキア」になるのか。",
    ko: "직업학교는 적응하여 앞서갈 것인가, 아니면 AI 시대의 '노키아'가 될 것인가.",
    "zh-TW": "技職學校會調適並走在前面，還是成為 AI 時代的「Nokia」？",
  } satisfies L10nMap,
  nut: {
    vi: "Khám phá định hướng",
    en: "Explore the direction",
    de: "Die Ausrichtung entdecken",
    ja: "その方向を見る",
    ko: "방향을 살펴보기",
    "zh-TW": "探索我們的方向",
  } satisfies L10nMap,
  anhAlt: {
    vi: "Ban lãnh đạo Việt Đức Group cùng hình ảnh các trường thành viên và giờ thực hành nghề",
    en: "The Viet Duc Group leadership with the member schools and scenes from workshop training",
    de: "Die Führung der Viet Duc Group mit den Mitgliedsschulen und Szenen aus der Werkstattausbildung",
    ja: "Viet Duc Group の経営陣と、加盟各校および実習風景",
    ko: "Viet Duc Group 경영진과 회원 학교들, 그리고 실습 장면",
    "zh-TW": "Viet Duc Group 經營團隊，以及各成員學校與實作教學的場景",
  } satisfies L10nMap,
};

/* ------------------------------------------------------------ khối 02 */

export const DICH_CHUYEN = {
  tieuDe: {
    vi: "Khi tri thức không còn giới hạn trong lớp học",
    en: "When knowledge is no longer confined to the classroom",
    de: "Wenn Wissen nicht mehr im Klassenraum bleibt",
    ja: "知識が教室の中にとどまらなくなったとき",
    ko: "지식이 더 이상 교실 안에만 머물지 않을 때",
    "zh-TW": "當知識不再侷限於教室",
  } satisfies L10nMap,
  thongDiep: {
    vi: "Giá trị đang dịch chuyển từ việc nắm giữ kiến thức sang khả năng giúp người học vận dụng kiến thức.",
    en: "Value is shifting from holding knowledge to helping learners put knowledge to work.",
    de: "Der Wert verschiebt sich vom Besitz des Wissens zur Fähigkeit, Lernenden bei dessen Anwendung zu helfen.",
    ja: "価値は「知識を持っていること」から「知識を使えるように導けること」へ移っています。",
    ko: "가치는 지식을 쥐고 있는 데서, 배우는 이가 지식을 쓰도록 돕는 힘으로 옮겨가고 있습니다.",
    "zh-TW": "價值正從「擁有知識」轉向「幫助學習者運用知識」。",
  } satisfies L10nMap,
  than: {
    vi: "Nokia không sa sút vì làm ra điện thoại kém. Họ sa sút vì thế giới đổi cách dùng điện thoại. Giáo dục nghề nghiệp đang đứng trước một chuyển động tương tự: người học hôm nay có thể tra quy trình, xem hướng dẫn và hỏi một trợ lý ảo vào bất cứ lúc nào.\n\nĐiều đó không làm nhà trường mất vai trò. Nó đổi vai trò ấy — từ nơi truyền đạt kiến thức thành nơi tổ chức để kiến thức trở thành tay nghề. Chu kỳ cập nhật kỹ năng ngày càng ngắn, nên thứ người học cần mang theo không chỉ là một nghề, mà là khả năng học lại một nghề.",
    en: "Nokia did not decline because it made poor phones. It declined because the world changed how phones were used. Vocational education faces a comparable shift: a learner today can look up a procedure, watch a demonstration and ask an assistant at any hour.\n\nThat does not take the school's role away. It changes that role — from a place that transmits knowledge to a place that arranges for knowledge to become skill. The cycle for refreshing skills keeps getting shorter, so what a learner needs to carry away is not only a trade, but the ability to learn a trade again.",
    de: "Nokia geriet nicht ins Hintertreffen, weil es schlechte Telefone baute. Es geriet ins Hintertreffen, weil die Welt den Umgang mit Telefonen änderte. Die Berufsbildung steht vor einer vergleichbaren Bewegung: Lernende können heute jederzeit Abläufe nachschlagen, Anleitungen ansehen und einen Assistenten fragen.\n\nDas nimmt der Schule ihre Rolle nicht. Es verändert sie – von einem Ort, der Wissen weitergibt, zu einem Ort, an dem aus Wissen Können wird. Die Zyklen, in denen Fähigkeiten aufgefrischt werden müssen, werden kürzer. Mitzunehmen ist deshalb nicht nur ein Beruf, sondern die Fähigkeit, einen Beruf erneut zu erlernen.",
    ja: "ノキアが退いたのは、質の悪い携帯を作ったからではありません。世界が携帯の使い方を変えたからです。職業教育も同じような動きの前に立っています。今日の学習者は、手順を調べ、手本を見て、いつでもアシスタントに尋ねることができます。\n\nそれで学校の役割がなくなるわけではありません。役割が変わるのです — 知識を伝える場から、知識が技能に変わるように場を整える側へ。技能を更新する周期は短くなり続けています。持ち帰るべきものは一つの職種だけでなく、職種をもう一度学び直す力です。",
    ko: "노키아가 물러난 것은 나쁜 휴대전화를 만들어서가 아닙니다. 세상이 휴대전화를 쓰는 방식을 바꾸었기 때문입니다. 직업교육도 비슷한 움직임 앞에 서 있습니다. 오늘의 학습자는 공정을 찾아보고, 시범을 보고, 언제든 도우미에게 물을 수 있습니다.\n\n그렇다고 학교의 역할이 사라지지는 않습니다. 역할이 달라질 뿐입니다 — 지식을 전달하던 곳에서, 지식이 기능으로 바뀌도록 자리를 마련하는 곳으로. 기능을 새로 익혀야 하는 주기는 점점 짧아집니다. 그러니 지니고 나가야 할 것은 하나의 직종만이 아니라, 직종을 다시 배울 수 있는 힘입니다.",
    "zh-TW": "Nokia 的失落，不是因為做出了不好的手機，而是因為世界改變了使用手機的方式。技職教育正面對一場類似的轉變：今天的學習者隨時可以查閱流程、觀看示範，並向助理提問。\n\n這並未奪走學校的角色，而是改變了它——從傳授知識的地方，轉為讓知識化為技能的場域。技能更新的週期愈來愈短，因此學習者要帶走的不只是一門職業，更是再次學會一門職業的能力。",
  } satisfies L10nMap,
  /* Sáu việc AI đã làm được cho người học nghề. Không có việc nào thay thế
     người hướng dẫn ở khâu thao tác thật — chủ ý, xem chú thích đầu file. */
  ungDung: [
    {
      ten: { vi: "Học vận hành CNC", en: "Learning CNC operation", de: "CNC-Bedienung lernen", ja: "CNC 操作を学ぶ", ko: "CNC 운전 익히기", "zh-TW": "學習 CNC 操作" },
      y: { vi: "Tra lệnh, đọc chương trình và luyện trước khi vào máy thật.", en: "Look up commands, read the program and rehearse before touching the machine.", de: "Befehle nachschlagen, das Programm lesen und üben, bevor es an die Maschine geht.", ja: "コマンドを調べ、プログラムを読み、実機に触れる前に練習する。", ko: "명령을 찾아보고 프로그램을 읽으며 실제 기계에 앞서 연습합니다.", "zh-TW": "查指令、讀程式，在上機之前先行演練。" },
    },
    {
      ten: { vi: "Mô phỏng sản xuất", en: "Production simulation", de: "Fertigungssimulation", ja: "生産のシミュレーション", ko: "생산 시뮬레이션", "zh-TW": "生產模擬" },
      y: { vi: "Thử một dây chuyền trên màn hình trước khi chạm vào thiết bị.", en: "Try a line on screen before touching the equipment.", de: "Eine Linie am Bildschirm durchspielen, bevor die Anlage angefasst wird.", ja: "設備に触れる前に、画面上でラインを試す。", ko: "설비를 만지기 전에 화면에서 라인을 시험해 봅니다.", "zh-TW": "在碰觸設備之前，先於螢幕上試跑一條產線。" },
    },
    {
      ten: { vi: "Hỗ trợ thiết kế", en: "Design support", de: "Entwurfsunterstützung", ja: "設計の支援", ko: "설계 지원", "zh-TW": "設計輔助" },
      y: { vi: "Dựng phương án, so sánh vật liệu, rút ngắn vòng thử sai.", en: "Draft options, compare materials, shorten the trial-and-error loop.", de: "Varianten entwerfen, Werkstoffe vergleichen, Versuchsschleifen verkürzen.", ja: "案をつくり、材料を比べ、試行錯誤の回り道を短くする。", ko: "안을 세우고 재료를 견주어 시행착오의 고리를 줄입니다.", "zh-TW": "擬定方案、比較材料，縮短試誤的循環。" },
    },
    {
      ten: { vi: "Phân tích lỗi kỹ thuật", en: "Fault analysis", de: "Fehleranalyse", ja: "不具合の分析", ko: "고장 분석", "zh-TW": "技術故障分析" },
      y: { vi: "Lần theo triệu chứng để hiểu nguyên nhân, thay vì đoán.", en: "Trace symptoms back to a cause instead of guessing.", de: "Symptomen zur Ursache folgen, statt zu raten.", ja: "症状から原因をたどる。あてずっぽうではなく。", ko: "증상을 따라 원인에 이릅니다. 짐작이 아니라.", "zh-TW": "循著徵狀追出原因，而不是憑猜測。" },
    },
    {
      ten: { vi: "Dịch tài liệu kỹ thuật", en: "Translating technical documents", de: "Technische Unterlagen übersetzen", ja: "技術資料の翻訳", ko: "기술 문서 번역", "zh-TW": "翻譯技術文件" },
      y: { vi: "Đọc được catalogue, sơ đồ và hướng dẫn của thiết bị nhập khẩu.", en: "Read the catalogues, diagrams and manuals that come with imported equipment.", de: "Kataloge, Schaltpläne und Handbücher importierter Anlagen lesen können.", ja: "輸入設備のカタログ、図面、取扱説明書が読めるようになる。", ko: "수입 설비의 카탈로그와 도면, 설명서를 읽어 냅니다.", "zh-TW": "讀懂進口設備的型錄、圖說與操作手冊。" },
    },
    {
      ten: { vi: "Hướng dẫn trực quan", en: "Visual guidance", de: "Visuelle Anleitung", ja: "目で見る手引き", ko: "눈으로 보는 안내", "zh-TW": "視覺化指引" },
      y: { vi: "Xem lại từng bước thao tác vào đúng lúc cần ôn.", en: "Replay each step at the moment it needs revisiting.", de: "Jeden Arbeitsschritt genau dann noch einmal ansehen, wenn er gebraucht wird.", ja: "必要になったその時に、手順を一つずつ見返す。", ko: "다시 봐야 할 그 순간에 동작을 한 단계씩 되돌려 봅니다.", "zh-TW": "在需要複習的當下，逐步回看每個動作。" },
    },
  ],
  soSanh: {
    cu: {
      vi: "Tri thức tập trung trong lớp học",
      en: "Knowledge held in the classroom",
      de: "Wissen im Klassenraum gebündelt",
      ja: "教室に集まっていた知識",
      ko: "교실에 모여 있던 지식",
      "zh-TW": "知識集中於教室",
    } satisfies L10nMap,
    moi: {
      vi: "Tri thức được kết nối, cập nhật liên tục",
      en: "Knowledge connected and continually refreshed",
      de: "Wissen vernetzt und laufend erneuert",
      ja: "つながり、絶えず更新される知識",
      ko: "이어지고 끊임없이 새로워지는 지식",
      "zh-TW": "知識彼此串連，持續更新",
    } satisfies L10nMap,
  },
  anh: {
    src: "/media/vision/cnc-may-tinh.webp",
    alt: {
      vi: "Học viên đọc chương trình gia công trên máy tính ngay cạnh máy CNC",
      en: "A trainee reading the machining program on a laptop beside the CNC machine",
      de: "Ein Auszubildender liest das Bearbeitungsprogramm am Laptop neben der CNC-Maschine",
      ja: "CNC 機のかたわらで、加工プログラムをノートパソコンで読む学習者",
      ko: "CNC 기계 옆에서 노트북으로 가공 프로그램을 읽는 학습자",
      "zh-TW": "學員在 CNC 機台旁以筆電閱讀加工程式",
    },
  } satisfies Anh,
};

/* ------------------------------------------------------------ khối 03 */

export const GIA_TRI = {
  tieuDe: {
    vi: "Bốn giá trị định hình trường nghề tương lai",
    en: "Four values that shape the vocational school of the future",
    de: "Vier Werte, die die Berufsschule der Zukunft prägen",
    ja: "これからの職業学校を形づくる四つの価値",
    ko: "미래의 직업학교를 빚는 네 가지 가치",
    "zh-TW": "形塑未來技職學校的四項價值",
  } satisfies L10nMap,
  gioiThieu: {
    vi: "Khi AI mở rộng khả năng tiếp cận tri thức, nhà trường càng cần làm sâu sắc những giá trị đến từ thực hành, con người và kết nối nghề nghiệp.",
    en: "As AI widens access to knowledge, a school must deepen what comes from practice, from people and from professional connections.",
    de: "Je breiter KI den Zugang zu Wissen macht, desto stärker muss eine Schule vertiefen, was aus Praxis, Menschen und beruflichen Verbindungen erwächst.",
    ja: "AI が知識への入口を広げるほど、学校は実習と人と職業のつながりから生まれるものを深めていく必要があります。",
    ko: "AI가 지식으로 가는 길을 넓힐수록, 학교는 실습과 사람과 직업의 이음새에서 오는 것을 더 깊이 다져야 합니다.",
    "zh-TW": "當 AI 讓知識更容易取得，學校更需要深化來自實作、人與職業連結的那些價值。",
  } satisfies L10nMap,
  muc: [
    {
      so: "01",
      ten: { vi: "Môi trường thực hành", en: "A place to practise", de: "Ein Ort zum Üben", ja: "実習の場", ko: "실습의 자리", "zh-TW": "實作的場域" },
      moTa: {
        vi: "Biến kiến thức thành năng lực qua thiết bị, xưởng và tình huống thực tế.",
        en: "Turning knowledge into capability through equipment, workshops and real situations.",
        de: "Wissen wird durch Anlagen, Werkstätten und echte Situationen zu Können.",
        ja: "設備と工場と現実の場面を通して、知識を力に変える。",
        ko: "설비와 실습장, 실제 상황을 통해 지식을 역량으로 바꿉니다.",
        "zh-TW": "透過設備、工場與真實情境，把知識轉為能力。",
      },
      y: {
        vi: ["Thiết bị đúng với thiết bị doanh nghiệp đang dùng", "Bài tập đặt trong tình huống nghề thật", "Có người hướng dẫn kèm ở khâu thao tác"],
        en: ["Equipment that matches what employers actually run", "Exercises set in real occupational situations", "An instructor alongside at the hands-on stage"],
        de: ["Anlagen, wie sie in den Betrieben tatsächlich laufen", "Aufgaben aus echten beruflichen Situationen", "Eine Lehrkraft an der Seite beim praktischen Tun"],
        ja: ["企業が実際に動かしているものと同じ設備", "実際の職業場面に置かれた課題", "手を動かす場面には指導者がそばに"],
        ko: ["기업이 실제로 돌리는 것과 같은 설비", "실제 직업 상황 속에 놓인 과제", "손을 쓰는 단계에는 지도자가 곁에"],
        "zh-TW": ["與企業實際使用相符的設備", "置於真實職場情境中的練習", "動手階段有指導者在旁"],
      },
      anh: {
        src: "/media/vision/to-thuc-hanh-co-khi.webp",
        alt: { vi: "Một tổ thực hành tháo lắp cụm truyền động, có đeo găng bảo hộ", en: "A practice team stripping down a gear assembly, wearing protective gloves", de: "Eine Übungsgruppe zerlegt eine Getriebebaugruppe, mit Schutzhandschuhen", ja: "保護手袋を着けて伝動装置を分解する実習班", ko: "보호 장갑을 끼고 전동 장치를 분해하는 실습 조", "zh-TW": "戴著防護手套拆解傳動組件的實作小組" },
      },
    },
    {
      so: "02",
      ten: { vi: "Tác phong công nghiệp", en: "Working like the trade works", de: "Arbeiten wie im Betrieb", ja: "現場の作法", ko: "현장의 몸가짐", "zh-TW": "產業工作態度" },
      moTa: {
        vi: "Rèn kỷ luật, trách nhiệm, hợp tác và tuân thủ quy trình.",
        en: "Building discipline, responsibility, teamwork and respect for procedure.",
        de: "Disziplin, Verantwortung, Zusammenarbeit und Verfahrenstreue einüben.",
        ja: "規律、責任、協働、そして手順を守ることを身につける。",
        ko: "규율과 책임, 협업, 그리고 절차를 지키는 태도를 기릅니다.",
        "zh-TW": "培養紀律、責任、協作與遵守流程的習慣。",
      },
      y: {
        vi: ["Giờ giấc và bảo hộ lao động như ở nhà máy", "Bàn giao ca, ghi chép và báo cáo đúng mẫu", "Làm việc nhóm với vai trò rõ ràng"],
        en: ["Timekeeping and protective equipment as on a factory floor", "Handovers, records and reports in the proper form", "Teamwork with clearly assigned roles"],
        de: ["Zeiten und Schutzausrüstung wie in der Fertigung", "Übergaben, Aufzeichnungen und Berichte in der richtigen Form", "Teamarbeit mit klar verteilten Rollen"],
        ja: ["工場と同じ時間の守り方と保護具", "引き継ぎ・記録・報告を定められた様式で", "役割のはっきりしたチーム作業"],
        ko: ["공장과 같은 시간 지키기와 보호 장비", "인수인계와 기록, 보고를 정해진 양식으로", "역할이 분명한 팀 작업"],
        "zh-TW": ["如同工廠現場的作息與防護裝備", "依規定格式交接、記錄與回報", "分工明確的團隊作業"],
      },
      anh: {
        src: "/media/vision/han-co-nguoi-kem.webp",
        alt: { vi: "Giờ hàn: mặt nạ, tạp dề và găng đầy đủ, người hướng dẫn đứng kèm bên cạnh", en: "A welding session: full mask, apron and gloves, with an instructor standing alongside", de: "Schweißübung mit Maske, Schürze und Handschuhen – die Lehrkraft steht daneben", ja: "溶接の実習。面・前掛け・手袋を着け、指導者がすぐそばに立つ", ko: "용접 실습. 마스크와 앞치마, 장갑을 갖추고 지도자가 곁에 선다", "zh-TW": "銲接實作：面罩、圍裙與手套齊備，指導者就在一旁" },
      },
    },
    {
      so: "03",
      ten: { vi: "Kết nối việc làm", en: "A path into work", de: "Ein Weg in die Arbeit", ja: "仕事へつなぐ", ko: "일자리로 잇기", "zh-TW": "連結就業" },
      moTa: {
        vi: "Gắn hành trình đào tạo với yêu cầu tuyển dụng và sự phát triển nghề nghiệp.",
        en: "Tying the training journey to what employers ask for and to a career that grows.",
        de: "Den Ausbildungsweg an die Anforderungen der Betriebe und an eine wachsende Laufbahn binden.",
        ja: "学びの道のりを、採用の求めと、その先の職業人生につなぐ。",
        ko: "배움의 여정을 채용의 요구와 이어지는 경력에 잇습니다.",
        "zh-TW": "把學習歷程與招募需求及職涯發展接在一起。",
      },
      y: {
        vi: ["Chuẩn đầu ra đọc được bằng ngôn ngữ tuyển dụng", "Thực tập tại doanh nghiệp trong chương trình", "Hỗ trợ hồ sơ, phỏng vấn và bước vào nghề"],
        en: ["Learning outcomes written in the language of hiring", "A workplace placement inside the programme", "Help with applications, interviews and the first steps in the trade"],
        de: ["Lernergebnisse in der Sprache der Personalauswahl", "Ein Betriebspraktikum im Programm", "Hilfe bei Bewerbung, Vorstellungsgespräch und Berufseinstieg"],
        ja: ["採用の言葉で読める修了要件", "課程に組み込まれた企業実習", "応募書類、面接、そして最初の一歩への支援"],
        ko: ["채용의 언어로 읽히는 성취 기준", "교육 과정 안에 놓인 기업 실습", "지원 서류와 면접, 첫걸음에 대한 도움"],
        "zh-TW": ["以招募語言寫成的學習成果", "納入課程之內的企業實習", "協助備審資料、面試與踏入職場的第一步"],
      },
      anh: {
        src: "/media/vision/nha-may-so.webp",
        alt: { vi: "Hai kỹ thuật viên trẻ theo dõi dây chuyền qua máy tính bảng ngay tại xưởng", en: "Two young technicians following the line on a tablet, out on the shop floor", de: "Zwei junge Fachkräfte verfolgen die Linie am Tablet – direkt in der Halle", ja: "現場で、タブレットを手にラインを見守る二人の若い技術者", ko: "현장에서 태블릿으로 라인을 지켜보는 두 젊은 기술자", "zh-TW": "兩位年輕技術員在現場以平板監看產線" },
      },
    },
    {
      so: "04",
      ten: { vi: "Hệ sinh thái doanh nghiệp", en: "Part of the industry's own system", de: "Teil des Systems der Wirtschaft", ja: "産業の仕組みの一部として", ko: "산업의 체계 안에서", "zh-TW": "產業生態系的一環" },
      moTa: {
        vi: "Đưa nhà trường trở thành một phần của quá trình phát triển nhân lực sản xuất.",
        en: "Making the school part of how industry develops its own workforce.",
        de: "Die Schule zu einem Teil davon machen, wie die Industrie ihre Fachkräfte entwickelt.",
        ja: "産業が自らの人材を育てる過程の一部に、学校が入っていく。",
        ko: "산업이 스스로 인력을 길러 내는 과정 안으로 학교가 들어갑니다.",
        "zh-TW": "讓學校成為產業培育自身人力過程中的一環。",
      },
      y: {
        vi: ["Cùng doanh nghiệp xây chuẩn đầu ra", "Giảng viên và kỹ sư cùng đứng lớp", "Cập nhật chương trình theo thay đổi của sản xuất"],
        en: ["Setting learning outcomes together with employers", "Teachers and engineers in the room together", "Updating the programme as production changes"],
        de: ["Lernergebnisse gemeinsam mit Betrieben festlegen", "Lehrkräfte und Ingenieure gemeinsam im Unterricht", "Das Programm anpassen, wenn sich die Fertigung ändert"],
        ja: ["企業とともに修了要件をつくる", "教員と技術者が同じ教室に立つ", "生産の変化に合わせて課程を更新する"],
        ko: ["기업과 함께 성취 기준을 세웁니다", "교원과 기술자가 같은 교실에 섭니다", "생산의 변화에 맞추어 과정을 고쳐 갑니다"],
        "zh-TW": ["與企業共同訂定學習成果", "教師與工程師一同授課", "隨生產的變化更新課程"],
      },
      anh: {
        src: "/media/vision/cung-thiet-ke-voi-doanh-nghiep.webp",
        alt: { vi: "Người của nhà trường và của doanh nghiệp cùng đứng quanh một mô hình thiết bị", en: "School and company people together around a training rig", de: "Schule und Unternehmen gemeinsam an einem Übungsaufbau", ja: "学校と企業の担当者が、実習装置を囲んでともに立つ", ko: "학교와 기업 관계자가 실습 장비를 함께 둘러선 자리", "zh-TW": "校方與企業人員一同圍在一組教學設備旁" },
      },
    },
  ],
};
