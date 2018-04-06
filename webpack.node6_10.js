// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
// const base = require("./webpack.config.js");
//
// const config =  JSON.parse(JSON.stringify(base));
// config.stats.warningsFilter = base.stats.warningsFilter;
//
//     config.output.filename = 'obniz.node6_101.js';
// delete config.output.library;
//
// config.module = config.module || {};
// config.module.rules = config.module.rules || [];
//
// config.module.rules.push({
//   test: /\.js$/,
//       // exclude: /(node_modules|bower_components)/,
//       use: {
//     loader: 'babel-loader',
//         options: {
//       "presets": [
//         ["env", {"targets": {"node": "6.10"}}]
//       ]
//     }
//   }
// });
//
//
// module.exports = config;
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  target : "node",
  // エントリーポイントの設定
  entry: './obniz/index.js',
  // entry: './test.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'obniz.node6_10.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname),

    library: 'Obniz',
    libraryTarget: "umd"
  },
  devtool: "none",
  module: {
    rules: [{
      test: /\.(yml|yaml)$/,
      use: [
        {
          loader: require.resolve('json-loader')
        },
        {
          loader: require.resolve('yaml-loader')
        }
      ]
    },{
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
    }]
  },
  externals: [nodeExternals()],
  stats:{
    warningsFilter:[ /(?!require function is used in a way in which dependencies cannot be statically extracted)/]
  },
};