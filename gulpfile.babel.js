// generated on 2016-02-23 using generator-webapp 2.0.0
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('assets/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('assets/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('assets/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('assets/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'assets', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('./'));
});

gulp.task('images', () => {
  return gulp.src('assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('./images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('assets/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('fonts/'));
});

gulp.task('extras', () => {
  return gulp.src([
    'assets/*.*',
    '!assets/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('./'));
});

gulp.task('clean', del.bind(null, ['.tmp', './']));

// gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
//   browserSync({
//     notify: false,
//     port: 9000,
//     server: {
//       baseDir: ['.tmp', 'assets'],
//       routes: {
//         '/bower_components': 'bower_components'
//       }
//     }
//   });
//
//   gulp.watch([
//     'assets/*.html',
//     'assets/images/**/*',
//     '.tmp/fonts/**/*'
//   ]).on('change', reload);
//
//   gulp.watch('assets/styles/**/*.scss', ['styles']);
//   gulp.watch('assets/scripts/**/*.js', ['scripts']);
//   gulp.watch('assets/fonts/**/*', ['fonts']);
//   gulp.watch('bower.json', ['wiredep', 'fonts']);
// });

gulp.task('serve', () => {
  browserSync({
    proxy: 'personal.dev',
    notify: false,
    port: 9000
  });

  gulp.watch([
    'assets/*.html',
    'assets/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('assets/styles/**/*.scss', ['styles']);
  gulp.watch('assets/scripts/**/*.js', ['scripts']);
  gulp.watch('assets/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// gulp.task('serve:test', ['scripts'], () => {
//   browserSync({
//     notify: false,
//     port: 9000,
//     ui: false,
//     server: {
//       baseDir: 'test',
//       routes: {
//         '/scripts': '.tmp/scripts',
//         '/bower_components': 'bower_components'
//       }
//     }
//   });
//
//   gulp.watch('assets/scripts/**/*.js', ['scripts']);
//   gulp.watch('test/spec/**/*.js').on('change', reload);
//   gulp.watch('test/spec/**/*.js', ['lint:test']);
// });

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('assets/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('assets/styles'));

  gulp.src('assets/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('assets'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('./').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
