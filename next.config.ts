import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // distDir: "dist", // Output build folder
  images: {
    unoptimized: true
  },
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
