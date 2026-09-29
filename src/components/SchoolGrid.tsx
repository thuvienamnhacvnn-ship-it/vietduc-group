import Image from "next/image";
import Link from "next/link";
import { localePath, t, type Locale } from "@/lib/i18n/config";
import { giuTenLien } from "@/lib/text";
import type { SchoolRow } from "@/lib/queries";
import styles from "./SchoolGrid.module.css";

/**
 * Tường thẻ các trường thành viên.
 *
 * Ba thẻ một hàng, mỗi trường một tấm ảnh khuôn viên của chính mình chứ không
 * phải một dòng chữ trong danh sách. Thẻ mang sẵn mọi thứ cần biết — số thứ tự,
 * huy hiệu, tên, nơi chốn và số ngành trường đang mở — không giấu gì sau một cú
 * bấm.
 *
 * TRƯỜNG CHƯA CÓ ẢNH vẫn phải ra một tấm thẻ hoàn chỉnh. Bản trước để trống chỗ
 * ảnh, thành ra thẻ ấy là một cái hộp rỗng có mỗi con số ở góc, thấp hơn hẳn
 * hàng bên cạnh và trông như trang bị lỗi. Giờ chỗ ấy là một khung huy hiệu:
 * nền navy sẫm, huy hiệu trường phóng lớn ở giữa, vài nét kẻ chéo rất mờ. Nó
 * đứng ngang hàng với thẻ có ảnh chứ không phải chỗ trống chờ ảnh.
 */
export function SchoolGrid({
  schools,
  locale,
  countLabel,
  programCount,
  coiNguon,
}: {
  schools: SchoolRow[];
  locale: Locale;
  countLabel: (count: number) => string;
  programCount: (schoolId: number) => number;
  /**
   * Gốc chung của cả tường thẻ: huy hiệu tập đoàn, tên tập đoàn và một nhánh
   * rẽ nối xuống lưới trường. Chỉ hiện trên điện thoại — xem .coiNguon trong
   * tệp kiểu dáng. Không truyền thì không dựng, nên trang nào không cần gốc
   * (ví dụ trang Hệ thống trường, vốn đã nói rõ bằng tiêu đề) vẫn như cũ.
   */
  coiNguon?: { ten: string; chuThich: string };
}) {
  return (
    <>
      {coiNguon ? (
        <div className={styles.coiNguon}>
          <span className={styles.coiNguonHuy}>
            <Image
              src="/brand/viet-duc-mark.png"
              alt=""
              width={152}
              height={163}
            />
          </span>
          <strong className={styles.coiNguonTen}>{coiNguon.ten}</strong>
          <span className={styles.coiNguonPhu}>{coiNguon.chuThich}</span>
          <span className={styles.nhanh} aria-hidden="true" />
        </div>
      ) : null}

      <ol className={styles.grid}>
        {schools.map((school, index) => {
          // Tên riêng không bao giờ bị bẻ làm hai dòng — xem giuTenLien().
          const name = giuTenLien(t(school.shortName ?? school.name, locale));
          const city = school.city ? t(school.city, locale) : "";

          return (
            <li
              key={school.id}
              data-reveal
              suppressHydrationWarning
              style={
                {
                  "--reveal-delay": `${(index % 3) * 90}ms`,
                } as React.CSSProperties
              }
            >
              <Link
                href={localePath(locale, `/dao-tao/truong/${school.slug}`)}
                className={styles.card}
                data-anh={school.coverPath ? "co" : "khong"}
              >
                <span
                  className={styles.figure}
                  data-anh={school.coverPath ? "co" : "khong"}
                >
                  {school.coverPath ? (
                    <Image
                      src={school.coverPath}
                      alt=""
                      width={1400}
                      height={1000}
                      sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                    />
                  ) : school.logoPath ? (
                    <span className={styles.huyHieuLon} aria-hidden="true">
                      <Image
                        src={school.logoPath}
                        alt=""
                        width={320}
                        height={320}
                      />
                    </span>
                  ) : null}
                </span>

                <span className={styles.body}>
                  {/*
                  Huy hiệu cưỡi lên đường nối ảnh và chữ, trên nền trắng của
                  riêng nó: đây là dấu hiệu của đơn vị khác, không nhuộm màu.

                  Nó nằm trong phần CHỮ chứ không trong khung ảnh, dù trông như
                  đang đè lên ảnh: khung ảnh phải cắt sát mép để phóng ảnh lúc
                  rê chuột, mà cắt sát thì xén luôn nửa dưới huy hiệu. Phần chữ
                  bắt đầu đúng chỗ khung ảnh kết thúc nên neo vào đây là vừa.

                  Dựng cho MỌI trường có huy hiệu, kể cả trường chưa có ảnh
                  khuôn viên: trên điện thoại đây chính là huy hiệu lớn giữa
                  thẻ, nên thẻ nào cũng phải có. Ở màn hình lớn, thẻ chưa có
                  ảnh đã mang huy hiệu phóng lớn trong khung rồi nên bản này
                  bị tắt — xem .card[data-anh="khong"] .crest.
                */}
                  {school.logoPath ? (
                    <span className={styles.crest}>
                      <Image
                        src={school.logoPath}
                        alt=""
                        width={160}
                        height={160}
                      />
                    </span>
                  ) : null}
                  {/* Dựng cả khi trống: trên điện thoại hai thẻ cạnh nhau
                    mà một thẻ thiếu dòng nơi chốn thì tên hai trường lệch
                    nhau một dòng. Ô rỗng bị tắt ở màn hình lớn — xem
                    .city:empty. */}
                <em className={styles.city}>{city}</em>
                  <strong className={styles.name}>{name}</strong>
                  <span className={styles.foot}>
                    <span className={styles.count}>
                      {countLabel(programCount(school.id))}
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M5 12h13M12 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
