// app/admin/settings/page.tsx
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form"; // 👈 নতুন ফর্ম

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-serif text-3xl">Site Settings</h1>
      <SettingsForm
        initialHeroImage={settings?.heroImage || ""}
        initialDhakaCharge={settings?.dhakaCharge || 60}
        initialOutsideCharge={settings?.outsideCharge || 120}
      />
    </div>
  );
}
