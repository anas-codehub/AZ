// app/order-success/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) return <div className="text-center py-32">Order not found</div>;

  return (
    <div className="container-luxe py-24 text-center max-w-2xl mx-auto space-y-8">
      <div className="flex justify-center">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </div>
      <h1 className="font-serif text-4xl">Order Confirmed!</h1>
      <p className="text-ink-500">
        Thank you for your purchase,{" "}
        <span className="font-medium text-ink-900">{order.shippingName}</span>.
        Your order ID is{" "}
        <span className="font-mono text-sm bg-ink-100 p-1 px-2">
          {order.id.split("-")[0].toUpperCase()}
        </span>
        .
      </p>

      {/* Order Details */}
      <div className="border border-ink-200 p-6 text-left space-y-4">
        <h2 className="font-medium border-b border-ink-200 pb-2">
          Order Summary
        </h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product.name} (x{item.quantity})
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t border-ink-200 pt-4">
          <span>Total Paid</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
