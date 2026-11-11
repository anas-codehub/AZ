// components/product/image-gallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ডিফল্ট ইমেজ যদি খালি থাকে
  const safeImages =
    images.length > 0 ? images : ["https://placehold.co/600x800?text=No+Image"];
  const activeImage = safeImages[activeIndex];

  const nextImage = () =>
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  const prevImage = () =>
    setActiveIndex(
      (prev) => (prev - 1 + safeImages.length) % safeImages.length,
    );

  // সোয়াইপ করার জন্য ড্র্যাগ হ্যান্ডলার
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeThreshold = 50;
    if (offset.x < -swipeThreshold) {
      nextImage();
    } else if (offset.x > swipeThreshold) {
      prevImage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Area */}
      <div className="relative aspect-[3/4] bg-ink-100 overflow-hidden group">
        {/* মোবাইলে Swipe, ডেস্কটপে Normal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Image
              src={activeImage}
              alt={productName}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover pointer-events-none"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (মোবাইলে দেখা যাবে) */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full md:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full md:hidden"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails (ডেস্কটপে) */}
      {safeImages.length > 1 && (
        <div className="hidden md:grid grid-cols-4 gap-4">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square bg-ink-100 overflow-hidden border-2 transition-all ${
                activeIndex === i
                  ? "border-ink-900"
                  : "border-transparent hover:border-ink-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 25vw, 12vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Pagination Dots */}
      {safeImages.length > 1 && (
        <div className="flex justify-center gap-2 md:hidden">
          {safeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === i ? "bg-ink-900 w-4" : "bg-ink-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
