"use client";

import React from "react";
import Image from "next/image";

type Props = {
  onGoogle?: () => void;
  onApple?: () => void;
  labelPrefix?: "Continue" | "Sign in";
};

export default function SocialProviders({ onGoogle, onApple, labelPrefix = "Continue" }: Props) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogle}
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-4 py-3 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)] focus:outline-none focus:ring-2 focus:ring-black"
        aria-label={`${labelPrefix} with Google`}
      >
        <Image src="/icons/google.svg" alt="" width={18} height={18} aria-hidden="true" />
        <span className="text-sm font-medium">{labelPrefix} with Google</span>
      </button>

      <button
        type="button"
        onClick={onApple}
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-4 py-3 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)] focus:outline-none focus:ring-2 focus:ring-black"
        aria-label={`${labelPrefix} with Apple`}
      >
        <Image src="/icons/apple.svg" alt="" width={18} height={18} aria-hidden="true" />
        <span className="text-sm font-medium">{labelPrefix} with Apple</span>
      </button>
    </div>
  );
}
