import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserToken } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
    select: { spotifyRefreshToken: true },
  });
  if (!config?.spotifyRefreshToken) return NextResponse.json(null);

  const token = await getUserToken(config.spotifyRefreshToken);
  if (!token) return NextResponse.json(null);

  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  console.log("[now-playing] spotify status:", res.status);
  if (res.status === 204 || !res.ok) return NextResponse.json(null);

  const data = await res.json();
  if (!data?.item || data.currently_playing_type !== "track") return NextResponse.json(null);

  return NextResponse.json({
    title: data.item.name,
    artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
    isPlaying: data.is_playing,
    albumArt: data.item.album?.images?.[2]?.url ?? null,
  });
}
