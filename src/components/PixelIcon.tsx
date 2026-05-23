"use client";

import { CSSProperties, useMemo } from "react";

export function parsePattern(p: string): { rows: string[]; w: number; h: number } {
  const lines = p.replace(/^\n+|\n+$/g, "").split("\n");
  // Dedent: find min leading whitespace
  let min = Infinity;
  for (const l of lines) {
    if (!l.trim()) continue;
    const m = l.match(/^[ \t]*/);
    if (m) min = Math.min(min, m[0].length);
  }
  if (!isFinite(min)) min = 0;
  const stripped = lines.map((l) => l.slice(min).replace(/[ \t]+$/g, ""));
  const w = stripped.reduce((a, b) => Math.max(a, b.length), 0);
  const padded = stripped.map((l) => l.padEnd(w, "."));
  return { rows: padded, w, h: padded.length };
}

type Props = {
  pattern: string;
  size?: number; // total width in px
  color?: string;
  gap?: number;
  className?: string;
  style?: CSSProperties;
};

export default function PixelIcon({ pattern, size = 24, color, gap = 1, className, style }: Props) {
  const { rows, w, h } = useMemo(() => parsePattern(pattern), [pattern]);
  const cell = w > 0 ? Math.floor(size / w) : 0;
  const cells: { lit: boolean; key: string }[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      cells.push({ lit: rows[y][x] === "#", key: `${y}-${x}` });
    }
  }
  return (
    <div
      className={`pix ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${w}, ${cell}px)`,
        gridTemplateRows: `repeat(${h}, ${cell}px)`,
        gap: `${gap}px`,
        ...style,
      }}
    >
      {cells.map((c) => (
        <span
          key={c.key}
          className={c.lit ? "on" : ""}
          style={c.lit && color ? { background: color } : undefined}
        />
      ))}
    </div>
  );
}
