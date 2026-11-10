// app/admin/customers/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { User, Mail, Phone, ShoppingBag } from "lucide-react";

export default async function AdminCustomersPage() {
  // সব ইউজার এবং তাদের অর্ডারগুলো নিয়ে আসা
  const customers = await prisma.user.findMany({
    where: { role: "USER" }, // শুধু কাস্টমাররা
    include: {
      orders: {
        select: { totalAmount: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Customers</h1>

      <div className="bg-white border border-ink-200 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-ink-50 border-b border-ink-200">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Orders</th>
              <th className="p-4 font-medium">Total Spent</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {customers.map((customer) => {
              // মোট খরচ হিসাব (শুধু Delivered বা Paid অর্ডার ধরা যেতে পারে)
              const totalSpent = customer.orders.reduce(
                (sum, order) => sum + order.totalAmount,
                0,
              );

              return (
                <tr key={customer.id} className="hover:bg-ink-50/50">
                  <td className="p-4 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-ink-400" />
                    {customer.name || "N/A"}
                  </td>
                  <td className="p-4 text-ink-500">{customer.email}</td>
                  <td className="p-4">{customer.orders.length}</td>
                  <td className="p-4 font-medium">{formatPrice(totalSpent)}</td>
                  <td className="p-4 text-ink-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="p-8 text-center text-ink-500">No customers yet.</p>
        )}
      </div>
    </div>
  );
}
