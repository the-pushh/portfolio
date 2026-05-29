import HomeSection from "@/sections/HomeSection";
import WorkSection from "@/sections/WorkSection";
import ToolboxSection from "@/sections/ToolboxSection";
import ThoughtsSection from "@/sections/ThoughtsSection";
import ContactSection from "@/sections/ContactSection";
import Shell from "@/chrome/Shell";
import { getSiteConfig, getThoughts } from "@/lib/data";

export default async function HomePage() {
  const [cfg, thoughts] = await Promise.all([getSiteConfig(), getThoughts()]);
  return (
    <Shell status={cfg.status} calUrl={cfg.calUrl} email={cfg.email} hasThoughts={thoughts.length > 0}>
      <main className="page">
        <HomeSection />
        <WorkSection />
        <ToolboxSection />
        <ThoughtsSection />
        <ContactSection />
      </main>
    </Shell>
  );
}
