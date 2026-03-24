import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/aligned-life",
  images: { unoptimized: true },
};

export default nextConfig;
