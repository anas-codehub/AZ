// app/api/admin/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, parentId } = await req.json();
  const slug = slugify(name);

  const category = await prisma.category.create({
    data: { name, slug, parentId: parentId || null },
  });

  return NextResponse.json(category);
}