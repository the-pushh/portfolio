function creds() {
  return {
    id: process.env.SPOTIFY_CLIENT_ID ?? "",
    secret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
  };
}

export async function getUserToken(refreshToken: string): Promise<string | null> {
  const { id, secret } = creds();
  if (!id || !secret || !refreshToken) return null;
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()).access_token ?? null;
  } catch {
    return null;
  }
}

async function getToken(): Promise<string | null> {
  const { id, secret } = creds();
  if (!id || !secret) return null;
  try {
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
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  previewUrl: string | null;
  albumArt: string | null;
};

export type SpotifyPlaylistMeta = {
  name: string;
  coverUrl: string | null;
  tracks: SpotifyTrack[];
};

export type SpotifyPlaylistSummary = {
  spotifyId: string;
  name: string;
  coverUrl: string | null;
  trackCount: number;
};

export async function fetchUserPlaylists(userToken: string): Promise<SpotifyPlaylistSummary[]> {
  if (!userToken) return [];
  const token = userToken;
  try {
    const all: SpotifyPlaylistSummary[] = [];
    let url: string | null = `https://api.spotify.com/v1/me/playlists?limit=50`;
    while (url) {
      const res: Response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) break;
      const data: { items?: any[]; next?: string | null } = await res.json();
      for (const pl of data.items ?? []) {
        all.push({
          spotifyId: pl.id,
          name: pl.name,
          coverUrl: pl.images?.[0]?.url ?? null,
          trackCount: pl.tracks?.total ?? 0,
        });
      }
      url = data.next ?? null;
    }
    return all;
  } catch {
    return [];
  }
}

export async function fetchPlaylist(spotifyId: string, userToken?: string): Promise<SpotifyPlaylistMeta | null> {
  const token = userToken ?? await getToken();
  if (!token) return null;
  try {
    const [metaRes, tracksRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/playlists/${spotifyId}?fields=name,images`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.spotify.com/v1/playlists/${spotifyId}/tracks?fields=items(track(id,name,preview_url,artists(name),album(images)))&limit=50`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
      ),
    ]);
    if (!metaRes.ok || !tracksRes.ok) return null;
    const meta = await metaRes.json();
    const tracksData = await tracksRes.json();
    return {
      name: meta.name,
      coverUrl: meta.images?.[0]?.url ?? null,
      tracks: (tracksData.items ?? [])
        .filter((item: any) => item?.track?.preview_url)
        .map((item: any) => ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists.map((a: any) => a.name).join(", "),
          previewUrl: item.track.preview_url,
          albumArt: item.track.album.images?.[1]?.url ?? null,
        })),
    };
  } catch {
    return null;
  }
}
