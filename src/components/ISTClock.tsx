"use client";

import { useEffect, useState } from "react";

export default function ISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const ist = new Date(d.getTime() + (330 + d.getTimezoneOffset()) * 60000);
      const hh = String(ist.getHours()).padStart(2, "0");
      const mm = String(ist.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm} IST`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.04em" }}>
      {time} in bangalore
    </span>
  );
}
