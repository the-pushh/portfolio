"use client";

import Link from "next/link";
import NameMorph from "@/components/NameMorph";
import { useScroll } from "./ScrollContext";

export default function BrandMark({ forceVisible = false }: { forceVisible?: boolean }) {
  const { scrolledPastHero } = useScroll();
  const visible = forceVisible || scrolledPastHero;

  return (
    <Link href="/" className={`brandmark ${visible ? "visible" : ""}`}>
      <NameMorph />
    </Link>
  );
}
