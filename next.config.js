/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint configuration for deployment
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
      {
        source: '/post',
        destination: '/posts',
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
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Output configuration for better caching
  output: 'standalone',
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
