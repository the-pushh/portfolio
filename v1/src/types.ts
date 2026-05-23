export interface Experience {
  id: number;
  role: string;
  company: string;
  companyLogoSrc: string;
  companyUrl?: string;
  summary: string[];
  skills: string[];
  start: string;
  end?: string;
}

export interface Project {
  id: number;
  title: string;
  displayImageSrc: string;
  codeImageSrc: string;
  description: string;
  timePeriod: string;
  skills: string[];
  urls: {
    name: string;
    to: string;
  }[];
}

export interface Skill {
  name: string;
  type: "frontend" | "backend" | "database" | "web3" | "misc";
}

export interface Contact {
  name: string;
  to: string;
  displayName: string;
}