-- Hệ thống cơ cấu nhân sự.
--
-- Bảng `people` cũ chỉ đủ cho một tấm thẻ: tên, một dòng chức danh, một đoạn
-- tiểu sử. Hồ sơ thật mà tập đoàn gửi sang là "executive profile" đầy đủ —
-- học vị, trình độ, năng lực cốt lõi, hành trình công tác, định hướng — nên
-- các cột dưới đây chứa đúng những phần ấy.
--
-- Mọi câu lệnh đều có IF NOT EXISTS: chạy lại lần nữa cũng không sao.

ALTER TABLE people ADD COLUMN IF NOT EXISTS honorific text;
ALTER TABLE people ADD COLUMN IF NOT EXISTS birth_year integer;
ALTER TABLE people ADD COLUMN IF NOT EXISTS headline jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS quote jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS expertise jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS education jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS competencies jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS career jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS overview jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS highlights jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS focus jsonb;
ALTER TABLE people ADD COLUMN IF NOT EXISTS direction jsonb;

-- Một người, nhiều chức vụ, nhiều đơn vị.
--
-- Đây là điều bảng `people` không diễn đạt nổi và là lý do phải có bảng riêng:
-- Chủ tịch HĐQT tập đoàn đồng thời là Chủ tịch Hội đồng trường ở ba trường và
-- Phó Chủ tịch ở trường thứ tư. Nhét vào một cột `role` thì hoặc mất thông
-- tin, hoặc phải lặp lại cả người ra bốn lần.
--
-- `school_id` NULL nghĩa là chức vụ ở cấp tập đoàn hoặc ở một pháp nhân ngoài
-- hệ thống trường (NIBELC Group, ITW Berlin) — khi ấy tên đơn vị nằm ở
-- `org_label`.
CREATE TABLE IF NOT EXISTS appointments (
  id serial PRIMARY KEY,
  person_id integer NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  school_id integer REFERENCES schools (id) ON DELETE CASCADE,
  -- Tên đơn vị khi không phải một trường trong hệ thống.
  org_label jsonb,
  -- hdqt | hdt | bks | bgh | khac
  body text NOT NULL DEFAULT 'khac',
  title jsonb NOT NULL,
  -- Thứ bậc trong ban, để xếp chủ tịch lên trước thư ký: càng nhỏ càng trước.
  rank integer NOT NULL DEFAULT 50,
  term text,
  decision_ref text,
  is_current boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS appointments_person_idx ON appointments (person_id);
CREATE INDEX IF NOT EXISTS appointments_school_idx ON appointments (school_id);
CREATE INDEX IF NOT EXISTS appointments_body_idx ON appointments (body);
