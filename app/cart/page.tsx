// app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="container-luxe py-32 text-center space-y-6">
        <h1 className="font-serif text-4xl">Your Cart is Empty</h1>
        <p className="text-ink-500">
          Looks like you haven't added anything yet.
        </p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-20">
      <h1 className="font-serif text-4xl mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex gap-6 border-b border-ink-200 pb-6"
            >
              <div className="relative w-24 h-32 shrink-0 bg-ink-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-sm text-ink-500">
                    {item.size && `Size: ${item.size}`}{" "}
                    {item.color && `| Color: ${item.color}`}
                  </p>
                  <p className="font-semibold mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-ink-200">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.size,
                          item.color,
                          item.quantity - 1,
                        )
                      }
                      className="p-2 hover:bg-ink-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.size,
                          item.color,
                          item.quantity + 1,
                        )
                      }
                      className="p-2 hover:bg-ink-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-ink-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-ink-50 p-6 md:p-8 h-fit sticky top-24">
          <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Shipping</span>
              <span className="font-medium">
                {total > 5000 ? "Free" : formatPrice(150)}
              </span>
            </div>
            <div className="border-t border-ink-200 pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(total > 5000 ? total : total + 150)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full h-12 bg-ink-900 text-white hover:bg-brand-600">
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
