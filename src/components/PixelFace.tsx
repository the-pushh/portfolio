"use client";

import { useEffect, useMemo, useState } from "react";
import PixelIcon from "./PixelIcon";

type MouthState = "closed" | "open" | "smile";

function buildFace({ blink, mouth }: { blink: boolean; mouth: MouthState }): string {
  const grid: string[][] = Array.from({ length: 16 }, () => Array(16).fill("."));

  // Eyes
  if (blink) {
    for (const x of [5, 6, 7]) grid[7][x] = "#";
    for (const x of [9, 10, 11]) grid[7][x] = "#";
  } else {
    for (const y of [6, 7]) {
      for (const x of [5, 6]) grid[y][x] = "#";
      for (const x of [10, 11]) grid[y][x] = "#";
    }
  }

  // Mouth
  if (mouth === "closed") {
    for (const x of [6, 7, 8, 9, 10]) grid[11][x] = "#";
  } else if (mouth === "open") {
    for (const x of [6, 7, 8, 9, 10]) { grid[11][x] = "#"; grid[13][x] = "#"; }
    grid[12][6] = "#"; grid[12][10] = "#";
  } else {
    for (const x of [6, 7, 8, 9, 10]) grid[11][x] = "#";
    for (const x of [7, 8, 9]) grid[12][x] = "#";
  }

  return grid.map((r) => r.join("")).join("\n");
}

type Props = {
  size?: number;
  talking?: boolean;
};

export default function PixelFace({ size = 40, talking = false }: Props) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      if (Math.random() < 0.6) {
        setBlink(true);
        setTimeout(() => setBlink(false), 110);
      }
    };
    const id = setInterval(tick, 2400);
    return () => { alive = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (!talking) { setMouthOpen(false); return; }
    const id = setInterval(() => setMouthOpen((m) => !m), 180);
    return () => clearInterval(id);
  }, [talking]);

  const pattern = useMemo(
    () => buildFace({ blink, mouth: talking ? (mouthOpen ? "open" : "closed") : "smile" }),
    [blink, talking, mouthOpen]
  );

  return (
    <div style={{ width: size, height: size }}>
      <PixelIcon pattern={pattern} size={size} color="var(--accent)" />
    </div>
  );
}
