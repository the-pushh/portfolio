import { selectedProjects } from "../../prisma/selected-projects";
import { getProjects } from "./data";
import type { ProjectDTO } from "@/types";

export async function getPublicProjects(): Promise<ProjectDTO[]> {
  const entries = await getProjects();
  const savedSlugs = new Set(entries.map(({ slug }) => slug));
  const bundled: ProjectDTO[] = selectedProjects
    .filter(({ slug }) => !savedSlugs.has(slug))
    .map((project) => ({
      ...project,
      id: `selected:${project.slug}`,
      kind: "project",
      role: "",
      when: "",
      current: false,
      tags: JSON.parse(project.tags) as string[],
    }));

  return [...bundled, ...entries].sort((a, b) => b.order - a.order);
}
