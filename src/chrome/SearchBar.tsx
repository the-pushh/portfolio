"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Cmd = {
  id: string;
  group: "jump to section" | "pages" | "actions";
  label: string;
  action: () => void;
  kbd?: string;
  kind?: "external" | "mail";
};

function IconExternal() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M2 8L8 2M8 2H4M8 2v4" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <path d="M1 8V1h7" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1.5 5.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export default function SearchBar({ onOpenChat, hasThoughts = true }: { onOpenChat?: () => void; hasThoughts?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  const sections = useMemo(() => {
    const base = [
      { id: "home", label: "home" },
      { id: "work", label: "work" },
      { id: "toolbox", label: "toolbox" },
      ...(hasThoughts ? [{ id: "thoughts", label: "thoughts" }] : []),
      { id: "connect", label: "connect" },
    ];
    return base.map((s, i) => ({ ...s, kbd: `⌘${i + 1}` }));
  }, [hasThoughts]);

  const commands: Cmd[] = useMemo(
    () => [
      ...sections.map((s) => ({
        id: `go-${s.id}`,
        group: "jump to section" as const,
        label: s.label,
        action: () => jump(s.id),
        kbd: s.kbd,
      })),
      { id: "p-projects", group: "pages", label: "all projects", action: () => router.push("/projects"), kind: "external" as const },
      ...(hasThoughts ? [{ id: "p-thoughts", group: "pages" as const, label: "all writing", action: () => router.push("/thoughts"), kind: "external" as const }] : []),
      { id: "p-resume", group: "pages", label: "resume", action: () => window.open("/resume", "_blank"), kind: "external" as const },
      { id: "a-mail", group: "actions", label: "mail", action: () => copyToClipboard("pushkarborkar1809@gmail.com", "a-mail"), kind: "mail" as const },
      { id: "a-github", group: "actions", label: "github", action: () => window.open("https://github.com/Pushkar1809", "_blank"), kind: "external" as const },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, onOpenChat, sections, hasThoughts]
  );

  function jump(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const filtered = useMemo(() => {
    if (!q.trim()) return commands;
    const needle = q.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(needle));
  }, [q, commands]);

  const grouped = useMemo(() => {
    const map: Record<string, Cmd[]> = {};
    for (const c of filtered) {
      (map[c.group] ??= []).push(c);
    }
    return map;
  }, [filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) {
        if ((e.metaKey || e.ctrlKey) && /^[1-5]$/.test(e.key)) {
          e.preventDefault();
          const s = sections[Number(e.key) - 1];
          if (s) jump(s.id);
        }
        return;
      }
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHover((h) => Math.min(filtered.length - 1, h + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHover((h) => Math.max(0, h - 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const c = filtered[hover];
        if (c) {
          c.action();
          if (c.kind !== "mail") { setOpen(false); setQ(""); }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, hover]);

  useEffect(() => {
    if (open) {
      setHover(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  let runningIdx = -1;

  return (
    <>
      <div className="searchbar">
        <button className="search-trigger" onClick={() => setOpen(true)} aria-label="open command palette">
          <svg className="search-icon-mobile" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/></svg>
          <span className="search-trigger-label">search · jump · do</span>
          <span className="kbd-chip">⌘K</span>
        </button>
      </div>
      {open ? (
        <div className="search-overlay" onClick={() => setOpen(false)}>
          <div className="search-panel" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              className="search-input"
              placeholder="search · jump · do"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="search-results">
              {Object.entries(grouped).map(([group, list]) => (
                <div key={group}>
                  <div className="search-group-title">{group}</div>
                  {list.map((c) => {
                    runningIdx++;
                    const i = runningIdx;
                    const isCopied = copiedId === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`search-item ${i === hover ? "active" : ""}`}
                        onMouseEnter={() => setHover(i)}
                        onClick={() => {
                          c.action();
                          if (c.kind !== "mail") { setOpen(false); setQ(""); }
                        }}
                      >
                        <span>{c.label}</span>
                        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                          {isCopied && (
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)" }}>
                              copied!
                            </span>
                          )}
                          {c.kind === "external" && (
                            <span style={{ color: i === hover ? "var(--accent)" : "var(--ink-mute)", display: "flex", alignItems: "center" }}><IconExternal /></span>
                          )}
                          {c.kind === "mail" && (
                            <span style={{ color: i === hover ? "var(--accent)" : "var(--ink-mute)", display: "flex", alignItems: "center" }}>{isCopied ? <IconCheck /> : <IconCopy />}</span>
                          )}
                          {c.kbd && <span className="label-tiny">{c.kbd}</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 ? (
                <div className="search-item">no matches</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
