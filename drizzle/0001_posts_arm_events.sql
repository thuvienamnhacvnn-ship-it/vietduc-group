-- Tin tức tách theo mảng, và phân biệt tin thường với sự kiện.
--
-- Tập đoàn có hai mảng chạy song song với hai bộ giao diện riêng. Trước đây
-- bảng posts không biết bài thuộc mảng nào, nên trang tin của mảng khách sạn
-- không thể tồn tại: nó sẽ hiện cả tin khai giảng.
--
-- Mặc định 'education' vì đó là mảng duy nhất từng có trang tin — bài cũ (nếu
-- có) vẫn đứng đúng chỗ mà không phải sửa tay.
--
-- Mọi câu lệnh đều có IF NOT EXISTS: script chạy lại lần nữa cũng không sao.

ALTER TABLE posts ADD COLUMN IF NOT EXISTS arm text NOT NULL DEFAULT 'education';

-- Sự kiện có ngày diễn ra và nơi chốn, khác với ngày đăng bài. Một buổi hội
-- thảo đăng trước hai tuần thì ngày người đọc cần là ngày hội thảo.
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_event boolean NOT NULL DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_at timestamptz;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_place jsonb;

CREATE INDEX IF NOT EXISTS posts_arm_idx ON posts (arm);
