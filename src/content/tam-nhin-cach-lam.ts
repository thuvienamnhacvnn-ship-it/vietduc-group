import type { L10nMap } from "@/lib/i18n/config";
import type { Anh } from "./tam-nhin";

/**
 * Nửa sau của mục "Tầm nhìn & Triết lý giáo dục": cách làm và nơi đến.
 *
 * `tam-nhin.ts` trả lời *vì sao* — bối cảnh, sự dịch chuyển của tri thức, bốn
 * giá trị. File này trả lời *làm thế nào*: hợp tác doanh nghiệp, năng lực mới,
 * học suốt đời, năm chuyển đổi, tầm nhìn 2045 và lời mời hành động.
 *
 * Tách đôi không phải vì file dài, mà vì hai nửa được sửa bởi hai lý do khác
 * nhau: nửa đầu đổi khi quan điểm giáo dục đổi, nửa sau đổi khi cách tổ chức
 * đào tạo đổi. Ba ràng buộc biên tập ghi ở đầu `tam-nhin.ts` áp dụng cho cả
 * file này.
 */

/* ------------------------------------------------------------ khối 04 */

export const DOANH_NGHIEP = {
  tieuDe: {
    vi: "Doanh nghiệp cùng kiến tạo năng lực",
    en: "Employers help build the capability",
    de: "Unternehmen bauen Kompetenz mit auf",
    ja: "企業とともに力を育てる",
    ko: "기업과 함께 역량을 만듭니다",
    "zh-TW": "企業共同打造能力",
  } satisfies L10nMap,
  cauDan: {
    vi: "Thu hẹp khoảng cách giữa điều được học và điều công việc thực sự cần.",
    en: "Closing the gap between what is taught and what the job actually needs.",
    de: "Die Lücke schließen zwischen dem, was gelehrt wird, und dem, was die Arbeit wirklich braucht.",
    ja: "教えられることと、仕事が本当に求めることの隔たりを縮める。",
    ko: "가르치는 것과 일이 실제로 요구하는 것 사이의 거리를 좁힙니다.",
    "zh-TW": "縮短所學與工作真正所需之間的落差。",
  } satisfies L10nMap,
  tachRoi: {
    nhan: {
      vi: "Đào tạo tách rời",
      en: "Training on its own",
      de: "Ausbildung für sich",
      ja: "切り離された教育",
      ko: "따로 떨어진 교육",
      "zh-TW": "各自為政的培訓",
    } satisfies L10nMap,
    buoc: {
      vi: ["Xây chương trình", "Giảng dạy", "Cấp bằng", "Tìm việc"],
      en: ["Write the programme", "Teach it", "Award the certificate", "Look for a job"],
      de: ["Programm erstellen", "Unterrichten", "Abschluss vergeben", "Arbeit suchen"],
      ja: ["課程をつくる", "教える", "資格を出す", "仕事を探す"],
      ko: ["과정을 짠다", "가르친다", "자격을 준다", "일자리를 찾는다"],
      "zh-TW": ["編寫課程", "進行教學", "頒發證書", "自行求職"],
    } satisfies L10nMap<string[]>,
  },
  hopTac: {
    nhan: {
      vi: "Đào tạo hợp tác",
      en: "Training together",
      de: "Ausbildung gemeinsam",
      ja: "ともにつくる教育",
      ko: "함께 만드는 교육",
      "zh-TW": "協作式培訓",
    } satisfies L10nMap,
    buoc: {
      vi: ["Xác định nhu cầu", "Đồng thiết kế", "Cùng đào tạo", "Cùng đánh giá", "Kết nối tuyển dụng"],
      en: ["Name the need", "Design it together", "Teach it together", "Assess it together", "Connect to hiring"],
      de: ["Bedarf benennen", "Gemeinsam entwerfen", "Gemeinsam ausbilden", "Gemeinsam bewerten", "An die Einstellung anschließen"],
      ja: ["必要を見きわめる", "ともに設計する", "ともに教える", "ともに評価する", "採用へつなぐ"],
      ko: ["필요를 짚는다", "함께 설계한다", "함께 가르친다", "함께 평가한다", "채용으로 잇는다"],
      "zh-TW": ["確認需求", "共同設計", "共同授課", "共同評量", "銜接招募"],
    } satisfies L10nMap<string[]>,
  },
  /* Đường quay lại từ tuyển dụng về chương trình: đây là thứ phân biệt một
     vòng lặp với một đường thẳng có điểm kết thúc. */
  phanHoi: {
    vi: "Nhu cầu tuyển dụng quay lại cập nhật chương trình",
    en: "Hiring needs feed back into the programme",
    de: "Der Personalbedarf fließt zurück in das Programm",
    ja: "採用の需要が課程の更新へ戻ってくる",
    ko: "채용의 필요가 다시 과정을 고치는 데로 돌아옵니다",
    "zh-TW": "招募需求回流，持續更新課程",
  } satisfies L10nMap,
  chot: {
    vi: "Nhu cầu thực tế tham gia định hình chương trình ngay từ đầu.",
    en: "Real demand shapes the programme from the very first step.",
    de: "Der tatsächliche Bedarf prägt das Programm vom ersten Schritt an.",
    ja: "現実の需要が、はじめの一歩から課程を形づくる。",
    ko: "현실의 수요가 첫 단계부터 과정을 빚습니다.",
    "zh-TW": "真實需求自第一步起即參與形塑課程。",
  } satisfies L10nMap,
};

