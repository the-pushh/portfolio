"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ScrollState = {
  active: string;
  scrollPct: number;
  scrolledPastHero: boolean;
};

const Ctx = createContext<ScrollState>({ active: "home", scrollPct: 0, scrolledPastHero: false });

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("home");
  const [scrollPct, setScrollPct] = useState(0);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const ids = ["home", "work", "toolbox", "thoughts", "connect"];

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
      setScrollPct(pct);
      setScrolledPastHero(window.scrollY > 240);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <Ctx.Provider value={{ active, scrollPct, scrolledPastHero }}>{children}</Ctx.Provider>;
}

export function useScroll() {
  return useContext(Ctx);
}
