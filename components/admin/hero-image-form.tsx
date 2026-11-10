// components/admin/hero-image-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export function HeroImageForm({ initialImage }: { initialImage: string }) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImage: imageUrl }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Hero image updated!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 border border-ink-200 space-y-4">
      <h2 className="font-medium">Homepage Hero Image</h2>

      {/* Preview */}
      {imageUrl && (
        <div className="relative w-full h-64 bg-ink-100">
          <Image
            src={imageUrl}
            alt="Hero Preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      <Input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />

      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary"
        onSuccess={(result: any) => {
          setImageUrl(result.info.secure_url);
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()}>
            Upload New Image
          </Button>
        )}
      </CldUploadWidget>

      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-ink-900 text-white"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
