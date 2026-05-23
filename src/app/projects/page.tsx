import Link from "next/link";
import Shell from "@/chrome/Shell";
import { getProjects, getSiteConfig, getTracks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectsIndex() {
  const [projects, cfg, tracks] = await Promise.all([
    getProjects(),
    getSiteConfig(),
    getTracks(),
  ]);
  const tagSet = Array.from(new Set(projects.flatMap((p) => p.tags)));

  return (
    <Shell status={cfg.status} tracks={tracks} showLeftRail={false}>
      <Link href="/" className="detail-back">
        ← home
      </Link>
      <main className="detail-shell">
        <div className="cli">
          <span className="prompt">›</span> ls ~/work --all
        </div>
        <h1 className="detail-title">every project.</h1>
        <p className="detail-deck">shipped, half-shipped, and the ones that taught me something.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 24px" }}>
          {tagSet.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="card-grid">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="card">
              <div
                style={{
                  fontFamily: "var(--font-edit)",
                  fontStyle: "italic",
                  fontSize: 22,
                }}
              >
                {p.name}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-dim)" }}>
                {p.role} · {p.when}
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: 0 }}>{p.blurb}</p>
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
