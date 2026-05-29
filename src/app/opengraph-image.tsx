import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/data";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const cfg = await getSiteConfig();

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
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(254,172,214,0.08) 0%, transparent 55%)",
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
            letterSpacing: "0.04em",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "#feacd6" }}>›</span>
          <span>whoami --pretty</span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 86,
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: 18,
          }}
        >
          {cfg.name}
        </div>

        {/* Role */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 30,
            color: "#888",
            fontWeight: 400,
            letterSpacing: "0.01em",
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
          }}
        />
      </div>
    ),
    { ...size }
  );
}
