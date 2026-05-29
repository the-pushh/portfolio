"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

async function guard() {
  if (!(await isAdmin())) throw new Error("unauthorized");
}

function parseTags(s: string): string {
  const arr = s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return JSON.stringify(arr);
}

function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true";
}

function str(fd: FormData, key: string, fallback = ""): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : fallback;
}

function int(fd: FormData, key: string, fallback = 0): number {
  const v = fd.get(key);
  if (typeof v !== "string") return fallback;
  const n = parseInt(v, 10);
  return isNaN(n) ? fallback : n;
}

// ----- Thoughts -----
export async function saveThought(id: string | null, fd: FormData) {
  await guard();
  const data = {
    slug: str(fd, "slug"),
    title: str(fd, "title"),
    excerpt: str(fd, "excerpt"),
    content: str(fd, "content"),
    tags: parseTags(str(fd, "tags")),
    date: str(fd, "date"),
    readTime: str(fd, "readTime"),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
  };
  if (id && id !== "new") {
    await prisma.thought.update({ where: { id }, data });
  } else {
    await prisma.thought.create({ data });
  }
  revalidatePath("/admin/thoughts");
  revalidatePath("/thoughts");
  revalidatePath("/");
  redirect("/admin/thoughts");
}

export async function deleteThought(id: string) {
  await guard();
  await prisma.thought.delete({ where: { id } });
  revalidatePath("/admin/thoughts");
  revalidatePath("/thoughts");
  revalidatePath("/");
}

// ----- Projects -----
export async function saveProject(id: string | null, fd: FormData) {
  await guard();
  const data = {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    role: str(fd, "role"),
    when: str(fd, "when"),
    blurb: str(fd, "blurb"),
    content: str(fd, "content"),
    tags: parseTags(str(fd, "tags")),
    live: str(fd, "live"),
    code: str(fd, "code"),
    current: bool(fd, "current"),
    kind: str(fd, "kind") || "project",
    order: int(fd, "order"),
  };
  if (id && id !== "new") {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await guard();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

// ----- Socials -----
export async function saveSocial(id: string | null, fd: FormData) {
  await guard();
  const data = {
    key: str(fd, "key"),
    val: str(fd, "val"),
    href: str(fd, "href"),
    order: int(fd, "order"),
  };
  if (id && id !== "new") {
    await prisma.social.update({ where: { id }, data });
  } else {
    await prisma.social.create({ data });
  }
  revalidatePath("/admin/socials");
  revalidatePath("/");
}

export async function deleteSocial(id: string) {
  await guard();
  await prisma.social.delete({ where: { id } });
  revalidatePath("/admin/socials");
  revalidatePath("/");
}

// ----- Spotify Playlists -----
export async function savePlaylist(id: string | null, fd: FormData) {
  await guard();
  const data = {
    spotifyId: str(fd, "spotifyId"),
    name: str(fd, "name"),
    isDefault: bool(fd, "isDefault"),
    order: int(fd, "order"),
  };
  if (id) {
    await prisma.spotifyPlaylist.update({ where: { id }, data });
  } else {
    await prisma.spotifyPlaylist.create({ data });
  }
  revalidatePath("/admin/playlists");
  revalidatePath("/");
}

export async function deletePlaylist(id: string) {
  await guard();
  await prisma.spotifyPlaylist.delete({ where: { id } });
  revalidatePath("/admin/playlists");
  revalidatePath("/");
}

export async function saveAllPlaylists(fd: FormData) {
  await guard();
  const allIds = (fd.getAll("spotifyId") as string[]);
  const allNames = (fd.getAll("name") as string[]);
  const enabledSet = new Set(fd.getAll("enabled") as string[]);
  const defaultId = str(fd, "defaultId");

  const enabledList = allIds.filter((id) => enabledSet.has(id));
  const resolvedDefault = defaultId || enabledList[0] || "";
  await prisma.spotifyPlaylist.deleteMany({});
  let order = 0;
  for (let i = 0; i < allIds.length; i++) {
    const spotifyId = allIds[i];
    if (!enabledSet.has(spotifyId)) continue;
    await prisma.spotifyPlaylist.create({
      data: {
        spotifyId,
        name: allNames[i],
        isDefault: spotifyId === resolvedDefault,
        order: order++,
      },
    });
  }
  revalidatePath("/admin/playlists");
  revalidatePath("/");
}

// ----- Toolbox -----
export async function saveToolbox(id: string | null, fd: FormData) {
  await guard();
  const items = str(fd, "items")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const data = {
    name: str(fd, "name"),
    items: JSON.stringify(items),
    order: int(fd, "order"),
  };
  if (id && id !== "new") {
    await prisma.toolboxCategory.update({ where: { id }, data });
  } else {
    await prisma.toolboxCategory.create({ data });
  }
  revalidatePath("/admin/toolbox");
  revalidatePath("/");
}

export async function deleteToolbox(id: string) {
  await guard();
  await prisma.toolboxCategory.delete({ where: { id } });
  revalidatePath("/admin/toolbox");
  revalidatePath("/");
}

// ----- Site config -----
export async function saveConfig(fd: FormData) {
  await guard();
  const data = {
    name: str(fd, "name"),
    role: str(fd, "role"),
    location: str(fd, "location"),
    accent: str(fd, "accent"),
    status: str(fd, "status"),
    statusDot: str(fd, "statusDot"),
    bio: str(fd, "bio"),
    about: str(fd, "about"),
    email: str(fd, "email"),
    resumeUrl: str(fd, "resumeUrl"),
    calUrl: str(fd, "calUrl"),
  };
  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/config");
}
