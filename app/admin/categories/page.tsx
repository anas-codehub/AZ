// app/admin/categories/page.tsx
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";

export default async function AdminCategoriesPage() {
  // শুধু মেইন ক্যাটাগরি এবং তাদের সাব-ক্যাটাগরি নিয়ে আসা
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-3xl">Manage Categories</h1>

      <CategoryForm parentCategories={categories} />

      <div className="bg-white border border-ink-200 p-6 mt-8">
        <h2 className="text-lg font-medium mb-4">Category List</h2>
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat.id}>
              <strong className="text-ink-900">{cat.name}</strong>
              {cat.children.length > 0 && (
                <ul className="ml-6 mt-2 space-y-1 text-sm text-ink-600 list-disc">
                  {cat.children.map((sub) => (
                    <li key={sub.id}>{sub.name}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
