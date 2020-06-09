const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  entry: [
    'whatwg-fetch',
    'core-js/stable',
    'regenerator-runtime/runtime',

    './scripts/app.js'
  ],
  output: {
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [new TerserPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                corejs: 3,
                useBuiltIns: 'entry',
                targets: '>0.2%, not dead'
              }]
            ]
          }
        }
      }
    ]
  }
};
