"use client";

import { useEffect, useRef, useState } from "react";
import PixelFace from "@/components/PixelFace";
import type { ChatMessage } from "@/types";

type SpeechRecognitionWindow = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [dim, setDim] = useState(false);
  const [voice, setVoice] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const idleTimer = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Idle dim
  useEffect(() => {
    if (!open) return;
    const reset = () => {
      setDim(false);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setDim(true), 4500);
    };
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

  function toggleVoice() {
    const w = window as SpeechRecognitionWindow;
    const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!C) {
      alert("voice input not supported here");
      return;
    }
    if (voice && recRef.current) {
      recRef.current.stop();
      setVoice(false);
      return;
    }
    const rec = new C();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      send(t);
    };
    rec.onend = () => setVoice(false);
    rec.start();
    recRef.current = rec;
    setVoice(true);
  }

  if (!open) {
    return (
      <div className="bot-fab" onClick={() => setOpen(true)}>
        <span className="bubble">ask anything</span>
        <button className="bot-face-btn" aria-label="open chat">
          <PixelFace size={40} />
        </button>
      </div>
    );
  }

  return (
    <div className={`chat-panel ${dim ? "dim" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PixelFace size={28} talking={streaming} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-dim)" }}>
          chat · transparent · close with esc
        </span>
        <button
          className="chat-btn"
          onClick={() => setOpen(false)}
          style={{ marginLeft: "auto" }}
          aria-label="close"
        >
          close
        </button>
      </div>
      <div className="chat-messages" ref={scrollRef}>
        {msgs.length === 0 ? (
          <div style={{ color: "var(--ink-mute)", fontSize: 12.5 }}>
            ask about projects, the stack, music, or anything else.
          </div>
        ) : null}
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.content}
            {streaming && i === msgs.length - 1 && m.role === "assistant" && !m.content ? (
              <span>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
            if (e.key === "Escape") setOpen(false);
          }}
        />
        <button className="chat-btn" onClick={toggleVoice} aria-label="voice">
          {voice ? "■" : "mic"}
        </button>
        <button className="chat-btn" onClick={() => send()} aria-label="send">
          send
        </button>
      </div>
    </div>
  );
}
