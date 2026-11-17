import { PrismaClient } from "@prisma/client";

const MARKER = "portfolio-done";
const OWNER = "the-pushh";
const PORTFOLIO = `${OWNER}/portfolio`;

type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  private: boolean;
  fork: boolean;
  topics: string[];
};

function homepage(value: string | null): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function sourceKey(value: string) {
  return value.trim().replace(/\/+$/, "").replace(/\.git$/i, "").toLowerCase();
}

async function completedRepositories(): Promise<Repository[]> {
  const completed: Repository[] = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/users/${OWNER}/repos?type=owner&sort=pushed&direction=asc&per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!response.ok) throw new Error(`GitHub repository listing failed (${response.status})`);
    const repositories = (await response.json()) as Repository[];
    completed.push(...repositories.filter((repo) =>
      !repo.private &&
      !repo.fork &&
      repo.full_name.toLowerCase() !== PORTFOLIO &&
      repo.topics.includes(MARKER)
    ));
    if (repositories.length < 100) return completed;
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the portfolio sync");

  const repositories = await completedRepositories();
  if (!repositories.length) {
    console.log("No repositories marked for the portfolio.");
    return;
  }

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.project.findMany({ select: { code: true, order: true } });
    const existingSources = new Set(existing.map(({ code }) => sourceKey(code)));
    let order = Math.max(11, ...existing.map((entry) => entry.order));
    const nameAndSource = repositories.map((repo) => ({
      repo,
      code: `https://github.com/${repo.full_name}`,
    }));
    const entries = nameAndSource
      .filter(({ code }) => !existingSources.has(sourceKey(code)))
      .map(({ repo, code }) => {
        const name = repo.name.replace(/[-_]+/g, " ").trim() || repo.name;
        const blurb = repo.description?.trim() ||
          (repo.language ? `${name} is a project built with ${repo.language}.` : `${name} is available on GitHub.`);
        return {
          slug: `github-${repo.id}`,
          name,
          blurb,
          content: blurb,
          role: "",
          when: "",
          kind: "project",
          live: homepage(repo.homepage),
          code,
          tags: JSON.stringify(repo.language ? [repo.language] : []),
          order: ++order,
        };
      });

    const result = entries.length
      ? await prisma.project.createMany({ data: entries, skipDuplicates: true })
      : { count: 0 };
    console.log(`Imported ${result.count} portfolio project(s).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Portfolio sync failed");
  process.exitCode = 1;
});
