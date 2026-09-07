import Image from "next/image";
import Link from "next/link";
import { localePath, pick, type Locale } from "@/lib/i18n/config";
import { MO_DAU, DICH_CHUYEN, GIA_TRI } from "@/content/tam-nhin";
import {
  DOANH_NGHIEP,
  NANG_LUC_MOI,
  HOC_SUOT_DOI,
  CHUYEN_DOI,
  TAM_NHIN_2045,
  KET_NOI,
} from "@/content/tam-nhin-cach-lam";
import { MucLuc } from "./MucLuc";
import { NamChuyenDoi } from "./NamChuyenDoi";
import styles from "./TamNhin.module.css";

/**
 * Mục "Tầm nhìn & Triết lý giáo dục" của trang Giới thiệu.
 *
 * Chín khối nối nhau thành một mạch đọc. Trang Giới thiệu đã có H1 của riêng
 * nó, nên mục này mở bằng H2 và mỗi khối là một H3 — không có cấp nào bị nhảy
 * cóc, và trình đọc màn hình lướt theo tiêu đề vẫn ra đúng cây.
 *
 * Chữ nghĩa nằm hết ở `src/content/tam-nhin.ts` và `tam-nhin-cach-lam.ts`,
 * kèm ba ràng buộc biên tập ghi ở đầu file thứ nhất. File này chỉ dựng hình.
 */

