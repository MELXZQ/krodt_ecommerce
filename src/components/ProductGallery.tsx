"use client";
import React from "react";

import Image from "next/image";
import { ImageOff, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ProductImage = { src: string; alt: string };
type Variant = { id: string; name: string; color: string; images: ProductImage[]; swatch: string };

interface Props {
  variants: Variant[];
}

const isValidSrc = (src: string | undefined | null) => Boolean(src && typeof src === "string");

export default function ProductGallery({ variants }: Props) {
  const validVariants = useMemo(
    () =>
      variants
        .map((v) => ({ ...v, images: (v.images || []).filter((img) => isValidSrc(img.src)) }))
        .filter((v) => v.images.length > 0),
    [variants]
  );

  const [variantIdx, setVariantIdx] = useState(0);
  const images = validVariants[variantIdx]?.images ?? [];
  const [imgIdx, setImgIdx] = useState(0);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setImgIdx(0);
  }, [variantIdx]);

  const next = () => setImgIdx((i) => (i + 1) % Math.max(images.length, 1));
  const prev = () => setImgIdx((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  if (validVariants.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-light-300 bg-light-200">
        <ImageOff className="h-10 w-10 text-light-400" aria-hidden="true" />
      </div>
    );
  }

  const main = images[imgIdx];

  return (
    <div className="grid grid-cols-[72px_1fr] gap-4 lg:gap-6">
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            className={`relative aspect-square overflow-hidden rounded-lg border ${
              i === imgIdx ? "border-dark-900" : "border-light-300"
            } focus:outline-none focus:ring-2 focus:ring-dark-900`}
            onClick={() => setImgIdx(i)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      <div
        className="relative rounded-xl border border-light-300 bg-light-200"
        tabIndex={0}
        onKeyDown={handleKey}
        aria-live="polite"
      >
        {main ? (
          <Image
            src={main.src}
            alt={main.alt}
            className="rounded-xl object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            priority
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center">
            <ImageOff className="h-10 w-10 text-light-400" aria-hidden="true" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            {validVariants.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setVariantIdx(i)}
                aria-label={`Select color ${v.name}`}
                className={`relative h-8 w-8 overflow-hidden rounded-full border ${
                  i === variantIdx ? "border-dark-900" : "border-light-300"
                } focus:outline-none focus:ring-2 focus:ring-dark-900`}
              >
                <Image src={v.swatch} alt={v.name} fill sizes="32px" className="object-cover" />
                {i === variantIdx && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white drop-shadow" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
