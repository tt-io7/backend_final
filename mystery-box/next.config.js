/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['medusa-public-images.s3.eu-west-1.amazonaws.com', 'localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/medusa/:path*',
        destination: 'http://localhost:9000/store/:path*',
      },
    ]
  },
}

module.exports = nextConfig