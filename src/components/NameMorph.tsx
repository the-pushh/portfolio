"use client";

import { useEffect, useState } from "react";

type Props = {
  names?: string[];
  interval?: number;
  className?: string;
};

export default function NameMorph({
  names = ["Pushkar", "ThePushh"],
  interval = 3200,
  className,
}: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % names.length);
    }, interval);
    return () => clearInterval(id);
  }, [names.length, interval]);

  const widest = names.reduce((a, b) => (b.length > a.length ? b : a), names[0]);

  return (
    <span className={`name-morph ${className ?? ""}`}>
      <span className="spacer" aria-hidden="true">
        {widest}
      </span>
      {names.map((n, i) => (
        <span key={n} className={i === idx ? "active" : "inactive"}>
          {n}
        </span>
      ))}
    </span>
  );
}
