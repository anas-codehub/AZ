// app/admin/stock/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertTriangle, Package, CheckCircle2 } from "lucide-react";

export default async function AdminStockPage() {
  // যেসব প্রোডাক্টের স্টক ১০ বা তার কম
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: { lte: 10 }, // 👈 ১০ বা তার নিচে
      isActive: true,
    },
    orderBy: { stock: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Stock Alerts</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          {lowStockProducts.length} Items Need Attention
        </div>
      </div>

      <div className="bg-white border border-ink-200">
        <div className="p-4 border-b border-ink-200 flex items-center gap-2 bg-red-50 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-medium">Low Stock Products (10 or less)</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 border-b border-ink-200">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {lowStockProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center text-ink-500 flex flex-col items-center gap-2"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  All products are well-stocked! 🎉
                </td>
              </tr>
            ) : (
              lowStockProducts.map((product) => {
                // স্টক ০ হলে সম্পূর্ণ লাল, ১-১০ হলে কমলা/হলুদ
                const isOutOfStock = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-ink-50/50">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Package className="w-4 h-4 text-ink-400" />{" "}
                      {product.name}
                    </td>
                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                          OUT OF STOCK
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                          {product.stock} LEFT (Low)
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-brand-600 hover:underline font-medium"
                      >
                        Restock Now
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