/* ------------------------------------------------------------ khối 05 */

export const NANG_LUC_MOI = {
  tieuDe: {
    vi: "Chuẩn bị cho những công việc đang hình thành",
    en: "Preparing for the work that is taking shape",
    de: "Auf Berufe vorbereiten, die gerade entstehen",
    ja: "いま形になりつつある仕事に備える",
    ko: "이제 막 모습을 갖추는 일에 대비합니다",
    "zh-TW": "為正在成形的工作做準備",
  } satisfies L10nMap,
  /*
   * Câu này BẮT BUỘC giữ. Tám nhóm dưới đây là hướng năng lực của tương lai,
   * không phải ngành nhà trường đang tuyển sinh — danh sách ngành đang tuyển
   * nằm ở trang tra cứu và lấy thẳng từ giấy phép hoạt động.
   */
  luuY: {
    vi: "Đây là các hướng năng lực đang hình thành trong sản xuất, không phải danh mục ngành nhà trường đang tuyển sinh.",
    en: "These are capability directions emerging in industry, not a list of programmes currently enrolling.",
    de: "Dies sind Kompetenzrichtungen, die in der Industrie entstehen – keine Liste aktuell aufnehmender Programme.",
    ja: "これらは産業のなかで生まれつつある能力の方向であり、現在募集している課程の一覧ではありません。",
    ko: "이는 산업에서 새로 생겨나는 역량의 방향이며, 현재 모집 중인 과정 목록이 아닙니다.",
    "zh-TW": "以下為產業中正在形成的能力方向，並非目前招生的課程清單。",
  } satisfies L10nMap,
  nhom: [
    {
      ten: { vi: "Kỹ thuật viên robot", en: "Robotics technician", de: "Robotiktechnik", ja: "ロボット技術者", ko: "로봇 기술자", "zh-TW": "機器人技術員" },
      y: { vi: "Lắp đặt, dạy việc và giữ cho cánh tay máy chạy đúng nhịp dây chuyền.", en: "Installing, teaching and keeping a robot arm in step with the line.", de: "Roboterarme einrichten, anlernen und im Takt der Linie halten.", ja: "ロボットアームを据え付け、動きを教え、ラインの拍子に合わせて保つ。", ko: "로봇 팔을 설치하고 동작을 가르치며 라인의 박자에 맞춰 유지합니다.", "zh-TW": "安裝、教導機械手臂，並使其與產線節奏一致。" },
    },
    {
      ten: { vi: "Vận hành hệ thống tự động hóa", en: "Automation systems operator", de: "Bedienung von Automatisierungsanlagen", ja: "自動化システムの運転", ko: "자동화 시스템 운전", "zh-TW": "自動化系統操作" },
      y: { vi: "Điều khiển cả cụm thiết bị như một hệ, không phải từng máy rời.", en: "Running a group of machines as one system rather than one at a time.", de: "Eine Anlagengruppe als System führen, nicht Maschine für Maschine.", ja: "機械を一台ずつではなく、ひとつの系として動かす。", ko: "기계를 한 대씩이 아니라 하나의 계로 다룹니다.", "zh-TW": "把整組設備當成一個系統來操控，而非逐台處理。" },
    },
    {
      ten: { vi: "Bảo trì dây chuyền thông minh", en: "Smart line maintenance", de: "Instandhaltung intelligenter Linien", ja: "スマートラインの保全", ko: "스마트 라인 보전", "zh-TW": "智慧產線維護" },
      y: { vi: "Đọc tín hiệu từ cảm biến để sửa trước khi dây chuyền phải dừng.", en: "Reading sensor signals to fix things before the line has to stop.", de: "Sensorsignale lesen und eingreifen, bevor die Linie stehen bleibt.", ja: "センサーの信号を読み、ラインが止まる前に手を打つ。", ko: "센서 신호를 읽어 라인이 멈추기 전에 손을 씁니다.", "zh-TW": "解讀感測訊號，在產線停下之前先行修復。" },
    },
    {
      ten: { vi: "Kỹ thuật viên năng lượng tái tạo", en: "Renewable energy technician", de: "Technik für erneuerbare Energien", ja: "再生可能エネルギー技術者", ko: "재생에너지 기술자", "zh-TW": "再生能源技術員" },
      y: { vi: "Lắp đặt và bảo trì điện mặt trời, điện gió và hệ lưu trữ.", en: "Installing and maintaining solar, wind and storage systems.", de: "Solar-, Wind- und Speicheranlagen errichten und instand halten.", ja: "太陽光、風力、蓄電の設備を据え付け、保つ。", ko: "태양광과 풍력, 저장 설비를 설치하고 관리합니다.", "zh-TW": "安裝與維護太陽能、風力及儲能系統。" },
    },
    {
      ten: { vi: "Chuyên viên in 3D", en: "Additive manufacturing specialist", de: "Fachkraft für 3D-Druck", ja: "3D プリンティング担当", ko: "3D 프린팅 전문 인력", "zh-TW": "3D 列印專業人員" },
      y: { vi: "Từ bản vẽ tới chi tiết thật, chọn vật liệu và kiểm chất lượng.", en: "From drawing to finished part: choosing materials and checking quality.", de: "Von der Zeichnung zum fertigen Teil: Werkstoff wählen, Qualität prüfen.", ja: "図面から実物の部品へ。材料を選び、品質を確かめる。", ko: "도면에서 실제 부품까지, 재료를 고르고 품질을 확인합니다.", "zh-TW": "從圖面到實體零件，選擇材料並檢驗品質。" },
    },
    {
      ten: { vi: "Vận hành nhà máy số", en: "Digital plant operator", de: "Bedienung digitaler Werke", ja: "デジタル工場の運転", ko: "디지털 공장 운전", "zh-TW": "數位工廠操作" },
      y: { vi: "Theo dõi sản xuất qua bảng số liệu và can thiệp đúng chỗ.", en: "Watching production through a dashboard and stepping in at the right place.", de: "Die Fertigung über Kennzahlen verfolgen und an der richtigen Stelle eingreifen.", ja: "指標で生産を見守り、しかるべき場所で手を入れる。", ko: "지표로 생산을 지켜보다 알맞은 자리에서 손을 씁니다.", "zh-TW": "透過儀表板掌握生產，並在對的地方介入。" },
    },
    {
      ten: { vi: "Kỹ thuật viên dữ liệu công nghiệp", en: "Industrial data technician", de: "Technik für Industriedaten", ja: "産業データ技術者", ko: "산업 데이터 기술자", "zh-TW": "工業數據技術員" },
      y: { vi: "Thu thập, làm sạch và diễn giải số liệu do máy móc sinh ra.", en: "Collecting, cleaning and making sense of the numbers machines produce.", de: "Maschinendaten sammeln, bereinigen und deuten.", ja: "機械が生む数値を集め、整え、意味を読む。", ko: "기계가 내놓는 수치를 모으고 다듬어 뜻을 읽습니다.", "zh-TW": "蒐集、清理並解讀機器產生的數據。" },
    },
    {
      ten: { vi: "Kỹ thuật viên AI ứng dụng", en: "Applied AI technician", de: "Technik für angewandte KI", ja: "応用 AI 技術者", ko: "응용 AI 기술자", "zh-TW": "應用 AI 技術員" },
      y: { vi: "Đưa công cụ AI vào công việc thật và kiểm chứng kết quả nó đưa ra.", en: "Putting AI tools to work on real jobs and verifying what they return.", de: "KI-Werkzeuge in die echte Arbeit bringen und ihre Ergebnisse prüfen.", ja: "AI の道具を実務に入れ、返ってきた結果を確かめる。", ko: "AI 도구를 실제 업무에 들이고 그 결과를 검증합니다.", "zh-TW": "把 AI 工具用於真實工作，並驗證其產出。" },
    },
  ],
};

