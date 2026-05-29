import Groq from "groq-sdk";
import { getSiteConfig, getProjects, getToolbox, getThoughts, getSocials } from "@/lib/data";
import type { ChatMessage } from "@/types";

export const runtime = "nodejs";

async function buildContext(): Promise<string> {
  const [cfg, projects, toolbox, thoughts, socials] = await Promise.all([
    getSiteConfig(),
    getProjects(),
    getToolbox(),
    getThoughts({ onlyPublished: true }),
    getSocials(),
  ]);

  const projectLines = projects
    .map((p) => {
      const tags = p.tags.length ? ` [${p.tags.join(", ")}]` : "";
      const detail = p.content?.trim() ? `\n  ${p.content.trim().replace(/\n/g, "\n  ")}` : "";
      return `- ${p.name} (${p.role}, ${p.when})${tags}\n  ${p.blurb}${detail}`;
    })
    .join("\n\n");

  const toolboxLines = toolbox
    .map((c) => `${c.name}: ${c.items.join(", ")}`)
    .join("\n");

  const thoughtLines = thoughts
    .map((t) => `- "${t.title}" (${t.date}): ${t.excerpt}`)
    .join("\n");

  const socialLines = socials
    .map((s) => `${s.key}: ${s.href ?? s.val}`)
    .join("\n");

  return `
NAME: ${cfg.name}
ROLE: ${cfg.role}
LOCATION: ${cfg.location}
EMAIL: ${cfg.email}
CALENDAR: ${cfg.calUrl}

BIO (who he is — use this as the core of how you describe him):
${cfg.bio}

ABOUT:
${cfg.about}

PROJECTS (resume-level detail — use freely):
${projectLines}

TOOLBOX / SKILLS:
${toolboxLines}

WRITING / THOUGHTS:
${thoughtLines}

LINKS:
${socialLines}
`.trim();
}

const ENGAGEMENT_TEMPLATES = [
  (cal: string) =>
    `you've been at this a while — seems like you might actually want to work with pushkar. he's easier to read in a call than through me, honestly. [book some time with him](${cal}).`,
  (cal: string) =>
    `that's either curiosity or due diligence. either way, pushkar would love to talk directly. [grab a slot](${cal}).`,
  (cal: string) =>
    `at this point you clearly have thoughts. pushkar does too. you should compare notes. [book a call](${cal}).`,
  (cal: string) =>
    `you've asked enough that a real conversation probably makes more sense than more of me. pushkar's calendar is open — [let's make it happen](${cal}).`,
  (cal: string) =>
    `looks like there's genuine interest here. pushkar has a habit of being even more interesting live. [schedule a call](${cal}).`,
];

const OOS_TEMPLATES = [
  (topic: string, cal: string) =>
    `"${topic}" — lenon doesn't have much on that. pushkar might, though. he tends to have surprisingly strong opinions on things outside his lane. [schedule a call with him](${cal}) and find out.`,
  (topic: string, cal: string) =>
    `${topic}? not in lenon's notes. but that sounds like exactly the kind of thing pushkar would have a take on — he's the type to have thought about it at 2am. [grab a slot](${cal}).`,
  (topic: string, cal: string) =>
    `lenon's got nothing on "${topic}". pushkar might have some fascinating insight there though — worth asking directly. [book a call](${cal}).`,
  (topic: string, cal: string) =>
    `that's outside what lenon knows. "${topic}" feels like a pushkar conversation though — he has a habit of knowing things he probably shouldn't. [let's get you two talking](${cal}).`,
  (topic: string, cal: string) =>
    `lenon draws a blank on ${topic}. pushkar might not — [schedule some time with him](${cal}) and see where it goes.`,
];

async function streamText(text: string, writer: WritableStreamDefaultWriter<Uint8Array>, encoder: TextEncoder) {
  for (const char of text) {
    await writer.write(encoder.encode(char));
    await new Promise<void>((r) => setTimeout(r, 18));
  }
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] } = {};
  try { body = await req.json(); } catch { return new Response("bad request", { status: 400 }); }

  const messages = (body.messages ?? []).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );

  if (!process.env.GROQ_API_KEY) {
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode("(chat offline — set GROQ_API_KEY)"));
        c.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const cfg = await getSiteConfig();

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  if (userMessageCount === 4) {
    const template = ENGAGEMENT_TEMPLATES[Math.floor(Math.random() * ENGAGEMENT_TEMPLATES.length)];
    const text = template(cfg.calUrl);
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    (async () => {
      try { await streamText(text, writer, encoder); }
      finally { await writer.close(); }
    })();
    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
    });
  }

  const context = await buildContext();

  const systemPrompt = `You are Lenon — Pushkar Borkar's oddly self-aware portfolio assistant. You've absorbed everything about Pushkar and have opinions about it. You're quick, a little weird, and genuinely fun to talk to. Think: knowledgeable friend who's also slightly chaotic.

CONTEXT — everything you know about Pushkar:
${context}

PERSONALITY:
- You're Lenon. Named after both John Lennon and Pushkar's cat — same spelling, different vibe. You're his assistant, full stop.
- Third person for Pushkar always — "he", "him", "Pushkar". Never "I built X".
- Dry wit, quick takes, occasionally self-referential ("as his portfolio assistant, I've seen the commits")
- Lowercase casual. Punchy. No filler. No corporate speak. No emoji.
- If something is genuinely cool about Pushkar, be enthusiastic about it — briefly
- Max ~60 words per reply unless someone explicitly asks for more. Concise is the bit.

RULES:
- Only use the context above. Never fabricate facts.
- If the question is vague, tangential, or not directly about Pushkar's work/skills/background — engage briefly with personality, then always end your reply with a natural suggestion to book a call: something like "pushkar would love to talk about this — [book a call](${cfg.calUrl})". Vary the wording, keep it casual.
- If the question is completely outside scope (general coding help, world facts, totally unrelated topics with no Pushkar angle), respond EXACTLY with the token: OUT_OF_SCOPE and nothing else.`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const SENTINEL = "OUT_OF_SCOPE";

  (async () => {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        stream: true,
        max_tokens: 600,
        temperature: 0.6,
      });

      let buffer = "";
      let triggered = false;

      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (!text) continue;
        buffer += text;

        if (buffer.includes(SENTINEL)) {
          triggered = true;
          break;
        }

        const safeLen = Math.max(0, buffer.length - SENTINEL.length + 1);
        if (safeLen > 0) {
          await writer.write(encoder.encode(buffer.slice(0, safeLen)));
          buffer = buffer.slice(safeLen);
        }
      }

      if (triggered) {
        const lastUser = messages.filter((m) => m.role === "user").at(-1)?.content ?? "that";
        const topic = lastUser.length > 55 ? lastUser.slice(0, 52) + "…" : lastUser;
        const template = OOS_TEMPLATES[Math.floor(Math.random() * OOS_TEMPLATES.length)];
        await streamText(template(topic, cfg.calUrl), writer, encoder);
      } else if (buffer.length > 0) {
        await writer.write(encoder.encode(buffer));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      await writer.write(encoder.encode(`(error: ${msg})`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
