const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: [
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
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'entry',
                targets: {
                  browsers: ['ie >= 11', 'safari > 9']
                }
              }]
            ]
          }
        }
      }
    ]
  }
};
