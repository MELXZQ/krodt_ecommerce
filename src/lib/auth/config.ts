import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { cookies } from "next/headers";
import { db } from "../db";
import * as schema from "../db/schema/index";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  credentials: {
    email: true,
    password: true,
  },
  session: {
    cookieName: "auth_session",
    expiresIn: 60 * 60 * 24 * 7,
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    },
  },
});

export async function getGuestSession() {
  const store = await cookies();
  const token = store.get("guest_session")?.value;
  if (!token) return null;
  const [row] = await db
    .select()
    .from(schema.guest)
    .where(eq(schema.guest.sessionToken, token))
    .limit(1);
  return row ?? null;
}

export async function setGuestSessionCookie(token: string, maxAgeSeconds: number) {
  const store = await cookies();
  store.set("guest_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearGuestSessionCookie() {
  const store = await cookies();
  store.delete("guest_session");
}
