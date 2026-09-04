import { redirect } from "next/navigation";
import { can, getSessionUser } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { SOCIAL_KEYS, SOCIAL_LABEL, socialHref } from "@/lib/site-config";
import { saveContact, saveSeo, saveSocial } from "../actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const SOCIAL_HINT: Record<string, string> = {
  facebook: "https://facebook.com/tenTrang",
  instagram: "https://instagram.com/tenTaiKhoan",
  tiktok: "https://tiktok.com/@tenTaiKhoan",
  youtube: "https://youtube.com/@tenKenh",
  linkedin: "https://linkedin.com/company/ten-cong-ty",
  zalo: "số điện thoại Zalo, ví dụ 0912345678",
  whatsapp: "số WhatsApp dạng quốc tế, ví dụ +84912345678",
};

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/dang-nhap");
  if (!can(user.role, "settings.write")) redirect("/admin");

  const { contact, social, seo } = await getSiteSettings();

  return (
    <>
      <header className={styles.pageHead}>
        <h1>Cấu hình website</h1>
        <p>
          Thông tin liên hệ, mạng xã hội và SEO dùng chung cho cả ba ngôn ngữ. Ô để trống nghĩa là
          không hiển thị – website không bao giờ tự sinh liên kết thay bạn.
        </p>
      </header>

      <section className={styles.panel}>
        <h2>Mạng xã hội</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Kênh nào để trống thì icon tương ứng biến mất khỏi header, footer và trang liên hệ.
        </p>
        <form action={saveSocial}>
          <div className={styles.fieldGrid}>
            {SOCIAL_KEYS.map((key) => {
              const value = social[key] ?? "";
              const resolved = socialHref(key, value);
              return (
                <div key={key} className={styles.field}>
                  <label htmlFor={`social-${key}`}>{SOCIAL_LABEL[key]}</label>
                  <input
                    id={`social-${key}`}
                    name={key}
                    type="text"
                    defaultValue={value}
                    placeholder={SOCIAL_HINT[key]}
                    className={styles.input}
                  />
                  <small>
                    {resolved ? (
                      <>
                        đang hiển thị:{" "}
                        <a href={resolved} target="_blank" rel="noopener noreferrer">
                          {resolved}
                        </a>
                      </>
                    ) : (
                      "chưa cấu hình – icon bị ẩn"
                    )}
                  </small>
                </div>
              );
            })}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              Lưu mạng xã hội
            </button>
          </div>
        </form>
      </section>

      <section className={styles.panel}>
        <h2>Thông tin liên hệ</h2>
        <form action={saveContact}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="organisationLegalName">Tên pháp nhân</label>
              <input
                id="organisationLegalName"
                name="organisationLegalName"
                defaultValue={contact.organisationLegalName}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="headquarters">Trụ sở</label>
              <input
                id="headquarters"
                name="headquarters"
                defaultValue={contact.headquarters}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Điện thoại (hiển thị)</label>
              <input id="phone" name="phone" defaultValue={contact.phone} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label htmlFor="phoneE164">Điện thoại dạng quốc tế</label>
              <input
                id="phoneE164"
                name="phoneE164"
                defaultValue={contact.phoneE164}
                placeholder="+842431236868"
                className={styles.input}
              />
              <small>Dùng cho nút gọi trên điện thoại.</small>
            </div>
            <div className={styles.field}>
              <label htmlFor="admissionsPhone">Số tư vấn tuyển sinh</label>
              <input
                id="admissionsPhone"
                name="admissionsPhone"
                defaultValue={contact.admissionsPhone}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" defaultValue={contact.email} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                defaultValue={contact.website}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="officeHoursVi">Giờ làm việc</label>
              <input
                id="officeHoursVi"
                name="officeHoursVi"
                defaultValue={contact.officeHours?.vi ?? ""}
                placeholder="Thứ 2 – Thứ 6, 8:00–17:00"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="mapEmbedUrl">URL nhúng bản đồ</label>
              <input
                id="mapEmbedUrl"
                name="mapEmbedUrl"
                defaultValue={contact.mapEmbedUrl}
                className={styles.input}
              />
              <small>Để trống thì trang liên hệ không hiển thị bản đồ.</small>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              Lưu liên hệ
            </button>
          </div>
        </form>
      </section>

      <section className={styles.panel}>
        <h2>SEO</h2>
        <form action={saveSeo}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="siteName">Tên website</label>
              <input
                id="siteName"
                name="siteName"
                defaultValue={seo.siteName}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="siteUrl">Địa chỉ công khai</label>
              <input
                id="siteUrl"
                name="siteUrl"
                defaultValue={seo.siteUrl}
                placeholder="https://vietducgroup.com.vn"
                className={styles.input}
              />
              <small>Dùng cho canonical, sitemap, Open Graph và mã QR.</small>
            </div>
            <div className={styles.field}>
              <label htmlFor="ogImage">Ảnh chia sẻ (Open Graph)</label>
              <input
                id="ogImage"
                name="ogImage"
                defaultValue={seo.ogImage}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGrid} style={{ marginTop: "var(--s-4)" }}>
            <div className={styles.field}>
              <label htmlFor="titleVi">Tiêu đề mặc định — VI</label>
              <input id="titleVi" name="titleVi" defaultValue={seo.defaultTitle.vi} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label htmlFor="titleEn">EN</label>
              <input id="titleEn" name="titleEn" defaultValue={seo.defaultTitle.en ?? ""} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label htmlFor="titleDe">DE</label>
              <input id="titleDe" name="titleDe" defaultValue={seo.defaultTitle.de ?? ""} className={styles.input} />
            </div>
          </div>

          <div className={styles.fieldGrid} style={{ marginTop: "var(--s-4)" }}>
            <div className={styles.field}>
              <label htmlFor="descVi">Mô tả mặc định — VI</label>
              <textarea id="descVi" name="descVi" rows={3} defaultValue={seo.defaultDescription.vi} className={styles.textarea} />
            </div>
            <div className={styles.field}>
              <label htmlFor="descEn">EN</label>
              <textarea id="descEn" name="descEn" rows={3} defaultValue={seo.defaultDescription.en ?? ""} className={styles.textarea} />
            </div>
            <div className={styles.field}>
              <label htmlFor="descDe">DE</label>
              <textarea id="descDe" name="descDe" rows={3} defaultValue={seo.defaultDescription.de ?? ""} className={styles.textarea} />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              Lưu SEO
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
