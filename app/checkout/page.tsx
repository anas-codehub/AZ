// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react"; // 👈 useEffect যোগ করা হলো
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Ticket } from "lucide-react";
import Select from "react-select";
import { districts } from "@/lib/districts";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // 👇 ডেলিভারি চার্জের স্টেট (ডিফল্ট ভ্যালু)
  const [charges, setCharges] = useState({ dhaka: 60, outside: 120 });

  const subtotal = getTotalPrice();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    paymentMethod: "COD",
  });

  // 👇 ডেটাবেস থেকে ডাইনামিক চার্জ আনা
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setCharges({
          dhaka: data.dhakaCharge || 60,
          outside: data.outsideCharge || 120,
        });
      })
      .catch(() => console.log("Using default charges"));
  }, []);

  // 👇 জেলা অনুযায়ী ডাইনামিক চার্জ হিসাব
  const isDhaka =
    formData.district === "Dhaka" ||
    ["Gazipur", "Narayanganj", "Narsingdi", "Manikganj", "Munshiganj"].includes(
      formData.district,
    );
  const shippingCharge =
    subtotal > 5000 ? 0 : isDhaka ? charges.dhaka : charges.outside;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const total = subtotal + shippingCharge - discount;

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
      !formData.district
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
          city: formData.district,
          items,
          subtotal,
          discount,
          shippingCharge,
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
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="rounded-none"
              />
              <Input
                name="phone"
                placeholder="Mobile Number"
                onChange={handleChange}
                required
                className="rounded-none"
              />
              <Input
                name="address"
                placeholder="Full Address (House, Road, Area)"
                onChange={handleChange}
                required
                className="rounded-none"
              />

              {/* 👇 সার্চেবল জেলা ড্রপডাউন */}
              <div>
                <label className="text-sm text-ink-500 mb-1 block">
                  Select District
                </label>
                <Select
                  options={districts}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      district: selected?.value || "",
                    })
                  }
                  placeholder="Search your district..."
                  isSearchable={true}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 0,
                      borderColor: "#e5e5e5",
                      padding: "2px",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#1a1a1a" },
                    }),
                  }}
                />
              </div>
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
              : `Place Order • ${formatPrice(total)}`}
          </Button>
        </form>

        {/* Right: Order Summary */}
        <div className="bg-ink-50 p-6 md:p-8 h-fit">
          <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
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

          {/* 👇 কুপন সেকশন */}
          <div className="border-t border-ink-200 pt-6 space-y-3">
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
                  className="bg-ink-900 text-white"
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

          <div className="border-t border-ink-200 pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Shipping</span>
              <span>
                {!formData.district
                  ? "Select District"
                  : shippingCharge === 0
                    ? "Free"
                    : formatPrice(shippingCharge)}
              </span>
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
    </div>
  );
}
