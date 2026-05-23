import Link from "next/link";
import SectionIcon from "@/components/SectionIcon";
import { getThoughts } from "@/lib/data";

export default async function ThoughtsSection() {
  const thoughts = await getThoughts();

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
              <span className="arrow">↗</span>
            </Link>
          ))}
        </div>
        <div className="sec-foot">
          <Link href="/thoughts">all writing →</Link>
          <a href="#" target="_blank" rel="noreferrer">
            rss ↗
          </a>
          <a href="https://x.com/0xPushkr" target="_blank" rel="noreferrer">
            x ↗
          </a>
        </div>
      </div>
    </section>
  );
}
