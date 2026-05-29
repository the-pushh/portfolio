import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import AnimatedTitle from "@/components/AnimatedTitle";

const inter = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const jb = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const instr = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-edit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Pushh",
  description: "Pushkar's Portfolio",
  icons: {
    icon: "/icons/home.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jb.variable} ${instr.variable}`}>
      <body>
        <AnimatedTitle />
        {children}
      </body>
    </html>
  );
}
