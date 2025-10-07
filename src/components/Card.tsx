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
      ? "text-[var(--color-red)]"
      : badge?.color === "green"
      ? "text-[var(--color-green)]"
      : "text-[var(--color-orange)]";

  return (
    <article
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-light-300)] bg-transparent shadow-sm",
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
            className={`absolute left-3 top-3 rounded-full bg-white px-3 py-[6px] text-[12px] font-medium shadow-sm ${badgeBg}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 bg-[var(--color-dark-900)] px-4 py-3 text-[var(--color-light-100)]">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-[15px] font-medium">{title}</h3>
          <span className="text-[13px] text-[var(--color-light-400)]">
            {typeof price === "number" ? `$${price}` : price}
          </span>
        </div>
        {brand && (
          <p className="text-[13px] text-[var(--color-light-400)]">{brand}</p>
        )}
        {description && (
          <p className="line-clamp-2 text-[12px] text-[var(--color-light-500)]">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
