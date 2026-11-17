import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ProjectDTO } from "@/types";

export default function PortfolioLinks({ entry }: { entry: ProjectDTO }) {
  if (!entry.live && !entry.code) return null;

  return (
    <div className="work-links">
      {entry.live && (
        <a className="work-link" href={entry.live} target="_blank" rel="noreferrer" aria-label={`Live site for ${entry.name}`}>
          live <ArrowUpRight size={12} aria-hidden />
        </a>
      )}
      {entry.code && (
        <a className="work-link" href={entry.code} target="_blank" rel="noreferrer" aria-label={`Source code for ${entry.name}`}>
          code <ArrowUpRight size={12} aria-hidden />
        </a>
      )}
    </div>
  );
}
