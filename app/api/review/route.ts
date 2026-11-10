// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to review" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ইউজার আগে রিভিউ দিয়েছে কি না চেক করা (ঐচ্ছিক, তবে ভালো প্র্যাকটিস)
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: session.user.id },
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: Number(rating),
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}