/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — deployable to any static host (Vercel / Cloudflare Pages / GitHub Pages).
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
