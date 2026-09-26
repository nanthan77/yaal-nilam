/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  // Keep local lead-testing builds separate from the production export build.
  distDir: process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST
    ? ".next-emulator"
    : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
