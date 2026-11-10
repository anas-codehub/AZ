// components/product/related-products.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export async function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  // একই ক্যাটাগরির অন্য প্রোডাক্ট খোঁজা (বর্তমান প্রোডাক্ট বাদে)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      id: { not: currentProductId }, // বর্তমান প্রোডাক্ট বাদ
      isActive: true,
    },
    take: 4, // সর্বোচ্চ ৪টি প্রোডাক্ট দেখাব
    orderBy: { createdAt: "desc" },
  });

  // যদি কোনো রিলেটেড প্রোডাক্ট না থাকে, তবে সেকশনটি দেখাব না
  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-24 border-t border-ink-200 pt-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl mb-2">You May Also Like</h2>
        <p className="text-ink-500 text-sm tracking-widest uppercase">
          Complete your look
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