/* ------------------------------------------------------------ khối 06 */

export const HOC_SUOT_DOI = {
  tieuDe: {
    vi: "Một hành trình học tập. Nhiều lần phát triển năng lực.",
    en: "One learning journey. Many rounds of growth.",
    de: "Ein Bildungsweg. Viele Runden des Wachstums.",
    ja: "学びの道はひとつ。力を伸ばす機会は何度も。",
    ko: "배움의 길은 하나, 역량을 키우는 기회는 여러 번.",
    "zh-TW": "一段學習旅程，多次能力躍升。",
  } satisfies L10nMap,
  quenThuoc: {
    nhan: {
      vi: "Hành trình quen thuộc",
      en: "The familiar path",
      de: "Der gewohnte Weg",
      ja: "見慣れた道",
      ko: "익숙한 길",
      "zh-TW": "熟悉的路徑",
    } satisfies L10nMap,
    buoc: {
      vi: ["Học", "Tốt nghiệp", "Đi làm"],
      en: ["Study", "Graduate", "Work"],
      de: ["Lernen", "Abschluss", "Arbeiten"],
      ja: ["学ぶ", "卒業する", "働く"],
      ko: ["배운다", "졸업한다", "일한다"],
      "zh-TW": ["求學", "畢業", "就業"],
    } satisfies L10nMap<string[]>,
  },
  vongLap: {
    nhan: {
      vi: "Hành trình liên tục",
      en: "The continuing path",
      de: "Der fortlaufende Weg",
      ja: "続いていく道",
      ko: "이어지는 길",
      "zh-TW": "持續的路徑",
    } satisfies L10nMap,
    buoc: {
      vi: ["Học", "Làm", "Học lại", "Nâng cấp kỹ năng", "Chuyển đổi nghề", "Tiếp tục học"],
      en: ["Study", "Work", "Study again", "Upgrade skills", "Change trade", "Keep learning"],
      de: ["Lernen", "Arbeiten", "Wieder lernen", "Fähigkeiten ausbauen", "Beruf wechseln", "Weiterlernen"],
      ja: ["学ぶ", "働く", "学び直す", "技能を高める", "職種を変える", "学びつづける"],
      ko: ["배운다", "일한다", "다시 배운다", "기능을 높인다", "직종을 바꾼다", "계속 배운다"],
      "zh-TW": ["求學", "工作", "重新學習", "技能升級", "轉換職業", "持續學習"],
    } satisfies L10nMap<string[]>,
  },
  nhom: [
    { vi: "Người lao động nâng cấp kỹ năng", en: "Workers upgrading their skills", de: "Beschäftigte, die ihre Fähigkeiten ausbauen", ja: "技能を高めたい働き手", ko: "기능을 높이려는 노동자", "zh-TW": "想提升技能的工作者" },
    { vi: "Công nhân chuyển đổi nghề", en: "Workers changing trade", de: "Beschäftigte im Berufswechsel", ja: "職種を変える人", ko: "직종을 바꾸는 노동자", "zh-TW": "轉換職業的工作者" },
    { vi: "Kỹ thuật viên cập nhật công nghệ", en: "Technicians keeping up with the technology", de: "Fachkräfte, die technisch am Ball bleiben", ja: "技術の変化に追いつく技術者", ko: "기술 변화를 따라잡는 기술자", "zh-TW": "跟上技術演進的技術人員" },
    { vi: "Doanh nghiệp đào tạo lại nhân sự", en: "Employers retraining their people", de: "Unternehmen, die ihre Belegschaft weiterbilden", ja: "人材を学び直させる企業", ko: "인력을 다시 가르치는 기업", "zh-TW": "為員工再培訓的企業" },
  ] satisfies L10nMap[],
  chot: {
    vi: "Giá trị của giáo dục không dừng lại ở ngày tốt nghiệp.",
    en: "The value of an education does not stop on graduation day.",
    de: "Der Wert einer Ausbildung endet nicht am Tag des Abschlusses.",
    ja: "教育の値打ちは、卒業の日で終わりません。",
    ko: "교육의 값어치는 졸업하는 날에 멈추지 않습니다.",
    "zh-TW": "教育的價值，不會停在畢業那天。",
  } satisfies L10nMap,
};

