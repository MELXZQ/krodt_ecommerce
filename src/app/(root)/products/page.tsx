import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProductsPage(props: { searchParams: SearchParams }) {
  const raw = await props.searchParams;
  const entries: [string, string][] = Object.entries(raw).flatMap(([k, v]) =>
    Array.isArray(v) ? v.map((vv) => [k, String(vv)]) : v ? [[k, String(v)]] : []
  ) as [string, string][];
  const urlParams = new URLSearchParams(entries);
  const filters = parseFilterParams(urlParams);
  const { products } = await getAllProducts(filters);

  const activeBadges: { key: string; value: string }[] = [];
  (["gender", "size", "color", "brand", "category"] as const).forEach((k) => {
    const vals = (filters as Record<string, unknown>)[k] as string[] | undefined;
    vals?.forEach((v) => activeBadges.push({ key: k, value: v }));
  });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-3">New</h1>
        <div className="flex items-center gap-4">
          <Link href="/products?gender=men" className="text-sm underline">Men</Link>
          <Link href="/products?gender=women" className="text-sm underline">Women</Link>
          <Sort />
        </div>
      </div>

      <div className="flex gap-6">
        <Filters />

        <main className="flex-1">
          {activeBadges.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeBadges.map((b, idx) => (
                <span
                  key={`${b.key}-${b.value}-${idx}`}
                  className="px-2 py-1 text-xs rounded-full bg-light-200 text-dark-900 border border-light-300"
                >
                  {b.key}: {b.value}
                </span>
              ))}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-body-medium text-dark-700">
                No products match your filters. Try clearing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <Card
                  key={p.id}
                  title={p.name}
                  description={p.description ?? undefined}
                  imageSrc={p.imageUrl || '/placeholder-image.jpg'}
                  price={p.minPrice === p.maxPrice ? p.minPrice : `$${p.minPrice} - $${p.maxPrice}`}
                  brand={p.brand ?? undefined}
                  href={`/products/${p.id}`}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
