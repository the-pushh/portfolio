"use client";

import { useState } from "react";

export default function LoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setErr("wrong password.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="form-grid"
      style={{
        border: "1px solid var(--line)",
        background: "var(--bg-2)",
        padding: 24,
        borderRadius: 14,
        width: "min(360px, 92vw)",
      }}
    >
      <h1 className="admin-h1" style={{ marginBottom: 6 }}>
        admin
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 13, margin: 0 }}>enter password to continue.</p>
      <div className="form-row">
        <label>password</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
        />
      </div>
      {err ? <div style={{ color: "#ff6b6b", fontSize: 12 }}>{err}</div> : null}
      <button className="btn primary" type="submit" disabled={busy}>
        {busy ? "…" : "sign in"}
      </button>
    </form>
  );
}
