"use client";

const FILE = {
  home: "/icons/home.svg",
  work: "/icons/work.svg",
  projects: "/icons/projects.svg",
  toolbox: "/icons/toolbox.svg",
  thoughts: "/icons/thoughts.svg",
  connect: "/icons/hello.svg",
};

type Props = {
  name: keyof typeof FILE;
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
