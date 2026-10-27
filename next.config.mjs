/** @type {import('next').NextConfig} */
const nextConfig = {
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
