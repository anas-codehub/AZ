// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push("/"); // লগইন সফল হলে হোমপেজে নিয়ে যাবে
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="container-luxe py-24 flex justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-2">Welcome Back</h1>
          <p className="text-ink-500 text-sm">Login to your LUXE account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm text-ink-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand-600 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
