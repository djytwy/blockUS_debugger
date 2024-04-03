/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    // v1:
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['ambrus.s3.amazonaws.com', 'cdn.ambrus.studio', 'storage.googleapis.com'],
  },
  typescript: {
    // v1: !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // v1:
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
};
