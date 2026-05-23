"use client";

import { useEffect, useMemo, useState } from "react";
import PixelIcon from "./PixelIcon";

const BASE = `
......######....
....##########..
...############.
..##############
.###############
.###############
.###############
.###############
################
################
.###############
.###############
.###############
.###############
..##############
...############.
`;

type MouthState = "closed" | "open" | "smile";

function buildFace({ blink, mouth }: { blink: boolean; mouth: MouthState }): string {
  const rows = BASE.replace(/^\n+|\n+$/g, "").split("\n");
  const grid = rows.map((r) => r.split(""));

  // Eyes cut-outs
  if (blink) {
    // slits at row7 cols 5-7 and 9-11
    for (const x of [5, 6, 7]) {
      if (grid[7] && grid[7][x] === "#") grid[7][x] = ".";
    }
    for (const x of [9, 10, 11]) {
      if (grid[7] && grid[7][x] === "#") grid[7][x] = ".";
    }
  } else {
    // 2x2 sockets [6-7, 5-6] and [6-7, 10-11]
    for (const y of [6, 7]) {
      for (const x of [5, 6]) {
        if (grid[y] && grid[y][x] === "#") grid[y][x] = ".";
      }
      for (const x of [10, 11]) {
        if (grid[y] && grid[y][x] === "#") grid[y][x] = ".";
      }
    }
  }

  // Mouth cut-outs
  if (mouth === "closed") {
    for (const x of [6, 7, 8, 9, 10]) {
      if (grid[11] && grid[11][x] === "#") grid[11][x] = ".";
    }
  } else if (mouth === "open") {
    // hollow O
    for (const x of [6, 7, 8, 9, 10]) {
      if (grid[11] && grid[11][x] === "#") grid[11][x] = ".";
      if (grid[13] && grid[13][x] === "#") grid[13][x] = ".";
    }
    if (grid[12]) {
      if (grid[12][6] === "#") grid[12][6] = ".";
      if (grid[12][10] === "#") grid[12][10] = ".";
    }
  } else if (mouth === "smile") {
    for (const x of [6, 7, 8, 9, 10]) {
      if (grid[11] && grid[11][x] === "#") grid[11][x] = ".";
    }
    for (const x of [7, 8, 9]) {
      if (grid[12] && grid[12][x] === "#") grid[12][x] = ".";
    }
  }

  return grid.map((r) => r.join("")).join("\n");
}

type Props = {
  size?: number;
  talking?: boolean;
  color?: string;
};

export default function PixelFace({ size = 40, talking = false, color }: Props) {
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
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!talking) {
      setMouthOpen(false);
      return;
    }
    const id = setInterval(() => {
      setMouthOpen((m) => !m);
    }, 180);
    return () => clearInterval(id);
  }, [talking]);

  const pattern = useMemo(
    () =>
      buildFace({
        blink,
        mouth: talking ? (mouthOpen ? "open" : "closed") : "smile",
      }),
    [blink, talking, mouthOpen]
  );

  return (
    <div className="pix-face-wrap" style={{ width: size, height: size }}>
      <PixelIcon pattern={pattern} size={size} color={color} />
    </div>
  );
}
