// components/admin/order-status-select.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

const statuses = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "PROCESSING",
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "bg-green-100 text-green-700",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Could not update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusObj =
    statuses.find((s) => s.value === status) || statuses[0];

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isUpdating}
        className={`appearance-none px-3 py-1 pr-8 text-xs font-medium rounded cursor-pointer outline-none ${currentStatusObj.color} border-none`}
      >
        {statuses.map((s) => (
          <option
            key={s.value}
            value={s.value}
            className="bg-white text-ink-900"
          >
            {s.label}
          </option>
        ))}
      </select>
      {isUpdating && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">
          ...
        </span>
      )}
    </div>
  );
}
