"use client";

import { useEffect, useState } from "react";

function setCookie(val: string) {
  document.cookie = `sound-pref=${val}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function MusicPrompt() {
  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [tooltipFading, setTooltipFading] = useState(false);

  useEffect(() => {
    const pref = document.cookie.match(/(?:^| )sound-pref=([^;]+)/)?.[1];
    if (!pref) {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function onYes() {
    setCookie("on");
    setShow(false);
    window.dispatchEvent(new CustomEvent("music-autoplay"));
  }

  function onNo() {
    setCookie("off");
    setShow(false);
    setTooltip(true);
    setTimeout(() => setTooltipFading(true), 3000);
    setTimeout(() => { setTooltip(false); setTooltipFading(false); }, 3600);
  }

  return (
    <>
      {show && (
        <div className="music-prompt">
          <span className="music-prompt-clef" aria-hidden>𝄞</span>
          <p className="music-prompt-q">experience this site with music?</p>
          <div className="music-prompt-btns">
            <button className="music-prompt-yes" onClick={onYes}>yes, play it</button>
            <button className="music-prompt-no" onClick={onNo}>no thanks</button>
          </div>
        </div>
      )}
      {tooltip && (
        <div className={`music-tooltip${tooltipFading ? " fading" : ""}`}>
          hover the playlist name anytime to browse curated playlists
        </div>
      )}
    </>
  );
}
