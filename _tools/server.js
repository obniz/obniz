const express = require('express')
const path = require('path')
const fs = require('fs')
const chokidar = require("chokidar");
const exec = require('child_process').exec;
const babel = require("babel-core");
const notifier = require('node-notifier');
const ncp = require('ncp').ncp;

var ejs = require('ejs');

const app = express()
const port = 3100

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})

app.get('/obniz.js', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.sendFile(path.join(__dirname, '../obniz.js'));
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})

const obnizPath = path.join(__dirname, '../obniz/');
const partsPath = path.join(__dirname, '../parts/');
const packageJsonPath = path.join(__dirname, '../package.json');
const watcher = chokidar.watch([obnizPath, partsPath, packageJsonPath],{
  ignored:/[\/\\]\./,
  persistent:true
});

watcher.on('ready',function(){
  console.log("ready watching file change");
  watcher.on('add',function(path){
      if (path.indexOf('.js') >= 0) {
        console.log(path + " added");
        build();
      }
  });
  watcher.on('change',function(path){
    if (path.indexOf('.js') >= 0 || path.indexOf('.json') >= 0) {
      console.log(path + " changed");
      build();
    }
  });
});

const readmeWatcher = chokidar.watch([partsPath],{
  ignored:/[\/\\]\./,
  persistent:true
});
readmeWatcher.on('ready',function(){
  console.log("ready watching README.ejs");
  watcher.on('add',function(path){
      if (path.indexOf('.ejs') >= 0) {
        console.log(path + " added");
        readmeBuild();
      }
  });
  readmeWatcher.on('change',function(path){
    if (path.indexOf('.ejs') >= 0 ) {
      console.log(path + " changed");
        readmeBuild();
    }
  });
});


var jsonSchemaPath = path.join(__dirname, '../../wsroom/json_schema/');
if(fs.existsSync(jsonSchemaPath)){

  var jsonSchemaWatcher = chokidar.watch([jsonSchemaPath],{
    ignored:/[\/\\]\./,
    persistent:true
  });
  
  jsonSchemaWatcher.on('ready',function(){
    jsonSchemaWatcher.on('change',function(path){
      if (path.indexOf('.yml') >= 0) {
        console.log(path + " changed");
        schemaCopy();
      }
    });
    jsonSchemaWatcher.on('add',function(path){
      if (path.indexOf('.yml') >= 0) {
        console.log(path + " added");
        schemaCopy();
      }
    });

  });
}

build();
readmeBuild();
schemaCopy();

function build() {

  let combined = "";

  var packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  combined += `var _obniz_js_version = "${packageJson.version}";\n`

  // obniz libs
  var obnizlibPath = path.join(__dirname, '../obniz/libs')
  var obnizlibs = fs.readdirSync(obnizlibPath);
  var libnames = [];
  for (var i=0; i<obnizlibs.length; i++) {
    const lib = obnizlibs[i];
    if (lib.indexOf('.js')>0) {
      libnames.push(lib);
    }
  }

  //parts
  var partsPath = path.join(__dirname, '../parts')


  // obniz
  combined += fs.readFileSync(path.join(__dirname, '../obniz/index.js'), 'utf8');

  // obniz libs
  for (var i=0; i<libnames.length; i++) {
    var string = fs.readFileSync(path.join(obnizlibPath, libnames[i]), 'utf8');
    combined += "\n" + string;
  }

  // parts
  folderExploer(partsPath, "index.js", function(filePath){
    var string = fs.readFileSync(filePath, 'utf8');
    combined += "\n" + string;
    
  });

  // flush
  fs.writeFileSync(path.join(__dirname, '../obniz.js'), combined);

   var babelOptions = {
      "presets": [
        ["env", { "targets": {"node": "6.10" }}]
      ]
    };
    var write = true;
    try{
      var results = babel.transform(combined, babelOptions);
    }catch(err){
      write = false;
      console.log("\007");
      console.error(err.stack);
      
      // Object
      notifier.notify({
        'title': 'ERROR',
        'message': 'obniz.js compile ERROR. See console.'
      });
    }
    if(write){
      console.log("obniz.js compile success");
    }
    fs.writeFileSync(path.join(__dirname, '../obniz.node6_10.js'), write ? results.code : "");
}

function readmeBuild(){
  var partsPath = path.join(__dirname, '../parts');
  
  folderExploer(partsPath, "README.ejs", function(filePath){
    ejs.renderFile(filePath, null, null, function(err, str){
      if(err){
        
        // Object
        notifier.notify({
          'title': 'ERROR',
          'message': filePath + ' compile ERROR. See console.'
        });
        console.log( filePath + ' compile ERROR.', err);
      }else{
        fs.writeFileSync(path.join(filePath, '../README.md'), str);
      }
    });
  });
  
}



function folderExploer(dirPath, targetFilename, callback) {

  var file_list = fs.readdirSync(dirPath);

  file_list
      .filter(function (file) {
        return !file.match(/^\..*/);
      })
      .filter(function (file) {
        return file === targetFilename;
      })
      .map(function (file) {
        return path.resolve(dirPath, file);
      })
      .forEach(function (filepath) {
        callback(filepath);
      });
      
  file_list
      .map(function (file) {
        return path.resolve(dirPath, file);
      })
      .filter(function (filepath) {
        return fs.lstatSync(filepath).isDirectory();
      })
      .forEach(function (filepath) {
        folderExploer(filepath, targetFilename, callback);
      });
          
}

function schemaCopy(){
  var dest = path.join(__dirname, '../test/json_schema/')
  ncp(jsonSchemaPath, dest, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('copy done!');
   });
}