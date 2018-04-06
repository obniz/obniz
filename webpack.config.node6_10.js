// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
const config = require("./webpack.config");


config.output.filename = 'obniz.node6_10.js';
delete config.output.library;

config.module = config.module || {};
config.module.rules = config.module.rules || [];

config.module.rules.push({
  test: /\.js$/,
  // exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      "presets": [
        ["env", {"targets": {"node": "6.10"}}]
      ]
    }
  }
})


module.exports = config;