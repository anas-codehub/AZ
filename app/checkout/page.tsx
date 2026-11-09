// app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const total = getTotalPrice();

  // ফর্ম ডেটা
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      return toast.error("Please fill in all shipping details");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          totalAmount: total > 5000 ? total : total + 150, // শিপিং চার্জ
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/order-success/${data.orderId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/products")}>Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-20">
      <h1 className="font-serif text-4xl mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="rounded-none"
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                required
                className="rounded-none"
              />
              <Input
                name="address"
                placeholder="Street Address"
                onChange={handleChange}
                required
                className="rounded-none md:col-span-2"
              />
              <Input
                name="city"
                placeholder="City"
                onChange={handleChange}
                required
                className="rounded-none md:col-span-2"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-ink-200 cursor-pointer hover:border-ink-900 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleChange}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-ink-200 cursor-pointer hover:border-ink-900 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BKASH"
                  checked={formData.paymentMethod === "BKASH"}
                  onChange={handleChange}
                />
                <span>bKash</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-ink-900 text-white hover:bg-brand-600"
          >
            {isLoading
              ? "Processing..."
              : `Place Order • ${formatPrice(total > 5000 ? total : total + 150)}`}
          </Button>
        </form>

        {/* Right: Order Summary */}
        <div className="bg-ink-50 p-6 md:p-8 h-fit">
          <h2 className="font-serif text-2xl mb-6">In Your Bag</h2>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4"
              >
                <div className="relative w-16 h-20 bg-ink-200 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-ink-500">
                    {item.size} / {item.color} (x{item.quantity})
                  </p>
                  <p className="font-semibold mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-ink-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Shipping</span>
              <span>{total > 5000 ? "Free" : formatPrice(150)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4 border-t border-ink-200 pt-4">
              <span>Total</span>
              <span>{formatPrice(total > 5000 ? total : total + 150)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
