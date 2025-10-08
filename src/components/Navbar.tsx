"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=kids" },
  { label: "Collections", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-[var(--color-light-300)] bg-[var(--color-light-100)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="#" aria-label="Home" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8 invert"
          />
        </Link>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-light-300)] text-[var(--color-dark-900)] md:hidden"
        >
          <span className="sr-only">Open Menu</span>
          <svg
            className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <ul className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-[var(--color-dark-900)] hover:text-[var(--color-dark-700)] text-base"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button className="text-[var(--color-dark-900)] hover:text-[var(--color-dark-700)]">
            Search
          </button>
          <button className="text-[var(--color-dark-900)] hover:text-[var(--color-dark-700)]">
            My Cart (2)
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden">
          <ul className="space-y-2 border-t border-[var(--color-light-300)] px-4 py-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-md px-2 py-2 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex items-center gap-4 px-2">
              <button className="text-[var(--color-dark-900)] hover:text-[var(--color-dark-700)]">
                Search
              </button>
              <button className="text-[var(--color-dark-900)] hover:text-[var(--color-dark-700)]">
                My Cart (2)
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
