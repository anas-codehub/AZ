// app/admin/products/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // প্রোডাক্ট এবং ক্যাটাগরি একসাথে আনা
  const product = await prisma.product.findUnique({ where: { id } });

  // শুধু সাব-ক্যাটাগরি লিস্ট আনা
  const categories = await prisma.category.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
  });

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-3xl">Edit Product</h1>
      <ProductForm
        initialData={product}
        isEdit={true}
        categories={categories}
      />
    </div>
  );
}
