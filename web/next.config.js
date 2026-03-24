/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "yaalnilam-media.s3.ap-south-1.amazonaws.com" },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    NEXT_PUBLIC_MAP_CENTER_LAT: "9.6615",
    NEXT_PUBLIC_MAP_CENTER_LNG: "80.0255",
  },
};

module.exports = nextConfig;
