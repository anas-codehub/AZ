// components/home/brand-story.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function BrandStory() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-luxe">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative h-[600px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop"
              alt="Our Story"
              fill
              className="object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-600 hidden lg:block" />
          </div>

          {/* Text */}
          <div className="space-y-8 lg:pl-8">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Crafted with <br /> Intention & Elegance
            </h2>
            <p className="text-ink-500 leading-relaxed">
              We believe that true luxury lies in the details. Every piece in
              our collection is meticulously designed and crafted using the
              finest materials, ensuring that you not only look good but feel
              extraordinary.
            </p>
            <p className="text-ink-500 leading-relaxed">
              Our commitment to sustainability and timeless design means your
              LUXE pieces will remain wardrobe staples for years to come.
            </p>
            <div className="pt-4">
              <Button variant="outline">Read Our Story</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
