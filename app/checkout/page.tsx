// app/checkout/page.tsx (আপডেটেড)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Ticket } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 150;

  // ডিসকাউন্ট ক্যালকুলেশন
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const total = subtotal + shipping - discount;

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

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAppliedCoupon(data.coupon);
      toast.success("Coupon applied successfully!");
    } catch (error: any) {
      toast.error(error.message);
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
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
          subtotal,
          discount,
          totalAmount: total,
          couponId: appliedCoupon?.id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/order-success/${data.orderId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (বাকি JSX কোড আগের মতো, শুধু Order Summary-তে কুপন সেকশন যোগ করুন)

  return (
    <div className="container-luxe py-12 md:py-20">
      {/* ... আগের ফর্ম অংশ */}

      {/* Order Summary Section-এ কুপন ইনপুট ও ডিসকাউন্ট দেখান */}
      <div className="bg-ink-50 p-6 md:p-8 h-fit">
        <h2 className="font-serif text-2xl mb-6">In Your Bag</h2>
        {/* ... প্রোডাক্ট লিস্ট */}

        {/* Coupon Input */}
        <div className="border-t border-ink-200 pt-6 mt-6 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="rounded-none"
              disabled={!!appliedCoupon}
            />
            {appliedCoupon ? (
              <Button
                type="button"
                variant="destructive"
                onClick={removeCoupon}
              >
                Remove
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon}
              >
                <Ticket className="w-4 h-4 mr-2" />
                Apply
              </Button>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-xs text-green-600">
              {appliedCoupon.code} applied! You saved {formatPrice(discount)}
            </p>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-ink-200 pt-4 mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- {formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg mt-4 border-t border-ink-200 pt-4">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
