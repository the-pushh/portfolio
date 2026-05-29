"use client";

import { useEffect, useRef, useState } from "react";
import type { SpotifyPlaylistDTO } from "@/types";

type Props = { playlists: SpotifyPlaylistDTO[] };

export default function MusicPlayer({ playlists }: Props) {
  const defaultIdx = (() => {
    const di = playlists.findIndex((p) => p.isDefault);
    return di >= 0 ? di : Math.floor(Math.random() * playlists.length);
  })();
  const [playlistIdx, setPlaylistIdx] = useState(defaultIdx);
  const [trackIdx, setTrackIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [popOpen, setPopOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const playlist = playlists[playlistIdx];
  const tracks = playlist?.tracks ?? [];
  const track = tracks[trackIdx] ?? null;

  // Cycle track display every 8s
  useEffect(() => {
    if (tracks.length === 0) return;
    const id = setInterval(() => setTrackIdx((i) => (i + 1) % tracks.length), 8000);
    return () => clearInterval(id);
  }, [tracks.length, playlistIdx]);

  // Audio playback
  useEffect(() => {
    if (!track?.previewUrl || muted) {
      audioRef.current?.pause();
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.src = track.previewUrl;
    audio.volume = 0.45;
    audio.play().catch(() => {});
    const onEnd = () => setTrackIdx((i) => (i + 1) % tracks.length);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("ended", onEnd);
      audio.pause();
    };
  }, [track?.previewUrl, muted, tracks.length]);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!popRef.current?.contains(e.target as Node)) setPopOpen(false);
    };
    if (popOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popOpen]);

  function switchPlaylist(idx: number) {
    setPlaylistIdx(idx);
    setTrackIdx(0);
    setPopOpen(false);
  }

  if (!playlist || tracks.length === 0) return null;

  return (
    <span className="sb-item music-player">
      <button
        className="mute-btn sb-btn"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "unmute" : "mute"}
        title={muted ? "unmute" : "mute"}
        style={{ padding: "0 4px" }}
      >
        {muted ? (
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 2.5v11l-4-3.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h3l4-3.5z" fill="currentColor" stroke="none" />
            <line x1="12" y1="6" x2="15" y2="10" />
            <line x1="15" y1="6" x2="12" y2="10" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 2.5v11l-4-3.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h3l4-3.5z" fill="currentColor" stroke="none" />
            <path d="M12 5.5a4 4 0 010 5" fill="none" />
            <path d="M14.5 3.5a7 7 0 010 9" fill="none" />
          </svg>
        )}
      </button>

      {!muted && (
        <span className="wave" aria-hidden>
          <span /><span /><span /><span />
        </span>
      )}

      <div className="music-info" ref={popRef} style={{ position: "relative" }}>
        <button
          className="sb-btn music-track-btn"
          onClick={() => setPopOpen((v) => !v)}
          title="switch playlist"
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0, padding: "0 4px" }}
        >
          <span className="sb-track">{track?.artist} — {track?.title}</span>
          <span className="music-pl-name">{playlist.name} ▾</span>
        </button>

        {popOpen && (
          <div className="popover music-popover" onClick={(e) => e.stopPropagation()}>
            {playlists.map((pl, i) => (
              <button
                key={pl.id}
                className={`music-pl-item${i === playlistIdx ? " active" : ""}`}
                onClick={() => switchPlaylist(i)}
              >
                {pl.coverUrl && (
                  <img src={pl.coverUrl} width={24} height={24} alt="" style={{ borderRadius: 3, flexShrink: 0 }} />
                )}
                <span>{pl.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </span>
  );
}
