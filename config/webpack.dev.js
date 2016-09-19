const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './app/index.jsx',
  ],

  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ],
  },

  output: {
    path: './build',
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel!eslint',
      },

      {
        test: /\.sass$/,
        loader: 'style!css?sourceMap!sass?sourceMap',
      },

      {
        test: /\.(ttf|eot|svg|woff|woff2)/,
        loader: 'file',
      }
    ]
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new HtmlPlugin({
      template: './app/index.html',
    }),

    new CopyPlugin([
      {from: './app/favicons', to: './'},
    ]),
  ],
};

