import Link from "next/link";
import SectionIcon from "@/components/SectionIcon";
import { getThoughts } from "@/lib/data";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default async function ThoughtsSection() {
  const thoughts = await getThoughts();
  if (thoughts.length === 0) return null;

  return (
    <section id="thoughts" className="section">
      <div className="section-icon">
        <SectionIcon name="thoughts" />
      </div>
      <div className="section-body">
        <div className="cli">
          <span className="prompt">›</span> cat ~/thoughts/*.md --sort=recent
        </div>
        <div className="sec-head">
          <h2>thoughts.</h2>
          <p className="sec-sub">A blog. Mostly essays on building software, design as a social act, and music tech.</p>
        </div>
        <div>
          {thoughts.map((t, i) => (
            <Link key={t.id} href={`/thoughts/${t.slug}`} className="thought-row">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="title">{t.title}</span>
              <span className="meta">
                {t.date} · {t.readTime}
              </span>
              <ArrowUpRight className="arrow" size={16} weight="bold" />
            </Link>
          ))}
        </div>
        <div className="sec-foot">
          <Link href="/thoughts">all writing <ArrowRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} /></Link>
          <a href="#" target="_blank" rel="noreferrer">
            rss <ArrowUpRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} />
          </a>
          <a href="https://x.com/0xPushkr" target="_blank" rel="noreferrer">
            x <ArrowUpRight size={13} weight="bold" style={{ display: "inline", verticalAlign: "middle" }} />
          </a>
        </div>
      </div>
    </section>
  );
}
