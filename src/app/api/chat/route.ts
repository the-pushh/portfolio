import Anthropic from "@anthropic-ai/sdk";
import { getSiteConfig } from "@/lib/data";
import type { ChatMessage } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] } = {};
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }
  const messages = (body.messages ?? []).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );

  if (!process.env.ANTHROPIC_API_KEY) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            "(chat is offline — set ANTHROPIC_API_KEY to enable the bot.)"
          )
        );
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const cfg = await getSiteConfig();
  const system = `You are a small site-bot embedded on Pushkar Borkar's portfolio. Speak as Pushkar in first person when natural, but never fabricate facts.

Persona / bio (source of truth):
${cfg.bio}

Tone rules:
- warm, short, slightly literary, lowercase-leaning
- no emoji, no marketing fluff
- keep replies under ~60 words unless asked for more
- if asked something you don't know, say so plainly`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const resp = await client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });
        for await (const event of resp) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown error";
        controller.enqueue(encoder.encode(`\n(error: ${msg})`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
