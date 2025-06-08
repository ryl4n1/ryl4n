/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.seeklogo.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 