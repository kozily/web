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
      '.js',
      '.jsx'
    ],
  },

  output: {
    publicPath: 'http://localhost:8080/',
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

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: true,
              failOnError: true,
            },
          },
        ],
      },
      {
        test: /\.ne$/,
        use: [
          'nearley-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};

