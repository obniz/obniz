// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: './obniz/index.js',
  // entry: './test.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'obniz.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname),

    library: 'Obniz',
  },
  devtool: "none",
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        sourceMap: true,
      })
    ]
  },
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
    }]
  }
};