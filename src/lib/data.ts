import { prisma } from "./db";
import { fetchPlaylist, getUserToken } from "./spotify";
import type {
  ProjectDTO,
  SiteConfigDTO,
  SocialDTO,
  SpotifyPlaylistDTO,
  ThoughtDTO,
  ToolboxCategoryDTO,
} from "@/types";

function safeJSON<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export async function getThoughts(opts?: { onlyPublished?: boolean }): Promise<ThoughtDTO[]> {
  const rows = await prisma.thought.findMany({
    where: opts?.onlyPublished === false ? undefined : { published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    tags: safeJSON<string[]>(r.tags, []),
    date: r.date,
    readTime: r.readTime,
    featured: r.featured,
    published: r.published,
  }));
}

export async function getThoughtBySlug(slug: string): Promise<ThoughtDTO | null> {
  const r = await prisma.thought.findUnique({ where: { slug } });
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    tags: safeJSON<string[]>(r.tags, []),
    date: r.date,
    readTime: r.readTime,
    featured: r.featured,
    published: r.published,
  };
}

export async function getThoughtById(id: string): Promise<ThoughtDTO | null> {
  const r = await prisma.thought.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    tags: safeJSON<string[]>(r.tags, []),
    date: r.date,
    readTime: r.readTime,
    featured: r.featured,
    published: r.published,
  };
}

export async function getProjects(): Promise<ProjectDTO[]> {
  const rows = await prisma.project.findMany({ orderBy: { order: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    role: r.role,
    when: r.when,
    blurb: r.blurb,
    content: r.content,
    tags: safeJSON<string[]>(r.tags, []),
    live: r.live,
    code: r.code,
    current: r.current,
    kind: r.kind,
    order: r.order,
  }));
}

export async function getProjectBySlug(slug: string): Promise<ProjectDTO | null> {
  const r = await prisma.project.findUnique({ where: { slug } });
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    role: r.role,
    when: r.when,
    blurb: r.blurb,
    content: r.content,
    tags: safeJSON<string[]>(r.tags, []),
    live: r.live,
    code: r.code,
    current: r.current,
    kind: r.kind,
    order: r.order,
  };
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  const r = await prisma.project.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    role: r.role,
    when: r.when,
    blurb: r.blurb,
    content: r.content,
    tags: safeJSON<string[]>(r.tags, []),
    live: r.live,
    code: r.code,
    current: r.current,
    kind: r.kind,
    order: r.order,
  };
}

export async function getSocials(): Promise<SocialDTO[]> {
  const rows = await prisma.social.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({ id: r.id, key: r.key, val: r.val, href: r.href, order: r.order }));
}

export async function getSpotifyPlaylists(): Promise<SpotifyPlaylistDTO[]> {
  const rows = await prisma.spotifyPlaylist.findMany({ orderBy: { order: "asc" } });
  if (rows.length === 0) return [];
  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" }, select: { spotifyRefreshToken: true } });
  const userToken = config?.spotifyRefreshToken ? await getUserToken(config.spotifyRefreshToken) : null;
  const results = await Promise.all(
    rows.map(async (row) => {
      const data = await fetchPlaylist(row.spotifyId, userToken ?? undefined);
      return {
        id: row.id,
        spotifyId: row.spotifyId,
        name: data?.name ?? row.name,
        coverUrl: data?.coverUrl ?? null,
        isDefault: row.isDefault,
        tracks: data?.tracks ?? [],
      };
    })
  );
  return results;
}

export async function getToolbox(): Promise<ToolboxCategoryDTO[]> {
  const rows = await prisma.toolboxCategory.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    items: safeJSON<string[]>(r.items, []),
    order: r.order,
  }));
}

export async function getSiteConfig(): Promise<SiteConfigDTO> {
  const r = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  if (!r) {
    // Sane defaults if not seeded
    return {
      id: "singleton",
      name: "Pushkar Borkar",
      role: "Generalist Engineer",
      location: "Bangalore, IN",
      accent: "#FEACD6",
      status: "work with me",
      statusDot: "warm",
      bio: "",
      about: "",
      email: "thepushh@gmail.com",
      resumeUrl: "/resume",
      calUrl: "https://cal.com/pushkar",
    };
  }
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    location: r.location,
    accent: r.accent,
    status: r.status,
    statusDot: r.statusDot,
    bio: r.bio,
    about: r.about,
    email: r.email,
    resumeUrl: r.resumeUrl,
    calUrl: r.calUrl,
  };
}
