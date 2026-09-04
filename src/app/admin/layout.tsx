import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser, can } from "@/lib/auth";
import { signOut } from "./actions";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị Việt Đức Group",
  // The editor area must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

const NAV = [
  { href: "/admin", label: "Tổng quan", capability: "content.read", exact: true },
  { href: "/admin/noi-dung", label: "Nội dung", capability: "content.read" },
  { href: "/admin/tai-lieu", label: "Tài liệu & PDF", capability: "content.read" },
  { href: "/admin/leads", label: "Đăng ký tư vấn", capability: "leads.read" },
  { href: "/admin/tro-ly", label: "Trợ lý AI", capability: "conversations.read" },
  { href: "/admin/cai-dat", label: "Cấu hình", capability: "settings.write" },
];

const ROLE_LABEL: Record<string, string> = {
  administrator: "Quản trị viên",
  content_editor: "Biên tập nội dung",
  admissions_staff: "Cán bộ tuyển sinh",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  // The sign-in page renders inside this layout too; without a session it must
  // not show the navigation.
  if (!user) return <div className={styles.bare}>{children}</div>;

  const items = NAV.filter((item) => can(user.role, item.capability));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>VĐ</span>
          <span>
            <strong>Việt Đức Group</strong>
            <small>Trang quản trị</small>
          </span>
        </div>

        <nav aria-label="Quản trị">
          <ul className={styles.nav}>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.user}>
          <p className={styles.userName}>{user.name}</p>
          <p className={styles.userRole}>{ROLE_LABEL[user.role] ?? user.role}</p>
          <form action={signOut}>
            <button type="submit" className={styles.signOut}>
              Đăng xuất
            </button>
          </form>
          <Link href="/vi" className={styles.viewSite} target="_blank" rel="noopener noreferrer">
            Xem website ↗
          </Link>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
