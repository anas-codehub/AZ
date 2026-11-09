// app/product/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, reviews: true },
  });

  if (!product) notFound();

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
            <Button variant="outline" className="flex-1 rounded-none">
              <Heart className="w-5 h-5 mr-2" /> Add to Wishlist
            </Button>
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
    </div>
  );
}
