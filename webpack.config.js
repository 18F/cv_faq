const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: [
    'whatwg-fetch',
    './scripts/app.js'
  ],
  output: {
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          // With useBuiltIns: 'usage', exclude polyfills
          /\bcore-js\b/,
          /\bwebpack\/buildin\b/,

          // Accessible-autocomplete's bundle is already transpiled
          /\baccessible-autocomplete\b/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                corejs: 3,
                useBuiltIns: 'usage'
              }]
            ]
          }
        }
      }
    ]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }
  else if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            negate_iife: false,
            properties: false,
            ie8: true
          },
          mangle: {
            ie8: true
          },
          output: {
            comments: false,
            ie8: true
          }
        }
      })]
    };
  }

  return config;
}
