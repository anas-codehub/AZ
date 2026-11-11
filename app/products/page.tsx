// app/products/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { SearchBar } from "@/components/product/search-bar";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { MobileFilterDrawer } from "@/components/product/mobile-filter-drawer"; // 👈 নতুন ইমপোর্ট
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q as string | undefined;
  const category = params.category as string | undefined;
  const sizes = (params.size as string)?.split(",") || [];
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  // ডেটাবেস কুয়েরি তৈরি
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = {
      OR: [
        { slug: category }, // যদি সরাসরি Hoodie সিলেক্ট করে
        { parent: { slug: category } }, // যদি Men সিলেক্ট করে, তবে Men এর সব সাব-ক্যাটাগরি
      ],
    };
  }

  if (sizes.length > 0) {
    where.sizes = { hasSome: sizes };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-luxe py-16 md:py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-ink-200 pb-8">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">All Products</h1>
          <p className="text-ink-500 text-sm tracking-widest uppercase mt-2">
            {products.length} Products Found
          </p>
        </div>
        <SearchBar />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar />
        </aside>

        {/* 👇 Mobile Filter Drawer */}
        <MobileFilterDrawer />

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24 text-ink-500">
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
