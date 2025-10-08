import React from "react";
"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="py-5 first:pt-0">
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <h3 className="text-[16px] font-medium text-dark-900">{title}</h3>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}
