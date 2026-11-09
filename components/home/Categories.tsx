// components/home/categories.tsx
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Women",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Men",
    slug: "men",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
  },
];

export function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="container-luxe">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl mb-3">Shop by Category</h2>
            <p className="text-ink-500 text-sm tracking-widest uppercase">
              Find your perfect look
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative h-[400px] md:h-[500px] overflow-hidden block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute bottom-8 left-8 text-white z-10">
                <h3 className="font-serif text-3xl mb-2">{cat.name}</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
