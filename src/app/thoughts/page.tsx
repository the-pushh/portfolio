import Link from "next/link";
import Shell from "@/chrome/Shell";
import { getSiteConfig, getThoughts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ThoughtsIndex() {
  const [thoughts, cfg] = await Promise.all([getThoughts(), getSiteConfig()]);

  return (
    <Shell status={cfg.status} calUrl={cfg.calUrl} email={cfg.email} showLeftRail={false}>
      <main className="detail-shell">
        <nav className="breadcrumb">
          <Link href="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">writing</span>
        </nav>
        <div className="cli">
          <span className="prompt">›</span> cat ~/thoughts/*.md --sort=recent
        </div>
        <h1 className="detail-title">all writing.</h1>
        <p className="detail-deck">notes, longreads, half-formed ideas.</p>

        <div style={{ marginTop: 32 }}>
          {thoughts.map((t, i) => (
            <Link key={t.id} href={`/thoughts/${t.slug}`} className="thought-row">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="title">{t.title}</span>
              <span className="meta">{t.date} · {t.readTime}</span>
              <span className="arrow">↗</span>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
