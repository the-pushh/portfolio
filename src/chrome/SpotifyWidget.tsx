"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Playlist = { id: string; spotifyId: string; name: string; isDefault: boolean };

export default function SpotifyWidget() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [plIdx, setPlIdx] = useState(0);
  const [popOpen, setPopOpen] = useState(false);
  const [popClosing, setPopClosing] = useState(false);
  const [popCenterX, setPopCenterX] = useState(0);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeAnimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/spotify/playlists")
      .then((r) => r.json())
      .then((data: Playlist[]) => {
        const di = data.findIndex((p) => p.isDefault);
        setPlaylists(data);
        setPlIdx(di >= 0 ? di : 0);
      })
      .catch(() => {});
  }, []);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopCenterX(rect.left + rect.width / 2);
    }
  }, []);

  function openPop() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (closeAnimTimer.current) clearTimeout(closeAnimTimer.current);
    setPopClosing(false);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopCenterX(rect.left + rect.width / 2);
    }
    setPopOpen(true);
  }

  function closePop() {
    hoverTimer.current = setTimeout(() => {
      setPopClosing(true);
      closeAnimTimer.current = setTimeout(() => {
        setPopOpen(false);
        setPopClosing(false);
      }, 190);
    }, 150);
  }

  if (playlists.length === 0) return null;

  const pl = playlists[plIdx];
  const visible = popOpen || popClosing;
  const embedSrc = `https://open.spotify.com/embed/playlist/${pl.spotifyId}?utm_source=generator&theme=0`;

  return (
    <>
      <span className="sb-item now-playing">
        <div
          ref={triggerRef}
          className="marquee-container"
          onMouseEnter={openPop}
          onMouseLeave={closePop}
          style={{ cursor: "pointer" }}
        >
          <span className="np-label">
            <span className="np-clef" aria-hidden>𝄞</span>
            {pl.name.length > 14 ? (
              <span className="np-name">
                <span className="np-name-scroll">
                  <span className="np-name-inner">{pl.name} <span className="np-clef-scroll">𝄄</span></span>
                  <span className="np-name-inner" aria-hidden>{pl.name} <span className="np-clef-scroll">𝄄</span></span>
                </span>
              </span>
            ) : (
              <span className="np-name">{pl.name}</span>
            )}
          </span>
        </div>
      </span>

      {/* Popup — always in DOM so iframe keeps playing */}
      <div
        className={`music-popover-fixed${popClosing ? " closing" : ""}`}
        style={{
          left: popCenterX,
          transform: "translateX(-50%)",
          visibility: visible ? "visible" : "hidden",
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={openPop}
        onMouseLeave={closePop}
      >
        <div className="music-popover-label" style={{ marginBottom: 6 }}>
          pushkar&apos;s curated playlists
        </div>
        <iframe
          key={pl.spotifyId}
          src={embedSrc}
          width="100%"
          height="152"
          style={{ borderRadius: 8, border: "none" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
        />
        <div className="music-popover-label" style={{ marginTop: 10 }}>switch playlist</div>
        {playlists.map((p, i) => (
          <button
            key={p.id}
            className={`music-pl-item${i === plIdx ? " active" : ""}`}
            onClick={() => setPlIdx(i)}
          >
            <span>{p.name}</span>
            {i === plIdx && <span className="np-now">now playing</span>}
          </button>
        ))}
      </div>
    </>
  );
}
