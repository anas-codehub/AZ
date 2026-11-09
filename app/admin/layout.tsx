// app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // সুরক্ষা: লগইন না থাকলে বা অ্যাডমিন না হলে রিডাইরেক্ট
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside className="w-64 bg-ink-950 text-ink-300 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-ink-800">
          <Link href="/" className="font-serif text-2xl text-white">
            LUXE Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <Package className="w-5 h-5" /> Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5" /> Orders
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5" /> Customers
          </Link>
        </nav>
        <div className="p-4 border-t border-ink-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
