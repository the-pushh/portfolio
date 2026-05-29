"use client";

import { useEffect, useRef } from "react";

const NAMES = ["ThePushh", "Pushkar"];
const TYPE_MS = 95;
const DEL_MS  = 55;
const PAUSE_AFTER = 3400;
const PAUSE_BEFORE = 320;

type Props = { className?: string };

export default function NameMorph({ className }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const timer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let ni = 0;
    let ci = 0;
    let del = false;

    const tick = () => {
      const name = NAMES[ni];
      if (!del) {
        ci++;
        if (spanRef.current) spanRef.current.textContent = name.slice(0, ci);
        if (ci === name.length) {
          del = true;
          timer.current = setTimeout(tick, PAUSE_AFTER);
          return;
        }
        timer.current = setTimeout(tick, TYPE_MS);
      } else {
        ci--;
        if (spanRef.current) spanRef.current.textContent = name.slice(0, ci);
        if (ci === 0) {
          del = false;
          ni = (ni + 1) % NAMES.length;
          timer.current = setTimeout(tick, PAUSE_BEFORE);
          return;
        }
        timer.current = setTimeout(tick, DEL_MS);
      }
    };

    if (spanRef.current) spanRef.current.textContent = "";
    timer.current = setTimeout(tick, 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const widest = NAMES.reduce((a, b) => (b.length > a.length ? b : a), NAMES[0]);

  return (
    <span className={`name-morph ${className ?? ""}`}>
      <span className="spacer" aria-hidden="true">{widest}</span>
      <span ref={spanRef} className="active nm-cursor" aria-live="polite" />
    </span>
  );
}
