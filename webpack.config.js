const path = require('path');

const entry = path.join(__dirname, 'src', 'index.ts');

module.exports = {
  entry: ['babel-polyfill', entry],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
  },
};
