"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  togglePlay(): void;
  loadUri(uri: string): void;
  addListener(ev: string, cb: (e: unknown) => void): void;
}

export default function SpotifyWidget() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [plIdx, setPlIdx] = useState(0);
  const [popOpen, setPopOpen] = useState(false);
  const [popClosing, setPopClosing] = useState(false);
  const [popCenterX, setPopCenterX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const apiRef = useRef<SpotifyIFrameAPI | null>(null);
  const playlistsRef = useRef<Playlist[]>([]);
  const plIdxRef = useRef(0);
  const initDone = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeAnimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function tryInit() {
    if (initDone.current || !apiRef.current || !iframeRef.current || playlistsRef.current.length === 0) return;
    initDone.current = true;
    const spotifyId = playlistsRef.current[plIdxRef.current]?.spotifyId ?? "";
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

  /* listen for music-autoplay from MusicPrompt */
  useEffect(() => {
    const onAutoplay = () => controllerRef.current?.play();
    window.addEventListener("music-autoplay", onAutoplay);
    return () => window.removeEventListener("music-autoplay", onAutoplay);
  }, []);

  /* load Spotify iFrame API — call tryInit when ready */
  useEffect(() => {
    window.onSpotifyIframeApiReady = (api) => {
      apiRef.current = api;
      tryInit();
    };
    if (!document.getElementById("spotify-iframe-api")) {
      const s = document.createElement("script");
      s.id = "spotify-iframe-api";
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      document.body.appendChild(s);
    }
    /* poll until API, iframe div, and playlists are all ready */
    const poll = setInterval(() => {
      if (apiRef.current && iframeRef.current && playlistsRef.current.length > 0) {
        clearInterval(poll);
        tryInit();
      }
    }, 200);
    const timeout = setTimeout(() => clearInterval(poll), 15000);
    return () => { clearInterval(poll); clearTimeout(timeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* fetch playlists — call tryInit when ready */
  useEffect(() => {
    fetch("/api/spotify/playlists")
      .then((r) => r.json())
      .then((data: Playlist[]) => {
        const di = data.findIndex((p) => p.isDefault);
        const idx = di >= 0 ? di : 0;
        playlistsRef.current = data;
        plIdxRef.current = idx;
        setPlaylists(data);
        setPlIdx(idx);
        tryInit();
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* compute popup position after mount */
  useLayoutEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopCenterX(rect.left + rect.width / 2);
    }
  }, []);

  function switchPlaylist(idx: number) {
    setPlIdx(idx);
    plIdxRef.current = idx;
    const target = playlistsRef.current[idx];
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

  return (
    <>
      <span className="sb-item now-playing">
        <button
          className="sb-btn mute-btn"
          style={{ width: 28, padding: "0 6px" }}
          aria-label={isPlaying ? "pause" : "play"}
          onClick={() => controllerRef.current?.togglePlay()}
          disabled={!playerReady}
        >
          {!playerReady
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
          style={{ cursor: "pointer" }}
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

      {/* Popup — always in DOM so iframe stays mounted and audio continues */}
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
        <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", minHeight: 152 }}>
          {!playerReady && <div className="sp-skeleton" style={{ position: "absolute", inset: 0, borderRadius: 8 }} />}
          <div ref={iframeRef} style={{ borderRadius: 8, overflow: "hidden" }} />
        </div>
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
    </>
  );
}
