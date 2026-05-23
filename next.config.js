/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
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

module.exports = nextConfig;
