import { t, tList, type Locale } from "@/lib/i18n/config";
import type { VentureBlock } from "@/content/venture-types";
import styles from "./KhoiNoiDung.module.css";

/**
 * Dựng một khối nội dung trích từ hồ sơ: đoạn văn, danh sách, bảng hoặc mốc thời gian.
 *
 * Hồ sơ dự án nào cũng gồm mấy dạng ấy — bảng hạng mục, bảng thống kê đất, dãy
 * mốc tiến độ. Gom chúng vào một kiểu dữ liệu (`VentureBlock`) thì chép hồ sơ
 * lên web chỉ còn là việc điền bảng, không phải dựng lại giao diện mỗi lần.
 *
 * Bảng luôn nằm trong một khung cuộn ngang riêng: bảng năm cột trên màn hình
 * điện thoại mà không có khung cuộn thì nó đẩy ngang cả trang, và cái bị đẩy
 * lệch là toàn bộ phần chữ chứ không riêng cái bảng.
 */
export function KhoiNoiDung({ khoi, locale }: { khoi: VentureBlock; locale: Locale }) {
  const tieuDe = t(khoi.title, locale);

  if (khoi.kind === "prose") {
    return (
      <section className={styles.khoi} data-reveal suppressHydrationWarning>
        <h2>{tieuDe}</h2>
        <div className={styles.van}>
          {tList(khoi.paragraphs, locale).map((doan) => (
            <p key={doan}>{doan}</p>
          ))}
        </div>
      </section>
    );
  }

  if (khoi.kind === "list") {
    return (
      <section className={styles.khoi} data-reveal suppressHydrationWarning>
        <h2>{tieuDe}</h2>
        <ul className={styles.gach}>
          {tList(khoi.items, locale).map((y) => (
            <li key={y}>{y}</li>
          ))}
        </ul>
        {khoi.note ? <p className={styles.ghiChu}>{t(khoi.note, locale)}</p> : null}
      </section>
    );
  }

  if (khoi.kind === "steps") {
    return (
      <section className={styles.khoi} data-reveal suppressHydrationWarning>
        <h2>{tieuDe}</h2>
        <ol className={styles.moc}>
          {khoi.steps.map((buoc) => (
            <li key={t(buoc.when, locale)}>
              <span className={styles.mocKhi}>{t(buoc.when, locale)}</span>
              <span className={styles.mocGi}>{t(buoc.what, locale)}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (khoi.kind === "table") {
    return (
      <section className={styles.khoi} data-reveal suppressHydrationWarning>
        <h2>{tieuDe}</h2>
        <div className={styles.cuon}>
          <table className={styles.bang}>
            <tbody>
              {khoi.rows.map((hang) => (
                <tr key={t(hang.label, locale)}>
                  <th scope="row">{t(hang.label, locale)}</th>
                  <td>{t(hang.value, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {khoi.note ? <p className={styles.ghiChu}>{t(khoi.note, locale)}</p> : null}
      </section>
    );
  }

  return (
    <section className={styles.khoi} data-reveal suppressHydrationWarning>
      <h2>{tieuDe}</h2>
      <div className={styles.cuon}>
        <table className={styles.bang}>
          <thead>
            <tr>
              {khoi.columns.map((cot) => (
                <th key={t(cot, locale)} scope="col">
                  {t(cot, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {khoi.rows.map((hang) => (
              <tr key={t(hang[0], locale)}>
                <th scope="row">{t(hang[0], locale)}</th>
                <td>{t(hang[1], locale)}</td>
                <td>{t(hang[2], locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {khoi.note ? <p className={styles.ghiChu}>{t(khoi.note, locale)}</p> : null}
    </section>
  );
}
