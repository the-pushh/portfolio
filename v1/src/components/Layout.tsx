import React from "react";
import { cn } from "../utils";

interface Props {
  icon: string;
  title: string;
  children: React.ReactNode;
  iconStyles?: string;
  id?: string;
  className?: string;
}

export const Layout = ({ icon, title, children, iconStyles, id, className="" }: Props) => (
  <div id={id} className={cn("flex flex-col lg:flex-row lg:items-start gap-0 lg:gap-3 py-[3.5rem] lg:py-[5rem] items-center justify-center px-5 lg:px-0", className)}>
    <img src={icon} alt="icon" className={cn("w-[4rem]", iconStyles)} />
    <div className="flex-1 text-center lg:text-left w-full">
      <h2 className="text-[2.25rem] font-semibold">{title}</h2>
      {children}
    </div>
  </div>
)