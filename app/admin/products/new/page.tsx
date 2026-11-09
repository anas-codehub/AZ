// app/admin/products/new/page.tsx

import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-3xl">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
