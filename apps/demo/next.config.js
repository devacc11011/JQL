/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jql/json-sql-explorer'],
  webpack: (config, { isServer }) => {
    // Monaco editor requires this
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });

    // Ignore react-native modules (used by AlaSQL but not needed in browser)
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': false,
      'react-native-fetch-blob': false,
      'react-native-fs': false,
    };

    // Fallback for Node.js modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
