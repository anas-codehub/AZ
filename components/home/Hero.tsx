// components/home/hero.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma"; // 👈 নতুন ইমপোর্ট

export async function Hero() {
  // ডেটাবেস থেকে হিরো ইমেজ আনা (না থাকলে ডিফল্ট Unsplash ইমেজ)
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  const heroImage =
    settings?.heroImage ||
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-ink-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105 animate-fade-in"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 container-luxe text-center text-white space-y-6 animate-slide-up">
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-brand-300 font-medium">
          The New Season
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl max-w-4xl mx-auto leading-tight text-balance">
          Elevate Your <br className="hidden md:block" /> Everyday Style
        </h1>
        <div className="pt-8">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-white text-ink-950 hover:bg-brand-600 hover:text-white transition-colors duration-300 group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
