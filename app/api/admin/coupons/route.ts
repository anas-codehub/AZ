import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: parseFloat(data.discountValue),
      minOrderValue: data.minOrderValue ? parseFloat(data.minOrderValue) : null,
      isActive: data.isActive ?? true,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
  return NextResponse.json(coupon, { status: 201 });
}