const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
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
    publicPath: 'http://localhost:8080/',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel!eslint',
      },

      {
        test: /\.(sass|scss)$/,
        loader: 'style!css?sourceMap!sass?sourceMap',
      },

      {
        test: /\.css$/,
        loader: 'style!css?sourceMap',
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

