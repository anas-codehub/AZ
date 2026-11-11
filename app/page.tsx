// app/page.tsx

import { BrandStory } from "@/components/home/Brand-story";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/Featured-products";
import { FlashSale } from "@/components/home/flash-sale";
import { Hero } from "@/components/home/Hero";
import { ScrollReveal } from "@/components/providers/scroll-reveal"; // 👈 নতুন

export default function Home() {
  return (
    <>
      <Hero />
      <FlashSale />
      <ScrollReveal>
        <Categories />
      </ScrollReveal>
      <ScrollReveal>
        <FeaturedProducts />
      </ScrollReveal>
      <ScrollReveal>
        <BrandStory />
      </ScrollReveal>
    </>
  );
}
