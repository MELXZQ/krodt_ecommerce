import Link from "next/link";
import { Suspense } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import Card from "@/components/Card";
import { getProduct, getProductReviews, getRecommendedProducts } from "@/lib/actions/product";

function NotFoundBlock() {
  return (
    <main className="mx-auto max-w-4xl px-4 md:px-6 py-16 text-center">
      <h1 className="text-heading-3 text-dark-900 mb-2">Product not found</h1>
      <p className="text-dark-700 mb-6">The product you’re looking for doesn’t exist or has been removed.</p>
      <Link href="/products" className="inline-block rounded-full border border-light-300 px-5 py-2 hover:bg-light-200">
        Back to Products
      </Link>
    </main>
  );
}

function priceDisplay(min?: number, max?: number) {
  if (min === undefined || max === undefined) return null;
  if (min === max) return `$${min.toFixed(2)}`;
  return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
}

function ReviewsSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-3">
      <div className="h-6 w-40 bg-light-300 rounded" />
      <div className="h-4 w-full bg-light-200 rounded" />
      <div className="h-4 w-5/6 bg-light-200 rounded" />
      <div className="h-4 w-4/6 bg-light-200 rounded" />
    </div>
  );
}

function AlsoLikeSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-light-300 p-4">
          <div className="aspect-square w-full rounded bg-light-200" />
          <div className="mt-3 h-4 w-3/4 bg-light-200 rounded" />
          <div className="mt-2 h-4 w-1/2 bg-light-200 rounded" />
        </div>
      ))}
    </div>
  );
}

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews = await getProductReviews(productId);
  if (!reviews.length) {
    return (
      <CollapsibleSection title="Reviews">
        <p className="mt-2 text-sm text-dark-700">No reviews yet.</p>
      </CollapsibleSection>
    );
  }

  const items = reviews.slice(0, 10);
  const avg =
    items.reduce((acc, r) => acc + (typeof r.rating === "number" ? r.rating : 0), 0) / items.length;

  return (
    <CollapsibleSection title={`Reviews (${items.length})`}>
      <div className="flex items-center gap-2 text-dark-900">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(avg) ? "fill-current" : ""}`}
            aria-hidden="true"
          />
        ))}
        <span className="text-sm text-dark-700">{avg.toFixed(1)} out of 5</span>
      </div>
      <ul className="mt-4 space-y-4">
        {items.map((r) => (
          <li key={r.id} className="rounded-lg border border-light-300 p-3">
            <div className="flex items-center justify-between">
              <strong className="text-sm">{r.author}</strong>
              <div className="flex items-center gap-1" aria-label={`Rating ${r.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : ""}`} />
                ))}
              </div>
            </div>
            {r.title && <p className="mt-1 font-medium">{r.title}</p>}
            <CollapsibleSection title="Read more">
              <p className="text-sm text-dark-700 whitespace-pre-line">{r.content}</p>
            </CollapsibleSection>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}

async function AlsoLikeSection({ productId }: { productId: string }) {
  const recs = await getRecommendedProducts(productId);
  if (!recs.length) return null;
  return (
    <section className="mt-14">
      <h2 className="mb-4 text-heading-3">You Might Also Like</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map((p) => (
          <Card
            key={p.id}
            title={p.title}
            description=""
            imageSrc={p.imageUrl}
            price={p.price}
            href={`/products/${p.id}`}
          />
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return <NotFoundBlock />;

  const subtitleParts = [product.gender?.label, product.category?.name, product.brand?.name].filter(Boolean);
  const minPrice = Math.min(
    ...product.variants.map((v) => (v.salePrice ?? v.price)),
    ...(product.variants.length ? [] : [0]),
  );
  const maxPrice = Math.max(
    ...product.variants.map((v) => (v.salePrice ?? v.price)),
    ...(product.variants.length ? [] : [0]),
  );

  const galleryVariants =
    product.variants.map((v) => ({
      id: v.id,
      name: v.color?.name ?? v.sku,
      color: v.color?.hexCode ?? "#ffffff",
      swatch: "",
      images: (v.images && v.images.length ? v.images : product.images).map((src, i) => ({
        src,
        alt: `${product.name} - ${v.color?.name ?? "image"} ${i + 1}`,
      })),
    })) ?? [];

  const hasAnyImages =
    galleryVariants.some((v) => v.images && v.images.length > 0) || product.images.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-dark-700)]">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-[var(--color-dark-900)]">{product.name}</span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-[520px_minmax(0,1fr)] gap-8 lg:gap-12">
        <div>
          {hasAnyImages ? (
            <ProductGallery variants={galleryVariants} />
          ) : (
            <div className="aspect-square w-full rounded-xl border border-light-300 bg-light-200" />
          )}
        </div>

        <div className="flex flex-col">
          <header className="mb-4">
            <h1 className="text-heading-3 text-dark-900">{product.name}</h1>
            <p className="text-[var(--color-dark-700)] text-sm">{subtitleParts.join(" • ")}</p>
          </header>

          <div className="mb-5 flex items-end gap-3">
            <p className="text-2xl font-semibold text-dark-900">
              {priceDisplay(
                isFinite(minPrice) ? minPrice : undefined,
                isFinite(maxPrice) ? maxPrice : undefined
              )}
            </p>
          </div>

          <div className="mb-6">
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
            </CollapsibleSection>

            <Suspense fallback={<ReviewsSkeleton />}>
              {/* @ts-expect-error Async Server Component */}
              <ReviewsSection productId={product.id} />
            </Suspense>
          </div>
        </div>
      </section>

      <Suspense fallback={<AlsoLikeSkeleton />}>
        {/* @ts-expect-error Async Server Component */}
        <AlsoLikeSection productId={product.id} />
      </Suspense>
    </main>
  );
}
