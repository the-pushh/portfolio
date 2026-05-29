import { NextResponse } from "next/server";
import { getSpotifyPlaylists } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const playlists = await getSpotifyPlaylists();
  if (playlists.length === 0) return NextResponse.json([]);

  const randomIdx = Math.floor(Math.random() * playlists.length);
  return NextResponse.json(
    playlists.map((p, i) => ({ ...p, isDefault: i === randomIdx }))
  );
}
