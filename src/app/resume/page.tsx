import Link from "next/link";

export const metadata = { title: "Resume — Pushkar Borkar" };

export default function ResumePage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "80px 24px",
        color: "var(--ink)",
      }}
    >
      <Link href="/" style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
        ← home
      </Link>
      <h1 style={{ fontFamily: "var(--font-edit)", fontSize: 56, margin: "20px 0 6px" }}>
        Pushkar Borkar
      </h1>
      <p style={{ color: "var(--ink-soft)", fontStyle: "italic", fontFamily: "var(--font-edit)", fontSize: 20, marginTop: 0 }}>
        Generalist Engineer · Bangalore, IN
      </p>
      <p style={{ color: "var(--ink-soft)" }}>
        Resume PDF coming soon. In the meantime, see the work section on the home page or reach out via{" "}
        <a href="mailto:thepushh@gmail.com" style={{ borderBottom: "1px solid var(--accent-line)" }}>
          email
        </a>
        .
      </p>
    </main>
  );
}
