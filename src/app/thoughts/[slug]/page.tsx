import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/chrome/Shell";
import { getSiteConfig, getThoughtBySlug, getThoughts, getTracks } from "@/lib/data";

export const dynamic = "force-dynamic";

function mdToHtml(md: string): string {
  // very tiny markdown: paragraphs + headings + bold + italics
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const lines = escaped.split("\n\n");
  return lines
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("## ")) return `<h2>${b.slice(3)}</h2>`;
      if (b.startsWith("# ")) return `<h2>${b.slice(2)}</h2>`;
      const inline = b
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br/>");
      return `<p>${inline}</p>`;
    })
    .join("\n");
}

export default async function ThoughtDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [t, all, cfg, tracks] = await Promise.all([
    getThoughtBySlug(slug),
    getThoughts(),
    getSiteConfig(),
    getTracks(),
  ]);
  if (!t) return notFound();
  const i = all.findIndex((x) => x.slug === slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  return (
    <Shell status={cfg.status} tracks={tracks} showLeftRail={false}>
      <Link href="/thoughts" className="detail-back">
        ← all writing
      </Link>
      <main className="detail-shell">
        <div className="cli">
          <span className="prompt">›</span> cat ~/thoughts/{t.slug}.md
        </div>
        <h1 className="detail-title">{t.title}</h1>
        <p className="detail-deck">{t.excerpt}</p>
        <div className="detail-meta">
          <span>{t.date}</span>
          <span>· {t.readTime}</span>
          {t.tags.map((tg) => (
            <span key={tg}>· {tg}</span>
          ))}
        </div>
        <div
          className="detail-prose"
          dangerouslySetInnerHTML={{
            __html: mdToHtml(
              t.content ||
                `${t.excerpt}\n\nMore on this soon. In the meantime, the working draft lives in a notebook on my desk.`
            ),
          }}
        />
        <div className="pager">
          {prev ? (
            <Link href={`/thoughts/${prev.slug}`}>← {prev.title}</Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/thoughts/${next.slug}`} style={{ textAlign: "right" }}>
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </Shell>
  );
}
