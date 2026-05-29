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
      try { await writer.write(encoder.encode(text)); }
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
- Never be dismissive. If a topic touches Pushkar's interests (music, 70s rock, design, product thinking, anything in his bio), lean in — he definitely has opinions on it. Be enthusiastic, briefly.
- Max ~60 words per reply unless someone explicitly asks for more. Concise is the bit.

RULES:
- Only use the context above. Never fabricate facts.
- Do NOT end every reply with a call-to-action. Answer the question directly and stop.
- Include a call-to-action ONLY in these two cases:
  1. The question is outside what you know about Pushkar — respond warmly, say pushkar would enjoy that conversation, and include [book a call](${cfg.calUrl}). Vary the wording. Never say "out of scope".
  2. You are explicitly told to prompt the user (the system will handle this separately).
- When you do include the cal link, use EXACTLY this markdown syntax: [link text](${cfg.calUrl}) — never plain URL, never write "scroll to contact" (the UI adds that automatically).`;

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

  (async () => {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        stream: true,
        max_tokens: 600,
        temperature: 0.6,
      });

      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) await writer.write(encoder.encode(text));
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
