import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Head-to-head pages and the share card render on demand for pairs and highlights that were not prebuilt,
  // so the data files, logos and fonts they read must ride along with those functions.
  outputFileTracingIncludes: {
    '/compare/**': ['./data/**/*'],
    '/api/og/compare': ['./data/**/*', './public/logos/**/*', './src/assets/fonts/*'],
  },
  async redirects() {
    return [
      { source: '/categories', destination: '/dimensions', permanent: true },
      { source: '/categories/:key', destination: '/dimensions/:key', permanent: true },
      { source: '/confirmed', destination: '/', permanent: true },
      { source: '/stretch', destination: '/?kind=all', permanent: true },
    ];
  },
};

export default nextConfig;
