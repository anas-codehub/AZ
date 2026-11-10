// app/account/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, User as UserIcon } from "lucide-react";

// স্ট্যাটাস অনুযায়ী রঙ নির্ধারণের হেল্পার ফাংশন
function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "PROCESSING":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-purple-100 text-purple-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-ink-100 text-ink-700";
  }
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // ইউজারের অর্ডারগুলো ডেটাবেস থেকে নিয়ে আসা
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-luxe py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-4">
          <div className="flex items-center gap-4 border-b border-ink-200 pb-6">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-medium">{session.user.name}</h2>
              <p className="text-sm text-ink-500">{session.user.email}</p>
            </div>
          </div>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/account"
              className="text-sm font-medium text-brand-600 bg-brand-50 p-3"
            >
              My Orders
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-ink-600 hover:bg-ink-50 p-3"
            >
              Profile Settings
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-ink-600 hover:bg-ink-50 p-3"
            >
              Addresses
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <h1 className="font-serif text-3xl mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-brand-600" /> Order History
          </h1>

          {orders.length === 0 ? (
            <div className="bg-ink-50 p-12 text-center space-y-4">
              <p className="text-ink-500">You haven't placed any orders yet.</p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-ink-200 p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between border-b border-ink-100 pb-4 gap-2">
                    <div>
                      <p className="text-sm text-ink-500">Order ID</p>
                      <p className="font-mono font-medium">
                        {order.id.split("-")[0].toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-500">Date</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-500">Total</p>
                      <p className="font-medium">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-500">Status</p>
                      {/* 👇 স্ট্যাটাস কালার আপডেট করা হয়েছে */}
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.product.name} (x{item.quantity})
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
