import { getSortComparator, parseQuery, SortKey } from "@/lib/utils/query";
import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  tags: { gender: string; color: string; size: string };
  imageUrl: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Nike Air Max 90",
    description: "Cushioned everyday comfort with classic style.",
    price: 98.3,
    createdAt: new Date("2025-09-01"),
    tags: { gender: "men", color: "black", size: "10" },
    imageUrl: "/shoes/shoe-1.jpg",
  },
  {
    id: "2",
    name: "Nike Air Force 1",
    description: "Iconic hoops style, modern comfort.",
    price: 98.3,
    createdAt: new Date("2025-08-22"),
    tags: { gender: "women", color: "white", size: "8" },
    imageUrl: "/shoes/shoe-2.webp",
  },
  {
    id: "3",
    name: "Nike Dunk Low Retro",
    description: "Vintage hoops, street-ready look.",
    price: 120,
    createdAt: new Date("2025-07-10"),
    tags: { gender: "men", color: "green", size: "11" },
    imageUrl: "/shoes/shoe-3.webp",
  },
  {
    id: "4",
    name: "Nike Legend Essential 3",
    description: "Versatile training shoe with stable base.",
    price: 75,
    createdAt: new Date("2025-06-15"),
    tags: { gender: "women", color: "blue", size: "9" },
    imageUrl: "/shoes/shoe-4.webp",
  },
  {
    id: "5",
    name: "Nike Blazer Low ’77 Jumbo",
    description: "Classic court style with bold Swoosh.",
    price: 95,
    createdAt: new Date("2025-05-30"),
    tags: { gender: "women", color: "white", size: "7" },
    imageUrl: "/shoes/shoe-5.avif",
  },
  {
    id: "6",
    name: "Nike Court Vision Low Next Nature",
    description: "Hoops-inspired design made with recycled content.",
    price: 80,
    createdAt: new Date("2025-03-18"),
    tags: { gender: "men", color: "black", size: "9" },
    imageUrl: "/shoes/shoe-6.avif",
  },
];

function applyFilters(products: Product[], query: Record<string, unknown>) {
  const genders = toArray(query.gender);
  const sizes = toArray(query.size);
  const colors = toArray(query.color);
  const prices = toArray(query.price); // values like "0-50"

  return products.filter((p) => {
    if (genders.length && !genders.includes(p.tags.gender)) return false;
    if (sizes.length && !sizes.includes(p.tags.size)) return false;
    if (colors.length && !colors.includes(p.tags.color)) return false;

    if (prices.length) {
      const inAnyPrice = prices.some((pr: string) => {
        const [min, max] = pr.split("-").map((n) => Number(n));
        return p.price >= (isNaN(min) ? 0 : min) && p.price <= (isNaN(max) ? Infinity : max);
      });
      if (!inAnyPrice) return false;
    }
    return true;
  });
}

function toArray(v: unknown): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v.map(String) : String(v).split(",").filter(Boolean);
}

export default async function ProductsPage(props: { searchParams: SearchParams }) {
  const raw = await props.searchParams;
  const parsed = parseQuery(new URLSearchParams(raw as Record<string, string>).toString());

  const sort = (parsed.sort as SortKey) || "featured";
  const filtered = applyFilters(MOCK_PRODUCTS, parsed);
  const comparator = getSortComparator(sort as SortKey);
  const result = [...filtered].sort(comparator);

  const activeBadges: { key: string; value: string }[] = [];
  ["gender", "size", "color", "price"].forEach((k) => {
    toArray(parsed[k]).forEach((v) => activeBadges.push({ key: k, value: v }));
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

          {result.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-body-medium text-dark-700">
                No products match your filters. Try clearing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result.map((p) => (
                <Card
                  key={p.id}
                  title={p.name}
                  description={p.description}
                  imageSrc={p.imageUrl}
                  price={p.price}
                  badge={undefined}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
