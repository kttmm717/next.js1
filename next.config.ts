import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental' //pprを有効化
  }
};

export default nextConfig;
