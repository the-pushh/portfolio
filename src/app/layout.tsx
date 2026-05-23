import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const jb = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const instr = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-edit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pushkar Borkar — Generalist Engineer",
  description: "Portfolio of Pushkar Borkar (a.k.a. ThePushh) — designer-developer based in Bangalore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jb.variable} ${instr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
