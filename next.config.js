/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindcss.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'news.google.com',
      }
    ],
  },
  // Redirect old seo-gen URLs to new structure
  async redirects() {
    return [
      {
        source: '/seo-gen/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
    ];
  },
  // Optimize chunks to prevent loading failures
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'react-icons'
    ],
  },
  // Add retry configuration for chunk loading
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
