"use client";

import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function PullButton({ href, label }: { href: string; label: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  }

  function onLeave() {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = "translate(0,0)";
  }

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="pull-btn"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {label}
      <ArrowUpRight size={13} weight="bold" />
    </a>
  );
}
