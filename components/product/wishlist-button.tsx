// components/product/wishlist-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "react-hot-toast";

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
  className?: string;
  variant?: "icon" | "full";
}

export function WishlistButton({
  product,
  className = "",
  variant = "full",
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleToggle = () => {
    if (isWishlisted) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image:
          product.images[0] || "https://placehold.co/600x800?text=No+Image",
        slug: product.slug,
      });
      toast.success("Added to wishlist!");
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full bg-white/90 hover:bg-white transition-colors ${className}`}
      >
        <Heart
          className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-ink-900"}`}
        />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className={`flex-1 rounded-none ${className}`}
    >
      <Heart
        className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
      />
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
