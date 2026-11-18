import HomeSection from "@/sections/HomeSection";
import WorkSection from "@/sections/WorkSection";
import ProjectsSection from "@/sections/ProjectsSection";
import ToolboxSection from "@/sections/ToolboxSection";
import ThoughtsSection from "@/sections/ThoughtsSection";
import ContactSection from "@/sections/ContactSection";
import Shell from "@/chrome/Shell";
import { getSiteConfig, getThoughts } from "@/lib/data";
import { getPublicProjects } from "@/lib/public-projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cfg, thoughts, entries] = await Promise.all([getSiteConfig(), getThoughts(), getPublicProjects()]);
  const experience = entries.filter((entry) => entry.kind === "experience");
  const projects = entries.filter((entry) => entry.kind !== "experience");
  return (
    <Shell status={cfg.status} calUrl={cfg.calUrl} email={cfg.email} hasThoughts={thoughts.length > 0}>
      <main className="page">
        <HomeSection />
        <WorkSection experience={experience} />
        <ProjectsSection projects={projects} />
        <ToolboxSection />
        <ThoughtsSection />
        <ContactSection />
      </main>
    </Shell>
  );
}
