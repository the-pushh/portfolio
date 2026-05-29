import NameMorph from "@/components/NameMorph";
import SectionIcon from "@/components/SectionIcon";
import { getSiteConfig } from "@/lib/data";
import PullButton from "@/components/PullButton";

export default async function HomeSection() {
  const cfg = await getSiteConfig();
  const paragraphs = (cfg.about || "").split("\n\n").filter(Boolean);

  return (
    <section id="home" className="section">
      <div className="section-icon">
        <SectionIcon name="home" />
      </div>
      <div className="section-body">
        <div className="cli">
          <span className="prompt">›</span> whoami --pretty
        </div>
        <h1 className="editorial-h1">
          <NameMorph />
        </h1>
        <p className="subtitle">{cfg.role}.</p>
        <div className="prose">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <PullButton href={cfg.calUrl} label={cfg.status} />
        </div>
      </div>
    </section>
  );
}
