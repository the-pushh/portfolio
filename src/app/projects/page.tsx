import Link from "next/link";
import Shell from "@/chrome/Shell";
import { getProjects, getSiteConfig, getTracks } from "@/lib/data";
import type { ProjectDTO } from "@/types";

export const dynamic = "force-dynamic";

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

export default async function ProjectsIndex() {
  const [projects, cfg, tracks] = await Promise.all([
    getProjects(),
    getSiteConfig(),
    getTracks(),
  ]);

  return (
    <Shell status={cfg.status} tracks={tracks} showLeftRail={false}>
      <main className="detail-shell">
        <nav className="breadcrumb">
          <Link href="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">projects</span>
        </nav>
        <div className="cli">
          <span className="prompt">›</span> ls ~/work --all
        </div>
        <h1 className="detail-title">all projects.</h1>
        <p className="detail-deck">shipped, half-shipped, and the ones that taught me something.</p>

        <div className="past-grid" style={{ marginTop: 32 }}>
          {projects.map((p) => <PastItem key={p.id} p={p} />)}
        </div>
      </main>
    </Shell>
  );
}

