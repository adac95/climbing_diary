/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    domains: [
      "localhost",
      "source.unsplash.com",
      "api.unsplash.com",
      "hcegmotvdidgavvacgcy.supabase.co",
    ],
  },
};

module.exports = nextConfig;
