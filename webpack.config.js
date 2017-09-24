var path = require('path');

module.exports = {
  entry: './examples/main.jsx',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'examples')
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "examples"),
          path.resolve(__dirname, "src"),
        ],
        exclude: ['node_modules'],
        loader: "babel-loader",
        query: {
          plugins: ['transform-runtime', 'transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react'],
        }
      },
    ]
  }
};