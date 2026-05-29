"use client";

import { useEffect } from "react";

const TITLES = ["The Pushh", "Pushkar's Portfolio"];
const INTERVAL = 3000;

export default function AnimatedTitle() {
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % TITLES.length;
      document.title = TITLES[i];
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return null;
}
