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
  await prisma.thought.deleteMany({});

  // ---------- Projects (work = experiences + projects from v1) ----------
  const projects = [
    // experiences
    {
      slug: "foliox",
      name: "folioX",
      role: "Lead Software Engineer",
      when: "Dec 2023 — Present",
      blurb: "Built web3 portfolio management software with liquid staking and liquidity pools. Designed and developed landing pages with motion graphics. Set up company-wide design system and code infrastructure.",
      tags: ["React", "Next.js", "Wagmi", "Ethers.js", "Tailwind", "Radix"],
      live: "https://www.foliox.io/",
      code: "",
      current: true,
      kind: "experience",
      order: 7,
    },
    {
      slug: "liquid-staking-aggregator",
      name: "Liquid Staking Aggregator",
      role: "Full Stack Developer",
      when: "Nov 2023",
      blurb: "Dapp enabling ETH staking to Lido and Stader from a unified UI — aggregates staking across both platforms.",
      tags: ["React", "Ethers.js", "Solidity", "Styled-components"],
      live: "https://lst-agg.vercel.app/",
      code: "https://github.com/Pushkar1809/Liquid-Staking-Agg",
      current: false,
      kind: "project",
      order: 6,
    },
    {
      slug: "ngram",
      name: "ngram",
      role: "SDE Intern",
      when: "Jan 2023 — Aug 2023",
      blurb: "Boosted SEO through strategic nested sitemaps. Implemented rate limiting and role-based subscriptions. Leveraged Large Language Models for data extraction and structuring.",
      tags: ["React", "Next.js", "Flask", "Python", "OpenAI API"],
      live: "https://www.ngram.com/",
      code: "",
      current: false,
      kind: "experience",
      order: 5,
    },
    {
      slug: "panda-wallet",
      name: "Panda Wallet",
      role: "Full Stack Developer",
      when: "Dec 2022",
      blurb: "User-friendly Web3 wallet abstracting private keys with smart contracts, offering guardian wallets for easy recovery.",
      tags: ["React", "ethers.js", "ChakraUI", "EIP 4337"],
      live: "",
      code: "https://github.com/dark-circles-2022/panda-wallet",
      current: false,
      kind: "project",
      order: 4,
    },
    {
      slug: "onboard-studio",
      name: "OnboardStudioOü",
      role: "Founding Software Developer",
      when: "Mar 2022 — Oct 2022",
      blurb: "Developed a DAO members management hub with React client and Node.js API integrated with MongoDB. Spearheaded deployment on cPanel and Linux servers. Secured $20,000 in grants to fund startup operations.",
      tags: ["React", "Node.js", "Express.js", "Ethers.js", "MongoDB", "Linux"],
      live: "",
      code: "",
      current: false,
      kind: "experience",
      order: 3,
    },
    {
      slug: "nuance",
      name: "Nuance Communications",
      role: "SDE Intern",
      when: "May 2022 — Jul 2022",
      blurb: "Contributed to a physicians report builder using speech-to-text models. Reverse-engineered application code to create design documentation for onboarding. Established best practices for Git, TDD, and Agile.",
      tags: ["React", "Ruby on Rails", "MySQL", "Redis", "JIRA"],
      live: "https://www.nuance.com/",
      code: "",
      current: false,
      kind: "experience",
      order: 2,
    },
    {
      slug: "shatranj",
      name: "Shatranj",
      role: "Full Stack Developer",
      when: "Nov 2021",
      blurb: "Chess dapp merging chess legacy with Web3 — rewarding winners with unique, artsy chess NFTs for customization.",
      tags: ["React", "chess.js", "moralis", "infura", "ERC721"],
      live: "",
      code: "https://github.com/GHODA-crypto/shatranj",
      current: false,
      kind: "project",
      order: 1,
    },
    {
      slug: "marsmello",
      name: "Marsmello",
      role: "Web3 Engineer",
      when: "Aug 2021",
      blurb: "Decentralized Mars colonization game blending idle, open-world, strategy, economy, and simulation — a unique Web3 experience.",
      tags: ["React", "web3.js", "NFT", "Polygon", "React Spring"],
      live: "https://marsmello.netlify.app/",
      code: "https://github.com/jayeshbhole/MarsMello",
      current: false,
      kind: "project",
      order: 0,
    },
    {
      slug: "OMEGALabs Inc.",
      name: "OMEGALabs AI",
      role: "Founding Engineer & Tech Lead",
      when: "Oct 2024 — Dec 2025",
      blurb: "Led full-stack development of core systems at Omega Labs including screen recording, a work reward flow, and a task marketplace, while owning execution across engineering and design through team turnover in a fast moving early stage environment.",
      tags: ["AI", "LLM", "Agents", "VoiceAI", "Software Architecture", "Management", "Video Processing"],
      live: "https://www.omega.inc",
      code: "",
      current: false,
      kind: "experience",
      order: 8,
    },
  ];

  await prisma.project.deleteMany({});
  for (const p of projects) {
    await prisma.project.create({
      data: {
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
        kind: p.kind,
        order: p.order,
      },
    });
  }

  // ---------- Toolbox ----------
  const toolboxData = [
    { name: "Frontend", items: ["Javascript", "Typescript", "React", "Next.js", "TailwindCSS", "React-Native"] },
    { name: "Backend", items: ["Python", "Flask", "Node.js", "Express.js"] },
    { name: "Database", items: ["MongoDB", "SQL", "MySQL", "Redis"] },
    { name: "Web3", items: ["ethers.js", "wagmi"] },
    { name: "Misc", items: ["Vercel", "Git", "Figma"] },
    { name: "Frameworks", items: ["Electron", "Supabase"] },
  ];
  await prisma.toolboxCategory.deleteMany({});
  for (let i = 0; i < toolboxData.length; i++) {
    const t = toolboxData[i];
    await prisma.toolboxCategory.create({
      data: { name: t.name, items: JSON.stringify(t.items), order: i },
    });
  }

  // ---------- Socials ----------
  const socials = [
    { key: "Github", val: "@Pushkar1809", href: "https://github.com/Pushkar1809" },
    { key: "LinkedIn", val: "/in/pushkar-borkar", href: "https://www.linkedin.com/in/pushkar-borkar" },
    { key: "Twitter/X", val: "@the_pushh", href: "https://twitter.com/the_pushh" },
    { key: "Email", val: "me@thepushh.com", href: "mailto:me@thepushh.com" },
    { key: "Instagram", val: "@the_pushh", href: "https://www.instagram.com/the_pushh/" },
  ];
  await prisma.social.deleteMany({});
  for (let i = 0; i < socials.length; i++) {
    await prisma.social.create({ data: { ...socials[i], order: i } });
  }

  // ---------- Spotify Playlists ----------
  const playlists = [
    { spotifyId: "5PwsPoX590Bi9J5AgXSNGL", name: "The Groovy Train", isDefault: false, order: 0 },
    { spotifyId: "79k6Ro7BfRTQKfnFtgJAZk", name: "Dimension Shifting Rock", isDefault: false, order: 1 },
    { spotifyId: "7dg2tOyOEqopjt4zqcogyW", name: "If you like Nirvana", isDefault: false, order: 2 },
    { spotifyId: "7CBtW9Mn4O0jJf6sGpwHL2", name: "Ain't no guitar like these", isDefault: false, order: 3 },
    { spotifyId: "4c7WVJWWZGbiQAUsHFOKIM", name: "Should have died in '79", isDefault: false, order: 4 },
    { spotifyId: "1vIYoXFZf5jTHkDUXFlwuA", name: "Gazals Therapy", isDefault: false, order: 5 },
    { spotifyId: "7KM1nzfWcqeIrN7LuwWRmy", name: "Smoother than a que ball", isDefault: false, order: 6 },
  ];
  await prisma.spotifyPlaylist.deleteMany({});
  for (const pl of playlists) {
    await prisma.spotifyPlaylist.create({ data: pl });
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
