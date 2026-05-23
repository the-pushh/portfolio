"use client";

import { useScroll } from "./ScrollContext";

const ITEMS = [
  { id: "home", label: "home", k: "⌘1" },
  { id: "work", label: "work", k: "⌘2" },
  { id: "toolbox", label: "toolbox", k: "⌘3" },
  { id: "thoughts", label: "thoughts", k: "⌘4" },
  { id: "connect", label: "connect", k: "⌘5" },
];

export default function LeftRail() {
  const { active, scrollPct } = useScroll();

  return (
    <nav className="leftrail" aria-label="section navigation">
      {ITEMS.map((it) => (
        <a key={it.id} href={`#${it.id}`} className={active === it.id ? "active" : ""}>
          <span>{it.label}</span>
          <span className="kbd">{it.k}</span>
        </a>
      ))}
      <div
        style={{
          marginTop: 16,
          width: 1,
          height: 80,
          background: "var(--line)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -1,
            top: 0,
            width: 3,
            height: `${scrollPct}%`,
            background: "var(--accent)",
            transition: "height 80ms linear",
          }}
        />
      </div>
    </nav>
  );
}
