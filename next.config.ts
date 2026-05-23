import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async rewrites() {
    return [
      { source: "/v1", destination: "/v1/index.html" },
    ];
  },
};

export default nextConfig;
