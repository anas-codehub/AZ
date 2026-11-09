// components/home/featured-products.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const mockProducts = [
  {
    id: 1,
    name: "Silk Minimal Dress",
    price: 4500,
    comparePrice: 5500,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Classic Leather Jacket",
    price: 8900,
    comparePrice: 0,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Linen Oversized Shirt",
    price: 3200,
    comparePrice: 4000,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Tailored Wool Trousers",
    price: 5200,
    comparePrice: 0,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-ink-50">
      <div className="container-luxe">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-4xl mb-4">New Arrivals</h2>
          <p className="text-ink-500 text-sm tracking-widest uppercase mb-8">
            Curated for the season
          </p>
          <Link href="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.comparePrice > 0 && (
                  <span className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                    Sale
                  </span>
                )}
                {/* Quick Add Button (Hover Effect) */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button className="w-full bg-white/90 text-ink-950 hover:bg-ink-950 hover:text-white backdrop-blur-sm rounded-none">
                    Quick View
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-medium text-ink-900">{product.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span
                    className={
                      product.comparePrice > 0
                        ? "text-brand-600 font-semibold"
                        : "text-ink-900"
                    }
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice > 0 && (
                    <span className="text-ink-400 line-through text-xs">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
