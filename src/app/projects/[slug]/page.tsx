import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/chrome/Shell";
import { getProjectBySlug, getProjects, getSiteConfig } from "@/lib/data";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";

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
      const items = b.split("\n");
      if (items.every((item) => item.startsWith("- "))) {
        return `<ul class="list-disc space-y-1 pl-5">${items.map((item) => `<li>${item.slice(2)}</li>`).join("")}</ul>`;
      }
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
  const [p, entries, cfg] = await Promise.all([getProjectBySlug(slug), getProjects(), getSiteConfig()]);
  if (!p) return notFound();
  const isExperience = p.kind === "experience";
  const all = entries.filter((entry) => (entry.kind === "experience") === isExperience);
  const i = all.findIndex((x) => x.slug === slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  return (
    <Shell status={cfg.status} calUrl={cfg.calUrl} email={cfg.email} showLeftRail={false}>
      <main className="detail-shell">
        <nav className="breadcrumb">
          <Link href="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={isExperience ? "/#work" : "/projects"}>{isExperience ? "work" : "projects"}</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{p.name}</span>
        </nav>
        <div className="cli">
          <span className="prompt">›</span> open ~/{isExperience ? "work" : "projects"}/{p.slug}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
            gap: 18,
            padding: "18px 0",
            borderTop: "1px solid var(--line-soft)",
            borderBottom: "1px solid var(--line-soft)",
            margin: "14px 0",
          }}
        >
          {p.role && (
            <div>
              <div className="tool-cat-name">role</div>
              <div>{p.role}</div>
            </div>
          )}
          <div>
            <div className="tool-cat-name">stack</div>
            <div>{p.tags.join(", ")}</div>
          </div>
          {p.when && (
            <div>
              <div className="tool-cat-name">when</div>
              <div>{p.when}</div>
            </div>
          )}
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
              visit live <ArrowUpRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} />
            </a>
          ) : null}
          {p.code ? (
            <a className="pill" href={p.code} target="_blank" rel="noreferrer">
              source <ArrowUpRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} />
            </a>
          ) : null}
        </div>
        <div className="pager">
          {prev ? <Link href={`/projects/${encodeURIComponent(prev.slug)}`}>← {prev.name}</Link> : <span />}
          {next ? (
            <Link href={`/projects/${encodeURIComponent(next.slug)}`} style={{ textAlign: "right" }}>
              {next.name} <ArrowRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </Shell>
  );
}
