// components/product/review-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";

export function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    return (
      <div className="bg-ink-50 p-6 text-center text-sm">
        Please{" "}
        <a href="/login" className="text-brand-600 underline">
          login
        </a>{" "}
        to write a review.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success("Review submitted!");
      setComment("");
      router.refresh(); // পেজ রিফ্রেশ করে নতুন রিভিউ দেখানো
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border border-ink-200 p-6 bg-white"
    >
      <h3 className="font-medium text-lg">Write a Review</h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hover || rating)
                  ? "fill-brand-500 text-brand-500"
                  : "text-ink-300"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        placeholder="Share your thoughts about this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        className="w-full border border-ink-200 p-3 text-sm rounded-none min-h-[100px]"
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-ink-900 text-white"
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
