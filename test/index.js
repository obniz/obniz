
var path = require('path');
var expect = require('chai').expect;

global.appRoot = path.resolve(__dirname + "/../") + "/";

//先にjsファイルでテストをする
require('mocha-directory')();


//htmlファイルのテスト
var util = require("./testUtil.js");
var  _ = require( 'underscore' );
var  fs = require( 'fs' );




var exclude = [
//  path.resolve(__dirname, './obniz/index.html'),
];

var recursiveTestImport = function (root_directory) {
  var file_list = fs.readdirSync(root_directory);

  // Run files
  _
      .chain(file_list)
      .filter(function (file) {
        return !file.match(/^\..*/);
      })
      .filter(function (file) {
        return file.match(/.*\.html$/);
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
        
        describe(basename, () => {
          it('runs ' + relativePath, () => {
//            return util.browser(file).then(({passes, failures}) => {
//              expect(failures).to.equal(1);
//            });
          });
        });

      });

  // Recurse on directories
  _
      .chain(file_list)
      .filter(function (file) {
        var file_path = path.resolve(root_directory, file);
        return fs.lstatSync(file_path).isDirectory()
      })
      .each(function (file) {
        var file_path = path.resolve(root_directory, file);
        describe(file, function () {
          recursiveTestImport(file_path);
        })
      });
};

describe('browser', ()=>{
  var wait = function(){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,500);
    });
  };
  
  (async function () {
    await wait();
  })();
  recursiveTestImport(__dirname);
});