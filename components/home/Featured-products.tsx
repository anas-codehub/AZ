// components/home/featured-products.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

export async function FeaturedProducts() {
  // ডেটাবেস থেকে নতুন ৪টি প্রোডাক্ট আনা (যেগুলো featured হিসেবে চিহ্নিত বা নতুন)
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4, // সর্বোচ্চ ৪টি
  });

  if (products.length === 0) return null; // যদি কোনো প্রোডাক্ট না থাকে, সেকশন দেখাব না

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
