"use client";

import { useEffect, useMemo, useState } from "react";
import PixelIcon from "./PixelIcon";

type Emoji = "grin" | "squint" | "open" | "think" | "surprise" | "flat" | "smirk";
type Blink = 0 | 1 | 2;

const BLOB: [number, number, number][] = [
  [1,  5,  9],
  [2,  3, 11],
  [3,  2, 12],
  [4,  2, 12],
  [5,  1, 13],
  [6,  1, 13],
  [7,  1, 13],
  [8,  1, 13],
  [9,  1, 13],
  [10, 2, 12],
  [11, 2, 12],
  [12, 3, 11],
  [13, 5,  9],
];

function makeGrid(): string[][] {
  return Array.from({ length: 16 }, () => Array(16).fill("."));
}
function fillBlob(G: string[][]): void {
  for (const [y, x0, x1] of BLOB)
    for (let x = x0; x <= x1; x++) G[y][x] = "#";
}
function cut(G: string[][], y: number, ...xs: number[]): void {
  xs.forEach((x) => { G[y][x] = "."; });
}

function buildPattern(emoji: Emoji, blink: Blink): string {
  const G = makeGrid();
  fillBlob(G);

  // ── eyes ─────────────────────────────────────────────
  if (emoji === "flat") {
    // 😑 single-pixel line eyes — blink collapses them to nothing
    if (blink < 2) cut(G, 5, 3, 4, 5, 9, 10, 11);
  } else if (emoji === "squint") {
    // 😄 thin slit
    if (blink < 2) cut(G, 5, 3, 4, 5, 9, 10, 11);
  } else if (emoji === "think") {
    // 🤔 raised right brow + left open + right squint
    cut(G, 3, 9, 10, 11);
    if (blink === 0) cut(G, 4, 3, 4, 5);
    if (blink < 2) { cut(G, 5, 3, 4, 5); cut(G, 5, 9, 10, 11); }
  } else if (emoji === "surprise") {
    // 😮 extra tall eyes — 3 rows
    if (blink === 0) cut(G, 3, 3, 4, 5, 9, 10, 11);
    if (blink < 2)  cut(G, 4, 3, 4, 5, 9, 10, 11);
    if (blink < 2)  cut(G, 5, 3, 4, 5, 9, 10, 11);
  } else {
    // grin / open / smirk — standard 2×3
    if (blink === 0) cut(G, 4, 3, 4, 5, 9, 10, 11);
    if (blink < 2)  cut(G, 5, 3, 4, 5, 9, 10, 11);
  }

  // ── mouth ─────────────────────────────────────────────
  if (emoji === "grin") {
    // 😃 U-curve smile
    cut(G, 9,  4, 9);
    cut(G, 10, 4, 5, 6, 7, 8, 9);
    cut(G, 11, 5, 6, 7, 8);
  } else if (emoji === "squint") {
    // 😄 big cheeks, wide U
    cut(G, 9,  3, 10);
    cut(G, 10, 3, 4, 9, 10);
    cut(G, 11, 4, 5, 6, 7, 8, 9);
  } else if (emoji === "open") {
    // 😀 O-mouth with teeth bar
    cut(G, 9,  4, 5, 6, 7, 8, 9);
    cut(G, 10, 4, 9);
    cut(G, 11, 4, 5, 6, 7, 8, 9);
  } else if (emoji === "think") {
    // 🤔 small pursed
    cut(G, 10, 6, 7, 8);
  } else if (emoji === "surprise") {
    // 😮 tall O
    cut(G, 8,  6, 7, 8);
    cut(G, 9,  5, 9);
    cut(G, 10, 5, 9);
    cut(G, 11, 6, 7, 8);
  } else if (emoji === "flat") {
    // 😑 dead flat line
    cut(G, 10, 4, 5, 6, 7, 8, 9);
  } else {
    // 😏 smirk — right corner high, left corner low
    cut(G, 9,  8, 9, 10);
    cut(G, 10, 4, 5, 6, 7, 8);
  }

  return G.map((r) => r.join("")).join("\n");
}

export default function PixelCat({ size = 40, talking = false }: { size?: number; talking?: boolean }) {
  const [emoji, setEmoji] = useState<Emoji>("grin");
  const [blink, setBlink] = useState<Blink>(0);

  // ── state machine ──────────────────────────────────────
  useEffect(() => {
    if (talking) return;
    let dead = false;
    let t: ReturnType<typeof setTimeout>;

    function pick<T>(items: T[], weights: number[]): T {
      let r = Math.random() * weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    }

    const NEXT: Record<Emoji, [Emoji[], number[], [number, number]]> = {
      grin:     [["squint","open","think","surprise","flat","smirk"],  [25,15,20,15,12,13], [1500,2500]],
      squint:   [["grin","open","think","surprise","flat","smirk"],    [35,25,15,10,8,7],   [900,1600]],
      open:     [["grin","squint","think","surprise","flat","smirk"],  [40,20,15,12,8,5],   [900,1400]],
      think:    [["grin","squint","open","surprise","smirk","flat"],   [40,15,15,15,10,5],  [2000,2000]],
      surprise: [["grin","open","think","flat","squint"],              [35,20,20,15,10],    [700,1000]],
      flat:     [["grin","squint","smirk","think","grin"],             [30,20,20,15,15],    [1200,2000]],
      smirk:    [["grin","open","think","flat","squint"],              [35,20,20,15,10],    [1200,2000]],
    };

    function run(current: Emoji) {
      const [nexts, weights, [min, extra]] = NEXT[current];
      t = setTimeout(() => {
        if (dead) return;
        const next = pick(nexts, weights);
        setEmoji(next);
        run(next);
      }, min + Math.random() * extra);
    }

    run("grin");
    return () => { dead = true; clearTimeout(t); };
  }, [talking]);

  // ── talking ────────────────────────────────────────────
  useEffect(() => {
    if (!talking) { setEmoji("grin"); return; }
    const id = setInterval(() => setEmoji((e) => (e === "open" ? "grin" : "open")), 180);
    return () => clearInterval(id);
  }, [talking]);

  // ── blink ──────────────────────────────────────────────
  useEffect(() => {
    let dead = false;
    function doBlink() {
      setBlink(1);
      setTimeout(() => { if (!dead) setBlink(2); }, 80);
      setTimeout(() => { if (!dead) setBlink(1); }, 170);
      setTimeout(() => { if (!dead) setBlink(0); }, 250);
    }
    function schedule(): ReturnType<typeof setTimeout> {
      return setTimeout(() => { if (dead) return; doBlink(); schedule(); }, 2200 + Math.random() * 3500);
    }
    const t = schedule();
    return () => { dead = true; clearTimeout(t); };
  }, []);

  const pattern = useMemo(() => buildPattern(emoji, blink), [emoji, blink]);

  return (
    <div style={{ width: size, height: size }}>
      <PixelIcon pattern={pattern} size={size} color="var(--accent)" className="face-morph" />
    </div>
  );
}
