import Link from "next/link";
import Shell from "@/chrome/Shell";
import { getSiteConfig } from "@/lib/data";
import { getPublicProjects } from "@/lib/public-projects";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

export default async function ProjectsIndex() {
  const [entries, cfg] = await Promise.all([getPublicProjects(), getSiteConfig()]);
  const projects = entries.filter((entry) => entry.kind !== "experience");

  return (
    <Shell status={cfg.status} calUrl={cfg.calUrl} email={cfg.email} showLeftRail={false}>
      <main className="detail-shell">
        <nav className="breadcrumb">
          <Link href="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">projects</span>
        </nav>
        <div className="cli">
          <span className="prompt">›</span> ls ~/projects --all
        </div>
        <h1 className="detail-title">all projects.</h1>
        <p className="detail-deck">shipped, half-shipped, and the ones that taught me something.</p>

        <div style={{ marginTop: 32 }}>
          <ProjectGrid projects={projects} />
        </div>
      </main>
    </Shell>
  );
}

