export type ThoughtDTO = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  readTime: string;
  featured: boolean;
  published: boolean;
};

export type ProjectDTO = {
  id: string;
  slug: string;
  name: string;
  role: string;
  when: string;
  blurb: string;
  content: string;
  tags: string[];
  live: string;
  code: string;
  current: boolean;
  order: number;
};

export type SocialDTO = {
  id: string;
  key: string;
  val: string;
  href: string;
  order: number;
};

export type TrackDTO = {
  id: string;
  artist: string;
  title: string;
  len: string;
  order: number;
};

export type ToolboxCategoryDTO = {
  id: string;
  name: string;
  items: string[];
  order: number;
};

export type SiteConfigDTO = {
  id: string;
  name: string;
  role: string;
  location: string;
  accent: string;
  status: string;
  statusDot: string;
  bio: string;
  about: string;
  email: string;
  resumeUrl: string;
  calUrl: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
