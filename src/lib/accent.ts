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

export function applyAccent(color: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--accent", color);
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
