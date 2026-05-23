"use client";

import PixelIcon from "./PixelIcon";

const PATTERNS: Record<string, string> = {
  home: `
..#####..
.#.....#.
#.......#
#.......#
#.##.##.#
#.#...#.#
#.#####.#
#.......#
.#######.
`,
  work: `
.#######.
#.......#
#.##.##.#
#.......#
#.#####.#
#.......#
#.......#
.#######.
`,
  toolbox: `
.........
.#.....#.
.##...##.
..#####..
..#####..
.##...##.
.#.....#.
.........
`,
  thoughts: `
..#####..
.#.....#.
#.#####.#
#.......#
#.#####.#
#.......#
#.#####.#
.#.....#.
..#####..
`,
  connect: `
.........
..#...#..
.#.#.#.#.
#...#...#
#.......#
.#.....#.
..#####..
.........
`,
};

type Props = {
  name: "home" | "work" | "toolbox" | "thoughts" | "connect";
  size?: number;
  color?: string;
};

export default function SectionIcon({ name, size = 22, color }: Props) {
  return <PixelIcon pattern={PATTERNS[name]} size={size} color={color} />;
}
