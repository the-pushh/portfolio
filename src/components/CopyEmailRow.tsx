"use client";

import { useState } from "react";

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <path d="M1 8V1h7" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1.5 5.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export default function CopyEmailRow({ email, idx }: { email: string; idx: number }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button className="social-row copy-row" onClick={copy} style={{ background: "transparent", borderTop: "none", borderLeft: "none", borderRight: "none", width: "100%", textAlign: "left", cursor: "pointer" }}>
      <span className="num">{String(idx + 1).padStart(2, "0")}</span>
      <span className="name">Email</span>
      <span className="rule" />
      <span className="val">{copied ? "copied to clipboard!" : email}</span>
      <span className="arrow" style={{ display: "flex", alignItems: "center" }}>{copied ? <IconCheck /> : <IconCopy />}</span>
    </button>
  );
}
