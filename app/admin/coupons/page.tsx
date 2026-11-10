"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AdminCouponsPage() {
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderValue: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Coupon created!");
      setForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderValue: "",
      });
    } else toast.error("Failed");
  };

  return (
    <div className="max-w-md space-y-6">
      <h1 className="font-serif text-3xl">Create Coupon</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 border border-ink-200"
      >
        <Input
          placeholder="Coupon Code (e.g. EID2025)"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value.toUpperCase() })
          }
          required
        />
        <select
          className="w-full border border-ink-200 p-2 text-sm"
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
        >
          <option value="PERCENTAGE">Percentage (%)</option>
          <option value="FIXED">Fixed Amount (৳)</option>
        </select>
        <Input
          type="number"
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Minimum Order Value (optional)"
          value={form.minOrderValue}
          onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
        />
        <Button type="submit" className="w-full bg-ink-900 text-white">
          Create Coupon
        </Button>
      </form>
    </div>
  );
}
