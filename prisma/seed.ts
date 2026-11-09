// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
async function main() {
  // ১. ক্যাটাগরি তৈরি
  const men = await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59" },
  });

  const women = await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b" },
  });

  // ২. প্রোডাক্ট তৈরি
  await prisma.product.upsert({
    where: { slug: "silk-minimal-dress" },
    update: {},
    create: {
      name: "Silk Minimal Dress",
      slug: "silk-minimal-dress",
      description: "A premium silk dress for elegant evenings.",
      price: 4500,
      comparePrice: 5500,
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8"],
      sizes: ["S", "M", "L"],
      colors: ["Black", "Ivory"],
      stock: 20,
      isFeatured: true,
      categoryId: women.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "classic-leather-jacket" },
    update: {},
    create: {
      name: "Classic Leather Jacket",
      slug: "classic-leather-jacket",
      description: "Genuine leather jacket with a timeless fit.",
      price: 8900,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
      sizes: ["M", "L", "XL"],
      colors: ["Black", "Brown"],
      stock: 15,
      isFeatured: true,
      categoryId: men.id,
    },
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });