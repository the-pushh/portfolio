import { SquaresFour } from "@phosphor-icons/react/dist/ssr";
import ProjectFilmstrip from "@/components/ProjectFilmstrip";
import type { ProjectDTO } from "@/types";

export default function ProjectsSection({ projects }: { projects: ProjectDTO[] }) {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="section-icon" aria-hidden>
        <SquaresFour size={64} weight="duotone" color="var(--accent)" />
      </div>
      <div className="section-body">
        <div className="sec-head">
          <h2 id="projects-heading">projects.</h2>
        </div>
        {!projects.length && <p className="sec-sub">No projects listed yet.</p>}
      </div>
      {projects.length > 0 && <ProjectFilmstrip projects={projects} />}
    </section>
  );
}
