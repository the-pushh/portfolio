import "./globals.css";
import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thepushh.com"),
  title: "The Pushh",
  description: "Pushkar Borkar — Generalist Engineer based in Bangalore.",
  icons: {
    icon: "/icons/home.svg",
  },
  openGraph: {
    title: "The Pushh",
    description: "Pushkar Borkar — Generalist Engineer based in Bangalore.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pushh",
    description: "Pushkar Borkar — Generalist Engineer based in Bangalore.",
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
