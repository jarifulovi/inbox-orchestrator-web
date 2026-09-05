import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/inbox",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

