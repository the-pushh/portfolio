import { Experience, Project, Skill, Contact } from "./types";
import ngram from "./assets/images/ngram.png";
import nuance from "./assets/images/nuance.png";
import onboard from "./assets/images/onboard.png";
import foliox from "./assets/images/foliox.png";
import marsmello from "./assets/images/marsmello.png";
import marsmelloCode from "./assets/images/marsmello-code.png";
import shatranj from "./assets/images/shatranj.png";
import shatranjCode from "./assets/images/shatranj-code.png";
import panda from "./assets/images/panda.png";
import pandaCode from "./assets/images/panda-code.png";
import lst from "./assets/images/lst.png";
import lstCode from "./assets/images/lst-code.png";
import resume from "./assets/Pushkar_Borkar_Resume.pdf";

export const headline: string = "Crafting *User-Centric* Digital Experiences.";

export const aboutMe: string =
	"I'm a *full stack developer* who loves creating smooth, eye-catching digital experiences. Crafting *intuitive interfaces* and tackling *complex coding challenges* really gets me going. *Design* feeds my soul too - web design systems, fashion, architecture, you name it. If it blends function with beauty, I'm obsessed! But I don't just geek out over tech and design. *Music* is my vibe - listening, making, discovering new tunes. And, 🤓 I geek out on music too.";

export const calendlyUrl: string = "https://calendly.com/pushkar1809/a-quick-connect";

export const experiences: Experience[] = [
	{
		id: 0,
		role: "Lead Software Engineer",
		company: "folioX",
		companyLogoSrc: foliox,
		companyUrl: "https://www.foliox.io/",
		summary: [
			"Built web3 portfolio management software with liquid staking and liquidity pools.",
			"Designed and developed landing pages with motion graphics for better product reach.",
			"Set up company-wide design system for apps and marketing and set up code infrastructure.",
		],
		skills: ["React", "Nextjs", "Wagmi", "Ethers.js", "Tailwind", "Radix"],
		start: "Dec, 2023",
	},
	{
		id: 1,
		role: "SDE Intern",
		company: "ngram",
		companyLogoSrc: ngram,
		companyUrl: "https://www.ngram.com/",
		summary: [
			"Boosted SEO through strategic nested sitemaps, optimizing search engine visibility.",
			"Implemented rate limiting and role-based subscriptions for efficient resource management.",
			"Leveraged Large Language Models for data extraction, structuring in JSON format.",
		],
		skills: [
			"React",
			"Nextjs",
			"Flask",
			"Python",
			"Apache Superset",
			"OpenAI API",
		],
		start: "Jan, 2023",
		end: "Aug, 2023",
	},
	{
		id: 2,
		role: "Founding Software Developer",
		company: "OnboardStudioOü",
		companyLogoSrc: onboard,
		summary: [
			"Developed a DAO members management hub with React client and Node.js API integrated with MongoDB.",
			"Spearheaded deployment process, working with cPanel and Linux servers for seamless user access.",
			"Managed and collaborated with team across various time zones.",
			"Successfully secured $20,000 in grants to fund startup operations.",
		],
		skills: [
			"React",
			"Nodejs",
			"Express.js",
			"Ethers.js",
			"ChakraUI",
			"MongoDB",
			"Linux",
		],
		start: "Mar, 2022",
		end: "Oct, 2022",
	},
	{
		id: 3,
		role: "SDE Intern",
		company: "Nuance Communications",
		companyLogoSrc: nuance,
		companyUrl: "https://www.nuance.com/index.html",
		summary: [
			"Contributed in building a physicians report builder that creates report using speech-to-text models.",
			"Reverse-engineered application code to create design documentation for streamlining new hire onboarding.",
			"Established industry best practices for Git, coding, Test Driven Development and Agile methodologies.",
		],
		skills: ["React", "Ruby on Rails", "MySQL", "Redis", "JIRA"],
		start: "May, 2022",
		end: "July, 2022",
	},
];

