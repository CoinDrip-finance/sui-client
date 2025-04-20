const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
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

    config.module.rules.push({
      test: /secure-json-parse[\\/]index\.js$/,
      type: 'javascript/auto',
    });

    return config;
  },
  transpilePackages: [
    '@assistant-ui/react-ui',
    '@assistant-ui/react',
    '@assistant-ui/react-ai-sdk',
    '@assistant-ui/react-markdown',
    'secure-json-parse', // 👈 critical to transpile this
  ],
};

module.exports = nextConfig;
