"use client";

import { ReactNode } from "react";
import { ScrollProvider } from "./ScrollContext";
import BrandMark from "./BrandMark";
import LeftRail from "./LeftRail";
import SearchBar from "./SearchBar";
import StatusBar from "./StatusBar";
import ChatBot from "./ChatBot";
import MusicPrompt from "./MusicPrompt";
type Props = {
  children: ReactNode;
  status: string;
  calUrl: string;
  email: string;
  hasThoughts?: boolean;
  showLeftRail?: boolean;
};

export default function Shell({ children, status, calUrl, email, hasThoughts = true, showLeftRail = true }: Props) {
  return (
    <ScrollProvider>
      <BrandMark forceVisible={!showLeftRail} />
      {showLeftRail ? <LeftRail hasThoughts={hasThoughts} /> : null}
      <SearchBar hasThoughts={hasThoughts} />
      {children}
      <StatusBar status={status} calUrl={calUrl} email={email} />
      <ChatBot calUrl={calUrl} />
      <MusicPrompt />
    </ScrollProvider>
  );
}
