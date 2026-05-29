import { prisma } from "@/lib/db";
import { fetchUserPlaylists, getUserToken } from "@/lib/spotify";
import { saveAllPlaylists } from "../actions";

export const dynamic = "force-dynamic";

export default async function PlaylistsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const { connected, error } = await searchParams;

  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  const refreshToken = config?.spotifyRefreshToken ?? "";

  const saved = await prisma.spotifyPlaylist.findMany({ orderBy: { order: "asc" } });
  const enabledIds = new Set(saved.map((p) => p.spotifyId));
  const defaultId = saved.find((p) => p.isDefault)?.spotifyId ?? "";

  let spotifyPlaylists: Awaited<ReturnType<typeof fetchUserPlaylists>> = [];
  let userToken = "";

  if (refreshToken) {
    userToken = (await getUserToken(refreshToken)) ?? "";
    if (userToken) spotifyPlaylists = await fetchUserPlaylists(userToken);
  }

  return (
    <div>
      <h1 className="admin-h1">spotify playlists</h1>

      {error && (
        <p style={{ color: "#f87171", marginBottom: 16, fontSize: 13 }}>
          OAuth error: {error}. <a href="/api/spotify/auth" style={{ color: "var(--accent)" }}>Try again ↗</a>
        </p>
      )}

      {!refreshToken ? (
        <div style={{ padding: 24, border: "1px solid var(--line)", borderRadius: 12, background: "var(--bg-2)" }}>
          <p style={{ color: "var(--ink-dim)", fontSize: 14, margin: "0 0 16px" }}>
            Connect your Spotify account to select which playlists to feature in the player.
          </p>
          <a href="/api/spotify/auth" className="btn primary">connect spotify ↗</a>
        </div>
      ) : !userToken ? (
        <p style={{ color: "var(--ink-dim)", fontSize: 13 }}>
          Token expired. <a href="/api/spotify/auth" style={{ color: "var(--accent)" }}>Reconnect ↗</a>
        </p>
      ) : spotifyPlaylists.length === 0 ? (
        <p style={{ color: "var(--ink-dim)", fontSize: 13 }}>
          No playlists found. <a href="/api/spotify/auth" style={{ color: "var(--accent)" }}>Reconnect ↗</a>
        </p>
      ) : (
        <>
          {connected && (
            <p style={{ color: "var(--accent)", fontSize: 13, marginBottom: 12 }}>Connected.</p>
          )}

          <form action={saveAllPlaylists}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ color: "var(--ink-dim)", fontSize: 13, margin: 0 }}>
                Check to show in player · ★ sets default
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <a href="/api/spotify/auth" style={{ color: "var(--ink-dim)", fontSize: 11 }}>reconnect</a>
                <button className="btn primary" type="submit">save</button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {spotifyPlaylists.map((pl) => {
                const isEnabled = enabledIds.has(pl.spotifyId);
                const isDefault = pl.spotifyId === defaultId;

                return (
                  <div key={pl.spotifyId} style={{
                    display: "grid",
                    gridTemplateColumns: "32px 32px 40px 1fr",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 14px",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    background: isEnabled ? "var(--bg-2)" : "transparent",
                    opacity: isEnabled ? 1 : 0.5,
                  }}>
                    <input type="hidden" name="spotifyId" value={pl.spotifyId} />
                    <input type="hidden" name="name" value={pl.name} />

                    <label title="show in player" style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}>
                      <input type="checkbox" name="enabled" value={pl.spotifyId} defaultChecked={isEnabled} />
                    </label>

                    <label title="set as default" style={{ display: "flex", justifyContent: "center", fontSize: 18, cursor: "pointer", color: isDefault ? "var(--accent)" : "var(--ink-dim)" }}>
                      <input type="radio" name="defaultId" value={pl.spotifyId} defaultChecked={isDefault} style={{ display: "none" }} />
                      ★
                    </label>

                    {pl.coverUrl ? (
                      <img src={pl.coverUrl} width={36} height={36} alt="" style={{ borderRadius: 4, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 36, height: 36, background: "var(--bg)", borderRadius: 4 }} />
                    )}

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{pl.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
                        {pl.trackCount} tracks
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button className="btn primary" type="submit">save</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
