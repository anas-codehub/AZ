// components/product/filter-sidebar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Men", slug: "men" },
  { name: "Women", slug: "women" },
  { name: "Accessories", slug: "accessories" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");
  const currentSizes = searchParams.get("size")?.split(",") || [];
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const updateFilters = (
    key: string,
    value: string,
    isMulti: boolean = false,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isMulti) {
      let values = params.get(key)?.split(",") || [];
      if (values.includes(value)) {
        values = values.filter((v) => v !== value);
      } else {
        values.push(value);
      }
      if (values.length > 0) params.set(key, values.join(","));
      else params.delete(key);
    } else {
      if (params.get(key) === value) params.delete(key);
      else params.set(key, value);
    }

    router.push(`/products?${params.toString()}`);
  };

  const handlePriceFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get("min") as string;
    const max = formData.get("max") as string;

    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");

    router.push(`/products?${params.toString()}`);
  };

  const clearAll = () => router.push("/products");

  return (
    <div className="space-y-8">
      {/* Clear Filters */}
      {(currentCategory ||
        currentSizes.length > 0 ||
        currentMinPrice ||
        currentMaxPrice) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-xs text-red-500 underline"
        >
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-widest mb-4">
          Category
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => updateFilters("category", cat.slug)}
                className={`text-sm ${currentCategory === cat.slug ? "text-brand-600 font-semibold" : "text-ink-600 hover:text-ink-900"}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-widest mb-4">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilters("size", size, true)}
              className={`h-9 w-9 text-xs border transition-colors ${
                currentSizes.includes(size)
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 hover:border-ink-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-widest mb-4">
          Price Range
        </h3>
        <form onSubmit={handlePriceFilter} className="flex items-center gap-2">
          <input
            type="number"
            name="min"
            placeholder="Min"
            defaultValue={currentMinPrice}
            className="w-full border border-ink-200 p-2 text-sm rounded-none"
          />
          <span className="text-ink-400">-</span>
          <input
            type="number"
            name="max"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            className="w-full border border-ink-200 p-2 text-sm rounded-none"
          />
          <Button type="submit" size="sm" variant="outline">
            Go
          </Button>
        </form>
      </div>
    </div>
  );
}
