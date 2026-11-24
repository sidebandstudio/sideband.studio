/** @type {import('next').NextConfig} */
const nextConfig = process.env.SIDEBAND_STATIC_EXPORT === '1' ? {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
} : {
  async redirects() {
    return [
      // Eternal2x was renamed Upflow2x by its makers in October 2026.
      {
        source: '/products/eternal2x',
        destination: '/products/upflow2x',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
