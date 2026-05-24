/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly declare turbopack config so Next.js 16 doesn't error
  // when next-pwa injects a webpack config alongside Turbopack
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
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

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: true, // Disabled during Beta to prevent Service Worker phantom caching bugs
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports = withPWA(nextConfig);
