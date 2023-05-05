// next config
module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    // Dynamic module import because nextjs-sync is ESM
    const zestyNext = await import("@zesty-io/nextjs-sync");
    const data = await zestyNext.fetchRedirects();
    return data;
  },
};
