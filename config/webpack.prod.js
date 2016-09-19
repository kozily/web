const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './app/index.jsx',
    vendor: ['react', 'react-dom'],
  },

  resolve: {
    root: [
      path.resolve('./app'),
    ],
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
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap'),
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

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
  ],
};

