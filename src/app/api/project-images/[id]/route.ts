import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import marsmello from "../../../../../v1/src/assets/images/marsmello.png";
import shatranj from "../../../../../v1/src/assets/images/shatranj.png";
import panda from "../../../../../v1/src/assets/images/panda.png";
import lst from "../../../../../v1/src/assets/images/lst.png";

const legacy = new Map([
  ["marsmello", marsmello.src],
  ["shatranj", shatranj.src],
  ["panda-wallet", panda.src],
  ["liquid-staking-aggregator", lst.src],
]);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // The legacy images can still render while the additive image table is being deployed.
  const image = await prisma.projectImage.findUnique({ where: { projectId: id } }).catch((error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") return null;
    throw error;
  });

  if (image) {
    return new Response(new Uint8Array(image.bytes), {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const project = await prisma.project.findUnique({ where: { id }, select: { slug: true } });
  const fallback = project && legacy.get(project.slug);
  if (fallback) {
    return new Response(null, {
      status: 302,
      headers: { Location: new URL(fallback, request.url).href, "Cache-Control": "no-cache" },
    });
  }
  return new Response(null, { status: 404, headers: { "Cache-Control": "no-cache" } });
}
