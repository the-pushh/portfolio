import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin-session";

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const c = jar.get(ADMIN_COOKIE);
  if (!c) return false;
  return c.value === expectedSessionValue();
}

export function expectedSessionValue(): string {
  // Stable, low-entropy session marker; the secret is the password itself
  const pw = process.env.ADMIN_PASSWORD ?? "changeme";
  // simple obfuscation; not a real signature
  return Buffer.from(`ok:${pw.length}:${pw.slice(0, 1)}${pw.slice(-1)}`).toString("base64");
}
