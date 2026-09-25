-- Địa điểm đào tạo thực hành ghi trên giấy phép hoạt động.
-- Tách khỏi cột address vì chính giấy phép tách hai thứ này: address là nơi
-- trường đăng ký trụ sở, còn đây là những nơi trường được phép dạy thực hành.
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "training_sites" jsonb;
