## Build
index.js is what we called obniz.js.
It is build result.
index.js is made from two js files
```
  obniz/index.js  
  parts/*/index.js  
```
To update, you should edit these js files. Not index.js on root directory.
You can build index.js by using _tools/server.js.

## Development
Clone this and use this from your HTML.
After cloning. You are able to launch local server

```shell
 cd ./
 node _tools/server.js
```
Then, http://localhost:3100/obniz.js is accessible.
In obniz.io program page. add ```&obnizjs=local``` to queries.
It will load obniz js from http://localhost:3100/obniz.js

When you make something changed, server.js will generate index.js automatically.