export const projects: Project[] = [
	{
		id: 0,
		title: "Marsmello",
		displayImageSrc: marsmello,
		codeImageSrc: marsmelloCode,
		description:
			"Decentralized Mars colonization game blending idle, open-world, strategy, economy, and simulation, offering a unique Web3 experience.",
		timePeriod: "August 2021",
		skills: ["React", "web3.js", "NFT", "Polygon", "React Spring"],
		urls: [
			{
				name: "live",
				to: "https://marsmello.netlify.app/",
			},
			{
				name: "github",
				to: "https://github.com/jayeshbhole/MarsMello",
			},
			{
				name: "devfolio",
				to: "https://devfolio.co/projects/marsmello-a90e",
			},
		],
	},
	{
		id: 1,
		title: "Shatranj",
		displayImageSrc: shatranj,
		codeImageSrc: shatranjCode,
		description:
			"Chess dapp merging chess legacy with Web3, rewarding winners with unique, artsy chess NFTs for customization.",
		timePeriod: "November 2021",
		skills: ["React", "chess.js", "moralis", "infura", "ERC721"],
		urls: [
			{
				name: "nft",
				to: "https://testnets.opensea.io/assets/mumbai/0x59936a21b97aa3c42d885b9fba3b6a0c562c6f0d/4",
			},
			{
				name: "github",
				to: "https://github.com/GHODA-crypto/shatranj",
			},
			{
				name: "devfolio",
				to: "https://devfolio.co/projects/shatranj-d063",
			},
		],
	},
	{
		id: 2,
		title: "Panda Wallet",
		displayImageSrc: panda,
		codeImageSrc: pandaCode,
		description:
			"User-friendly Web3 wallet, abstracting private keys with smart contracts, and offering guardian wallets for easy recovery.",
		timePeriod: "December 2022",
		skills: ["React", "ethers.js", "chakraUI", "EIP 4337"],
		urls: [
			{
				name: "figma",
				to: "https://www.figma.com/file/0BqUhbNQ7xxqaaqujbNXHo/Wallet?node-id=164%3A24365&t=9KHDA77kh1eBHzod-1",
			},
			{
				name: "github",
				to: "https://github.com/dark-circles-2022/panda-wallet",
			},
			{
				name: "devfolio",
				to: "https://devfolio.co/projects/panda-wallet-698f",
			},
		],
	},
	{
		id: 3,
		title: "Liquid Staking Aggregator",
		displayImageSrc: lst,
		codeImageSrc: lstCode,
		description:
			"Dapp that will enable you to stake your ETH to Lido and Stader from an unified UI. This is aggregator that facilitates staking on both platforms.",
		timePeriod: "Novmeber 2023",
		skills: ["React", "Ethers.js", "Solidity", "Styled-components"],
		urls: [
			{
				name: "live",
				to: "https://lst-agg.vercel.app/",
			},
			{
				name: "github",
				to: "https://github.com/Pushkar1809/Liquid-Staking-Agg",
			},
		],
	},
];

export const skills: Skill[] = [
	{ name: "Javascript", type: "frontend" },
	{ name: "Typescript", type: "frontend" },
	{ name: "React", type: "frontend" },
	{ name: "Next.js", type: "frontend" },
	{ name: "TailwindCSS", type: "frontend" },
	{ name: "React-Native", type: "frontend" },
	{ name: "Python", type: "backend" },
	{ name: "Flask", type: "backend" },
	{ name: "Node.js", type: "backend" },
	{ name: "Express.js", type: "backend" },
	{ name: "MongoDB", type: "database" },
	{ name: "SQL", type: "database" },
	{ name: "MySQL", type: "database" },
	{ name: "Redis", type: "database" },
	{ name: "ethers.js", type: "web3" },
	{ name: "wagmi", type: "web3" },
  { name: "Vercel", type: "misc" },
  { name: "Git", type: "misc" },
  { name: "Figma", type: "misc" }
];

export const contacts: Contact[] = [
	{
		name: "Github",
		to: "https://github.com/Pushkar1809",
		displayName: "@Pushkar1809",
	},
	{
		name: "Linkedin",
		to: "https://www.linkedin.com/in/pushkar-borkar",
		displayName: "/in/pushkar-borkar",
	},
	{
		name: "Twitter/X",
		to: "https://twitter.com/0xpushkr",
		displayName: "@0xPushkr",
	},
	{
		name: "Resume",
		to: resume,
		displayName: "/resume",
	},
	{
		name: "Email",
		to: "mailto:pushkarborkar1809@gmail.com",
		displayName: "pushkarborkar1809@gmail.com",
	},
	{
		name: "Twitch",
		to: "https://www.twitch.tv/pushkarborkar",
		displayName: "@pushkarborkar",
	},
	{
		name: "Instagram",
		to: "https://www.instagram.com/champagnebappi/",
		displayName: "@champagnebappi",
	},
];