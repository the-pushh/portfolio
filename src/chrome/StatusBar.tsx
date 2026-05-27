"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT_PRESETS, applyAccent, loadAccent } from "@/lib/accent";
import type { TrackDTO } from "@/types";

type Props = {
  status: string;
  tracks: TrackDTO[];
};

export default function StatusBar({ status, tracks }: Props) {
  const [time, setTime] = useState<string>("");
  const [accent, setAccent] = useState<string>("#FEACD6");
  const [open, setOpen] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const popRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const stored = loadAccent();
    const color = stored ?? "#FEACD6";
    applyAccent(color);
    setAccent(color);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (tracks.length === 0) return;
    const id = setInterval(() => setTrackIdx((i) => (i + 1) % tracks.length), 8000);
    return () => clearInterval(id);
  }, [tracks.length]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!popRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function pick(c: string) { applyAccent(c); setAccent(c); }

  const track = tracks[trackIdx];

  return (
    <div className="statusbar">
      <div className="sb-left">
        <a href="#connect" className="status-pill">
          <span className="dot" />
          <span>{status}</span>
        </a>
      </div>

      <div className="sb-right">
        {track && (
          <>
            <span className="sb-item">
              <span className="wave">
                <span /><span /><span /><span />
              </span>
              <span className="sb-track">{track.artist} — {track.title}</span>
            </span>
            <span className="sb-sep" />
          </>
        )}

        <button
          ref={popRef}
          className="sb-btn"
          aria-label="change accent"
          onClick={() => setOpen((v) => !v)}
          style={{ position: "relative" }}
        >
          <span className="sb-swatch" style={{ background: accent }} />
          accent
          {open && (
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
                style={{ width: "100%", height: 28, border: "1px solid var(--line)", borderRadius: 6, background: "transparent" }}
              />
            </div>
          )}
        </button>

        <span className="sb-sep" />

        <a href="/v1/" className="sb-item sb-btn" title="View v1 portfolio" target="_blank" rel="noopener noreferrer">
          v1 ↗
        </a>

        <span className="sb-sep" />

        <span className="sb-item sb-time">{time}</span>
      </div>
    </div>
  );
}