/* ------------------------------------------------------------ khối 07 */

export const CHUYEN_DOI = {
  tieuDe: {
    vi: "Năm chuyển đổi để kiến tạo tương lai",
    en: "Five shifts to build the future on",
    de: "Fünf Veränderungen, auf denen die Zukunft aufbaut",
    ja: "未来をつくる五つの転換",
    ko: "미래를 세우는 다섯 가지 전환",
    "zh-TW": "打造未來的五項轉變",
  } satisfies L10nMap,
  nhanGiaTri: {
    vi: "Giá trị kỳ vọng đối với người học",
    en: "What the learner should gain",
    de: "Was Lernende davon haben sollen",
    ja: "学ぶ人にとっての期待される価値",
    ko: "배우는 이가 얻게 될 것",
    "zh-TW": "對學習者的預期價值",
  } satisfies L10nMap,
  muc: [
    {
      so: "01",
      ten: { vi: "Đào tạo theo năng lực", en: "Teach to capability", de: "Kompetenzorientiert ausbilden", ja: "能力にもとづく教育", ko: "역량 중심 교육", "zh-TW": "以能力為本的培訓" },
      dinhHuong: {
        vi: "Chia chương trình thành các mô-đun năng lực rõ ràng, học xong mô-đun nào là làm được việc ấy.",
        en: "Break the programme into clear capability modules: finish one and you can do that work.",
        de: "Das Programm in klare Kompetenzmodule gliedern: Wer eines abschließt, kann diese Arbeit ausführen.",
        ja: "課程を明確な能力の単位に分ける。ひとつ終えれば、その仕事ができる。",
        ko: "과정을 뚜렷한 역량 단위로 나눕니다. 하나를 마치면 그 일을 할 수 있습니다.",
        "zh-TW": "將課程切分為明確的能力模組：修完一個模組，就能做那件事。",
      },
      hanhDong: {
        vi: ["Mô-đun tự động hóa và điều khiển số", "Mô-đun dữ liệu công nghiệp và AI ứng dụng", "Mô-đun quản trị sản xuất"],
        en: ["Modules in automation and numerical control", "Modules in industrial data and applied AI", "Modules in production management"],
        de: ["Module zu Automatisierung und numerischer Steuerung", "Module zu Industriedaten und angewandter KI", "Module zur Produktionssteuerung"],
        ja: ["自動化と数値制御の単位", "産業データと応用 AI の単位", "生産管理の単位"],
        ko: ["자동화와 수치 제어 모듈", "산업 데이터와 응용 AI 모듈", "생산 관리 모듈"],
        "zh-TW": ["自動化與數值控制模組", "工業數據與應用 AI 模組", "生產管理模組"],
      } satisfies L10nMap<string[]>,
      giaTri: {
        vi: "Biết rõ mình làm được gì sau mỗi chặng, thay vì đợi đến ngày nhận bằng.",
        en: "Knowing what you can do after each stage, instead of waiting for the certificate.",
        de: "Nach jeder Stufe wissen, was man kann – statt auf das Zeugnis zu warten.",
        ja: "資格を待たずとも、段階ごとに自分に何ができるかが分かる。",
        ko: "자격증을 기다릴 것 없이, 단계마다 자기가 무엇을 할 수 있는지 압니다.",
        "zh-TW": "每完成一段就清楚自己會做什麼，不必等到領證那天。",
      },
    },
    {
      so: "02",
      ten: { vi: "Doanh nghiệp cùng tham gia", en: "Employers at the table", de: "Unternehmen mit am Tisch", ja: "企業がその場にいる", ko: "기업이 자리에 함께", "zh-TW": "企業一同參與" },
      dinhHuong: {
        vi: "Doanh nghiệp có mặt từ lúc đặt chuẩn đầu ra, không phải chỉ ở khâu nhận người.",
        en: "Employers are there when the learning outcomes are set, not only when people are hired.",
        de: "Unternehmen sind dabei, wenn die Lernergebnisse festgelegt werden – nicht erst bei der Einstellung.",
        ja: "企業は修了要件を決める段階から加わる。採用の場面だけではなく。",
        ko: "기업은 채용할 때만이 아니라 성취 기준을 정할 때부터 함께합니다.",
        "zh-TW": "企業自訂定學習成果之時即參與，而非只在錄用階段出現。",
      },
      hanhDong: {
        vi: ["Cùng xây chuẩn đầu ra", "Cùng đứng lớp và hướng dẫn thực hành", "Cùng chấm bài đánh giá cuối mô-đun"],
        en: ["Setting learning outcomes together", "Teaching and supervising practice together", "Marking the end-of-module assessment together"],
        de: ["Lernergebnisse gemeinsam festlegen", "Gemeinsam unterrichten und die Praxis begleiten", "Die Modulprüfung gemeinsam bewerten"],
        ja: ["修了要件をともにつくる", "授業と実習指導にともに立つ", "単位末の評価をともに採点する"],
        ko: ["성취 기준을 함께 세운다", "수업과 실습 지도에 함께 선다", "모듈 말미의 평가를 함께 채점한다"],
        "zh-TW": ["共同訂定學習成果", "共同授課並指導實作", "共同評閱模組末的評量"],
      } satisfies L10nMap<string[]>,
      giaTri: {
        vi: "Điều học được đúng với điều nơi tuyển dụng đang cần.",
        en: "What you learn matches what the people hiring actually need.",
        de: "Das Gelernte passt zu dem, was einstellende Betriebe wirklich brauchen.",
        ja: "学んだことが、採用する側の求めと食い違わない。",
        ko: "배운 것이 채용하는 쪽의 필요와 어긋나지 않습니다.",
        "zh-TW": "所學與招募方真正的需求一致。",
      },
    },
    {
      so: "03",
      ten: { vi: "AI là năng lực nền tảng", en: "AI as a basic capability", de: "KI als Grundkompetenz", ja: "AI を土台の力に", ko: "AI를 기본 역량으로", "zh-TW": "AI 作為基礎能力" },
      dinhHuong: {
        vi: "Người học dùng được công cụ AI trong nghề của mình, và biết kiểm chứng kết quả nó đưa ra.",
        en: "Learners can use AI tools within their trade, and can check what those tools return.",
        de: "Lernende können KI-Werkzeuge in ihrem Beruf einsetzen und deren Ergebnisse prüfen.",
        ja: "学ぶ人が自分の職種で AI の道具を使いこなし、返ってきた結果を確かめられる。",
        ko: "배우는 이가 자기 직종에서 AI 도구를 쓰고, 그 결과를 검증할 수 있게 합니다.",
        "zh-TW": "學習者能在自己的職業中運用 AI 工具，並查驗其產出。",
      },
      hanhDong: {
        vi: ["Dùng AI để tra cứu và chuẩn bị trước khi vào xưởng", "Đối chiếu kết quả AI với tài liệu kỹ thuật", "Ghi lại chỗ AI sai để rút kinh nghiệm"],
        en: ["Using AI to look things up and prepare before entering the workshop", "Checking AI answers against the technical documents", "Recording where AI got it wrong, and learning from it"],
        de: ["KI zum Nachschlagen und Vorbereiten nutzen, bevor es in die Werkstatt geht", "KI-Antworten mit den technischen Unterlagen abgleichen", "Festhalten, wo die KI falsch lag – und daraus lernen"],
        ja: ["工場に入る前の下調べと準備に AI を使う", "AI の答えを技術資料と突き合わせる", "AI が誤ったところを書き留め、次に生かす"],
        ko: ["실습장에 들어가기 전 조사와 준비에 AI를 쓴다", "AI의 답을 기술 문서와 대조한다", "AI가 틀린 곳을 적어 두고 배운다"],
        "zh-TW": ["進入工場前，用 AI 查資料與做準備", "把 AI 的答案與技術文件相互比對", "記下 AI 出錯之處，並從中學習"],
      } satisfies L10nMap<string[]>,
      giaTri: {
        vi: "Làm chủ công cụ thay vì phụ thuộc vào nó — và vẫn có người hướng dẫn ở khâu thao tác thật.",
        en: "Mastering the tool rather than depending on it — with an instructor still alongside for the hands-on work.",
        de: "Das Werkzeug beherrschen, statt von ihm abzuhängen – und beim praktischen Tun bleibt eine Lehrkraft dabei.",
        ja: "道具に頼るのではなく使いこなす。実際の作業には指導者がそばにいる。",
        ko: "도구에 기대는 대신 부리게 됩니다. 실제 작업에는 여전히 지도자가 곁에 있습니다.",
        "zh-TW": "駕馭工具而非依賴它；動手操作時，仍有指導者在旁。",
      },
    },
    {
      so: "04",
      ten: { vi: "Đánh giá bằng năng lực thực tế", en: "Assess by what is actually done", de: "Bewerten, was tatsächlich geleistet wird", ja: "実際にできたことで評価する", ko: "실제로 해낸 것으로 평가", "zh-TW": "以實際能力評量" },
      dinhHuong: {
        vi: "Đánh giá dựa trên sản phẩm làm ra và cách làm ra nó, không chỉ dựa trên bài viết.",
        en: "Judge the work produced and the way it was produced, not only the written paper.",
        de: "Das entstandene Werkstück und den Weg dorthin bewerten, nicht nur die schriftliche Arbeit.",
        ja: "できあがった物と、その作り方で評価する。筆記だけではなく。",
        ko: "만들어 낸 것과 만든 방식으로 평가합니다. 필기만이 아니라.",
        "zh-TW": "以做出的成品與製作過程來評量，而不只看筆試。",
      },
      hanhDong: {
        vi: ["Bài tập lớn và sản phẩm thực hành", "Hồ sơ năng lực số theo suốt người học", "Phản hồi từ doanh nghiệp nơi thực tập"],
        en: ["Project work and finished practical pieces", "A digital portfolio that follows the learner", "Feedback from the workplace where they trained"],
        de: ["Projektarbeiten und fertige Werkstücke", "Ein digitales Portfolio, das den Lernenden begleitet", "Rückmeldungen aus dem Ausbildungsbetrieb"],
        ja: ["課題制作と実習の成果物", "学ぶ人についてまわる電子の能力記録", "実習先の企業からの評価"],
        ko: ["과제 작업과 실습 결과물", "배우는 이를 따라다니는 디지털 역량 기록", "실습한 기업에서 오는 평가"],
        "zh-TW": ["專題作業與實作成品", "隨學習者移動的數位能力檔案", "實習企業給出的回饋"],
      } satisfies L10nMap<string[]>,
      giaTri: {
        vi: "Có bằng chứng cụ thể để đưa ra khi đi xin việc.",
        en: "Concrete evidence to show when applying for work.",
        de: "Konkrete Nachweise, die man bei einer Bewerbung vorlegen kann.",
        ja: "就職のときに差し出せる、目に見える証拠が手元に残る。",
        ko: "일자리를 구할 때 내보일 수 있는 구체적인 증거가 남습니다.",
        "zh-TW": "求職時能拿得出來的具體佐證。",
      },
    },
    {
      so: "05",
      ten: { vi: "Học tập linh hoạt", en: "Learning that bends to a life", de: "Lernen, das sich dem Leben anpasst", ja: "暮らしに合う学び方", ko: "삶에 맞춰지는 배움", "zh-TW": "彈性的學習方式" },
      dinhHuong: {
        vi: "Học theo mô-đun, tích lũy kết quả và quay lại học tiếp khi công việc đòi hỏi.",
        en: "Study module by module, bank what you pass, and come back when work demands it.",
        de: "Modulweise lernen, Erreichtes anrechnen lassen und zurückkommen, wenn die Arbeit es verlangt.",
        ja: "単位ごとに学び、積み上げ、仕事が求めたときにまた戻ってくる。",
        ko: "모듈 단위로 배우고 쌓아 두었다가, 일이 요구할 때 다시 돌아옵니다.",
        "zh-TW": "以模組方式學習、累積成果，待工作需要時再回來續讀。",
      },
      hanhDong: {
        vi: ["Lịch học theo mô-đun ngắn", "Tích lũy kết quả học tập qua từng đợt", "Kết hợp phần lý thuyết trực tuyến với thực hành tại xưởng"],
        en: ["Short modules on a flexible timetable", "Credit carried forward from one spell of study to the next", "Theory online, practice in the workshop"],
        de: ["Kurze Module mit flexiblem Zeitplan", "Erreichtes wird von einem Abschnitt zum nächsten mitgenommen", "Theorie online, Praxis in der Werkstatt"],
        ja: ["短い単位で組む時間割", "学んだ結果を次の機会へ持ち越す", "理論はオンライン、実習は工場で"],
        ko: ["짧은 모듈로 짜는 시간표", "배운 결과를 다음 기회로 이어 쌓기", "이론은 온라인, 실습은 실습장에서"],
        "zh-TW": ["以短模組安排的彈性課表", "學習成果可跨梯次累計", "理論線上進行，實作在工場完成"],
      } satisfies L10nMap<string[]>,
      giaTri: {
        vi: "Đi làm rồi vẫn học tiếp được, không phải bỏ việc mới đi học.",
        en: "You can keep learning while working, instead of leaving a job to study.",
        de: "Weiterlernen, ohne die Arbeit aufgeben zu müssen.",
        ja: "働きながら学びつづけられる。仕事を辞めて学校へ、ではなく。",
        ko: "일을 그만두고 학교로 가는 대신, 일하면서 계속 배울 수 있습니다.",
        "zh-TW": "能一邊工作一邊繼續學，不必辭職才能進修。",
      },
    },
  ],
};

