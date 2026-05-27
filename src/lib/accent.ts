"use client";

export const ACCENT_PRESETS = [
  "#FEACD6",
  "#FFB36B",
  "#A6E3FF",
  "#B6F09C",
  "#E0A6FF",
  "#FFE680",
  "#FF7A7A",
  "#F2E8E4",
];

const KEY = "pushh:accent";

const hex = (color: string) => color.replace("#", "%23");

const lighten = (color: string, amount = 0.5) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `#${[r, g, b].map(c => Math.round(c + (255 - c) * amount).toString(16).padStart(2, "0")).join("")}`;
};

const arrowCursor = (color: string) =>
  `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='22'><polygon points='3,2 3,19 7,15 9,21 12,20 10,14 15,14' fill='${hex(color)}' stroke='%231e1e1e' stroke-width='1.2' stroke-linejoin='round'/></svg>") 3 2, default !important`;

const handCursor = (color: string) => {
  const d = `M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path fill="${lighten(color)}" d="${d}"/><path fill="none" stroke="#000" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" d="${d}"/><line stroke="#000" stroke-width="0.75" stroke-linecap="round" x1="19.6" y1="20.7" x2="19.6" y2="17.3"/><line stroke="#000" stroke-width="0.75" stroke-linecap="round" x1="17.6" y1="20.7" x2="17.5" y2="17.3"/><line stroke="#000" stroke-width="0.75" stroke-linecap="round" x1="15.6" y1="17.3" x2="15.6" y2="20.7"/></svg>`;
  return `url("data:image/svg+xml;base64,${btoa(svg)}") 11 8, pointer !important`;
};


export function applyAccent(color: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--accent", color);
  let el = document.getElementById("accent-cursor-style") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "accent-cursor-style";
    document.head.appendChild(el);
  }
  el.textContent = [
    `body{cursor:${arrowCursor(color)};}`,
    `a,button,[role=button],label,select,[type=submit],[type=button],[type=reset]{cursor:${handCursor(color)};}`,
    `p,h1,h2,h3,h4,h5,h6,blockquote,article,section,main,pre,code,input[type=text],textarea,[contenteditable]{cursor:text !important;}`,
  ].join("");
  try {
    localStorage.setItem(KEY, color);
  } catch {}
}

export function loadAccent(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
