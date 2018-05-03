const webpack = require("webpack");
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OfflinePlugin = require("offline-plugin");

module.exports = {
  entry: {
    app: "./app/index.jsx",
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name]-[chunkhash].js",
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.ne$/,
        use: ["nearley-loader"],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|png)/,
        use: ["file-loader"],
      },
    ],
  },

  plugins: [
    new HtmlPlugin({
      template: "./app/index.html",
      filename: "index.html",
    }),

    new HtmlPlugin({
      template: "./app/index.html",
      filename: "200.html",
    }),

    new CopyPlugin([{ from: "./app/favicons", to: "./" }]),

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),

    new ExtractTextPlugin("[name]-[contenthash].css", { allChunks: true }),

    new OfflinePlugin({
      autoUpdate: 30 * 1000,
      ServiceWorker: {
        events: true,
      },

      AppCache: {
        events: true,
      },
    }),
  ],
};
