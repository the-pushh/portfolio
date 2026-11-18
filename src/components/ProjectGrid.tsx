import ProjectCard from "@/components/ProjectCard";
import type { ProjectDTO } from "@/types";

export default function ProjectGrid({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return <p className="sec-sub">No projects listed yet.</p>;

  return (
    <div className="project-grid">
      {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
    </div>
  );
}
