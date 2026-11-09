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
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-3xl">Edit Product</h1>
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
