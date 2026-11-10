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
  Tags,
  Settings, // 👈 নতুন ইমপোর্ট
  AlertCircle, // 👈 নতুন ইমপোর্ট
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
    <div className="flex flex-col md:flex-row min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-ink-950 text-ink-300 flex flex-col">
        <div className="p-6 border-b border-ink-800">
          <Link href="/" className="font-serif text-2xl text-white">
            LUXE Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-x-visible">
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
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <Tags className="w-5 h-5" /> Categories
          </Link>

          {/* 👇 নতুন Stock Alerts লিংক */}
          <Link
            href="/admin/stock"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <AlertCircle className="w-5 h-5" /> Stock Alerts
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

          {/* 👇 নতুন Settings লিংক */}
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-900 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" /> Settings
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
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
