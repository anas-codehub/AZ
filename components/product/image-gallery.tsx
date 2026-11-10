// components/product/image-gallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  // ডিফল্টভাবে প্রথম ইমেজটি সিলেক্ট থাকবে
  const [activeImage, setActiveImage] = useState(
    images[0] || "https://placehold.co/600x800?text=No+Image",
  );

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-[3/4] bg-ink-100 overflow-hidden">
        <Image
          src={activeImage}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw" // 👈 মোবাইলে ফুল স্ক্রিন, ডেস্কটপে অর্ধেক
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square bg-ink-100 overflow-hidden border-2 transition-all ${
                activeImage === img
                  ? "border-ink-900"
                  : "border-transparent hover:border-ink-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 25vw, 12vw" // 👈 থাম্বনেইলের জন্য ছোট সাইজ
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
