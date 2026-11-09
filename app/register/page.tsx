// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-luxe py-24 flex justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-2">Create Account</h1>
          <p className="text-ink-500 text-sm">
            Join LUXE for a premium experience
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="rounded-none"
          />
          <Input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="rounded-none"
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="rounded-none"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-ink-900 text-white"
          >
            {isLoading ? "Creating..." : "Register"}
          </Button>
        </form>
        <p className="text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
