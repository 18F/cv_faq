const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './**/*.html',
    './**/*.js',
    './**/*.md'
  ],
  whitelistPatterns: [
    /^autocomplete/
  ],

  // Include any special characters you're using in this regular expression
  //defaultExtractor: content => content.match(/[\w-/.:_]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require('autoprefixer'),
    purgecss,
    require('postcss-csso')
  ]
}
