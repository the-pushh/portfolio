"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "./ScrollContext";
import { ACCENT_PRESETS, applyAccent, loadAccent } from "@/lib/accent";
import type { TrackDTO } from "@/types";

type Props = {
  status: string;
  tracks: TrackDTO[];
};

export default function StatusBar({ status, tracks }: Props) {
  const { scrollPct } = useScroll();
  const [now, setNow] = useState<string>("");
  const [accent, setAccent] = useState<string>("#FEACD6");
  const [open, setOpen] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = loadAccent();
    if (stored) {
      applyAccent(stored);
      setAccent(stored);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const ist = new Date(d.getTime() + (5.5 * 60 - d.getTimezoneOffset()) * 60000);
      const hh = String(ist.getUTCHours()).padStart(2, "0");
      const mm = String(ist.getUTCMinutes()).padStart(2, "0");
      setNow(`${hh}:${mm} IST`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (tracks.length === 0) return;
    const id = setInterval(() => {
      setTrackIdx((i) => (i + 1) % tracks.length);
    }, 8000);
    return () => clearInterval(id);
  }, [tracks.length]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function pick(c: string) {
    applyAccent(c);
    setAccent(c);
  }

  const track = tracks[trackIdx];

  return (
    <div className="statusbar">
      <div className="col-left">
        <a href="#connect" className="status-pill">
          <span className="dot" />
          <span>{status}</span>
        </a>
      </div>
      <div className="col-center" ref={popRef}>
        <span>{now}</span>
        <button
          className="pill"
          aria-label="change accent"
          onClick={() => setOpen((v) => !v)}
          style={{ position: "relative" }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          accent
          {open ? (
            <div className="popover" onClick={(e) => e.stopPropagation()}>
              <div className="swatches">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${accent.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
                    style={{ background: c }}
                    onClick={() => pick(c)}
                    aria-label={`accent ${c}`}
                  />
                ))}
              </div>
              <input
                type="color"
                value={accent}
                onChange={(e) => pick(e.target.value)}
                style={{
                  width: "100%",
                  height: 28,
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  background: "transparent",
                }}
              />
            </div>
          ) : null}
        </button>
        <a href="/v1/" className="pill" title="View v1 portfolio" target="_blank" rel="noopener noreferrer">
          v1 ↗
        </a>
      </div>
      <div className="col-right">
        {track ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span className="wave">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span style={{ color: "var(--ink-soft)" }}>
              {track.artist} — {track.title}
            </span>
            <span style={{ color: "var(--ink-mute)" }}>{track.len}</span>
          </span>
        ) : null}
        <span>{Math.round(scrollPct)}%</span>
      </div>
    </div>
  );
}