function MuiTen({ xoay = false }: { xoay?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      style={xoay ? { rotate: "90deg" } : undefined}
    >
      <path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MuiTenVong() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 5.7" strokeLinecap="round" />
      <path d="M20 5.5V11h-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TamNhin({ locale }: { locale: Locale }) {
  const p = (href: string) => localePath(locale, href);

  return (
    <section className={styles.scope} aria-labelledby="tam-nhin">
      {/*
        ---------------------------------------------------- 01 mở đầu

        Không có ảnh nền. Bức ảnh chủ đạo của tập đoàn đã lên làm banner ở đầu
        trang Giới thiệu, nơi nó không mang chữ nào; đặt lại nó ở đây rồi phủ
        chữ lên là quay về đúng chỗ hỏng — chữ rơi vào mặt người. Khối này đứng
        bằng chữ trên nền navy, và con số 2045 làm điểm tựa thị giác.
      */}
      <div className={styles.moDau}>
        <div className={`shell ${styles.moDauTrong}`}>
          <div className={styles.moDauChu}>
            <p className={styles.nhan}>{pick(MO_DAU.nhan, locale)}</p>
            <h2 id="tam-nhin" className={styles.moDauTieuDe}>
              {pick(MO_DAU.tieuDe, locale)}
            </h2>
            <p className={styles.moDauMoTa}>{pick(MO_DAU.moTa, locale)}</p>
            <p className={styles.moDauDan}>{pick(MO_DAU.cauDan, locale)}</p>

            <a className={styles.moDauNut} href="#boi-canh">
              {pick(MO_DAU.nut, locale)}
              <MuiTen xoay />
            </a>
          </div>
        </div>

        <span className={styles.moDauNam} aria-hidden="true">
          {TAM_NHIN_2045.nam}
        </span>
      </div>

      <MucLuc locale={locale} />

      {/* --------------------------------------- 02 dịch chuyển của tri thức */}
      <div id="boi-canh" className={styles.khoi}>
        <div className="shell">
          <div className={styles.dichChuyen}>
            <div className={styles.dichChuyenChu}>
              <h3 className={styles.tieuDeKhoi}>{pick(DICH_CHUYEN.tieuDe, locale)}</h3>
              <p className={styles.thongDiep}>{pick(DICH_CHUYEN.thongDiep, locale)}</p>
              {pick(DICH_CHUYEN.than, locale)
                .split("\n\n")
                .map((doan) => (
                  <p key={doan.slice(0, 24)}>{doan}</p>
                ))}
            </div>

            {/* Chú thích nằm DƯỚI ảnh, không đè lên: bức này nhiều chi tiết,
                chữ nhỏ đặt lên trên sẽ không đọc được ở bất kỳ khổ nào. */}
            <figure className={styles.dichChuyenAnh}>
              <Image
                src={DICH_CHUYEN.anh.src}
                alt={pick(DICH_CHUYEN.anh.alt, locale)}
                width={1400}
                height={1050}
                sizes="(min-width: 1000px) 58vw, 100vw"
              />
              <figcaption>{pick(DICH_CHUYEN.anh.alt, locale)}</figcaption>
            </figure>
          </div>

          <ul className={styles.ungDung}>
            {DICH_CHUYEN.ungDung.map((u) => (
              <li key={u.ten.vi}>
                <strong>{pick(u.ten, locale)}</strong>
                <span>{pick(u.y, locale)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.soSanh}>
            <p className={`${styles.soSanhO} ${styles.soSanhCu}`}>
              {pick(DICH_CHUYEN.soSanh.cu, locale)}
            </p>
            <span className={styles.soSanhMuiTen}>
              <MuiTen />
            </span>
            <p className={`${styles.soSanhO} ${styles.soSanhMoi}`}>
              {pick(DICH_CHUYEN.soSanh.moi, locale)}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------ 03 bốn giá trị cốt lõi */}
      <div id="gia-tri" className={`${styles.khoi} ${styles.khoiNen}`}>
        <div className="shell">
          <h3 className={styles.tieuDeKhoi}>{pick(GIA_TRI.tieuDe, locale)}</h3>
          <p className={styles.dan}>{pick(GIA_TRI.gioiThieu, locale)}</p>

          <ol className={styles.giaTri}>
            {GIA_TRI.muc.map((m) => (
              <li key={m.so} className={styles.giaTriHang} data-reveal>
                <figure className={styles.giaTriAnh}>
                  <Image
                    src={m.anh.src}
                    alt={pick(m.anh.alt, locale)}
                    width={1400}
                    height={1050}
                    sizes="(min-width: 700px) 46vw, 100vw"
                  />
                  <figcaption>{pick(m.anh.alt, locale)}</figcaption>
                </figure>
                <div>
                  <span className={styles.giaTriSo} aria-hidden="true">
                    {m.so}
                  </span>
                  <h4 className={styles.giaTriTen}>{pick(m.ten, locale)}</h4>
                  <p className={styles.giaTriMoTa}>{pick(m.moTa, locale)}</p>
                  <ul className={styles.giaTriY}>
                    {pick(m.y, locale).map((y) => (
                      <li key={y}>{y}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ------------------------------------ 04 đào tạo gắn với doanh nghiệp */}
      <div id="doanh-nghiep" className={styles.khoi}>
        <div className="shell">
          <h3 className={styles.tieuDeKhoi}>{pick(DOANH_NGHIEP.tieuDe, locale)}</h3>
          <p className={styles.dan}>{pick(DOANH_NGHIEP.cauDan, locale)}</p>

          <div className={styles.quyTrinh}>
            <div className={styles.quyTrinhHang}>
              <p className={styles.quyTrinhNhan}>{pick(DOANH_NGHIEP.tachRoi.nhan, locale)}</p>
              <ol className={styles.buoc}>
                {pick(DOANH_NGHIEP.tachRoi.buoc, locale).map((b, i, ds) => (
                  <li key={b}>
                    <span className={styles.buocO}>{b}</span>
                    {i < ds.length - 1 ? (
                      <span className={styles.buocMuiTen}>
                        <MuiTen />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>

            <div className={`${styles.quyTrinhHang} ${styles.quyTrinhHopTac}`}>
              <p className={styles.quyTrinhNhan}>{pick(DOANH_NGHIEP.hopTac.nhan, locale)}</p>
              <ol className={styles.buoc}>
                {pick(DOANH_NGHIEP.hopTac.buoc, locale).map((b, i, ds) => (
                  <li key={b}>
                    <span className={styles.buocO}>{b}</span>
                    {i < ds.length - 1 ? (
                      <span className={styles.buocMuiTen}>
                        <MuiTen />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
              <p className={styles.phanHoi}>
                <MuiTenVong />
                {pick(DOANH_NGHIEP.phanHoi, locale)}
              </p>
            </div>
          </div>

          <figure className={styles.anhRong}>
            <Image
              src={DOANH_NGHIEP.anh.src}
              alt={pick(DOANH_NGHIEP.anh.alt, locale)}
              width={1600}
              height={900}
              sizes="(min-width: 1000px) 1100px, 100vw"
            />
            <figcaption>{pick(DOANH_NGHIEP.anh.alt, locale)}</figcaption>
          </figure>

          <p className={styles.chotKhoi}>{pick(DOANH_NGHIEP.chot, locale)}</p>
        </div>
      </div>

      {/* ------------------------------- 05 công việc và năng lực tương lai */}
      <div id="nang-luc-moi" className={`${styles.khoi} ${styles.khoiNen}`}>
        <div className="shell">
          <h3 className={styles.tieuDeKhoi}>{pick(NANG_LUC_MOI.tieuDe, locale)}</h3>
          <p className={styles.luuY}>{pick(NANG_LUC_MOI.luuY, locale)}</p>

          {/* Ba tấm cho thấy công việc đang nói tới trông ra sao. Danh sách
              tám nhóm bên dưới cố ý không kèm ảnh: kho tư liệu mới đủ cho năm
              nhóm, ba nhóm còn lại mà dựng ảnh thì thành bịa thiết bị. */}
          <ul className={styles.daiAnh}>
            {NANG_LUC_MOI.dai.map((a) => (
              <li key={a.src}>
                <figure>
                  <Image
                    src={a.src}
                    alt={pick(a.alt, locale)}
                    width={1400}
                    height={1050}
                    sizes="(min-width: 700px) 30vw, 100vw"
                  />
                  <figcaption>{pick(a.alt, locale)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <ul className={styles.ngheMoi}>
            {NANG_LUC_MOI.nhom.map((n) => (
              <li key={n.ten.vi} data-reveal>
                <span className={styles.ngheTen}>{pick(n.ten, locale)}</span>
                <span className={styles.ngheY}>{pick(n.y, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ------------------------------------------- 06 học tập suốt đời */}
      <div id="hoc-suot-doi" className={styles.khoi}>
        <div className="shell">
          <h3 className={styles.tieuDeKhoi}>{pick(HOC_SUOT_DOI.tieuDe, locale)}</h3>

          <div className={styles.hanhTrinh}>
            <div className={styles.quyTrinhHang}>
              <p className={styles.quyTrinhNhan}>{pick(HOC_SUOT_DOI.quenThuoc.nhan, locale)}</p>
              <ol className={styles.buoc}>
                {pick(HOC_SUOT_DOI.quenThuoc.buoc, locale).map((b, i, ds) => (
                  <li key={b}>
                    <span className={styles.buocO}>{b}</span>
                    {i < ds.length - 1 ? (
                      <span className={styles.buocMuiTen}>
                        <MuiTen />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.hanhTrinhLap}>
              <p className={styles.quyTrinhNhan}>{pick(HOC_SUOT_DOI.vongLap.nhan, locale)}</p>
              <ol className={styles.buoc}>
                {pick(HOC_SUOT_DOI.vongLap.buoc, locale).map((b, i, ds) => (
                  <li key={b}>
                    <span className={styles.buocO}>{b}</span>
                    {i < ds.length - 1 ? (
                      <span className={styles.buocMuiTen}>
                        <MuiTen />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
              <p className={styles.vongLai}>
                <MuiTenVong />
                {pick(HOC_SUOT_DOI.chot, locale)}
              </p>
            </div>
          </div>

          <ul className={styles.nhomHoc}>
            {HOC_SUOT_DOI.nhom.map((n) => (
              <li key={n.vi}>{pick(n, locale)}</li>
            ))}
          </ul>

          <figure className={styles.anhRong}>
            <Image
              src={HOC_SUOT_DOI.anh.src}
              alt={pick(HOC_SUOT_DOI.anh.alt, locale)}
              width={1600}
              height={900}
              sizes="(min-width: 1000px) 1100px, 100vw"
            />
            <figcaption>{pick(HOC_SUOT_DOI.anh.alt, locale)}</figcaption>
          </figure>
        </div>
      </div>

      {/* ---------------------------------------------- 07 năm chuyển đổi */}
      <div id="chuyen-doi" className={`${styles.khoi} ${styles.khoiNen}`}>
        <div className="shell">
          <h3 className={styles.tieuDeKhoi}>{pick(CHUYEN_DOI.tieuDe, locale)}</h3>
          <NamChuyenDoi locale={locale} />
        </div>
      </div>

      {/* ------------------------------------------------ 08 tầm nhìn 2045 */}
      <div id="nam-2045" className={`${styles.khoi} ${styles.khoiToi}`}>
        <div className="shell">
          <span className={styles.namLon} aria-hidden="true">
            {TAM_NHIN_2045.nam}
          </span>
          <h3 className={styles.tieuDeKhoi}>
            <span className="visually-hidden">{TAM_NHIN_2045.nam} — </span>
            {pick(TAM_NHIN_2045.tieuDe, locale)}
          </h3>

          <div className={styles.n2045}>
            <div>
              <p className={styles.tuyenNgon}>{pick(TAM_NHIN_2045.tuyenNgon, locale)}</p>
              <ol className={styles.huong2045}>
                {TAM_NHIN_2045.huong.map((h) => (
                  <li key={h.vi}>{pick(h, locale)}</li>
                ))}
              </ol>
            </div>

            <figure className={styles.n2045Anh}>
              {/* alt rỗng vì figcaption ngay dưới đã mô tả đúng bức ảnh này.
                  Để cả hai thì trình đọc màn hình đọc câu ấy hai lần. */}
              <Image
                src={TAM_NHIN_2045.anh.src}
                alt=""
                width={1672}
                height={941}
                sizes="(min-width: 1000px) 46vw, 100vw"
              />
              <figcaption>{pick(TAM_NHIN_2045.anh.alt, locale)}</figcaption>
            </figure>
          </div>

          <p className={styles.chotKhoi}>{pick(TAM_NHIN_2045.chot, locale)}</p>
        </div>
      </div>

      {/* ------------------------------------------ 09 kết nối và hành động */}
      <div className={`${styles.khoi} ${styles.khoiToi} ${styles.ketNoi}`}>
        <div className={`shell ${styles.ketNoiTrong}`}>
          <p className={styles.ketNoiDeTua}>
            <span className={styles.cham} aria-hidden="true" />
            {pick(
              {
                vi: "Bắt đầu từ đây",
                en: "Start here",
                de: "Hier beginnen",
                ja: "ここから",
                ko: "여기서 시작",
                "zh-TW": "從這裡開始",
              },
              locale,
            )}
          </p>

          <h3 className={styles.ketNoiTieuDe}>{pick(KET_NOI.tieuDe, locale)}</h3>
          <p className={styles.ketNoiMoTa}>{pick(KET_NOI.moTa, locale)}</p>

          <div className={styles.ketNoiNut}>
            <Link className={styles.nutChinh} href={p("/dao-tao/chuong-trinh")}>
              {pick(KET_NOI.nutChinh, locale)}
              <MuiTen />
            </Link>
            <Link className={styles.nutPhu} href={p("/lien-he")}>
              <span>{pick(KET_NOI.nutPhu, locale)}</span>
              <MuiTen />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
