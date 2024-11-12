import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/mongos-bson-converter',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
