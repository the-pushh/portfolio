"use client";

import { useEffect, useRef, useState } from "react";

type Playlist = { id: string; spotifyId: string; name: string; isDefault: boolean };

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}
interface SpotifyIFrameAPI {
  createController(el: HTMLElement, opts: object, cb: (ctrl: SpotifyController) => void): void;
}
interface SpotifyController {
  play(): void;
  pause(): void;
  nextTrack(): void;
  previousTrack(): void;
  togglePlay(): void;
  loadUri(uri: string): void;
  addListener(ev: string, cb: (e: unknown) => void): void;
}

export default function SpotifyWidget() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [plIdx, setPlIdx] = useState(0);
  const [popOpen, setPopOpen] = useState(false);
  const [popClosing, setPopClosing] = useState(false);
  const [popRect, setPopRect] = useState<{ centerX: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [initStarted, setInitStarted] = useState(false);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const apiRef = useRef<SpotifyIFrameAPI | null>(null);
  const initDone = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeAnimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* load Spotify iFrame API */
  useEffect(() => {
    window.onSpotifyIframeApiReady = (api) => {
      apiRef.current = api;
    };
    if (!document.getElementById("spotify-iframe-api")) {
      const s = document.createElement("script");
      s.id = "spotify-iframe-api";
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      document.body.appendChild(s);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* fetch playlists */
  useEffect(() => {
    fetch("/api/spotify/playlists")
      .then((r) => r.json())
      .then((data: Playlist[]) => {
        setPlaylists(data);
        const di = data.findIndex((p) => p.isDefault);
        setPlIdx(di >= 0 ? di : 0);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function tryInit(spotifyId: string) {
    if (initDone.current || !apiRef.current || !iframeRef.current) return;
    initDone.current = true;
    setInitStarted(true);
    apiRef.current.createController(
      iframeRef.current,
      { uri: `spotify:playlist:${spotifyId}`, width: "100%", height: 152 },
      (ctrl) => {
        controllerRef.current = ctrl;
        setPlayerReady(true);
        const pref = document.cookie.match(/(?:^| )sound-pref=([^;]+)/)?.[1];
        if (pref === "on") ctrl.play();
        ctrl.addListener("playback_update", (e) => {
          const ev = e as { data?: { isPaused?: boolean } };
          setIsPlaying(!(ev.data?.isPaused ?? true));
        });
      }
    );
  }

  if (playlists.length === 0) return null;

  const pl = playlists[plIdx];

  function switchPlaylist(idx: number) {
    setPlIdx(idx);
    const target = playlists[idx];
    if (!target || !controllerRef.current) return;
    controllerRef.current.loadUri(`spotify:playlist:${target.spotifyId}`);
    controllerRef.current.play();
  }

  function openPop() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (closeAnimTimer.current) clearTimeout(closeAnimTimer.current);
    setPopClosing(false);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopRect({ centerX: rect.left + rect.width / 2 });
    }
    setEverOpened(true);
    setPopOpen(true);
    /* init controller after render tick so iframeRef is mounted */
    setTimeout(() => tryInit(playlists[plIdx]?.spotifyId ?? ""), 50);
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

  const visible = popOpen || popClosing;

  return (
    <>
      <span className="sb-item now-playing">
        <button className="sb-btn mute-btn" style={{ width: 28, padding: "0 6px" }} aria-label={isPlaying ? "pause" : "play"}
          onClick={() => initStarted ? controllerRef.current?.togglePlay() : openPop()} disabled={initStarted && !playerReady}>
          {initStarted && !playerReady
            ? <span className="sp-loader" />
            : isPlaying
              ? <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx="1"/><rect x="9" y="2" width="4" height="12" rx="1"/></svg>
              : <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6z"/></svg>
          }
        </button>
        <div
          ref={triggerRef}
          className="marquee-container"
          onMouseEnter={openPop}
          onMouseLeave={closePop}
        >
          {isPlaying && (
            <div className="marquee-wave-bg" aria-hidden>
              {([
                [3.2,"bar-a",0.0],[2.4,"bar-c",0.6],[4.0,"bar-b",0.2],[2.8,"bar-d",1.4],
                [3.6,"bar-a",0.9],[2.6,"bar-b",2.0],[4.5,"bar-c",0.4],[3.0,"bar-d",1.1],
                [3.4,"bar-a",1.7],[2.8,"bar-c",0.5],[3.8,"bar-b",1.3],[2.4,"bar-d",2.2],
                [3.1,"bar-a",0.8],[4.2,"bar-c",1.8],
              ] as [number,string,number][]).map(([dur, anim, delay], i) => (
                <span key={i} style={{ animationDuration: `${dur}s`, animationName: anim, animationDelay: `${delay}s` }} />
              ))}
            </div>
          )}
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

      {/* Popup — stays in DOM after first open so iframe keeps playing */}
      {everOpened && popRect && (
        <div
          className={`music-popover-fixed${popClosing ? " closing" : ""}`}
          style={{
            left: popRect.centerX,
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
          {/* iframe div — always mounted once everOpened, controller lives here */}
          {!playerReady && <div className="sp-skeleton" style={{ height: 152, borderRadius: 8 }} />}
          <div ref={iframeRef} style={{ borderRadius: 8, overflow: "hidden", display: playerReady ? "block" : "none" }} />
          <div className="music-popover-label" style={{ marginTop: 10 }}>switch playlist</div>
          {playlists.map((p, i) => (
            <button
              key={p.id}
              className={`music-pl-item${i === plIdx ? " active" : ""}`}
              onClick={() => switchPlaylist(i)}
            >
              <span>{p.name}</span>
              {i === plIdx && <span className="np-now">now playing</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
