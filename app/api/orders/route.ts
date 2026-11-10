// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, city, paymentMethod, items, totalAmount, couponId } = body;

    // ১. ভ্যালিডেশন
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ২. ইউজার নির্ধারণ (লগইন থাকলে সেশন থেকে, না থাকলে গেস্ট)
    const session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
      // গেস্ট ইউজার তৈরি বা খোঁজা
      const guestEmail = `guest_${phone}@luxe.com`;
      let guestUser = await prisma.user.findUnique({ where: { email: guestEmail } });
      
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            name: name,
            email: guestEmail,
            role: "USER",
          },
        });
      }
      userId = guestUser.id;
    }

    // ৩. অর্ডার তৈরি
    const order = await prisma.order.create({
      data: {
        userId: userId,
        totalAmount,
        paymentMethod,
        status: "PENDING",
        shippingName: name,
        shippingPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        couponId: couponId || null, 
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    for (const item of items) {
  await prisma.product.update({
    where: { id: item.id },
    data: {
      stock: {
        decrement: item.quantity, // যত  অর্ডার হয়েছে, স্টক তত কমবে
      },
    },
  });
}

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}