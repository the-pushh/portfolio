import Link from "next/link";
import ProjectImage from "@/components/ProjectImage";
import PortfolioLinks from "@/components/PortfolioLinks";
import type { ProjectDTO } from "@/types";

export default function ProjectCard({ project, reserveImage = false }: { project: ProjectDTO; reserveImage?: boolean }) {
  return (
    <article className="project-entry">
      {reserveImage && (
        project.id.startsWith("selected:")
          ? <div className="project-entry-image" aria-hidden="true" />
          : <ProjectImage key={project.id} id={project.id} />
      )}
      <h3 className="project-entry-title">
        <Link href={`/projects/${encodeURIComponent(project.slug)}`}>{project.name}</Link>
      </h3>
      {project.when && <p className="work-when">{project.when}</p>}
      <p className="work-blurb">{project.blurb}</p>
      <PortfolioLinks entry={project} />
      {project.tags.length > 0 && (
        <ul className="project-entry-skills" aria-label="Skills">
          {project.tags.map((tag) => <li key={tag} className="proj-tag">{tag}</li>)}
        </ul>
      )}
    </article>
  );
}
