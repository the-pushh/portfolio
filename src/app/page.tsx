import HomeSection from "@/sections/HomeSection";
import WorkSection from "@/sections/WorkSection";
import ToolboxSection from "@/sections/ToolboxSection";
import ThoughtsSection from "@/sections/ThoughtsSection";
import ContactSection from "@/sections/ContactSection";
import Shell from "@/chrome/Shell";
import { getSiteConfig, getTracks } from "@/lib/data";

export default async function HomePage() {
  const [cfg, tracks] = await Promise.all([getSiteConfig(), getTracks()]);
  return (
    <Shell status={cfg.status} tracks={tracks}>
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
