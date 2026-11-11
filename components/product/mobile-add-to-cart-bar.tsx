// components/product/mobile-add-to-cart-bar.tsx
"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

interface MobileAddToCartBarProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sizes: string[];
    colors: string[];
    slug: string;
  };
}

export function MobileAddToCartBar({ product }: MobileAddToCartBarProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // মোবাইলে ভাইব্রেশন (যদি ব্রাউজার সাপোর্ট করে)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "https://placehold.co/600x800?text=No+Image",
      size: product.sizes[0] || "", // ডিফল্ট প্রথম সাইজ
      color: product.colors[0] || "", // ডিফল্ট প্রথম কালার
      quantity: 1,
      slug: product.slug,
    });

    toast.success("Added to cart!");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-ink-200 p-4 flex items-center justify-between z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div>
        <p className="text-sm font-medium text-ink-900 line-clamp-1">
          {product.name}
        </p>
        <p className="text-brand-600 font-semibold">
          {formatPrice(product.price)}
        </p>
      </div>
      <Button
        onClick={handleAddToCart}
        className="bg-ink-900 text-white hover:bg-brand-600 px-6 rounded-none"
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
}