/* ------------------------------------------------------------ khối 08 */

export const TAM_NHIN_2045 = {
  nam: "2045",
  tieuDe: {
    vi: "Giáo dục nghề nghiệp ở trung tâm phát triển nhân lực",
    en: "Vocational education at the centre of building a workforce",
    de: "Berufsbildung im Zentrum der Fachkräfteentwicklung",
    ja: "人材づくりの中心に、職業教育を",
    ko: "인력 양성의 한가운데에 직업교육을",
    "zh-TW": "讓技職教育站在人力發展的核心",
  } satisfies L10nMap,
  /* Là tầm nhìn, không phải kết quả đã đạt. Không thêm mốc hay số liệu tăng
     trưởng ở đây chừng nào chưa có tài liệu. */
  tuyenNgon: {
    vi: "Chúng tôi hướng tới một hệ thống nơi người học có thể bước vào sản xuất hiện đại, quay lại học khi cần, và mang năng lực của mình đi xa hơn biên giới.",
    en: "We are working towards a system where a learner can step into modern production, come back to study when they need to, and take their capability beyond the border.",
    de: "Wir arbeiten auf ein System hin, in dem Lernende in die moderne Fertigung eintreten, bei Bedarf zum Lernen zurückkehren und ihre Fähigkeiten über die Grenze hinaus einbringen können.",
    ja: "学ぶ人が現代の生産現場に入り、必要になればまた学びに戻り、身につけた力を国境の外へも持っていける。そんな仕組みを目指しています。",
    ko: "배우는 이가 현대적인 생산 현장으로 들어가고, 필요하면 다시 배우러 돌아오며, 갖춘 역량을 국경 너머로도 가져갈 수 있는 체계를 지향합니다.",
    "zh-TW": "我們期望建立這樣一個體系：學習者能走進現代化生產現場，需要時回來續讀，並把自己的能力帶到國界之外。",
  } satisfies L10nMap,
  huong: [
    { vi: "Phát triển nhân lực kỹ thuật chất lượng cao", en: "Developing a high-quality technical workforce", de: "Hochwertige technische Fachkräfte entwickeln", ja: "質の高い技術人材を育てる", ko: "수준 높은 기술 인력을 길러 냅니다", "zh-TW": "培育優質技術人力" },
    { vi: "Kết nối đào tạo với sản xuất thông minh", en: "Connecting training to smart production", de: "Ausbildung mit intelligenter Fertigung verbinden", ja: "教育とスマート生産をつなぐ", ko: "교육을 스마트 생산과 잇습니다", "zh-TW": "串連培訓與智慧生產" },
    { vi: "Hướng tới nhu cầu nhân lực khu vực châu Á – Thái Bình Dương", en: "Looking to workforce demand across the Asia–Pacific", de: "Den Fachkräftebedarf im asiatisch-pazifischen Raum im Blick", ja: "アジア太平洋地域の人材需要を見据える", ko: "아시아·태평양 지역의 인력 수요를 내다봅니다", "zh-TW": "面向亞太地區的人力需求" },
  ] satisfies L10nMap[],
  chot: {
    vi: "Tương lai thuộc về những tổ chức liên tục học hỏi và thích nghi.",
    en: "The future belongs to organisations that keep learning and adapting.",
    de: "Die Zukunft gehört Organisationen, die weiter lernen und sich anpassen.",
    ja: "未来は、学びつづけ、変わりつづける組織のものです。",
    ko: "미래는 끊임없이 배우고 맞춰 가는 조직의 것입니다.",
    "zh-TW": "未來屬於不斷學習與調適的組織。",
  } satisfies L10nMap,
  anh: {
    src: "/media/education/nghe-03.webp",
    alt: {
      vi: "Buổi học tập trung tại hội trường của trường thành viên",
      en: "A whole-cohort session in a member school's main hall",
      de: "Eine Veranstaltung für den ganzen Jahrgang in der Aula einer Mitgliedsschule",
      ja: "加盟校の講堂で行われた全体授業",
      ko: "회원 학교 대강당에서 열린 전체 수업",
      "zh-TW": "成員學校大禮堂中的全體課程",
    },
  } satisfies Anh,
};

