const express = require('express');
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulp_ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const gulp_notify = require('gulp-notify');
const gulp_yaml = require('gulp-yaml');
const concatWith = require('./concatWith');
const gulp_sort = require('gulp-sort');
const docGenerator = require('./wsDocGenerator');

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
    response.sendFile(path.join(__dirname, '../obniz.js'));
  });

  app.listen(port, err => {
    if (err) {
      return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
  });
});

const obnizMain = path.join(__dirname, '../obniz/index.js');
const obnizPath = path.join(__dirname, '../obniz/**/*.js');
const partsPath = path.join(__dirname, '../parts/');
const packageJsonPath = path.join(__dirname, '../package.json');
const schemaSrcPath = path.join(__dirname, '../json_schema/**/*.yml');
const docPath = path.join(__dirname, '../doc');
const tv4Path = require.resolve('tv4', {
  path: path.resolve(__dirname, '../'),
});
if (!tv4Path) {
  throw new Error('tv4 not found.npm install please');
}

gulp.task('jsonSchemaDoc', function jsonSchemaForVar(callback) {
  const baseSchemaSrcPath = path.join(__dirname, '../json_schema/index.yml');

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
    'ble/central',
    'ble/peripheral',
    // 'ble/security',
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
    const srcPath = path.join(__dirname, '../json_schema/*/' + one + '/*.yml');

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

const webpackConfig = require('../webpack.config.js');
const webpackConfigProduction = require('../webpack.production.js');

gulp.task('obniz.js', [], function obnizJsBuild() {
  return gulp
    .src(obnizMain)
    .pipe(plumber({ errorHandler: reportError }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(rename('obniz.js'))
    .pipe(gulp.dest(path.join(__dirname, '../')))
    .on('end', function() {
      console.log('obniz.js compiled!');
    });
});

gulp.task('obniz.min.js', [], function obnizJsBuild() {
  return gulp
    .src(obnizMain)
    .pipe(plumber({ errorHandler: reportError }))
    .pipe(webpackStream(webpackConfigProduction, webpack))
    .pipe(rename('obniz.min.js'))
    .pipe(gulp.dest(path.join(__dirname, '../')))
    .on('end', function() {
      console.log('obniz.min.js compiled!');
    });
});

gulp.task('readMe', [], function readMeBuild() {
  return gulp
    .src(path.join(partsPath, '/**/README*.ejs'))
    .pipe(plumber({ errorHandler: reportError }))
    .pipe(gulp_ejs())
    .pipe(rename({ extname: '.md' }))
    .pipe(gulp.dest(partsPath))
    .on('end', function() {
      console.log('ejs compiled!');
    });
});

function reportError(error) {
  let lineNumber = error.lineNumber ? 'LINE ' + error.lineNumber + ' -- ' : '';

  gulp_notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: lineNumber + 'See console.',
    sound: 'Sosumi', // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

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
  gulp.watch([schemaSrcPath], ['jsonSchemaDoc']);
  gulp.watch(path.join(partsPath, '/**/README*.ejs'), ['readMe']);
  gulp.watch(
    [
      obnizPath,
      path.join(partsPath, '/**/*.js'),
      packageJsonPath,
      schemaSrcPath,
    ],
    ['obniz.js', 'obniz.min.js']
  );
});

gulp.task('build', ['jsonSchemaDoc', 'obniz.js', 'obniz.min.js', 'readMe']);
gulp.task('default', ['server', 'build', 'watch']);
