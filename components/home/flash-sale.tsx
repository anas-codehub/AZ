// components/home/flash-sale.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { CountdownTimer } from "./countdown-timer";
import { Button } from "@/components/ui/button";

export async function FlashSale() {
  // ডেটাবেস থেকে সেসব প্রোডাক্ট আনা যাদের comparePrice (আগের দাম) আছে
  const saleProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      comparePrice: { not: null },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  if (saleProducts.length === 0) return null;

  // ডেমো সেলের শেষ সময়: আগামী ৩ দিন পর
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  return (
    <section className="bg-ink-950 py-20">
      <div className="container-luxe">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
          <div>
            <h2 className="font-serif text-4xl text-white mb-2">Flash Sale</h2>
            <p className="text-ink-400 text-sm tracking-widest uppercase">
              Up to 50% off. Limited time only.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-white/70 text-sm uppercase tracking-widest hidden md:block">
              Ends In:
            </p>
            <CountdownTimer targetDate={targetDate.toISOString()} />
          </div>
        </div>

        {/* Sale Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {saleProducts.map((product) => (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className="group relative block bg-ink-900 overflow-hidden"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={
                    product.images[0] ||
                    "https://placehold.co/600x800?text=No+Image"
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
                  Sale
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="font-serif text-xl text-white mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-brand-400 font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-white/50 line-through text-sm">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
