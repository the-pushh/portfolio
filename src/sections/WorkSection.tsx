import Link from "next/link";
import SectionIcon from "@/components/SectionIcon";
import { getProjects } from "@/lib/data";
import type { ProjectDTO } from "@/types";

function Poster({ name }: { name: string }) {
  const seed = name.charCodeAt(0) % 4;
  return (
    <div className="poster">
      <svg viewBox="0 0 320 140" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`g-${name}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-2)" />
            <stop offset="100%" stopColor="var(--bg-deep)" />
          </linearGradient>
        </defs>
        <rect width="320" height="140" fill={`url(#g-${name})`} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            x2={320}
            y1={(i + 1) * 11 + seed}
            y2={(i + 1) * 11 + seed}
            stroke="var(--line-soft)"
            strokeWidth={1}
          />
        ))}
        <text
          x={18}
          y={36}
          fill="var(--ink-soft)"
          fontFamily="var(--font-edit)"
          fontStyle="italic"
          fontSize={26}
        >
          {name}
        </text>
        <circle cx={290} cy={110} r={14} fill="var(--accent)" opacity={0.7} />
      </svg>
    </div>
  );
}

export default async function WorkSection() {
  const projects = await getProjects();
  const current = projects.filter((p) => p.current);
  const past = projects.filter((p) => !p.current);
  const featured = current[0];
  const rest: ProjectDTO[] = [...current.slice(1), ...past];

  return (
    <section id="work" className="section">
      <div className="section-icon">
        <SectionIcon name="work" />
      </div>
      <div className="section-body">
        <div className="cli">
          <span className="prompt">›</span> ls ~/work --shipped --sort=recent
        </div>
        <div className="sec-head">
          <h2>work &amp; projects.</h2>
          <p className="sec-sub">Where I spend my hours — and the small things I&apos;ve shipped alongside.</p>
        </div>

        {/* Featured — single full-width card */}
        {featured && (
          <>
            <div className="label">currently shipping</div>
            <article className="card">
              <Poster name={featured.name} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Link href={`/projects/${featured.slug}`} style={{ fontFamily: "var(--font-edit)", fontStyle: "italic", fontSize: 22 }}>
                  {featured.name}
                </Link>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)" }}>
                  {featured.when}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
                {featured.role}
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: 0 }}>{featured.blurb}</p>
              <div className="tag-row">
                {featured.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                {featured.live && <a className="pill" href={featured.live} target="_blank" rel="noreferrer">live ↗</a>}
                {featured.code && <a className="pill" href={featured.code} target="_blank" rel="noreferrer">code ↗</a>}
              </div>
            </article>
          </>
        )}

        {/* Rest — 2-col mini cards with description + links */}
        {rest.length > 0 && (
          <>
            <div className="label" style={{ marginTop: 36 }}>projects.</div>
            <div className="proj-grid">
              {rest.map((p) => (
                <article key={p.id} className="proj-card">
                  <div className="proj-card-top">
                    <Link href={`/projects/${p.slug}`} className="proj-card-name">{p.name}</Link>
                    <span className="proj-card-when">{p.when}</span>
                  </div>
                  <div className="proj-card-role">{p.role}</div>
                  <p className="proj-card-blurb">{p.blurb}</p>
                  <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 10, flexWrap: "wrap" as const }}>
                    {p.live && <a className="pill" href={p.live} target="_blank" rel="noreferrer">live ↗</a>}
                    {p.code && <a className="pill" href={p.code} target="_blank" rel="noreferrer">code ↗</a>}
                    <Link className="pill" href={`/projects/${p.slug}`}>case →</Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="sec-foot">
          <Link href="/projects">browse every project →</Link>
        </div>
      </div>
    </section>
  );
}
