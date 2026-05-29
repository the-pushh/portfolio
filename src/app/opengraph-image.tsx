import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/data";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" } }
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [cfg, dmSansBold, dmSansReg, jbMono] = await Promise.all([
    getSiteConfig(),
    loadGoogleFont("DM Sans", 700),
    loadGoogleFont("DM Sans", 400),
    loadGoogleFont("JetBrains Mono", 400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#141414",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          fontFamily: '"DM Sans", sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(254,172,214,0.08) 0%, transparent 55%)",
            display: "flex",
          }}
        />

        {/* CLI prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
            color: "#666",
            fontSize: 22,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <span style={{ color: "#feacd6" }}>›</span>
          <span>whoami --pretty</span>
        </div>

        {/* Name */}
        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: 18,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {cfg.name}
        </div>

        {/* Role + location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 30,
            color: "#888",
            fontWeight: 400,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          <span>{cfg.role}</span>
          <span style={{ color: "#feacd6" }}>·</span>
          <span>{cfg.location}</span>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #feacd6 0%, transparent 60%)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Sans", data: dmSansBold, weight: 700 },
        { name: "DM Sans", data: dmSansReg, weight: 400 },
        { name: "JetBrains Mono", data: jbMono, weight: 400 },
      ],
    }
  );
}
