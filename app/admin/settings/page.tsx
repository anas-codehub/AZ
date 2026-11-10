// app/admin/settings/page.tsx
import { prisma } from "@/lib/prisma";
import { HeroImageForm } from "@/components/admin/hero-image-form";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-serif text-3xl">Site Settings</h1>
      <HeroImageForm initialImage={settings?.heroImage || ""} />
    </div>
  );
}
