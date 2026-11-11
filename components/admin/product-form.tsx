// components/admin/product-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import { Sparkles } from "lucide-react";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
  categories: { id: string; name: string; parent: { name: string } | null }[];
}

export function ProductForm({
  initialData,
  isEdit = false,
  categories = [],
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    comparePrice: initialData?.comparePrice || "",
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    images: initialData?.images?.join(", ") || "",
    sizes: initialData?.sizes?.join(", ") || "",
    colors: initialData?.colors?.join(", ") || "",
  });

  const handleGenerateDescription = async () => {
    if (!form.name) {
      toast.error("Please enter a product name first");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.categoryId,
          keywords: form.colors
            ? `Colors: ${form.colors}. Sizes: ${form.sizes}`
            : "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm((prev) => ({ ...prev, description: data.description }));
      toast.success("Description generated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock: parseInt(form.stock.toString()),
      images: form.images
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      sizes: form.sizes
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(isEdit ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 border border-ink-200"
    >
      <Input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        placeholder="Slug (e.g. silk-dress)"
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        required
      />

      {/* 👇 ডেসক্রিপশন ফিল্ড ও AI বাটন */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-ink-700">
            Description
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={isGenerating}
            className="text-xs border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white transition-colors"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
        <textarea
          placeholder="Write or generate product description..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="w-full border border-ink-200 p-3 text-sm min-h-[120px] rounded-none focus:outline-none focus:border-ink-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Price (BDT)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Compare Price (optional)"
          value={form.comparePrice}
          onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
          min="0"
        />

        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
          className="w-full border border-ink-200 p-2 text-sm rounded-none"
        >
          <option value="">Select Sub-Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.parent?.name} → {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        placeholder="Images (comma separated URLs)"
        value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
      />

      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary"
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          const imageUrl = result.info.secure_url;
          setForm((prev) => ({
            ...prev,
            images: prev.images ? `${prev.images}, ${imageUrl}` : imageUrl,
          }));
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()}>
            Upload Product Image
          </Button>
        )}
      </CldUploadWidget>

      <Input
        placeholder="Sizes (comma separated: S, M, L)"
        value={form.sizes}
        onChange={(e) => setForm({ ...form, sizes: e.target.value })}
      />
      <Input
        placeholder="Colors (comma separated: Black, White)"
        value={form.colors}
        onChange={(e) => setForm({ ...form, colors: e.target.value })}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-ink-900 text-white hover:bg-brand-600"
      >
        {isLoading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
