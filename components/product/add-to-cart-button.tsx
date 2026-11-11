// components/product/add-to-cart-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-hot-toast";

interface AddToCartButtonProps {
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

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // ৫০ মিলিসেকেন্ডের ভাইব্রেশন
    }
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "https://placehold.co/600x800?text=No+Image",
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      slug: product.slug,
    });

    toast.success("Added to cart!");
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium uppercase tracking-widest mb-3">
            Color
          </h3>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-colors ${
                  selectedColor === color ? "border-ink-900" : "border-ink-200"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium uppercase tracking-widest mb-3">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-10 w-12 border text-sm transition-colors ${
                  selectedSize === size
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-200 hover:border-ink-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Button */}
      <Button
        size="lg"
        onClick={handleAddToCart}
        className="w-full bg-ink-900 text-white hover:bg-brand-600"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
}
