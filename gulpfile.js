const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const PROJECT_SASS_SRC = './_assets/css';
const PROJECT_JS_SRC = './_assets/js';
const PROJECT_JS_MAIN = 'app.js';
const OUTPUT_DIR = './_site_assets';
const JS_DEST = `${OUTPUT_DIR}`;
const CSS_DEST = `${OUTPUT_DIR}`;

gulp.task('build-js', () => {
  const stream = browserify({ entries: `${PROJECT_JS_SRC}/${PROJECT_JS_MAIN}`, debug: true })
    .bundle()
    .pipe(source(PROJECT_JS_MAIN))
    .pipe(buffer())
    .pipe(gulp.dest(JS_DEST))
    .pipe(gulp.dest(JS_DEST));

  return stream;
});

gulp.task('watch-js', () => gulp.watch(
  `${PROJECT_JS_SRC}/**/*.js`,
  gulp.series('build-js'),
));

gulp.task('build-sass', () => {
  const plugins = [
    autoprefixer([
      '> 1%',
      'Last 2 versions',
      'IE 11',
    ]),
  ];

  const stream = gulp
    .src([`${PROJECT_SASS_SRC}/index.scss`])
    .pipe(sass({
      includePaths: [
        PROJECT_SASS_SRC,
        `node_modules/uswds/dist/scss`,
        `node_modules/uswds/dist/scss/packages`,
      ],
    }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(CSS_DEST))
    .pipe(gulp.dest(CSS_DEST));

  return stream;
});

gulp.task('watch-sass', () => gulp.watch(
  `${PROJECT_SASS_SRC}/**/*.scss`,
  gulp.series('build-sass'),
));

gulp.task('build', gulp.parallel(
  'build-js',
  'build-sass',
));

gulp.task('watch', gulp.parallel(
  gulp.series('build-js', 'watch-js'),
  gulp.series('build-sass', 'watch-sass'),
));

gulp.task('default', gulp.series('watch'));
