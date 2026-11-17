import Link from "next/link";
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
        {projects.length > 0 && (
          <div className="sec-foot">
            <Link href="/projects">view all {projects.length} projects →</Link>
          </div>
        )}
      </div>
      {projects.length ? (
        <ProjectFilmstrip projects={projects} />
      ) : <p className="sec-sub project-filmstrip-empty">No projects listed yet.</p>}
    </section>
  );
}
