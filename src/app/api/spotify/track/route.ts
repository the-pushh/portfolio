import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getClientToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3500 },
  });
  if (!res.ok) return null;
  return (await res.json()).access_token ?? null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json(null);

  const token = await getClientToken();
  if (!token) return NextResponse.json(null);

  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return NextResponse.json(null);

  const data = await res.json();
  return NextResponse.json({
    title: data.name,
    artist: data.artists?.map((a: { name: string }) => a.name).join(", ") ?? "",
  });
}
