import Link from "next/link";
import SectionIcon from "@/components/SectionIcon";
import PortfolioLinks from "@/components/PortfolioLinks";
import type { ProjectDTO } from "@/types";

export default function WorkSection({ experience }: { experience: ProjectDTO[] }) {
  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <div className="section-icon" aria-hidden>
        <SectionIcon name="work" />
      </div>
      <div className="section-body">
        <div className="sec-head">
          <h2 id="work-heading">work.</h2>
        </div>
        {experience.length ? (
          <ol className="work-timeline" role="list">
            {experience.map((entry) => (
              <li key={entry.id} className="work-timeline-entry">
                <p className="work-when">{entry.when}</p>
                <h3 className="work-name">
                  <Link href={`/projects/${encodeURIComponent(entry.slug)}`}>{entry.name}</Link>
                </h3>
                <p className="work-role">{entry.role}</p>
                <p className="work-blurb">{entry.blurb}</p>
                <PortfolioLinks entry={entry} />
              </li>
            ))}
          </ol>
        ) : <p className="sec-sub">No work experience listed yet.</p>}
      </div>
    </section>
  );
}
