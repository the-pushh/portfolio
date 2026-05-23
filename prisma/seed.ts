import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------- SiteConfig ----------
  const about = `I'm a designer who learned to code, and a developer who never stopped sketching. For the last few years I've been making things at the intersection of design, engineering, and music — interfaces that handle live data without feeling frantic, smart contracts I half-understand, and side projects that survive a year.

I currently lead design & web3 work at Marsmello, a decentralised Mars colonisation game. Before that I built three fintech dashboards as a freelancer, shipped Stanza, Slowmail and Rifftrack as solo projects, and helped folioX rebuild its publishing pipeline. I read manuals like poems, write poems like manuals, and record demos in my room under my own name. Based in Bangalore.`;

  const bio = `Pushkar Borkar — a.k.a. ThePushh. Multidisciplinary builder based in Bangalore, India (IST, UTC+5:30).

Role: designer who learned to code; developer who never stopped sketching. Currently open to work and looking for a co-founder / partner for something weird and ambitious.

Now: leading design & web3 work at Marsmello (decentralised Mars colonisation game). Shipping the v2 economy update.

Past projects: Marsmello, Rifftrack, Stanza, Slowmail, folioX, freelance fintech dashboards.

Stack: TypeScript, React, Next.js; Node/Express, Python; ethers.js, wagmi, Foundry. Vercel, Figma, Git.

Aesthetic: editorial, dark, single-accent minimalism. Loves typography, slow software, music tech.

Tone for replies: warm, short, slightly literary, lowercase-leaning. Don't use emoji. Don't oversell. Keep replies under ~60 words unless asked for more.`;

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: {
      name: "Pushkar Borkar",
      role: "Generalist Engineer",
      location: "Bangalore, IN",
      accent: "#FEACD6",
      status: "work with me",
      statusDot: "warm",
      email: "thepushh@gmail.com",
      resumeUrl: "/resume",
      calUrl: "https://cal.com/pushkar",
      about,
      bio,
    },
    create: {
      id: "singleton",
      name: "Pushkar Borkar",
      role: "Generalist Engineer",
      location: "Bangalore, IN",
      accent: "#FEACD6",
      status: "work with me",
      statusDot: "warm",
      email: "thepushh@gmail.com",
      resumeUrl: "/resume",
      calUrl: "https://cal.com/pushkar",
      about,
      bio,
    },
  });

  // ---------- Thoughts ----------
  const thoughts = [
    {
      slug: "on-building-things-you-dont-fully-understand",
      title: "On building things you don't fully understand",
      excerpt:
        "A long note on web3, half-knowledge, and the strange comfort of shipping anyway.",
      tags: ["web3", "engineering", "longread"],
      date: "May 02, 2026",
      readTime: "11 min",
      featured: true,
    },
    {
      slug: "the-composer-is-a-state-machine",
      title: "The composer is a state machine",
      excerpt:
        "Why music software is just UX with extra steps — and why that's hopeful.",
      tags: ["music-tech", "engineering"],
      date: "Apr 18, 2026",
      readTime: "7 min",
      featured: false,
    },
    {
      slug: "latency-is-a-feeling-not-a-number",
      title: "Latency is a feeling, not a number",
      excerpt: "Small notes on perceived speed, optimistic UI, and trust.",
      tags: ["ux", "frontend"],
      date: "Apr 02, 2026",
      readTime: "5 min",
      featured: false,
    },
    {
      slug: "reading-the-room-design-systems-as-social-contracts",
      title: "Reading the room: design systems as social contracts",
      excerpt: "Systems work because people agree, not because Figma says so.",
      tags: ["design", "systems"],
      date: "Feb 24, 2026",
      readTime: "8 min",
      featured: false,
    },
    {
      slug: "i-rewrote-my-portfolio-for-the-seventh-time",
      title: "I rewrote my portfolio for the seventh time",
      excerpt: "Notes from another rebuild. Editorial, dark, single accent.",
      tags: ["design", "meta"],
      date: "Mar 11, 2026",
      readTime: "4 min",
      featured: false,
    },
  ];

  for (const t of thoughts) {
    await prisma.thought.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        excerpt: t.excerpt,
        tags: JSON.stringify(t.tags),
        date: t.date,
        readTime: t.readTime,
        featured: t.featured,
      },
      create: {
        slug: t.slug,
        title: t.title,
        excerpt: t.excerpt,
        content: "",
        tags: JSON.stringify(t.tags),
        date: t.date,
        readTime: t.readTime,
        featured: t.featured,
        published: true,
      },
    });
  }

  // ---------- Projects ----------
  const projects = [
    {
      slug: "marsmello",
      name: "Marsmello",
      role: "Design + Web3 Engineer",
      when: "2024 — Present",
      blurb:
        "Decentralised Mars colonisation game. Designing the v2 economy and shipping the player-facing dashboard.",
      tags: ["web3", "game", "react", "design-system", "ethers.js"],
      live: "https://marsmello.example",
      code: "https://github.com/Pushkar1809/marsmello",
      current: true,
      order: 0,
    },
    {
      slug: "rifftrack",
      name: "Rifftrack",
      role: "Solo · Design + Engineering",
      when: "2026",
      blurb:
        "A small DAW-ish thing for laying down ideas fast. Webaudio, react, a stubborn pursuit of low latency.",
      tags: ["music", "webaudio", "react", "node"],
      live: "https://rifftrack.example",
      code: "https://github.com/Pushkar1809/rifftrack",
      current: true,
      order: 1,
    },
    {
      slug: "stanza",
      name: "Stanza",
      role: "Solo, Design + Code",
      when: "2025",
      blurb: "A quiet writing tool for poetry. Drafts, line-breaks, and a little restraint.",
      tags: ["writing", "react"],
      live: "",
      code: "",
      current: false,
      order: 2,
    },
    {
      slug: "slowmail",
      name: "Slowmail",
      role: "Solo, Full Stack",
      when: "2024",
      blurb: "Letters that arrive when you mean them to.",
      tags: ["fullstack", "next.js"],
      live: "",
      code: "",
      current: false,
      order: 3,
    },
    {
      slug: "foliox",
      name: "folioX",
      role: "Full Stack Developer",
      when: "2023–24",
      blurb: "Rebuilt the publishing pipeline. Cut latency, kept the editorial.",
      tags: ["fullstack", "publishing"],
      live: "",
      code: "",
      current: false,
      order: 4,
    },
    {
      slug: "fintech-dashboards",
      name: "Fintech Dashboards",
      role: "Freelance Frontend",
      when: "2024–25",
      blurb: "Three dashboards for three fintechs. Live data, calm interfaces.",
      tags: ["frontend", "freelance"],
      live: "",
      code: "",
      current: false,
      order: 5,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        role: p.role,
        when: p.when,
        blurb: p.blurb,
        tags: JSON.stringify(p.tags),
        live: p.live,
        code: p.code,
        current: p.current,
        order: p.order,
      },
      create: {
        slug: p.slug,
        name: p.name,
        role: p.role,
        when: p.when,
        blurb: p.blurb,
        content: "",
        tags: JSON.stringify(p.tags),
        live: p.live,
        code: p.code,
        current: p.current,
        order: p.order,
      },
    });
  }

  // ---------- Toolbox ----------
  const toolboxData = [
    { name: "Frontend", items: ["Javascript", "Typescript", "React", "Vue"] },
    { name: "Frameworks", items: ["Next.js", "Astro", "Remix", "Vite", "Tailwind"] },
    { name: "Backend", items: ["Python", "Flask", "Node.js", "Express.js"] },
    { name: "Databases", items: ["MongoDB", "MySQL", "SQL", "Redis"] },
    { name: "Web3", items: ["ethers.js", "wagmi", "viem", "Foundry"] },
    { name: "Tools", items: ["Vercel", "Figma", "Git", "Docker", "Linear"] },
  ];
  await prisma.toolboxCategory.deleteMany({});
  for (let i = 0; i < toolboxData.length; i++) {
    const t = toolboxData[i];
    await prisma.toolboxCategory.create({
      data: { name: t.name, items: JSON.stringify(t.items), order: i },
    });
  }

  // ---------- Tracks ----------
  const tracks = [
    { artist: "Khruangbin", title: "Maria Tambien", len: "5:13" },
    { artist: "Bon Iver", title: "Holocene", len: "5:36" },
    { artist: "Ravi Shankar", title: "Raga Jog", len: "8:42" },
    { artist: "Mac DeMarco", title: "Chamber of Reflection", len: "4:48" },
    { artist: "Tame Impala", title: "Let It Happen", len: "7:47" },
    { artist: "Nils Frahm", title: "Says", len: "8:18" },
    { artist: "Arooj Aftab", title: "Mohabbat", len: "6:50" },
    { artist: "Floating Points", title: "Birth", len: "5:51" },
    { artist: "Pushkar (demo)", title: "Bangalore, 4am", len: "3:42" },
  ];
  await prisma.track.deleteMany({});
  for (let i = 0; i < tracks.length; i++) {
    await prisma.track.create({ data: { ...tracks[i], order: i } });
  }

  // ---------- Socials ----------
  const socials = [
    { key: "Github", val: "@Pushkar1809", href: "https://github.com/Pushkar1809" },
    { key: "LinkedIn", val: "/in/pushkar-borkar", href: "https://linkedin.com/in/pushkar-borkar" },
    { key: "Twitter/X", val: "@0xPushkr", href: "https://x.com/0xPushkr" },
    { key: "Resume", val: "/resume", href: "/resume" },
    { key: "Mail", val: "thepushh@gmail.com", href: "mailto:thepushh@gmail.com" },
    { key: "Twitch", val: "@pushkarborkar", href: "https://twitch.tv/pushkarborkar" },
    { key: "Instagram", val: "@champagnebappi", href: "https://instagram.com/champagnebappi" },
  ];
  await prisma.social.deleteMany({});
  for (let i = 0; i < socials.length; i++) {
    await prisma.social.create({ data: { ...socials[i], order: i } });
  }

  console.log("seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
