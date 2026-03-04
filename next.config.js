/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Do NOT externalize jsdom/@mozilla/readability: their transitive dep html-encoding-sniffer
  // require()s @exodus/bytes (ESM-only), causing ERR_REQUIRE_ESM in serverless. Bundling fixes it.
};

module.exports = nextConfig;
