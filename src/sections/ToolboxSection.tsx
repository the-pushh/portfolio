import SectionIcon from "@/components/SectionIcon";
import { getSiteConfig, getToolbox } from "@/lib/data";

export default async function ToolboxSection() {
  const [cats, cfg] = await Promise.all([getToolbox(), getSiteConfig()]);

  return (
    <section id="toolbox" className="section">
      <div className="section-icon">
        <SectionIcon name="toolbox" />
      </div>
      <div className="section-body">
        <div className="cli">
          <span className="prompt">›</span> cat toolbox.toml
        </div>
        <div className="sec-head">
          <h2>my toolbox.</h2>
          <p className="sec-sub">What I reach for. Roughly grouped, loosely opinionated.</p>
        </div>
        <div className="tool-grid">
          {cats.map((c) => (
            <div key={c.id}>
              <div className="tool-cat-name">{c.name}</div>
              <ul className="tool-list">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="sec-foot">
          <a href={cfg.resumeUrl} target="_blank" rel="noreferrer">
            resume.pdf ↗
          </a>
        </div>
      </div>
    </section>
  );
}
