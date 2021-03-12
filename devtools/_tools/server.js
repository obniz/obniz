const express = require('express');
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulp_ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const gulp_yaml = require('gulp-yaml');
const concatWith = require('./concatWith');
const gulp_sort = require('gulp-sort');
const docGenerator = require('./wsDocGenerator');
const ts = require('gulp-typescript');

const app = express();
const port = 3100;

gulp.task('server', function jsonSchemaForVar() {
  app.get('/', (request, response) => {
    response.send('Hello from Express!');
  });

  app.get('/obniz.js', (request, response) => {
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Expires', '0');
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Access-Control-Allow-Origin', '*');
    response.sendFile(path.join(__dirname, '../../obniz.js'));
  });

  app.listen(port, err => {
    if (err) {
      return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
  });
});

const obnizMain = path.join(__dirname, '../../dist/src/obniz/index.js');
const obnizPath = path.join(__dirname, '../../dist/src/obniz/**/*.js');
const partsPath = path.join(__dirname, '../../dist/src/parts/');
const packageJsonPath = path.join(__dirname, '../../package.json');
const schemaSrcPath = path.join(
  __dirname,
  '../../dist/src/json_schema/**/*.yml'
);
const tsConfigPath = path.join(__dirname, '../../tsconfig.json');
const docPath = path.join(__dirname, '../../docs');
const tv4Path = require.resolve('tv4', {
  path: path.resolve(__dirname, '../../src/'),
});
if (!tv4Path) {
  throw new Error('tv4 not found.npm install please');
}

const tsProject = ts.createProject(tsConfigPath);

gulp.task('jsonSchemaDoc', function jsonSchemaForVar(callback) {
  const baseSchemaSrcPath = path.join(
    __dirname,
    '../../src/json_schema/index.yml'
  );

  let list = [
    'ws',
    'system',
    'io',
    'ioAnimation',
    'ad',
    'pwm',
    'uart',
    'spi',
    'i2c',
    'logicAnalyzer',
    'measure',
    'display',
    'switch',
    'ble/hci',
    'tcp',
    'wifi',
    'plugin',
    'message',
    'debug',
  ];

  let wait_max = list.length * 2;
  let wait_count = 0;

  function onEnd(one) {
    wait_count++;

    console.log(`jsonSchemaDoc compiled! ${wait_count}/${wait_max}  : ${one} `);

    if (wait_max === wait_count) {
      callback();
    }
  }

  for (let one of list) {
    const srcPath = path.join(
      __dirname,
      '../../src/json_schema/*/' + one + '/*.yml'
    );

    gulp
      .src([srcPath, baseSchemaSrcPath])
      .pipe(plumber({ errorHandler: reportError }))
      .pipe(gulp_sort())
      .pipe(gulp_yaml({ safe: true }))
      .pipe(
        concatWith('schema.js', {
          header: 'let wsSchema = [',
          separator: ',',
          footer: '];',
        })
      )
      .pipe(
        docGenerator(path.resolve(__dirname, 'doctemplate/doc-one.ejs'), one)
      )
      .pipe(rename('websocket/' + one.replace('/', '_') + '.md'))
      .pipe(gulp.dest(docPath))
      .on('end', function() {
        onEnd(one);
      });

    gulp
      .src([srcPath, baseSchemaSrcPath])
      .pipe(plumber({ errorHandler: reportError }))
      .pipe(gulp_sort())
      .pipe(gulp_yaml({ safe: true }))
      .pipe(
        concatWith('schema.js', {
          header: 'let wsSchema = [',
          separator: ',',
          footer: '];',
        })
      )
      .pipe(
        docGenerator(path.resolve(__dirname, 'doctemplate/doc-one.ejs'), one)
      )
      .pipe(rename('websocket/' + one.replace('/', '_') + '-ja.md'))
      .pipe(gulp.dest(docPath))
      .on('end', function() {
        onEnd(one + '-ja');
      });
  }
});

gulp.task('tsc:copy:statics', function(done) {
  return gulp
    .src([
      path.join(__dirname, '../../src/**/*.yml'),
      path.join(__dirname, '../../src/**/*.json'),
      path.join(__dirname, '../../src/**/*.css'),
    ])
    .pipe(gulp.dest(path.join(__dirname, '../../dist/src')))
    .on('end', function() {
      console.log('static file copy compiled!');
      done();
    });
});

gulp.task('tsc:copy:package.json', function(done) {
  return gulp
    .src([path.join(__dirname, '../../package.json')])
    .pipe(
      concatWith('package.js', {
        header: 'module.exports = ',
        footer: ';',
      })
    )
    .pipe(gulp.dest(path.join(__dirname, '../../dist')))
    .on('end', function() {
      console.log('static file copy compiled!');
      done();
    });
});
gulp.task(
  'tsc:copy',
  gulp.parallel('tsc:copy:statics', 'tsc:copy:package.json')
);

gulp.task('tsc:compile', function(done) {
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist'))
    .on('end', function() {
      console.log('tsc compiled!');
      done();
    });
});

gulp.task('tsc', gulp.parallel('tsc:compile', 'tsc:copy'));

gulp.task('obniz.js', function obnizJsBuild(done) {
  const webpackConfig = require('../webpack.config.js');
  return gulp
    .src(obnizMain)
    .pipe(plumber({ errorHandler: reportError }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(rename('obniz.js'))
    .pipe(gulp.dest(path.join(__dirname, '../../')))
    .on('end', function() {
      console.log('obniz.js compiled!');
      done();
    });
});

// gulp.task('obniz.min.js', function obnizJsBuild(done) {
//   const webpackConfigProduction = require('../webpack.production.js');
//   return gulp
//     .src(obnizMain)
//     .pipe(plumber({ errorHandler: reportError }))
//     .pipe(webpackStream(webpackConfigProduction, webpack))
//     .pipe(rename('obniz.min.js'))
//     .pipe(gulp.dest(path.join(__dirname, '../../')))
//     .on('end', function() {
//       console.log('obniz.min.js compiled!');
//       done();
//     });
// });

gulp.task('readMe', function readMeBuild(done) {
  return gulp
    .src(path.join(partsPath, '/**/README*.ejs'))
    .pipe(plumber({ errorHandler: reportError }))
    .pipe(gulp_ejs())
    .pipe(rename({ extname: '.md' }))
    .pipe(gulp.dest(partsPath))
    .on('end', function() {
      console.log('ejs compiled!');
      done();
    });
});

function reportError(error) {
  let report = '';
  report += 'TASK:' + ' [' + error.plugin + ']\n';
  report += 'MESSAGE:' + ' ' + error.message + '\n';
  if (error.fileName) {
    report += 'FILE:' + ' ' + error.fileName + '\n';
  }
  if (error.lineNumber) {
    report += 'LINE:' + ' ' + error.lineNumber + '\n';
  }
  console.error(report);
}

gulp.task('watch', () => {
  gulp.watch([schemaSrcPath], gulp.task('jsonSchemaDoc'));
  gulp.watch(path.join(partsPath, '/**/README*.ejs'), gulp.task('readMe'));
  gulp.watch(
    [
      obnizPath,
      path.join(partsPath, '/**/*.js'),
      packageJsonPath,
      schemaSrcPath,
    ],
    gulp.parallel('obniz.js')
  );
});

gulp.task(
  'build',
  gulp.series('tsc', gulp.parallel('jsonSchemaDoc', 'obniz.js', 'readMe'))
);
gulp.task('default', gulp.parallel('server', 'build', 'watch'));
