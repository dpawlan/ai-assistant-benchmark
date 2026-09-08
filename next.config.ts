import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
