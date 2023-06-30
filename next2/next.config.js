// analyze the code bundles that are generated with Next.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const path = require('path');

module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Use when you already have ESLint configured to run in a separate part of your workflow (for example, in CI or a pre-commit hook).
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: process.env.APP_ENV !== 'production' ? true : false, // enables debugging for non production mode
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV
  },
  webpack: (config, { isServer }) => {
    //Added for svg files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // webpack < 5 used to include polyfills for node.js core modules by default. This is no longer the case. Verify if you need this module and configure a polyfill for it. This tells webpack 5 to either not resolve the module during client-side rendering, or render the specified polyfill
    if (!isServer) {
      config.resolve.fallback = {

        /** Bundle web3 polyfills.
         * @see: https://github.com/ChainSafe/web3.js#troubleshooting-and-known-issues*/
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        url: require.resolve("url"),
        url: require.resolve("querystring"),

        // Don't bundle pure NodeJS libs not needed in the browser
        fs: false,
        net: false,
        tls: false,
      };
    }

    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),

        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      )
    }

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  optimizeFonnts: true,
};
