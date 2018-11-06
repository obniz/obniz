let path = require('path');
let ejs = require('ejs');
let expect = require('chai').expect;

global.appRoot = path.resolve(__dirname + '/../') + '/';

const obnizJsonValidator = require('./obnizJsonValidator');

process.on('exit', () => {
  console.warn(obnizJsonValidator.checkResults('json', 'obniz.js <=> json '));
  console.warn(obnizJsonValidator.checkResults('wscommand', 'json <=> binary'));
});

describe('all', function() {
  require('mocha-directory')();

  let testUtil = require(global.appRoot + '/test/testUtil.js');
  let _ = require('underscore');
  let fs = require('fs');

  let exclude = [
    //  path.resolve(__dirname, './index.js'),
  ];

  let recursiveTestImport = function(root_directory) {
    let file_list = fs.readdirSync(root_directory);

    //build
    _.chain(file_list)
      .filter(function(file) {
        return !file.match(/^\..*/);
      })
      .filter(function(file) {
        return file.match(/.*\.js$/);
      })
      .filter(function(file) {
        return !file.match(/.*_ejs\.html$/);
      })
      .map(function(file) {
        return path.resolve(root_directory, file);
      })
      .filter(function(file) {
        return fs.lstatSync(file).isFile();
      })
      .filter(function(file) {
        return !exclude.includes(file);
      })
      .each(function(file) {
        let src = fs.readFileSync(file, 'utf8');
        let describeIndex = src.search('describe');
        let noTestIndex = src.search('no_html_test_build');
        if (describeIndex < 0) return;
        if (noTestIndex >= 0) return;
        let template = fs.readFileSync(
          global.appRoot + '/test/testTemplate.ejs',
          'utf8'
        );
        let param = {
          appRoot: global.appRoot,
          describe: src.substring(describeIndex),
        };

        let html = ejs.render(template, param);

        let newFilename = file.replace('.js', '') + '.html';

        fs.writeFileSync(newFilename, html);
      });

    //refresh
    file_list = fs.readdirSync(root_directory);

    // Run files
    _.chain(file_list)
      .filter(function(file) {
        return !file.match(/^\..*/);
      })
      .filter(function(file) {
        return file.match(/.*\.html$/);
      })
      .filter(function(file) {
        return !file.match(/.*_ejs\.html$/);
      })
      .map(function(file) {
        return path.resolve(root_directory, file);
      })
      .filter(function(file) {
        return fs.lstatSync(file).isFile();
      })
      .filter(function(file) {
        return !exclude.includes(file);
      })
      .each(function(file) {
        let basename = path.basename(file, '.html');
        let relativePath = path.relative(__dirname, file);

        describe(basename, function() {
          this.timeout(60000);
          it('runs ' + relativePath, () => {
            return testUtil.browser(file).then(results => {
              expect(results.passes).to.be.at.least(1);
              expect(results.failures).to.equal(0);
            });
          });
        });
      });

    // Recurse on directories
    _.chain(file_list)
      .filter(function(file) {
        let file_path = path.resolve(root_directory, file);
        return fs.lstatSync(file_path).isDirectory();
      })
      .each(function(file) {
        let file_path = path.resolve(root_directory, file);
        describe(file, function() {
          recursiveTestImport(file_path);
        });
      });
  };

  if (testUtil.needBrowserTest()) {
    describe('browser', () => {
      recursiveTestImport(__dirname);
    });
  }
});
