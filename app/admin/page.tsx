// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
} from "lucide-react"; // 👈 AlertTriangle যোগ করুন
import Link from "next/link";

export default async function AdminDashboard() {
  const [orders, productsCount, usersCount, recentOrders, lowStockCount] =
    await Promise.all([
      prisma.order.findMany(),
      prisma.product.count(),
      // গেস্ট ইউজার বাদ দিয়ে কাস্টমার সংখ্যা গণনা
      prisma.user.count({
        where: {
          role: "USER",
          email: { not: { startsWith: "guest_" } },
        },
      }),
      // সাম্প্রতিক ৫টি অর্ডার
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      // 👇 স্টক ১০ বা তার নিচে থাকা প্রোডাক্টের সংখ্যা
      prisma.product.count({
        where: { stock: { lte: 10 }, isActive: true },
      }),
    ]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalOrders = orders.length;

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-brand-100 text-brand-700",
    },
    {
      title: "Total Products",
      value: productsCount,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Customers",
      value: usersCount,
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl">Dashboard Overview</h1>

      {/* 👇 লো স্টক অ্যালার্ট */}
      {lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <p>
            <strong>Warning:</strong> You have {lowStockCount} product(s) with
            low stock (10 or less).{" "}
            <Link
              href="/admin/stock"
              className="underline ml-1 font-bold hover:text-red-900"
            >
              View Stock Alerts
            </Link>
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 border border-ink-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-ink-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-ink-200">
        <div className="p-6 border-b border-ink-200 flex justify-between items-center">
          <h2 className="font-medium">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand-600 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-ink-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/50">
                    <td className="p-4 font-mono text-xs">
                      {order.id.split("-")[0].toUpperCase()}
                    </td>
                    <td className="p-4">{order.shippingName}</td>
                    <td className="p-4">{formatPrice(order.totalAmount)}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs bg-ink-100 text-ink-700 rounded">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-ink-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
