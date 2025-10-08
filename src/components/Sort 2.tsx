"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseQuery, setParam, stringifyQuery, resetPagination, SortKey } from "@/lib/utils/query";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "price_asc", label: "Price: Low → High" },
];

export default function Sort() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parsed = useMemo(() => parseQuery(sp.toString()), [sp]);
  const current = (parsed.sort as SortKey) || "featured";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = setParam(parsed, "sort", e.target.value as SortKey);
    const url = `${pathname}${stringifyQuery(resetPagination(next))}`;
    router.push(url, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-dark-700">
        Sort By
      </label>
      <select
        id="sort"
        value={current}
        onChange={onChange}
        className="border border-light-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-900"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
