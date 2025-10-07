import React from "react";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    heading: "Featured",
    links: ["Air Force 1", "Huarache", "Air Max 90", "Air Max 95"],
  },
  {
    heading: "Shoes",
    links: ["All Shoes", "Custom Shoes", "Jordan Shoes", "Running Shoes"],
  },
  {
    heading: "Clothing",
    links: ["All Clothing", "Modest Wear", "Hoodies & Pullovers", "Shirts & Tops"],
  },
  {
    heading: "Kids'",
    links: [
      "Infant & Toddler Shoes",
      "Kids' Shoes",
      "Kids' Jordan Shoes",
      "Kids' Basketball Shoes",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-dark-900)] text-[var(--color-light-100)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-12 md:px-6 md:py-16">
        <div className="md:col-span-2">
          <Image
            src="/logo-inverse.svg"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </div>

        <div className="md:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="mb-4 text-sm font-medium text-[var(--color-light-300)]">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-[var(--color-light-500)] hover:text-[var(--color-light-200)] text-sm"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="md:col-span-2 flex items-start justify-start gap-3 md:justify-end">
          {[
            { src: "/icons/x.svg", label: "X" },
            { src: "/icons/facebook.svg", label: "Facebook" },
            { src: "/icons/instagram.svg", label: "Instagram" },
          ].map((i) => (
            <Link
              key={i.label}
              href="#"
              aria-label={i.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-light-400)] text-[var(--color-light-100)]"
            >
              <Image src={i.src} alt={i.label} width={16} height={16} />
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-[var(--color-light-500)] text-xs">
            © {new Date().getFullYear()} Nike, Inc. All Rights Reserved
          </p>
          <nav aria-label="Footer links">
            <ul className="flex items-center gap-6 text-xs text-[var(--color-light-500)]">
              <li>
                <Link href="#" className="hover:text-[var(--color-light-200)]">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-light-200)]">
                  Terms of Sale
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-light-200)]">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-light-200)]">
                  Nike Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
