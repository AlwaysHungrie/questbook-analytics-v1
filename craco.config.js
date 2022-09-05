const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": false,
          "fs": false
        },
      },
      // See https://github.com/webpack/webpack/issues/6725
      module: {
        rules: [
          {
            test: /\.wasm$/,
            type: 'javascript/auto',
          },
        ],
      },
      plugins: [
        new NodePolyfillPlugin({
          excludeAliases: ['console'],
        })
      ]
    },
  },
};
