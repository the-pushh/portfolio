"use client";

import { ReactNode } from "react";
import { ScrollProvider } from "./ScrollContext";
import BrandMark from "./BrandMark";
import LeftRail from "./LeftRail";
import SearchBar from "./SearchBar";
import StatusBar from "./StatusBar";
import ChatBot from "./ChatBot";
import type { TrackDTO } from "@/types";

type Props = {
  children: ReactNode;
  status: string;
  tracks: TrackDTO[];
  showLeftRail?: boolean;
};

export default function Shell({ children, status, tracks, showLeftRail = true }: Props) {
  return (
    <ScrollProvider>
      <BrandMark forceVisible={!showLeftRail} />
      {showLeftRail ? <LeftRail /> : null}
      <SearchBar />
      {children}
      <StatusBar status={status} tracks={tracks} />
      <ChatBot />
    </ScrollProvider>
  );
}
