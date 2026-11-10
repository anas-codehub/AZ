// app/api/track/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // কাস্টমার ছোট আইডি দিলেও যেন খুঁজে পায় (যেমন 1234 দিলে প্রথমে থাকা আইডি)
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { id: { startsWith: orderId.toLowerCase() } },
        ],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found. Please check your Order ID." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}