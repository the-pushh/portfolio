import Link from "next/link";
import PortfolioLinks from "@/components/PortfolioLinks";
import type { ProjectDTO } from "@/types";

export default function ProjectGrid({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return <p className="sec-sub">No projects listed yet.</p>;

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article key={project.id} className="work-card">
          <div className="work-meta">
            {project.when && <p className="work-when">{project.when}</p>}
            <h3 className="work-name">
              <Link href={`/projects/${encodeURIComponent(project.slug)}`}>{project.name}</Link>
            </h3>
            {project.role && <p className="work-role">{project.role}</p>}
            <p className="work-blurb">{project.blurb}</p>
            <div className="work-foot">
              <div className="work-tags">
                {project.tags.map((tag) => <span key={tag} className="proj-tag">{tag}</span>)}
              </div>
              <PortfolioLinks entry={project} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
