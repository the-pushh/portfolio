import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserToken } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json([]);

  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
    select: { spotifyRefreshToken: true },
  });
  if (!config?.spotifyRefreshToken) return NextResponse.json([]);

  const token = await getUserToken(config.spotifyRefreshToken);
  if (!token) return NextResponse.json([]);

  const tracks: { title: string; artist: string; durationMs: number }[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/playlists/${id}/tracks?fields=items(track(name,duration_ms,artists(name))),next&limit=50`;

  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } });
    if (!res.ok) break;
    const data = await res.json();
    for (const item of data.items ?? []) {
      const t = item?.track;
      if (!t || !t.duration_ms) continue;
      tracks.push({
        title: t.name,
        artist: t.artists?.map((a: { name: string }) => a.name).join(", ") ?? "",
        durationMs: t.duration_ms,
      });
    }
    url = data.next ?? null;
  }

  return NextResponse.json(tracks);
}