/* ------------------------------------------------------------ khối 09 */

export const KET_NOI = {
  tieuDe: {
    vi: "Kiến tạo năng lực hôm nay. Mở rộng cơ hội ngày mai.",
    en: "Build capability today. Widen the opportunity tomorrow.",
    de: "Heute Kompetenz aufbauen. Morgen Möglichkeiten öffnen.",
    ja: "今日、力をつくる。明日、機会を広げる。",
    ko: "오늘 역량을 세우고, 내일 기회를 넓힙니다.",
    "zh-TW": "今日打造能力，明日開拓機會。",
  } satisfies L10nMap,
  moTa: {
    vi: "Kết nối người học, nhà trường và doanh nghiệp trong một hành trình phát triển năng lực liên tục.",
    en: "Connecting learners, schools and employers in one continuing journey of capability.",
    de: "Lernende, Schulen und Unternehmen in einem fortlaufenden Weg der Kompetenzentwicklung verbinden.",
    ja: "学ぶ人と学校と企業を、力を育てつづける一本の道でつなぐ。",
    ko: "배우는 이와 학교와 기업을, 역량을 키워 가는 하나의 여정으로 잇습니다.",
    "zh-TW": "把學習者、學校與企業，連結在一段持續累積能力的旅程中。",
  } satisfies L10nMap,
  nutChinh: {
    vi: "Khám phá chương trình đào tạo",
    en: "Explore the programmes",
    de: "Bildungsangebote entdecken",
    ja: "教育課程を見る",
    ko: "교육 과정 살펴보기",
    "zh-TW": "探索培訓課程",
  } satisfies L10nMap,
  nutPhu: {
    vi: "Kết nối hợp tác doanh nghiệp",
    en: "Talk to us about partnering",
    de: "Über eine Partnerschaft sprechen",
    ja: "企業連携について相談する",
    ko: "기업 협력 문의하기",
    "zh-TW": "洽談企業合作",
  } satisfies L10nMap,
};

