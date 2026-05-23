import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "magbee-ecommerce.s3.ap-south-1.amazonaws.com",
      },
      {
      protocol: "https",
      hostname: "magbee-uat-database.s3.ap-south-1.amazonaws.com",
    },
   
    ],
    
    // domains: ["res.cloudinary.com"],
    // domains: ["magbee-ecommerce.s3.ap-south-1.amazonaws.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    dirs: ['pages', 'utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};

export default nextConfig;
