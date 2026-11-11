// components/product/product-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice, discountPercent } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// 👇 টাইপটি স্পষ্টভাবে ডিফাইন করা হলো
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.comparePrice
    ? discountPercent(product.price, product.comparePrice)
    : 0;

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-100">
          <Image
            src={
              product.images[0] || "https://placehold.co/600x800?text=No+Image"
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Sale Badge */}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
              -{discount}%
            </span>
          )}

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <Button className="w-full bg-white/90 text-ink-950 hover:bg-ink-950 hover:text-white backdrop-blur-sm rounded-none">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-4 space-y-1 text-center">
          <h3 className="font-medium text-ink-900 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span
              className={
                discount > 0 ? "text-brand-600 font-semibold" : "text-ink-900"
              }
            >
              {formatPrice(product.price)}
            </span>
            {discount > 0 && product.comparePrice && (
              <span className="text-ink-400 line-through text-xs">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* 👇 টাইপ ঠিক করার জন্য color: string স্পষ্ট করা হলো */}
          <div className="flex justify-center gap-1 mt-2">
            {product.colors.map((color: string) => (
              <span
                key={color}
                className="w-2 h-2 rounded-full border border-ink-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
