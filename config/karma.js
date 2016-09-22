const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'specs/*_spec.js',
      'specs/**/*_spec.js',
    ],
    preprocessors: {
      'specs/*_spec.js': ['webpack'],
      'specs/**/*_spec.js': ['webpack'],
    },
    reporters: ['mocha'],
    browsers: ['PhantomJS'],
    webpack: {
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
            loader: 'babel',
          },

          {
            test: /\.nearley$/,
            loader: 'nearley',
          },
        ]
      }
    },
  });
}
