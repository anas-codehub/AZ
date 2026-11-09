// components/layout/navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { name: "New Arrivals", href: "/products?sort=newest" },
  { name: "Men", href: "/products?category=men" },
  { name: "Women", href: "/products?category=women" },
  { name: "Accessories", href: "/products?category=accessories" },
  { name: "Sale", href: "/products?sale=true", highlight: true },
];

export function Navbar() {
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest font-medium transition-colors hover:text-brand-600",
                  link.highlight ? "text-brand-600" : "text-ink-800",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logo (Center) */}
          <Link
            href="/"
            className="font-serif text-3xl tracking-tight absolute left-1/2 -translate-x-1/2"
          >
            LUXE
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1 justify-end">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User / Account Section */}
            {session ? (
              <div className="flex items-center gap-2 lg:gap-4">
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

            {/* Cart Icon */}
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col animate-fade-in">
          <div className="flex items-center justify-between p-6 border-b border-ink-100">
            <span className="font-serif text-2xl">LUXE</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col p-6 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-xl uppercase tracking-widest font-medium",
                  link.highlight ? "text-brand-600" : "text-ink-900",
                )}
              >
                {link.name}
              </Link>
            ))}
            {/* মোবাইলে লগআউট দেখানোর জন্য */}
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
