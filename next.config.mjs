/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";
const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  fallback: {
    fallback: "/offline",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
});

export default nextConfig;
