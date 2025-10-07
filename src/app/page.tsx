import React from 'react'
import Card from "../components/Card";


const Home = () => {
    return (
        <main className="mx-auto max-w-7xl px-4 md:px-6 py-8">
            <h1 className="text-heading-1 font-jost mb-6">Nike</h1>

            {/* Product Grid Demo */} 
            {/* Replace imageSrc with real product images in /public when available */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    { title: "Nike Air Force 1 Mid '07", imageSrc: "/vercel.svg", price: "$98.30", brand: "Men's Shoes", badge: { label: "Best Seller", color: "red" as const } },
                    { title: "Nike Court Vision Low Next Nature", imageSrc: "/vercel.svg", price: "$98.30", brand: "Men's Shoes", badge: { label: "Extra 20% off", color: "green" as const } },
                    { title: "Nike Dunk Low Retro", imageSrc: "/vercel.svg", price: "$98.30", brand: "Men's Shoes", badge: { label: "Extra 10% off", color: "green" as const } },
                ].map((p) => (
                    <Card
                        key={p.title}
                        title={p.title}
                        imageSrc={p.imageSrc}
                        price={p.price}
                        brand={p.brand}
                        badge={p.badge}
                    />
                ))}
            </section>
        </main>
    )
}
export default Home
