/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
