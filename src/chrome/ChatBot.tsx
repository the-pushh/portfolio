"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import PixelCat from "@/components/PixelCat";
import type { ChatMessage } from "@/types";

type PanelState = "closed" | "open" | "closing";

const CLOSE_MS = 230;

function renderMd(text: string) {
  return text.split("\n").map((line, li) => {
    const parts: React.ReactNode[] = [];
    const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      if (m[1]) parts.push(<strong key={m.index}>{m[1]}</strong>);
      else parts.push(<a key={m.index} href={m[3]} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>{m[2]}</a>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return <span key={li}>{parts}{li < text.split("\n").length - 1 && <br />}</span>;
  });
}

export default function ChatBot() {
  const [panelState, setPanelState] = useState<PanelState>("closed");
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [dim, setDim] = useState(false);
  const idleTimer = useRef<number | null>(null);
  const hovering = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = panelState !== "closed";

  function openChat() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanelState("open");
  }

  function closeChat() {
    setDim(false);
    setPanelState("closing");
    closeTimer.current = setTimeout(() => setPanelState("closed"), CLOSE_MS);
  }

  // Global ESC to close, / to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { closeChat(); return; }
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && !open && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        openChat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Idle dim — suppressed while cursor is over the panel
  useEffect(() => {
    if (!open) return;
    const schedule = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (!hovering.current) idleTimer.current = window.setTimeout(() => setDim(true), 4500);
    };
    const reset = () => { setDim(false); schedule(); };
    reset();
    const evts = ["mousemove", "keydown", "scroll", "touchstart"] as const;
    for (const e of evts) window.addEventListener(e, reset);
    return () => {
      for (const e of evts) window.removeEventListener(e, reset);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput("");
    const next: ChatMessage[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setStreaming(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        setMsgs((m) => [...m, { role: "assistant", content: "sorry — couldn't reach the bot." }]);
        setStreaming(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "network hiccup." }]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="bot-container">
      {panelState !== "closed" && (
        <div
          className={`chat-panel${panelState === "closing" ? " closing" : ""}${dim ? " dim" : ""}`}
          onMouseEnter={() => { hovering.current = true; setDim(false); if (idleTimer.current) window.clearTimeout(idleTimer.current); }}
          onMouseLeave={() => { hovering.current = false; }}
        >
          <div className="chat-panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <PixelCat size={28} talking={streaming} />
              {streaming && (
                <div className="think-bubbles">
                  <span className="think-dot" />
                  <span className="think-dot" />
                  <span className="think-dot" />
                </div>
              )}
            </div>
            <button className="chat-btn" onClick={closeChat} aria-label="close">
              close <kbd className="kbd-hint">esc</kbd>
            </button>
          </div>
          <div className="chat-messages" ref={scrollRef}>
            {msgs.length === 0 ? (
              <div style={{ color: "var(--ink-mute)", fontSize: 12.5 }}>
                hey, i'm lenon — pushkar's assistant. named after the beatle and his cat. ask me anything about him.
              </div>
            ) : null}
            {msgs.map((m, i) => {
              const isStreamingTail = streaming && i === msgs.length - 1 && m.role === "assistant";
              return (
                <div key={i} className={`chat-msg ${m.role}`}>
                  {m.content ? (
                    <>
                      {renderMd(m.content)}
                      {isStreamingTail && <span className="stream-cursor" />}
                    </>
                  ) : isStreamingTail ? (
                    <span>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            />
            <button className="chat-send-btn" onClick={() => send()} aria-label="send" disabled={streaming}>
              <ArrowUp size={14} weight="bold" />
            </button>
          </div>
        </div>
      )}
      <div className={`bot-fab${open ? " open" : ""}`} onClick={() => !open && openChat()}>
        {!open && <span className="bubble">ask anything <kbd className="kbd-hint">/</kbd></span>}
        <button className="bot-face-btn" aria-label={open ? "chat" : "open chat"}>
          <PixelCat size={40} talking={open && streaming} />
        </button>
      </div>
    </div>
  );
}
