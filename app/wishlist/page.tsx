// app/wishlist/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="container-luxe py-32 text-center space-y-6">
        <Heart className="w-16 h-16 mx-auto text-ink-200" />
        <h1 className="font-serif text-4xl">Your Wishlist is Empty</h1>
        <p className="text-ink-500">
          Save your favourite items to view them later.
        </p>
        <Link href="/products">
          <Button size="lg">Discover Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-20">
      <h1 className="font-serif text-4xl mb-10">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <Link href={`/product/${item.slug}`}>
              <div className="relative aspect-[3/4] bg-ink-100 overflow-hidden mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
            <div className="space-y-1">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium hover:text-brand-600"
              >
                {item.name}
              </Link>
              <p className="font-semibold">{formatPrice(item.price)}</p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
