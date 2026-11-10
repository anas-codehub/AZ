// components/layout/navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useSession, signOut } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlist-store";

interface NavbarProps {
  categories: any[]; // 👈 প্রপ হিসেবে ক্যাটাগরি রিসিভ করবে
}

export function Navbar({ categories = [] }: NavbarProps) {
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-ink-900 text-white text-center py-2 text-xs letter-spaced uppercase">
        Free shipping on orders over ৳5,000
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-ink-200/50",
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-3 shadow-sm"
            : "bg-white py-5",
        )}
      >
        <div className="container-luxe flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            <Link
              href="/products?sort=newest"
              className="text-sm uppercase tracking-widest font-medium transition-colors hover:text-brand-600 text-ink-800"
            >
              New Arrivals
            </Link>

            {/* 👇 ডাইনামিক মেগা-মেনু */}
            {categories.map((cat) => (
              <div key={cat.id} className="relative group">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center gap-1 text-sm uppercase tracking-widest font-medium transition-colors hover:text-brand-600 text-ink-800 py-2"
                >
                  {cat.name}
                  {cat.children.length > 0 && (
                    <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {cat.children.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white border border-ink-100 shadow-xl p-4 min-w-[200px] flex flex-col gap-2">
                      {cat.children.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/products?category=${sub.slug}`}
                          className="text-sm text-ink-600 hover:text-brand-600 transition-colors py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/products?sale=true"
              className="text-sm uppercase tracking-widest font-medium transition-colors text-brand-600"
            >
              Sale
            </Link>
          </nav>

          {/* Logo (Center) */}
          <Link
            href="/"
            className="font-serif text-3xl tracking-tight absolute left-1/2 -translate-x-1/2"
          >
            ANSUZITA
          </Link>

          {/* Right Icons (এখানে আগের কোডটাই থাকবে) */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <Search className="w-5 h-5" />
            </Button>

            {session ? (
              <div className="flex items-center gap-2 lg:gap-4">
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" className="hidden md:block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs uppercase tracking-widest border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
                    </Button>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="text-sm font-medium hidden sm:block uppercase tracking-widest"
                >
                  {session.user?.name?.split(" ")[0]}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs uppercase tracking-widest"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:inline-flex"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (এখানেও সাব-ক্যাটাগরি যোগ করা হলো) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col animate-fade-in overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-ink-100">
            <span className="font-serif text-2xl">LUXE</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col p-6 gap-6">
            <Link
              href="/products?sort=newest"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl uppercase tracking-widest font-medium text-ink-900"
            >
              New Arrivals
            </Link>

            {/* Mobile Dynamic Categories */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="space-y-3 border-b border-ink-100 pb-3"
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl uppercase tracking-widest font-medium text-ink-900 block"
                >
                  {cat.name}
                </Link>
                {cat.children.length > 0 && (
                  <div className="flex flex-col gap-2 pl-4">
                    {cat.children.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/products?category=${sub.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm text-ink-500 uppercase tracking-wider"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/products?sale=true"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl uppercase tracking-widest font-medium text-brand-600"
            >
              Sale
            </Link>

            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl uppercase tracking-widest font-medium text-brand-600 border-t border-ink-100 pt-6 mt-2"
              >
                Admin Dashboard
              </Link>
            )}
            {session && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="text-left text-xl uppercase tracking-widest font-medium text-red-500 mt-4"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
