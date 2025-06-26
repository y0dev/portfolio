import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // distDir: "dist", // Output build folder
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  },
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
