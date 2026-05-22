import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/ig',
        destination: 'https://instagram.com/quietlyhuman',
        permanent: true,
      },
      {
        source: '/yt',
        destination: 'https://youtube.com/@quietlyhuman',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/books',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
