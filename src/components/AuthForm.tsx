"use client";

import React, { useState } from "react";
import Link from "next/link";
import SocialProviders from "./SocialProviders";
import {useRouter} from "next/navigation";
import {signIn} from "@/lib/auth/actions";

type Props = {
  mode: "sign-in" | "sign-up";
  onSubmit: (formData: FormData) => Promise<{ok: boolean, userID? : string} | null>;
};

export default function AuthForm({ mode, onSubmit}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "sign-up";
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      try {
          const result = await onSubmit(formData);

          if (result?.ok) router.push("/");

      } catch (e) {
          console.error(e);
      }

  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <p className="text-sm text-[var(--color-dark-700)]">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="underline hover:opacity-80">
                Sign In
              </Link>
            </>
          ) : (
            <>
              New to Nike?{" "}
              <Link href="/sign-up" className="underline hover:opacity-80">
                Create an account
              </Link>
            </>
          )}
        </p>
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-[var(--color-dark-900)]">
          {isSignup ? "Join Nike Today!" : "Welcome Back"}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-dark-700)]">
          {isSignup ? "Create your account to start your fitness journey" : "Sign in to continue"}
        </p>
      </div>

      <SocialProviders labelPrefix={isSignup ? "Continue" : "Sign in"} />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--color-light-300)]" />
        <span className="text-xs text-[var(--color-dark-700)]">
          {isSignup ? "Or sign up with" : "Or sign in with"}
        </span>
        <div className="h-px flex-1 bg-[var(--color-light-300)]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
        aria-describedby="auth-footnote"
      >
        {isSignup && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[var(--color-dark-900)]">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-4 py-3 text-[var(--color-dark-900)] placeholder-[var(--color-dark-500)] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[var(--color-dark-900)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-4 py-3 text-[var(--color-dark-900)] placeholder-[var(--color-dark-500)] focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[var(--color-dark-900)]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="minimum 8 characters"
              className="w-full rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-4 py-3 pr-12 text-[var(--color-dark-900)] placeholder-[var(--color-dark-500)] focus:outline-none focus:ring-2 focus:ring-black"
              aria-describedby="password-help"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 my-auto h-9 w-9 rounded-full text-[var(--color-dark-700)] hover:bg-[var(--color-light-200)] focus:outline-none focus:ring-2 focus:ring-black"
            >
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
          <p id="password-help" className="text-xs text-[var(--color-dark-700)]">
            At least 8 characters
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-[var(--color-dark-900)] text-[var(--color-light-100)] h-12 px-4 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black"
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        <p id="auth-footnote" className="mt-3 text-center text-xs text-[var(--color-dark-700)]">
          By {isSignup ? "signing up" : "signing in"}, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
