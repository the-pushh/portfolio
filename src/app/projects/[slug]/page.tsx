import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/chrome/Shell";
import { getProjectBySlug, getProjects, getSiteConfig, getTracks } from "@/lib/data";

export const dynamic = "force-dynamic";

function mdToHtml(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const lines = escaped.split("\n\n");
  return lines
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("## ")) return `<h2>${b.slice(3)}</h2>`;
      if (b.startsWith("# ")) return `<h2>${b.slice(2)}</h2>`;
      const inline = b
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br/>");
      return `<p>${inline}</p>`;
    })
    .join("\n");
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, all, cfg, tracks] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSiteConfig(),
    getTracks(),
  ]);
  if (!p) return notFound();
  const i = all.findIndex((x) => x.slug === slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  return (
    <Shell status={cfg.status} tracks={tracks} showLeftRail={false}>
      <main className="detail-shell">
        <nav className="breadcrumb">
          <Link href="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/projects">projects</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{p.name}</span>
        </nav>
        <div className="cli">
          <span className="prompt">›</span> open ~/work/{p.slug}
        </div>
        <div className="poster" style={{ marginTop: 12 }}>
          <svg viewBox="0 0 320 140" width="100%" height="100%" preserveAspectRatio="none">
            <rect width="320" height="140" fill="var(--bg-2)" />
            <text
              x={20}
              y={40}
              fill="var(--ink-soft)"
              fontFamily="var(--font-edit)"
              fontStyle="italic"
              fontSize={28}
            >
              {p.name}
            </text>
            <circle cx={280} cy={110} r={16} fill="var(--accent)" opacity={0.7} />
          </svg>
        </div>
        <h1 className="detail-title">{p.name}</h1>
        <p className="detail-deck">{p.blurb}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            padding: "18px 0",
            borderTop: "1px solid var(--line-soft)",
            borderBottom: "1px solid var(--line-soft)",
            margin: "14px 0",
          }}
        >
          <div>
            <div className="tool-cat-name">role</div>
            <div>{p.role}</div>
          </div>
          <div>
            <div className="tool-cat-name">stack</div>
            <div>{p.tags.join(", ")}</div>
          </div>
          <div>
            <div className="tool-cat-name">when</div>
            <div>{p.when}</div>
          </div>
        </div>
        <div
          className="detail-prose"
          dangerouslySetInnerHTML={{
            __html: mdToHtml(
              p.content ||
                `${p.blurb}\n\nMore details soon. For now, hit the links below.`
            ),
          }}
        />
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {p.live ? (
            <a className="pill" href={p.live} target="_blank" rel="noreferrer">
              visit live ↗
            </a>
          ) : null}
          {p.code ? (
            <a className="pill" href={p.code} target="_blank" rel="noreferrer">
              source ↗
            </a>
          ) : null}
        </div>
        <div className="pager">
          {prev ? <Link href={`/projects/${prev.slug}`}>← {prev.name}</Link> : <span />}
          {next ? (
            <Link href={`/projects/${next.slug}`} style={{ textAlign: "right" }}>
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </Shell>
  );
}
