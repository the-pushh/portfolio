import SectionIcon from "@/components/SectionIcon";
import PixelIcon from "@/components/PixelIcon";
import ISTClock from "@/components/ISTClock";
import CopyEmailRow from "@/components/CopyEmailRow";
import { getSiteConfig, getSocials } from "@/lib/data";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

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
          {socials.map((s, i) =>
            s.href.startsWith("mailto:") ? (
              <CopyEmailRow key={s.id} email={s.val} idx={i} />
            ) : (
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
                <ArrowUpRight className="arrow" size={16} weight="bold" />
              </a>
            )
          )}
        </div>
        <div className="sec-foot">
          <a href={cfg.calUrl} target="_blank" rel="noreferrer">
            book a call <ArrowUpRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} />
          </a>
        </div>
        <div className="site-credit">
          <PixelIcon pattern={HEART} size={14} color="var(--accent)" gap={1} />
          <span>made with love in bangalore</span>
        </div>
      </div>
    </section>
  );
}
