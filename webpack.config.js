const TerserPlugin = require('terser-webpack-plugin');

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
          /\bregenerator-runtime\b/,

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
            ],
            plugins: [
              ['template-html-minifier', {
                modules: {
                  'lit-html': ['html']
                },
                strictCSS: true,
                htmlMinifier: {
                  collapseWhitespace: true,
                  conservativeCollapse: true,
                  removeComments: true,
                  caseSensitive: true,
                  minifyCSS: true
                },
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
      minimizer: [new TerserPlugin({
        terserOptions: {
          ie8: true,
          sourceMap: true,
          compress: {
            negate_iife: false,
            properties: false,
            ie8: true,
          },
        },
      })]
    };
  }

  return config;
}
