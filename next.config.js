/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      // add any other domains you need for your remote images
    ],
  },
};

module.exports = nextConfig;
