// app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link href="/admin/products/new">
          <Button className="bg-ink-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-ink-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 border-b border-ink-200">
            <tr>
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-ink-50/50">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">{formatPrice(product.price)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-ink-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
