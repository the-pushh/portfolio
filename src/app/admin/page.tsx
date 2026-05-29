import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [tCount, pCount, sCount, plCount] = await Promise.all([
    prisma.thought.count(),
    prisma.project.count(),
    prisma.social.count(),
    prisma.spotifyPlaylist.count(),
  ]);

  const cards = [
    { href: "/admin/thoughts", label: "thoughts", count: tCount },
    { href: "/admin/projects", label: "projects", count: pCount },
    { href: "/admin/socials", label: "socials", count: sCount },
    { href: "/admin/playlists", label: "playlists", count: plCount },
    { href: "/admin/toolbox", label: "toolbox", count: null },
    { href: "/admin/config", label: "site config", count: null },
  ];

  return (
    <div>
      <h1 className="admin-h1">dashboard</h1>
      <p style={{ color: "var(--ink-dim)", marginTop: 0 }}>manage all site content.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              border: "1px solid var(--line)",
              background: "var(--bg-2)",
              borderRadius: 12,
              padding: 16,
              display: "block",
            }}
          >
            <div style={{ fontFamily: "var(--font-edit)", fontStyle: "italic", fontSize: 22 }}>
              {c.label}
            </div>
            {c.count !== null ? (
              <div style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 6 }}>
                {c.count} entries
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
