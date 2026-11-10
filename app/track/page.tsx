// app/track/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return toast.error("Please enter an order ID");

    setIsLoading(true);
    setOrder(null);

    try {
      const res = await fetch(`/api/track?orderId=${orderId}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // স্ট্যাটাস অনুযায়ী স্টেপ নির্ধারণ
  const getStepStatus = (status: string) => {
    const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
    if (status === "CANCELLED") return -1;
    return steps.indexOf(status);
  };

  const currentStep = order ? getStepStatus(order.status) : -1;

  return (
    <div className="container-luxe py-20 md:py-32 max-w-3xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <Package className="w-12 h-12 mx-auto text-brand-600" />
        <h1 className="font-serif text-4xl">Track Your Order</h1>
        <p className="text-ink-500">
          Enter your order ID to see the current status of your delivery.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleTrack}
        className="flex gap-2 max-w-md mx-auto mb-12"
      >
        <Input
          placeholder="Enter Order ID (e.g. 1234ABCD)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="rounded-none"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-none bg-ink-900 text-white"
        >
          <Search className="w-4 h-4 mr-2" /> Track
        </Button>
      </form>

      {/* Order Details */}
      {order && (
        <div className="bg-white border border-ink-200 p-6 md:p-10 space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between border-b border-ink-100 pb-4 gap-4">
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-widest">
                Order ID
              </p>
              <p className="font-mono font-medium text-lg">
                {order.id.split("-")[0].toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-widest">
                Date
              </p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-widest">
                Total
              </p>
              <p className="font-medium">৳{order.totalAmount}</p>
            </div>
          </div>

          {/* Progress Steps */}
          {order.status === "CANCELLED" ? (
            <div className="text-center py-6 text-red-500 space-y-2">
              <XCircle className="w-10 h-10 mx-auto" />
              <p className="font-medium">This order has been cancelled.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-ink-100 -z-10">
                <div
                  className="h-full bg-brand-600 transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>

              <div className="flex justify-between relative">
                {/* Step 1: Pending */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${currentStep >= 0 ? "border-brand-600 text-brand-600" : "border-ink-200 text-ink-300"}`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">
                    Pending
                  </span>
                </div>

                {/* Step 2: Processing */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${currentStep >= 1 ? "border-brand-600 text-brand-600" : "border-ink-200 text-ink-300"}`}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">
                    Processing
                  </span>
                </div>

                {/* Step 3: Shipped */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${currentStep >= 2 ? "border-brand-600 text-brand-600" : "border-ink-200 text-ink-300"}`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">
                    Shipped
                  </span>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${currentStep >= 3 ? "border-brand-600 text-brand-600" : "border-ink-200 text-ink-300"}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-ink-50 p-4 text-center text-sm text-ink-600">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@luxe.com"
              className="text-brand-600 underline"
            >
              support@luxe.com
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
