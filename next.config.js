const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true, // if supported in your version
  },
  swcMinify: true,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      process: false,
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
    };

    // config.module.rules.push({
    //   test: /secure-json-parse[\\/]index\.js$/,
    //   type: 'javascript/auto',
    // });

    return config;
  },
};

module.exports = nextConfig;
