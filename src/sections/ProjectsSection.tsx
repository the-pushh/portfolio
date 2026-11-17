import ProjectFilmstrip from "@/components/ProjectFilmstrip";
import type { ProjectDTO } from "@/types";

export default function ProjectsSection({ projects }: { projects: ProjectDTO[] }) {
  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-heading">
      <div className="sec-head">
        <h2 id="projects-heading">projects.</h2>
      </div>
      {projects.length ? (
        <ProjectFilmstrip projects={projects} />
      ) : <p className="sec-sub">No projects listed yet.</p>}
    </section>
  );
}
