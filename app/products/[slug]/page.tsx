// app/product/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Heart, Truck, RotateCcw, ShieldCheck, Star, User } from "lucide-react";
import { ReviewForm } from "@/components/product/review-form";
import { WishlistButton } from "@/components/product/wishlist-button";
import { RelatedProducts } from "@/components/product/related-products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  // গড় রেটিং বের করা
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-ink-100 overflow-hidden">
            <Image
              src={
                product.images[0] ||
                "https://placehold.co/600x800?text=No+Image"
              }
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-ink-100">
                  <Image
                    src={img}
                    alt={`${product.name} ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-brand-600 mb-2">
            {product.category.name}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-ink-400 line-through text-lg mb-1">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="text-ink-500 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Add to Cart Client Component */}
          <AddToCartButton product={product} />

          {/* Wishlist (Optional) */}
          <div className="flex gap-4 my-6">
            <WishlistButton product={product} />
          </div>

          {/* Trust Badges */}
          <div className="border-t border-ink-200 pt-6 space-y-4 text-sm text-ink-600">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-600" />
              <span>Free shipping on orders over ৳5,000</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-brand-600" />
              <span>7 days easy return & exchange</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>100% authentic guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 👇 রিভিউ সেকশন 👇 */}
      <div className="mt-20 border-t border-ink-200 pt-16">
        <h2 className="font-serif text-3xl mb-8">Customer Reviews</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Review List */}
          <div className="lg:col-span-2 space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-ink-500">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b border-ink-100 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ink-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-ink-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {review.user.name || "Verified Customer"}
                        </p>
                        <div className="flex text-brand-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "fill-brand-500" : "text-ink-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-ink-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-ink-600 text-sm mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Right: Review Form */}
          <div>
            <div className="mb-6 bg-ink-50 p-4 text-center">
              <p className="text-3xl font-serif font-bold text-brand-600">
                {avgRating.toFixed(1)}
              </p>
              <div className="flex justify-center text-brand-500 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-brand-500" : "text-ink-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-ink-500">
                Based on {product.reviews.length} reviews
              </p>
            </div>
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>

      {/* 👇 নতুন রিলেটেড প্রোডাক্ট সেকশন 👇 */}
      <RelatedProducts
        categoryId={product.categoryId}
        currentProductId={product.id}
      />
    </div>
  );
}
