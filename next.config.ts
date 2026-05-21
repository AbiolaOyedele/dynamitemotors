import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dynamitemotors.vercel.app' }],
        destination: 'https://www.dynamitemotors.com/:path*',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      { hostname: 'assets.basehub.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'cdn.sanity.io' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
