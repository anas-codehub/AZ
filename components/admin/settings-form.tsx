// components/admin/settings-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Save, Truck, Image as ImageIcon } from "lucide-react";

interface SettingsFormProps {
  initialHeroImage: string;
  initialDhakaCharge: number;
  initialOutsideCharge: number;
}

export function SettingsForm({
  initialHeroImage,
  initialDhakaCharge,
  initialOutsideCharge,
}: SettingsFormProps) {
  const [imageUrl, setImageUrl] = useState(initialHeroImage);
  const [dhakaCharge, setDhakaCharge] = useState(initialDhakaCharge);
  const [outsideCharge, setOutsideCharge] = useState(initialOutsideCharge);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage: imageUrl,
          dhakaCharge,
          outsideCharge,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Settings updated!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ১. Hero Image Section */}
      <div className="bg-white p-6 border border-ink-200 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="w-5 h-5 text-brand-600" />
          <h2 className="font-medium text-lg">Homepage Hero Image</h2>
        </div>

        {imageUrl && (
          <div className="relative w-full h-48 bg-ink-100">
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
          onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
        >
          {({ open }) => (
            <Button type="button" variant="outline" onClick={() => open()}>
              Upload New Hero Image
            </Button>
          )}
        </CldUploadWidget>
      </div>

      {/* ২. Delivery Charges Section (সব একসাথে) */}
      <div className="bg-white p-6 border border-ink-200 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-brand-600" />
          <h2 className="font-medium text-lg">Delivery Charges</h2>
        </div>
        <p className="text-sm text-ink-500 mb-4">
          Set the delivery charge based on the customer's location.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Inside Dhaka (৳)
            </label>
            <Input
              type="number"
              value={dhakaCharge}
              onChange={(e) => setDhakaCharge(Number(e.target.value))}
              min="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Outside Dhaka (৳)
            </label>
            <Input
              type="number"
              value={outsideCharge}
              onChange={(e) => setOutsideCharge(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full h-12 bg-ink-900 text-white hover:bg-brand-600"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
