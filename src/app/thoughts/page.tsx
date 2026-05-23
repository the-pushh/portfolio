import Link from "next/link";
import Shell from "@/chrome/Shell";
import { getSiteConfig, getThoughts, getTracks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ThoughtsIndex() {
  const [thoughts, cfg, tracks] = await Promise.all([
    getThoughts(),
    getSiteConfig(),
    getTracks(),
  ]);
  const featured = thoughts.find((t) => t.featured);
  const tagSet = Array.from(new Set(thoughts.flatMap((t) => t.tags)));

  return (
    <Shell status={cfg.status} tracks={tracks} showLeftRail={false}>
      <Link href="/" className="detail-back">
        ← home
      </Link>
      <main className="detail-shell">
        <div className="cli">
          <span className="prompt">›</span> ls ~/thoughts --all
        </div>
        <h1 className="detail-title">all writing.</h1>
        <p className="detail-deck">notes, longreads, half-formed ideas.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 24px" }}>
          {tagSet.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {featured ? (
          <Link
            href={`/thoughts/${featured.slug}`}
            className="card"
            style={{ marginBottom: 24, display: "block" }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>
              featured
            </div>
            <div
              style={{
                fontFamily: "var(--font-edit)",
                fontStyle: "italic",
                fontSize: 28,
                margin: "8px 0",
              }}
            >
              {featured.title}
            </div>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>{featured.excerpt}</p>
            <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-dim)" }}>
              {featured.date} · {featured.readTime}
            </div>
          </Link>
        ) : null}

        <div>
          {thoughts.map((t, i) => (
            <Link key={t.id} href={`/thoughts/${t.slug}`} className="thought-row">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="title">{t.title}</span>
              <span className="meta">
                {t.date} · {t.readTime}
              </span>
              <span className="arrow">↗</span>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
