// app/page.tsx
import { Hero } from "@/components/home/Hero";

import { FeaturedProducts } from "@/components/home/Featured-products";
import { BrandStory } from "@/components/home/Brand-story";
import { Categories } from "@/components/home/Categories";
import { FlashSale } from "@/components/home/flash-sale";

export default function Home() {
  return (
    <>
      <Hero />
      <FlashSale />
      <Categories />
      <FeaturedProducts />
      <BrandStory />
    </>
  );
}
