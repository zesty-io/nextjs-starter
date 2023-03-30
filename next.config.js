// zesty imports
const { fetchZestyRedirects } = require('./lib/zesty/fetchRedirects');
const zestyConfig = require('./zesty.config.json');

// next config
module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: ['pt9nc6rn.media.zestyio.com'],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  async redirects() {
    return  await fetchZestyRedirects(zestyConfig)
  }, 
  env: {
      zesty: zestyConfig
  }
}