/* --------------------------------------------------------- mục lục */

/**
 * Thanh mục lục trong phạm vi mục, bảy chặng.
 *
 * Khối 01 và 09 không có trong danh sách: một cái là chỗ người đọc vừa đi qua,
 * một cái là chỗ họ sẽ tới khi cuộn hết. Đưa vào chỉ làm thanh dài thêm mà
 * không giúp ai định vị.
 */
export const MUC_LUC = [
  { id: "boi-canh", nhan: { vi: "Bối cảnh", en: "Context", de: "Kontext", ja: "背景", ko: "배경", "zh-TW": "背景" } },
  { id: "gia-tri", nhan: { vi: "Giá trị", en: "Values", de: "Werte", ja: "価値", ko: "가치", "zh-TW": "價值" } },
  { id: "doanh-nghiep", nhan: { vi: "Doanh nghiệp", en: "Employers", de: "Unternehmen", ja: "企業", ko: "기업", "zh-TW": "企業" } },
  { id: "nang-luc-moi", nhan: { vi: "Năng lực mới", en: "New capability", de: "Neue Kompetenzen", ja: "新しい能力", ko: "새 역량", "zh-TW": "新能力" } },
  { id: "hoc-suot-doi", nhan: { vi: "Học suốt đời", en: "Lifelong learning", de: "Lebenslanges Lernen", ja: "生涯学習", ko: "평생 학습", "zh-TW": "終身學習" } },
  { id: "chuyen-doi", nhan: { vi: "Chuyển đổi", en: "The shifts", de: "Die Wandlungen", ja: "転換", ko: "전환", "zh-TW": "轉變" } },
  { id: "nam-2045", nhan: { vi: "2045", en: "2045", de: "2045", ja: "2045", ko: "2045", "zh-TW": "2045" } },
] satisfies { id: string; nhan: L10nMap }[];
