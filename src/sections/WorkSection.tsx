import Link from "next/link";
import SectionIcon from "@/components/SectionIcon";
import { getProjects } from "@/lib/data";
import type { ProjectDTO } from "@/types";

function ProjectThumb({ project }: { project: ProjectDTO }) {
  const { slug, name } = project;

  if (slug === "marsmello") {
    return (
      <div className="proj-thumb-wrap">
        <svg viewBox="0 0 360 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id={`rg-${slug}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--bg-deep)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="360" height="150" fill="var(--bg-deep)" />
          <rect width="360" height="150" fill={`url(#rg-${slug})`} />
          {/* orbital rings */}
          <ellipse cx="180" cy="75" rx="90" ry="28" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
          <ellipse cx="180" cy="75" rx="60" ry="18" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.2" />
          {/* planet */}
          <circle cx="180" cy="75" r="22" fill="var(--accent)" opacity="0.55" />
          <circle cx="180" cy="75" r="22" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.8" />
          {/* small moon */}
          <circle cx="248" cy="62" r="5" fill="var(--accent)" opacity="0.4" />
        </svg>
        <span className="proj-thumb-tag">./work/{slug}.app</span>
        <span className="proj-thumb">{name}</span>
      </div>
    );
  }

  if (slug === "rifftrack") {
    const bars = Array.from({ length: 42 }, (_, i) => {
      const h = 12 + Math.abs(Math.sin(i * 0.45) * 38 + Math.cos(i * 0.3) * 18);
      return { x: 14 + i * 8, h };
    });
    return (
      <div className="proj-thumb-wrap">
        <svg viewBox="0 0 360 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id={`rg-${slug}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--bg-deep)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="360" height="150" fill="var(--bg-deep)" />
          <rect width="360" height="150" fill={`url(#rg-${slug})`} />
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={75 - b.h / 2}
              width="4"
              height={b.h}
              rx="2"
              fill="var(--accent)"
              opacity={0.18 + (i % 5) * 0.06}
            />
          ))}
        </svg>
        <span className="proj-thumb-tag">./work/{slug}.app</span>
        <span className="proj-thumb">{name}</span>
      </div>
    );
  }

  return (
    <div className="proj-thumb-wrap">
      <svg viewBox="0 0 360 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`rg-${slug}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--bg-deep)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height="150" fill="var(--bg-deep)" />
        <rect width="360" height="150" fill={`url(#rg-${slug})`} />
        <circle cx="180" cy="75" r="38" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
        <circle cx="180" cy="75" r="22" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="180" cy="75" r="8" fill="var(--accent)" opacity="0.5" />
      </svg>
      <span className="proj-thumb-tag">./work/{slug}.app</span>
      <span className="proj-thumb">{name}</span>
    </div>
  );
}

function FeaturedCard({ p }: { p: ProjectDTO }) {
  return (
    <article className="work-card">
      <div className="work-meta">
        <div className="work-titleline">
          <Link href={`/projects/${p.slug}`} className="work-name">{p.name}</Link>
          <span className="work-when">{p.when}</span>
        </div>
        <div className="work-role">{p.role}</div>
        <p className="work-blurb">{p.blurb}</p>
        <div className="work-foot">
          <div className="work-tags">
            {p.tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}
          </div>
          <div className="work-links">
            {p.live && <a className="work-link" href={p.live} target="_blank" rel="noreferrer">live ↗</a>}
            {p.code && <a className="work-link" href={p.code} target="_blank" rel="noreferrer">code ↗</a>}
            <Link className="work-link" href={`/projects/${p.slug}`}>case →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function PastItem({ p }: { p: ProjectDTO }) {
  return (
    <div className="past-item">
      <div className="past-head">
        <span className="past-name">{p.name}</span>
        <span className="past-when">{p.when}</span>
      </div>
      <div className="past-role">{p.role}</div>
      <p className="past-blurb">{p.blurb}</p>
      <div className="work-links past-links">
        {p.live && <a className="work-link" href={p.live} target="_blank" rel="noreferrer">live ↗</a>}
        {p.code && <a className="work-link" href={p.code} target="_blank" rel="noreferrer">code ↗</a>}
        <Link className="work-link" href={`/projects/${p.slug}`}>case →</Link>
      </div>
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

        {featured && (
          <>
            <div className="label">currently shipping</div>
            <FeaturedCard p={featured} />
          </>
        )}

        {rest.length > 0 && (
          <>
            <div className="label" style={{ marginTop: 36 }}>projects.</div>
            <div className="past-grid">
              {rest.map((p) => <PastItem key={p.id} p={p} />)}
            </div>
          </>
        )}

        <div className="sec-foot">
          <Link href="/projects">all projects →</Link>
        </div>
      </div>
    </section>
  );
}
