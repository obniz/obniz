const express = require('express')
const path = require('path')
const fs = require('fs')
const chokidar = require("chokidar");
var exec = require('child_process').exec;
var babel = require("babel-core");
const notifier = require('node-notifier');


const app = express()
const port = 3100

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})

app.get('/obniz.js', (request, response) => {
  build();
  response.header('Access-Control-Allow-Origin', '*');
  response.sendFile(path.join(__dirname, '../index.js'));
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

var watcher = chokidar.watch(['../obniz/', '../parts/'],{
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
    if (path.indexOf('.js') >= 0) {
      console.log(path + " changed");
      build();
    }
  });
});

build();

function build() {

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
  var parts = fs.readdirSync(partsPath);
  var names = [];
  for (var i=0; i<parts.length; i++) {
    const partsName = parts[i];
    if (fs.existsSync(path.join(partsPath, partsName, 'index.js'))) {
      names.push(partsName);
    }
  }

  // obniz
  var combined = fs.readFileSync(path.join(__dirname, '../obniz/index.js'), 'utf8');

  // parts
  for (var i=0; i<libnames.length; i++) {
    var string = fs.readFileSync(path.join(obnizlibPath, libnames[i]), 'utf8');
    combined += "\n" + string;
  }

  // parts
  for (var i=0; i<names.length; i++) {
    var string = fs.readFileSync(path.join(partsPath, names[i], '/index.js'), 'utf8');
    combined += "\n" + string;
  }
  fs.writeFileSync(path.join(__dirname, '../index.js'), combined);
  
  
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
    fs.writeFileSync(path.join(__dirname, '../index-for-node6.10.js'), write ? results.code : "");
   
}