import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/admin/playlists?error=access_denied", req.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const origin = req.nextUrl.origin;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${origin}/spotify`;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/admin/playlists?error=token_exchange", req.url));
  }

  const data = await res.json();
  const refreshToken: string = data.refresh_token;

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: { spotifyRefreshToken: refreshToken },
    create: { id: "singleton", spotifyRefreshToken: refreshToken },
  });

  return NextResponse.redirect(new URL("/admin/playlists?connected=1", req.url));
}
