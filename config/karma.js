module.exports = config => {
  config.set({
    basePath: "..",
    frameworks: ["jasmine"],
    files: ["specs/**/*_spec.js"],
    preprocessors: {
      "specs/**/*_spec.js": ["webpack", "sourcemap"],
    },
    reporters: ["progress"],
    browsers: ["PhantomJS"],
    webpack: {
      devtool: "inline-source-map",

      resolve: {
        extensions: [".js", ".jsx"],
      },

      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              "babel-loader",
              {
                loader: "eslint-loader",
                options: {
                  failOnWarning: true,
                  failOnError: true,
                },
              },
            ],
          },
          {
            test: /\.ne$/,
            use: ["nearley-loader"],
          },
        ],
      },
    },
  });
};
