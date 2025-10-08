import React from "react";
import Card from "@/components/Card";
import { getAllProducts } from "@/lib/actions/product";

const Home = async () => {
  const { products } = await getAllProducts({ limit: 6, sort: "newest" });

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-8">
      <section aria-labelledby="latest" className="pb-12">
        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Latest shoes
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card
              key={p.id}
              title={p.name}
              description={p.description ?? undefined}
              imageSrc={p.imageUrl || "/placeholder-image.jpg"}
              price={p.minPrice === p.maxPrice ? p.minPrice : `$${p.minPrice} - $${p.maxPrice}`}
              brand={p.brand ?? undefined}
              href={`/products/${p.id}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
