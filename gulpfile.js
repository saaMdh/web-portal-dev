const gulp  = require("gulp");
const bump = require("gulp-bump");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const { getBrowserslistQueries } = require("bdsl-webpack-plugin");
const exec = require("child_process").exec;

const cssPostProcess = function({ env }) {
  var plugins = [
    autoprefixer({
      overrideBrowserslist: getBrowserslistQueries({ env })
    }),
    postcssPresetEnv({
      browsers: getBrowserslistQueries({ env })
    })
  ];
  return gulp
    .src(`./dist/${env}/css/*.css`)
    .pipe(postcss(plugins))
    .pipe(gulp.dest(`./dist/${env}/css`));
};

gulp.task("css:legacy", () => {
  return cssPostProcess({ env: "legacy" });
});
gulp.task("css:modern", () => {
  return cssPostProcess({ env: "modern" });
});


// Bump version
gulp.task('bump-major', () => {
  return gulp.src('./package.json')
  .pipe(bump({type: "major"}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', () => {
  return gulp.src('./package.json')
  .pipe(bump({type: "minor"}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', () => {
  return gulp.src('./package.json')
  .pipe(bump({type: "patch"}))
  .pipe(gulp.dest('./'));
});

gulp.task('yarn', function () {
  return gulp.src(['./package.json', './yarn.lock'])
    .pipe(gulp.dest('./dist'))
    // eslint-disable-next-line no-undef
    .pipe(yarn({
      production: true
    }));
});

gulp.task("build_legacy", function (cb) {
  exec("npm run build:legacy", function (err, stdout, stderr) {
    console.log(stderr);
    console.log(stdout);
    cb(err);
  });
});

gulp.task("build_modern", function (cb) {
  exec("npm run build:modern", function (err, stdout, stderr) {
    console.log(stderr);
    console.log(stdout);
    cb(err);
  });
});

gulp.task("postinstall", function (cb) {
  exec("npm run postinstall", function (err, stdout, stderr) {
    console.log(stderr);
    console.log(stdout);
    cb(err);
  });
});


gulp.task('build_dist', gulp.parallel('build_modern','build_legacy'));

gulp.task('build', gulp.series('build_dist','postinstall'));
