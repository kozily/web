module.exports = (config) => {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'specs/**/*_spec.js',
    ],
    preprocessors: {
      'specs/**/*_spec.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha'],
    browsers: ['PhantomJS'],
    webpack: {
      devtool: 'inline-source-map',

      resolve: {
        extensions: [
          '',
          '.js',
          '.jsx',
        ],
      },

      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel!eslint',
          },

          {
            test: /\.nearley$/,
            loader: 'nearley',
          },
        ],
      },
    },
  });
};

