// app/api/admin/settings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { heroImage } = await req.json();

  const settings = await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: { heroImage },
    create: { id: "default", heroImage },
  });

  return NextResponse.json(settings);
}