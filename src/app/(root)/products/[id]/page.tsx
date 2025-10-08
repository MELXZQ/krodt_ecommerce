import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import Card from "@/components/Card";

type ProductImage = { src: string; alt: string };
type Variant = { id: string; name: string; color: string; images: ProductImage[]; swatch: string };
type Product = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  description: string;
  features: string[];
  variants: Variant[];
};

const MOCK_PRODUCTS: Record<string, Product> = {
  "1": {
    id: "1",
    title: "Nike Air Max 90 SE",
    subtitle: "Women's Shoes",
    price: 140,
    compareAt: 170,
    description:
      "The Air Max 90 stays true to its running roots with the iconic Waffle sole. Stitched overlays and textured accents create the '90s look you love. Complete with romantic hues, its visible Air cushioning adds comfort to your journey.",
    features: [
      "Padded collar",
      "Foam midsole",
      "Shown: Dark Team Red/Platinum Tint/Pure Platinum/White",
      "Style: HM9451-600",
    ],
    variants: [
      {
        id: "v1",
        name: "Dark Team Red",
        color: "#6d1a1a",
        swatch: "/swatches/red.png",
        images: [
          { src: "/shoes/detail/airmax90-1.jpg", alt: "Air Max 90 SE angle 1" },
          { src: "/shoes/detail/airmax90-2.jpg", alt: "Air Max 90 SE angle 2" },
          { src: "/shoes/detail/airmax90-3.jpg", alt: "Air Max 90 SE angle 3" },
          { src: "/shoes/detail/airmax90-4.jpg", alt: "Air Max 90 SE angle 4" },
          { src: "/shoes/detail/airmax90-5.jpg", alt: "Air Max 90 SE angle 5" },
        ],
      },
      {
        id: "v2",
        name: "Pure Platinum",
        color: "#cfd3d6",
        swatch: "/swatches/gray.png",
        images: [
          { src: "/shoes/detail/airmax90-gray-1.jpg", alt: "Air Max 90 SE gray 1" },
          { src: "/shoes/detail/airmax90-gray-2.jpg", alt: "Air Max 90 SE gray 2" },
        ],
      },
      {
        id: "v3",
        name: "White",
        color: "#ffffff",
        swatch: "/swatches/white.png",
        images: [
          { src: "/shoes/detail/airmax90-white-1.jpg", alt: "Air Max 90 SE white 1" },
        ],
      },
    ],
  },
};

const RECOMMENDED = [
  {
    id: 2,
    title: "Nike Air Force 1 Mid '07",
    description: "Men's Shoes",
    imageSrc: "/shoes/shoe-1.jpg",
    price: 98.3,
    brand: "6 Colour",
    badge: { label: "Best Seller", color: "orange" as const },
  },
  {
    id: 3,
    title: "Nike Court Vision Low Next Nature",
    description: "Men's Shoes",
    imageSrc: "/shoes/shoe-2.webp",
    price: 98.3,
    brand: "4 Colour",
    badge: { label: "Extra 20% off", color: "green" as const },
  },
  {
    id: 4,
    title: "Nike Dunk Low Retro",
    description: "Men's Shoes",
    imageSrc: "/shoes/shoe-3.webp",
    price: 98.3,
    brand: "6 Colour",
    badge: { label: "Extra 10% off", color: "green" as const },
  },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS[params.id] ?? Object.values(MOCK_PRODUCTS)[0];

  const hasAnyImages = product.variants.some((v) => v.images && v.images.length > 0);

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-dark-700)]">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-[var(--color-dark-900)]">{product.title}</span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-[520px_minmax(0,1fr)] gap-8 lg:gap-12">
        <div>
          {hasAnyImages ? (
            <ProductGallery variants={product.variants} />
          ) : (
            <div className="aspect-square w-full rounded-xl border border-light-300 bg-light-200" />
          )}
        </div>

        <div className="flex flex-col">
          <header className="mb-4">
            <h1 className="text-heading-3 text-dark-900">{product.title}</h1>
            <p className="text-[var(--color-dark-700)] text-sm">{product.subtitle}</p>
          </header>

          <div className="mb-5 flex items-end gap-3">
            <p className="text-2xl font-semibold text-dark-900">${product.price}</p>
            {product.compareAt && (
              <>
                <p className="text-lg line-through text-[var(--color-light-400)]">${product.compareAt}</p>
                <span className="rounded-full bg-[var(--color-green)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-green)]">
                  {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}% off
                </span>
              </>
            )}
          </div>

          <div className="mb-6">
            {/* Variant swatches and gallery are handled within ProductGallery */}
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Select Size</span>
              <button className="text-sm underline">Size Guide</button>
            </div>
            <SizePicker sizes={["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]} />
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-dark-900)] px-6 py-3 text-white hover:opacity-90"
              aria-label="Add to Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Bag
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-light-300 bg-white px-6 py-3 text-dark-900 hover:bg-light-200"
              aria-label="Favorite"
            >
              <Heart className="h-5 w-5" />
              Favorite
            </button>
          </div>

          <div className="mt-8 divide-y divide-light-300">
            <CollapsibleSection title="Product Details" defaultOpen>
              <p className="text-[15px] text-dark-700 mb-4">{product.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-dark-700">
                {product.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Shipping & Returns">
              <p className="text-sm text-dark-700">
                Free standard shipping and 30-day returns for Nike Members.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Reviews (10)">
              <div className="flex items-center gap-1 text-dark-900">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-2 text-sm text-dark-700">No reviews yet.</p>
            </CollapsibleSection>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-heading-3">You Might Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RECOMMENDED.map((p) => (
            <Card
              key={p.id}
              title={p.title}
              description={p.description}
              imageSrc={p.imageSrc}
              price={p.price}
              brand={p.brand}
              badge={p.badge}
              href={`/products/${p.id}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
