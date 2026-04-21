/** @type {import('next').NextConfig} */
const repo = 'EternalReverse-dev'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
}

export default nextConfig
