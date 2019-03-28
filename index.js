const node_version = process.versions.node;
const major = parseInt(node_version.split('.')[0]);
const minor = parseInt(node_version.split('.')[1]);

if (major > 7 || (major === 7 && minor >= 6)) {
  // async await avaiable
  module.exports = require('./obniz/index.js');
} else {
  // none
  throw new Error("package 'obniz' want nodejs version > 7.6.X required");
}
