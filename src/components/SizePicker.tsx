import React from "react";
"use client";

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
            className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-900 ${
              active ? "border-dark-900" : "border-light-300"
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
