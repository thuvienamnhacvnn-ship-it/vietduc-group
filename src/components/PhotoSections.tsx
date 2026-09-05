import { t, type Locale } from "@/lib/i18n/config";
import type { L10n } from "@/lib/db/schema";
import { ghepNhom, type AnhNhom } from "@/content/anh-nhom";
import { PhotoWall } from "./PhotoWall";
import styles from "./PhotoSections.module.css";

/**
 * Nhiều mục ảnh có tiêu đề riêng, thay cho một đống ảnh dưới một tiêu đề chung.
 *
 * Ba mươi tấm ảnh dồn dưới một dòng "Hình ảnh hoạt động" thì người xem không
 * biết mình đang nhìn gì: lễ khai giảng, chuyến từ thiện vùng cao và buổi làm
 * việc ở Berlin nằm lẫn nhau thành một tấm thảm. Chia theo chủ đề thì mỗi mảng
 * ảnh tự nói được nó là gì.
 *
 * Mỗi mục có số đếm riêng, vì với ảnh tư liệu thì "bao nhiêu tấm" là một phần
 * của thông tin.
 */
export function PhotoSections({
  groups,
  all,
  locale,
  otherLabel,
  alt,
}: {
  groups: AnhNhom[];
  all: readonly string[];
  locale: Locale;
  /** Tiêu đề cho những ảnh chưa nhóm nào nhận. */
  otherLabel: L10n;
  /** Mô tả ảnh cho trình đọc màn hình, nhận tiêu đề mục đang dựng. */
  alt: (groupTitle: string) => string;
}) {
  const sections = ghepNhom(groups, all, otherLabel);
  if (!sections.length) return null;

  return (
    <div className={styles.stack}>
      {sections.map((section) => {
        const title = t(section.title, locale);
        return (
          <section key={title} className={styles.group}>
            <header className={styles.head}>
              <h3>{title}</h3>
              <span className={styles.count}>{section.shots.length}</span>
            </header>
            <PhotoWall
              shots={section.shots.map((src) => ({ src, alt: alt(title) }))}
              limit={section.shots.length}
            />
          </section>
        );
      })}
    </div>
  );
}
