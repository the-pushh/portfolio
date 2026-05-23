"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Cmd = {
  id: string;
  group: "jump to section" | "pages" | "actions";
  label: string;
  action: () => void;
  kbd?: string;
};

export default function SearchBar({ onOpenChat }: { onOpenChat?: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands: Cmd[] = useMemo(
    () => [
      { id: "go-home", group: "jump to section", label: "home", action: () => jump("home"), kbd: "⌘1" },
      { id: "go-work", group: "jump to section", label: "work", action: () => jump("work"), kbd: "⌘2" },
      { id: "go-toolbox", group: "jump to section", label: "toolbox", action: () => jump("toolbox"), kbd: "⌘3" },
      { id: "go-thoughts", group: "jump to section", label: "thoughts", action: () => jump("thoughts"), kbd: "⌘4" },
      { id: "go-connect", group: "jump to section", label: "connect", action: () => jump("connect"), kbd: "⌘5" },
      { id: "p-projects", group: "pages", label: "all projects", action: () => router.push("/projects") },
      { id: "p-thoughts", group: "pages", label: "all writing", action: () => router.push("/thoughts") },
      { id: "p-resume", group: "pages", label: "resume", action: () => router.push("/resume") },
      { id: "a-chat", group: "actions", label: "chat", action: () => onOpenChat?.() },
      { id: "a-voice", group: "actions", label: "voice", action: () => onOpenChat?.() },
      {
        id: "a-mail",
        group: "actions",
        label: "mail",
        action: () => (window.location.href = "mailto:thepushh@gmail.com"),
      },
      {
        id: "a-github",
        group: "actions",
        label: "github",
        action: () => window.open("https://github.com/Pushkar1809", "_blank"),
      },
    ],
    [router, onOpenChat]
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
          const ids = ["home", "work", "toolbox", "thoughts", "connect"];
          jump(ids[Number(e.key) - 1]);
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
          setOpen(false);
          setQ("");
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
          <span>search · jump · do</span>
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
                    return (
                      <div
                        key={c.id}
                        className={`search-item ${i === hover ? "active" : ""}`}
                        onMouseEnter={() => setHover(i)}
                        onClick={() => {
                          c.action();
                          setOpen(false);
                          setQ("");
                        }}
                      >
                        <span>{c.label}</span>
                        {c.kbd ? <span className="label-tiny">{c.kbd}</span> : null}
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
