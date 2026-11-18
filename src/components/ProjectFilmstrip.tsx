"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectDTO } from "@/types";

export default function ProjectFilmstrip({ projects }: { projects: ProjectDTO[] }) {
  const track = useRef<HTMLDivElement>(null);
  const canLoop = projects.length > 2;
  const first = canLoop ? 1 : 0;
  const last = first + projects.length - 1;
  const active = useRef(first);
  const [center, setCenter] = useState(first);
  const slides = canLoop
    ? [projects[projects.length - 1], ...projects, projects[0], projects[1]]
    : projects;

  function centerSlide(index: number, behavior: ScrollBehavior) {
    const viewport = track.current;
    const slide = viewport?.children[index] as HTMLElement | undefined;
    if (!viewport || !slide) return;
    const left = slide.offsetLeft + (slide.offsetWidth - viewport.clientWidth) / 2;
    viewport.scrollTo({ left, behavior });
  }

  useLayoutEffect(() => {
    active.current = first;
    centerSlide(first, "instant");
  }, [first, projects.length]);

  useEffect(() => {
    const viewport = track.current;
    if (!viewport) return;
    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const middle = viewport.scrollLeft + viewport.clientWidth / 2;
      const width = (viewport.firstElementChild as HTMLElement).offsetWidth;
      const start = (viewport.firstElementChild as HTMLElement).offsetLeft + width / 2;
      const step = (viewport.children[1] as HTMLElement | undefined)?.offsetLeft;
      const spacing = step === undefined ? width : step - (viewport.firstElementChild as HTMLElement).offsetLeft;
      const index = Math.max(0, Math.min(viewport.children.length - 1, Math.round((middle - start) / spacing)));
      active.current = index;
      setCenter(index);
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (!canLoop || (index >= first && index <= last)) return;
        const target = index < first ? last : first + index - last - 1;
        centerSlide(target, "instant");
      }, 140);
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      clearTimeout(settle);
    };
  }, [canLoop, first, last]);

  function move(direction: number) {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    centerSlide(active.current + direction, motion.matches ? "instant" : "smooth");
  }

  return (
    <div className="project-filmstrip" role="group" aria-label="Project carousel">
      <div
        ref={track}
        className="project-filmstrip-track"
        tabIndex={0}
        aria-label="Scroll through projects"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {slides.map((project, index) => {
          const duplicate = index < first || index > last;
          return (
            <div
              key={`${project.id}-${index}`}
              className="project-filmstrip-slide"
              data-centered={center === index || undefined}
              inert={duplicate}
              aria-hidden={duplicate || undefined}
            >
              <ProjectCard project={project} />
            </div>
          );
        })}
      </div>
      {projects.length > 1 && (
        <div className="project-filmstrip-controls">
          <button type="button" className="project-filmstrip-arrow" aria-label="Previous project" onClick={() => move(-1)} disabled={!canLoop && center === first}>←</button>
          <button type="button" className="project-filmstrip-arrow" aria-label="Next project" onClick={() => move(1)} disabled={!canLoop && center === last}>→</button>
        </div>
      )}
    </div>
  );
}
