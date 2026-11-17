import Link from "next/link";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr";
import ProjectGrid from "@/components/ProjectGrid";
import type { ProjectDTO } from "@/types";

const PREVIEW_COUNT = 4;

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
        <ProjectGrid projects={projects.slice(0, PREVIEW_COUNT)} />
        {projects.length > PREVIEW_COUNT && (
          <div className="sec-foot">
            <Link href="/projects">view all {projects.length} projects →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
