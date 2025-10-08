"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  parseQuery,
  stringifyQuery,
  toggleListParam,
  resetPagination,
} from "@/lib/utils/query";

type Group = {
  key: string;
  label: string;
  options: { value: string; label: string; swatch?: string }[];
};

const GROUPS: Group[] = [
  {
    key: "gender",
    label: "Gender",
    options: [
      { value: "men", label: "Men" },
      { value: "women", label: "Women" },
      { value: "kids", label: "Kids" },
    ],
  },
  {
    key: "size",
    label: "Size",
    options: [
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
      { value: "11", label: "11" },
      { value: "12", label: "12" },
    ],
  },
  {
    key: "color",
    label: "Color",
    options: [
      { value: "red", label: "Red", swatch: "#EF4444" },
      { value: "black", label: "Black", swatch: "#111827" },
      { value: "white", label: "White", swatch: "#F3F4F6" },
      { value: "blue", label: "Blue", swatch: "#1D4ED8" },
      { value: "green", label: "Green", swatch: "#10B981" },
      { value: "grey", label: "Grey", swatch: "#6B7280" },
    ],
  },
  {
    key: "price",
    label: "Price Range",
    options: [
      { value: "0-50", label: "$0 - $50" },
      { value: "50-100", label: "$50 - $100" },
      { value: "100-150", label: "$100 - $150" },
      { value: "150-9999", label: "Over $150" },
    ],
  },
];

export default function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parsed = useMemo(() => parseQuery(searchParams.toString()), [searchParams]);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.key, true]))
  );

  useEffect(() => {
    setOpen(false);
  }, [searchParams.toString()]);

  const isChecked = useCallback(
    (key: string, value: string) => {
      const arr = (parsed[key] ?? []) as string[] | string;
      const list = Array.isArray(arr) ? arr : [arr].filter(Boolean);
      return list.includes(value);
    },
    [parsed]
  );

  const updateUrl = useCallback(
    (nextParams: import("@/lib/utils/query").QueryObject) => {
      const url = `${pathname}${stringifyQuery(nextParams)}`;
      router.push(url, { scroll: false });
    },
    [pathname, router]
  );

  const onToggle = (key: string, value: string) => {
    const toggled = toggleListParam(parsed, key, value);
    updateUrl(resetPagination(toggled));
  };

  const clearAll = () => {
    updateUrl({});
  };

  return (
    <>
      <div className="md:hidden mb-4">
        <button
          aria-expanded={open}
          aria-controls="filters-drawer"
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-md bg-dark-900 text-light-100"
        >
          Show Filters
        </button>
      </div>

      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 font-medium">Filters</h2>
            <button
              onClick={clearAll}
              className="text-sm text-dark-700 hover:underline focus:outline-none focus:ring-2 focus:ring-dark-900 rounded"
            >
              Clear all
            </button>
          </div>
          {GROUPS.map((g) => (
            <div key={g.key} className="border-b border-light-300 pb-4">
              <button
                onClick={() =>
                  setExpanded((e) => ({ ...e, [g.key]: !e[g.key] }))
                }
                className="w-full flex items-center justify-between py-2 focus:outline-none focus:ring-2 focus:ring-dark-900 rounded"
                aria-expanded={expanded[g.key]}
                aria-controls={`section-${g.key}`}
              >
                <span className="text-body-medium">{g.label}</span>
                <span className="text-dark-700">{expanded[g.key] ? "−" : "+"}</span>
              </button>
              {expanded[g.key] && (
                <ul id={`section-${g.key}`} className="mt-2 space-y-2">
                  {g.options.map((opt) => {
                    const id = `${g.key}-${opt.value}`;
                    const checked = isChecked(g.key, opt.value);
                    return (
                      <li key={opt.value} className="flex items-center gap-2">
                        <input
                          id={id}
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(g.key, opt.value)}
                          className="h-4 w-4 rounded border-light-400 text-dark-900 focus:ring-dark-900"
                        />
                        <label htmlFor={id} className="cursor-pointer text-sm text-dark-900 flex items-center gap-2">
                          {opt.swatch && (
                            <span
                              aria-hidden
                              className="inline-block h-3 w-3 rounded-full border border-light-300"
                              style={{ backgroundColor: opt.swatch }}
                            />
                          )}
                          {opt.label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            id="filters-drawer"
            className="absolute left-0 top-0 bottom-0 w-4/5 max-w-xs bg-light-100 p-4 overflow-y-auto focus:outline-none"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-3">Filters</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-900 rounded px-2 py-1"
              >
                Close
              </button>
            </div>
            <button
              onClick={clearAll}
              className="text-sm text-dark-700 hover:underline mb-4 focus:outline-none focus:ring-2 focus:ring-dark-900 rounded"
            >
              Clear all
            </button>

            {GROUPS.map((g) => (
              <div key={g.key} className="border-b border-light-300 pb-4">
                <button
                  onClick={() =>
                    setExpanded((e) => ({ ...e, [g.key]: !e[g.key] }))
                  }
                  className="w-full flex items-center justify-between py-2 focus:outline-none focus:ring-2 focus:ring-dark-900 rounded"
                  aria-expanded={expanded[g.key]}
                  aria-controls={`drawer-section-${g.key}`}
                >
                  <span className="text-body-medium">{g.label}</span>
                  <span className="text-dark-700">
                    {expanded[g.key] ? "−" : "+"}
                  </span>
                </button>
                {expanded[g.key] && (
                  <ul id={`drawer-section-${g.key}`} className="mt-2 space-y-2">
                    {g.options.map((opt) => {
                      const id = `m-${g.key}-${opt.value}`;
                      const checked = isChecked(g.key, opt.value);
                      return (
                        <li key={opt.value} className="flex items-center gap-2">
                          <input
                            id={id}
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggle(g.key, opt.value)}
                            className="h-4 w-4 rounded border-light-400 text-dark-900 focus:ring-dark-900"
                          />
                          <label htmlFor={id} className="cursor-pointer text-sm text-dark-900 flex items-center gap-2">
                            {opt.swatch && (
                              <span
                                aria-hidden
                                className="inline-block h-3 w-3 rounded-full border border-light-300"
                                style={{ backgroundColor: opt.swatch }}
                              />
                            )}
                            {opt.label}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
