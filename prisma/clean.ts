// prisma/clean.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");

  // ১. রিলেশন ডেটা মুছে ফেলা (আগে চাইল্ড টেবিল, পরে প্যারেন্ট টেবিল)
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  
  // ❌ await prisma.stockAlert.deleteMany(); 👈 এই লাইনটি মুছে ফেলুন

  // ২. অর্ডার মুছে ফেলা
  await prisma.order.deleteMany();

  // ৩. প্রোডাক্ট ও ক্যাটাগরি মুছে ফেলা
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ৪. শুধু গেস্ট ইউজার এবং সাধারণ ইউজার মুছে ফেলা (অ্যাডমিন থাকবে)
  await prisma.user.deleteMany({
    where: {
      role: "USER", // অ্যাডমিন (role: "ADMIN") মুছবে না
    },
  });

  console.log("Database cleaned successfully! Admin account is safe.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });