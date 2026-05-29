"use client";

const FILE: Record<string, string> = {
  home: "/icons/home.svg",
  work: "/icons/work.svg",
  toolbox: "/icons/toolbox.svg",
  thoughts: "/icons/thoughts.svg",
  connect: "/icons/hello.svg",
};

type Props = {
  name: "home" | "work" | "toolbox" | "thoughts" | "connect";
  size?: number;
};

export default function SectionIcon({ name, size = 72 }: Props) {
  const url = FILE[name];
  return (
    <div
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url('${url}')`,
        maskImage: `url('${url}')`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        backgroundColor: "var(--accent)",
      }}
    />
  );
}
