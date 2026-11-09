// components/layout/footer.tsx
"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 pt-20 pb-10 mt-auto">
      <div className="container-luxe">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter */}
          <div className="space-y-6 lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-3xl text-white tracking-tight"
            >
              LUXE
            </Link>
            <p className="text-sm leading-relaxed text-ink-400 max-w-xs">
              Curated premium fashion for the modern individual. Elevate your
              everyday style with our exclusive collections.
            </p>
            <div className="pt-4">
              <p className="text-sm text-white mb-3 tracking-widest uppercase">
                Join the club
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent border-ink-800 text-white placeholder:text-ink-600 rounded-none focus-visible:ring-brand-500"
                />
                <Button variant="brand" className="rounded-none shrink-0">
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-sm tracking-widest uppercase mb-6 font-medium">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=men"
                  className="hover:text-white transition-colors"
                >
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=women"
                  className="hover:text-white transition-colors"
                >
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="hover:text-white transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sale=true"
                  className="text-brand-500 hover:text-brand-400 transition-colors"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white text-sm tracking-widest uppercase mb-6 font-medium">
              Help
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          {/* Social */}
          <div>
            <h4 className="text-white text-sm tracking-widest uppercase mb-6 font-medium">
              Follow Us
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ink-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          {/* <p>© {new Date().getFullYear()} LUXE Fashion. All rights reserved.</p> */}
          <p>© 2026 LUXE Fashion. All rights reserved.</p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
