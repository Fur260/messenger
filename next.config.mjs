/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   swcPlugins: [["next-superjson-plugin", {}]],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
