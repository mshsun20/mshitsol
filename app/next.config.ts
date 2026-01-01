import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compiler: {
    // Required for Emotion + MUI (production safe)
    emotion: true,
  },

  experimental: {
    // Prevents large client bundles (good for MUI)
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/x-data-grid",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  poweredByHeader: false,
};

export default nextConfig;
