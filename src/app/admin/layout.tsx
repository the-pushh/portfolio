import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();
  if (!ok) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div
          style={{
            fontFamily: "var(--font-edit)",
            fontStyle: "italic",
            fontSize: 20,
            marginBottom: 16,
            padding: "0 8px",
          }}
        >
          admin
        </div>
        <Link href="/admin">dashboard</Link>
        <Link href="/admin/thoughts">thoughts</Link>
        <Link href="/admin/projects">projects</Link>
        <Link href="/admin/config">site config</Link>
        <Link href="/admin/socials">socials</Link>
        <Link href="/admin/tracks">tracks</Link>
        <Link href="/admin/toolbox">toolbox</Link>
        <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid var(--line-soft)" }}>
          <Link href="/">← view site</Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
