const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './app/index.jsx',
  },

  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ],
  },

  output: {
    path: './build',
    filename: '[name]-[chunkhash].js',
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
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap'),
      },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap'),
      },

      {
        test: /\.(ttf|eot|svg|woff|woff2)/,
        loader: 'file',
      }
    ]
  },

  devtool: 'source-map',

  plugins: [
    new HtmlPlugin({
      template: './app/index.html',
    }),

    new HtmlPlugin({
      template: './app/index.html',
      filename: '200.html',
    }),

    new CopyPlugin([
      {from: './app/favicons', to: './'},
    ]),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),

    new ExtractTextPlugin(
      "[name]-[contenthash].css",
      {allChunks: true}
    ),
  ],
};

