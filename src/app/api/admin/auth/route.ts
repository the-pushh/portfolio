import { NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedSessionValue } from "@/lib/auth";

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const pw = (data?.password ?? "") as string;
  const expected = process.env.ADMIN_PASSWORD ?? "changeme";
  if (pw !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, expectedSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
