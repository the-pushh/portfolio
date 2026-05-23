import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        "bg-deep": "var(--bg-deep)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-dim": "var(--ink-dim)",
        "ink-mute": "var(--ink-mute)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        accent: "var(--accent)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        edit: ["var(--font-edit)"],
      },
    },
  },
  plugins: [],
};

export default config;
