"use client";

import { useEffect, useState } from "react";

type Track = { title: string; artist: string; isPlaying: boolean; albumArt: string | null };

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/spotify/now-playing");
        if (!cancelled) setTrack(res.ok ? await res.json() : null);
      } catch {
        if (!cancelled) setTrack(null);
      }
    }

    poll();
    const id = setInterval(poll, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!track) return null;

  return (
    <span className="sb-item now-playing">
      {track.isPlaying && (
        <span className="wave" aria-hidden>
          <span /><span /><span /><span />
        </span>
      )}
      <span className="now-playing-text">
        <span className="np-artist">{track.artist}</span>
        <span className="np-sep"> — </span>
        <span className="np-title">{track.title}</span>
      </span>
    </span>
  );
}
