import SectionIcon from "@/components/SectionIcon";
import ProjectFilmstrip from "@/components/ProjectFilmstrip";
import type { ProjectDTO } from "@/types";

export default function ProjectsSection({ projects }: { projects: ProjectDTO[] }) {
  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-heading">
      <div className="section-icon" aria-hidden>
        <SectionIcon name="projects" />
      </div>
      <div className="section-body">
        <div className="cli">
          <span className="prompt">›</span> ls ~/projects
        </div>
        <div className="sec-head">
          <h2 id="projects-heading">projects.</h2>
        </div>
        {!projects.length && <p className="sec-sub">No projects listed yet.</p>}
      </div>
      {projects.length > 0 && <ProjectFilmstrip projects={projects} />}
    </section>
  );
}
