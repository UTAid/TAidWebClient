/*
* Tasks for the gulp build tool.
*/

const gulp = require('gulp');
const ts = require('gulp-typescript');
const gutil = require('gulp-util');
const path = require('path');

// Load configurations from tsconfig.json
var tsProject = ts.createProject('tsconfig.json');

// Container for paths used
var paths = {}
initPaths(tsProject.config.compilerOptions);

// Set paths here.
function initPaths(compilerOpts){
  paths.src = compilerOpts.rootDir ? compilerOpts.rootDir : '.';
  paths.dist = compilerOpts.outDir ? compilerOpts.outDir : paths.src;

  paths.scripts = '**/*.js';
  paths.tscripts = '**/*.ts';
  paths.assets = '**/*.{html,htm,css}';
}

// Wipe the distrib directory.
gulp.task('clean', function() {
  const del = require('del');
  return del([
    path.join(paths.dist, '*'),
  ]);
});

// Build typescript
gulp.task('build.scripts', function() {
  const sourcemaps = require('gulp-sourcemaps');
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .js.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

// Build assets
gulp.task('build.assets', function() {
  return gulp.src(path.join(paths.src, paths.assets),
                  {since: gulp.lastRun('build.assets')})
    .pipe(gulp.dest(paths.dist));
});

// Start browser-sync, monitoring all files within distrib folder.
gulp.task('bs', function() {
  const bs = require('browser-sync').create();
  return bs.init({
    injectChanges: false, // workaround for Angular 2 styleUrls loading
    files: path.join(paths.dist, '**'),
    watchOptions: {
      ignored: 'node_modules'
    },
    server: {
      baseDir: '.',
      index: path.join(paths.dist, 'index.html')
    }
  })
});

// Execute a clean build.
gulp.task('build',
  gulp.series('clean',
    gulp.parallel('build.scripts', 'build.assets')
  )
);

// Watch source folder for changes. Incremental build when changes are detected.
gulp.task('watch', function() {
  var compileOnSave = tsProject.config.compileOnSave;
  if (compileOnSave === undefined) compileOnSave = true; // default
  // If compile on save is enabled, there's no need to do incremental builds.
  gutil.log('Editor compiles on save:', compileOnSave + '.',
            'Typescript files will', compileOnSave ? 'not be' : 'be',
            'compiled.');
  var scriptWatcher = gulp.watch(path.join(paths.src, paths.tscripts),
                        compileOnSave ? null : gulp.series('build.scripts'));
  var assetWatcher = gulp.watch(path.join(paths.src, paths.assets),
                        gulp.series('build.assets'));

  var onChange = (p, s) => gutil.log('[Changed]', gutil.colors.grey(p));
  var onUnlink = (p) => gutil.log('[Unlinked]', gutil.colors.grey(p));

  scriptWatcher.on('change', onChange);
  scriptWatcher.on('unlink', onUnlink);
  assetWatcher.on('change', onChange);
  assetWatcher.on('unlink', onUnlink);
})

// Start incremental build, and browser sync.
gulp.task('start',
  gulp.series('build',
    gulp.parallel('watch', 'bs')
));
