/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['jsdom', '@mozilla/readability'],
};

module.exports = nextConfig;
