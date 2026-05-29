"use client";

import { useScroll } from "./ScrollContext";

const BASE_ITEMS = [
  { id: "home", label: "home" },
  { id: "work", label: "work" },
  { id: "toolbox", label: "toolbox" },
  { id: "thoughts", label: "thoughts" },
  { id: "connect", label: "connect" },
];

export default function LeftRail({ hasThoughts = true }: { hasThoughts?: boolean }) {
  const { active, scrollPct } = useScroll();
  const items = BASE_ITEMS
    .filter((i) => i.id !== "thoughts" || hasThoughts)
    .map((i, idx) => ({ ...i, k: `⌘${idx + 1}` }));

  return (
    <nav className="leftrail" aria-label="section navigation">
      {items.map((it) => (
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
