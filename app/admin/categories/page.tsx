// app/admin/categories/page.tsx
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { Pencil, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default async function AdminCategoriesPage() {
  // শুধু মেইন ক্যাটাগরি এবং তাদের সাব-ক্যাটাগরি নিয়ে আসা
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="font-serif text-3xl">Manage Categories</h1>

      <CategoryForm parentCategories={categories} />

      <div className="bg-white border border-ink-200 p-6 mt-8">
        <h2 className="text-lg font-medium mb-4">Category List</h2>

        {categories.length === 0 ? (
          <p className="text-ink-500 text-sm">
            No categories found. Create one above.
          </p>
        ) : (
          <ul className="space-y-6">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="border-b border-ink-100 pb-4 last:border-0"
              >
                {/* Main Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <div className="relative w-10 h-10 bg-ink-100 rounded">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-ink-100 rounded flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-ink-400" />
                      </div>
                    )}
                    <strong className="text-ink-900 text-lg">{cat.name}</strong>
                  </div>
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    className="flex items-center gap-1 text-sm text-brand-600 hover:underline"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Link>
                </div>

                {/* Sub Categories */}
                {cat.children.length > 0 && (
                  <ul className="ml-14 mt-3 space-y-2 text-sm text-ink-600">
                    {cat.children.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex items-center gap-2">
                          {sub.image ? (
                            <div className="relative w-6 h-6 bg-ink-100 rounded">
                              <Image
                                src={sub.image}
                                alt={sub.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-ink-300" />
                          )}
                          <span>{sub.name}</span>
                        </div>
                        <Link
                          href={`/admin/categories/${sub.id}/edit`}
                          className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
