// app/products/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic"; // প্রতিবার নতুন ডেটা লোড হবে

export default async function ProductsPage() {
  // ডেটাবেস থেকে সব প্রোডাক্ট নিয়ে আসা
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-luxe py-16 md:py-24">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl">All Products</h1>
        <p className="text-ink-500 text-sm tracking-widest uppercase max-w-lg">
          Discover our full collection of premium fashion
        </p>
      </div>

      {/* Filter/Sort Bar (Placeholder for now) */}
      <div className="flex items-center justify-between border-y border-ink-200 py-4 mb-12">
        <p className="text-sm text-ink-500">{products.length} Products</p>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="uppercase tracking-widest text-xs"
          >
            Filter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="uppercase tracking-widest text-xs"
          >
            Sort By
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-ink-500">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
