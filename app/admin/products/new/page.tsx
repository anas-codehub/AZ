// app/admin/products/new/page.tsx
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  // ডেটাবেস থেকে শুধু সাব-ক্যাটাগরি নিয়ে আসা (parentId null না)
  const categories = await prisma.category.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-3xl">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
