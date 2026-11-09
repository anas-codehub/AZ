// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Users, Package, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const [orders, productsCount, usersCount] = await Promise.all([
    prisma.order.findMany(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "USER" } }),
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

      {/* Recent Orders Placeholder */}
      <div className="bg-white border border-ink-200">
        <div className="p-6 border-b border-ink-200">
          <h2 className="font-medium">Recent Orders</h2>
        </div>
        <div className="p-6 text-sm text-ink-500">
          {orders.length === 0
            ? "No orders yet."
            : `You have ${orders.length} recent orders.`}
          <br />
          <a
            href="/admin/orders"
            className="text-brand-600 underline mt-2 inline-block"
          >
            View all orders
          </a>
        </div>
      </div>
    </div>
  );
}
