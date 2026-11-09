// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Orders</h1>
      <div className="bg-white border border-ink-200 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-ink-50 border-b border-ink-200">
            <tr>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-ink-50/50">
                <td className="p-4 font-mono text-xs">
                  {order.id.split("-")[0].toUpperCase()}
                </td>
                <td className="p-4">{order.shippingName}</td>
                <td className="p-4">{formatPrice(order.totalAmount)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs bg-brand-100 text-brand-700 rounded">
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-ink-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}
