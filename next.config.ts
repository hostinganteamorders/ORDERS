import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Workaround for EISDIR bug on Windows non-C: drives
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
    };
    return config;
  },

  // SEO & Analytics optimizations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/undangantrisha',
        destination: '/undangantrisha.html',
      },
    ];
  },

  // Domain redirects untuk canonical URL
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.ordersapp.tech',
          },
        ],
        destination: 'https://ordersapp.tech/:path*',
        permanent: true,
      },
      {
        source: '/undangantrisha.html',
        destination: '/undangantrisha',
        permanent: true,
      },
    ];
  },

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
