import React from "react";
import Image from "next/image";

export type CardBadge =
  | { label: string; color?: "red" | "green" | "orange" }
  | null;

export interface CardProps {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  brand?: string;
  href?: string;
  badge?: CardBadge;
  className?: string;
}

const cx = (...cls: Array<string | false | null | undefined>) =>
  cls.filter(Boolean).join(" ");

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt = "",
  price,
  brand,
  href = "#",
  badge = null,
  className,
}: CardProps) {
  const badgeBg =
    badge?.color === "red"
      ? "bg-[var(--color-red)]/10 text-[var(--color-red)]"
      : badge?.color === "green"
      ? "bg-[var(--color-green)]/10 text-[var(--color-green)]"
      : "bg-[var(--color-orange)]/10 text-[var(--color-orange)]";

  return (
    <article
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] shadow-sm",
        className
      )}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-medium ${badgeBg}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-[var(--color-dark-900)] text-base font-medium">
          {title}
        </h3>
        {description && (
          <p className="line-clamp-2 text-[var(--color-dark-700)] text-sm">
            {description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[var(--color-dark-900)] text-lg font-semibold">
            {typeof price === "number" ? `$${price}` : price}
          </span>
          {brand && (
            <span className="text-[var(--color-dark-500)] text-sm">{brand}</span>
          )}
        </div>
        <a
          href={href}
          className="mt-3 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          aria-label={`View ${title}`}
        >
          View
        </a>
      </div>
    </article>
  );
}
