import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const origin = new URL(req.url).origin;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${origin}/spotify`;
  const scopes = "playlist-read-private playlist-read-collaborative user-read-currently-playing user-read-playback-state";

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true",
  });

  redirect(`https://accounts.spotify.com/authorize?${params}`);
}
