import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { hostname: 'assets.basehub.com' },
      { hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
