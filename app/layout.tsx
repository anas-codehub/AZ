// app/layout.tsx (সংশোধিত)
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/components/providers/session-provider";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/providers/page-transition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://আপনার-ডোমেইন.vercel.app"),
  title: { default: "LUXE — Premium Fashion", template: "%s | LUXE" },
  description: "Curated premium fashion for the modern individual.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white text-ink-900 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar categories={categories} />

          <main className="flex-1">
            <PageTransition>{children}</PageTransition>{" "}
            {/* 👈 শুধু এটুকুই থাকবে */}
          </main>

          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
