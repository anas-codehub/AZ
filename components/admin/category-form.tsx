// components/admin/category-form.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function CategoryForm({
  parentCategories,
}: {
  parentCategories: any[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId }),
      });
      if (!res.ok) throw new Error("Failed to create");

      toast.success("Category created!");
      setName("");
      setParentId("");
      router.refresh();
    } catch (error) {
      toast.error("Error creating category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 border border-ink-200"
    >
      <h2 className="font-medium">Add New Category</h2>
      <Input
        placeholder="Category Name (e.g. Men, Hoodie)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
        className="w-full border border-ink-200 p-2 text-sm rounded-none"
      >
        <option value="">Make it a Main Category (e.g. Men, Women)</option>
        {parentCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            Sub-category of {cat.name}
          </option>
        ))}
      </select>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-ink-900 text-white"
      >
        {isLoading ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}
