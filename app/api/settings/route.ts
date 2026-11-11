// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
      select: {
        dhakaCharge: true,
        outsideCharge: true,
      },
    });

    return NextResponse.json({
      dhakaCharge: settings?.dhakaCharge || 60,
      outsideCharge: settings?.outsideCharge || 120,
    });
  } catch (error) {
    return NextResponse.json({ dhakaCharge: 60, outsideCharge: 120 });
  }
}