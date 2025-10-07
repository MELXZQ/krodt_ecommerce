"use server";

import { z } from "zod";
import { getGuestSession, setGuestSessionCookie, clearGuestSessionCookie } from "./config";
import { db } from "../db";
import * as schema from "../db/schema/index";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const emailSchema = z.string().email().max(255);
const passwordSchema = z.string().min(8).max(255);
const nameSchema = z.string().min(1).max(255).optional();

export const createGuestSession = async () => {
  const token = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(schema.guest).values({
    sessionToken: token,
    expiresAt,
  });
  await setGuestSessionCookie(token, 7 * 24 * 60 * 60);
  return { ok: true, token, expiresAt };
};

export const guestSession = async () => {
  const guest = await getGuestSession();
  if (guest) return { ok: true, guest };
  return createGuestSession();
};

const signUpInput = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const signUp = async (input: z.infer<typeof signUpInput>) => {
  const data = signUpInput.parse(input);
  const existing = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, data.email),
  });
  if (existing) {
    return { ok: false, error: "Email already in use" };
  }
  const hashed = await bcrypt.hash(data.password, 10);
  const userId = randomUUID();
  await db.insert(schema.user).values({
    id: userId,
    email: data.email,
    name: data.name,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await db.insert(schema.account).values({
    userId,
    accountId: data.email,
    providerId: "credentials",
    password: hashed,
  });
  await mergeGuestCartWithUserCart();
  await clearGuestSessionCookie();
  return { ok: true };
};

const signInInput = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signIn = async (input: z.infer<typeof signInInput>) => {
  const data = signInInput.parse(input);
  const acc = await db.query.account.findFirst({
    where: (a, { and, eq }) => and(eq(a.providerId, "credentials"), eq(a.accountId, data.email)),
    with: { user: true },
  });
  if (!acc || !acc.password) {
    return { ok: false, error: "Invalid credentials" };
  }
  const valid = await bcrypt.compare(data.password, acc.password);
  if (!valid) {
    return { ok: false, error: "Invalid credentials" };
  }
  await mergeGuestCartWithUserCart();
  await clearGuestSessionCookie();
  return { ok: true };
};

export const signOut = async () => {
  return { ok: true };
};

export const mergeGuestCartWithUserCart = async () => {
  const guest = await getGuestSession();
  if (!guest) return { ok: true };
  await db.delete(schema.guest).where(eq(schema.guest.id, guest.id));
  return { ok: true };
};
