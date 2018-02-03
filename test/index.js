
var path = require('path');
var ejs = require('ejs');
var expect = require('chai').expect;

global.appRoot = path.resolve(__dirname + "/../") + "/";

//先にjsファイルでテストをする
require('mocha-directory')();


//htmlファイルのテスト
var testUtil = require(global.appRoot + "/test/testUtil.js");
var  _ = require( 'underscore' );
var  fs = require( 'fs' );
var semver = require('semver');




var exclude = [
//  path.resolve(__dirname, './index.js'),
];

var recursiveTestImport = function (root_directory) {
  var file_list = fs.readdirSync(root_directory);

  //build
  _
      .chain(file_list)
      .filter(function (file) {
        return !file.match(/^\..*/);
      })
      .filter(function (file) {
        return file.match(/.*\.js$/);
      })
      .filter(function (file) {
        return !file.match(/.*_ejs\.html$/);
      })
      .map(function (file) {
        return path.resolve(root_directory, file);
      })
      .filter(function (file) {
        return fs.lstatSync(file).isFile();
      })
      .filter(function (file) {
        return !exclude.includes(file);
      }).each(function (file) {
        var src = fs.readFileSync(file,'utf8');
        var describeIndex = src.search('describe');
        var noTestIndex = src.search('no_html_test_build');
        if(describeIndex < 0) return;
        if(noTestIndex >= 0) return;
        var template = fs.readFileSync(global.appRoot + "/test/testTemplate.ejs",'utf8');
        var param = {appRoot : global.appRoot, describe : src.substring(describeIndex)};
        
        html = ejs.render(template, param);
        
        var newFilename = file.replace(".js","") + ".html";

        fs.writeFileSync(newFilename, html);
       });
  
//refresh
  file_list = fs.readdirSync(root_directory);

  // Run files
  _
      .chain(file_list)
      .filter(function (file) {
        return !file.match(/^\..*/);
      })
      .filter(function (file) {
        return file.match(/.*\.html$/);
      })
      .filter(function (file) {
        return !file.match(/.*_ejs\.html$/);
      })
      .map(function (file) {
        return path.resolve(root_directory, file);
      })
      .filter(function (file) {
        return fs.lstatSync(file).isFile()
      })
      .filter(function (file) {
        return !exclude.includes(file);
      })
      .each(function (file) {
        var basename = path.basename(file, '.html');
        var relativePath = path.relative(__dirname, file);
        
        describe(basename, function() {
          this.timeout(60000); //browserは多めに取る
          it('runs ' + relativePath, () => {
            return testUtil.browser(file).then((results) => {
              expect(results.passes).to.be.above(1);
              expect(results.failures).to.equal(0);
            });
          });
        });

      });

  // Recurse on directories
  _
      .chain(file_list)
      .filter(function (file) {
        var file_path = path.resolve(root_directory, file);
        return fs.lstatSync(file_path).isDirectory();
      })
      .each(function (file) {
        var file_path = path.resolve(root_directory, file);
        describe(file, function () {
          recursiveTestImport(file_path);
        });
      });
};


if (testUtil.needBrowserTest()) {

  describe('browser', ()=>{
//    var wait = function(){
//      return new Promise(function(resolve,reject){
//          setTimeout(resolve,500);
//      });
//    };
//
//    (async function () {
//      await wait();
//    })();
    recursiveTestImport(__dirname);
  });
}