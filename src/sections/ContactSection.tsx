import SectionIcon from "@/components/SectionIcon";
import PixelIcon from "@/components/PixelIcon";
import ISTClock from "@/components/ISTClock";
import { getSiteConfig, getSocials } from "@/lib/data";

const HEART = `
.##.##.
#######
#######
.#####.
..###..
...#...
`;


export default async function ContactSection() {
  const [socials, cfg] = await Promise.all([getSocials(), getSiteConfig()]);
  const date = new Date().toISOString().slice(0, 10);

  return (
    <section id="connect" className="section">
      <div className="section-icon">
        <SectionIcon name="connect" />
      </div>
      <div className="section-body">
        <div className="cli">
          <span className="prompt">›</span> dig +short pushkar --anywhere
        </div>
        <div className="sec-head">
          <h2>say hello.</h2>
          <p className="sec-sub">Email is fastest. I read everything. I usually reply within a day.</p>
          <ISTClock />
        </div>
        <div>
          {socials.map((s, i) => (
            <a
              key={s.id}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="social-row"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="name">{s.key}</span>
              <span className="rule" />
              <span className="val">{s.val}</span>
              <span className="arrow">↗</span>
            </a>
          ))}
        </div>
        <div className="sec-foot">
          <a href={cfg.calUrl} target="_blank" rel="noreferrer">
            book a call ↗
          </a>
        </div>
        <div className="site-credit">
          <PixelIcon pattern={HEART} size={14} color="var(--accent)" gap={1} />
          <span>made with care in bangalore · last build {date}</span>
        </div>
      </div>
    </section>
  );
}
