"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT_PRESETS, applyAccent, loadAccent } from "@/lib/accent";
import SpotifyWidget from "./SpotifyWidget";

type Props = {
  status: string;
  calUrl: string;
  email: string;
};

export default function StatusBar({ status, calUrl, email }: Props) {
  const [time, setTime] = useState<string>("");
  const [accent, setAccent] = useState<string>("#FEACD6");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
    const onClick = (e: MouseEvent) => {
      if (!popRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function pick(c: string) { applyAccent(c); setAccent(c); }

  function copyEmail() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="statusbar">
      <div className="sb-left">
        <a href={calUrl} target="_blank" rel="noreferrer" className="sb-btn sb-item">
          <span className="dot" />
          {status}
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg>
        </a>
        <span className="sb-sep" />
        <a href="/resume" target="_blank" rel="noreferrer" className="sb-btn sb-item">
          resume
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg>
        </a>
        <span className="sb-sep" />
        <button className={`sb-btn${copied ? " sb-copied" : ""}`} onClick={copyEmail}>
          {copied ? "copied!" : "mail"}
          {copied
            ? <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 5.5l2.5 2.5 4.5-5"/></svg>
            : <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M1 8V1h7"/></svg>
          }
        </button>
      </div>

      <div className="sb-right">
        {/* <SpotifyWidget /> */}
        {/* <span className="sb-sep" /> */}

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

        <a href="/v1/" className="sb-item sb-btn" title="View v1 portfolio" target="_blank" rel="noopener noreferrer" onClick={() => window.dispatchEvent(new CustomEvent("pause-music"))}>
          v1 ↗
        </a>

        <span className="sb-sep" />

        <span className="sb-item sb-time">{time}</span>
      </div>
    </div>
  );
}
