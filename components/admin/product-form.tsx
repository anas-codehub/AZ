// components/admin/product-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
  categories: { id: string; name: string; parent: { name: string } | null }[]; // 👈 ক্যাটাগরি ডাটা
}

export function ProductForm({
  initialData,
  isEdit = false,
  categories = [],
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    comparePrice: initialData?.comparePrice || "",
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || categories[0]?.id || "", // ডিফল্ট প্রথম সাব-ক্যাটাগরি
    images: initialData?.images?.join(", ") || "",
    sizes: initialData?.sizes?.join(", ") || "",
    colors: initialData?.colors?.join(", ") || "",
  });

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
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        className="w-full border border-ink-200 p-2 text-sm min-h-[100px]"
      />

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
          required // 👈 বাধ্যতামূলক
          min="0" // 👈 ০ এর নিচে যেতে পারবে না
        />

        {/* 👇 ক্যাটাগরি সিলেক্ট ড্রপডাউন */}
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

      {/* Cloudinary Upload Widget */}
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
        className="w-full bg-ink-900 text-white"
      >
        {isLoading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
