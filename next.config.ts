// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 👇 Next.js 16-এ quality ভ্যালু allow-list করতে হয়
    qualities: [75, 85, 100], 
    
    // 👇 remotePatterns (domains বাদ দেওয়া হয়েছে Next.js 16-এ)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;