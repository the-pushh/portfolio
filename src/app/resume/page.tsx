import { redirect } from "next/navigation";

export const metadata = { title: "Resume — Pushkar Borkar" };

export default function ResumePage() {
  redirect("/pushkar-resume.pdf");
}
