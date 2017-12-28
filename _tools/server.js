const express = require('express')
const path = require('path')
const fs = require('fs')
const chokidar = require("chokidar");
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
  var partsPath = path.join(__dirname, '../parts')
  var parts = fs.readdirSync(partsPath);
  var names = [];
  for (var i=0; i<parts.length; i++) {
    const partsName = parts[i];
    if (fs.existsSync(path.join(partsPath, partsName, 'index.js'))) {
      names.push(partsName);
    }
  }

  var combined = fs.readFileSync(path.join(__dirname, '../obniz/index.js'), 'utf8');
  for (var i=0; i<names.length; i++) {
    var anParts = fs.readFileSync(path.join(__dirname, '../parts/', names[i], '/index.js'), 'utf8');
    combined += "\n" + anParts;
  }
  fs.writeFileSync(path.join(__dirname, '../index.js'), combined);
}