import { NextResponse } from "next/server";
import { getSpotifyPlaylists } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const playlists = await getSpotifyPlaylists();
  return NextResponse.json(playlists);
}
