"use client";
import React from "react";
import { useState } from "react";

interface Props {
  sizes: string[];
}

export default function SizePicker({ sizes }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {sizes.map((s) => {
        const active = selected === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => setSelected(s)}
            className={`h-11 w-14 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-dark-900 ${
              active
                ? "bg-[var(--color-dark-900)] text-white border-[var(--color-dark-900)]"
                : "bg-white text-dark-900 border-light-300 hover:border-dark-900"
            }`}
            aria-pressed={active}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
