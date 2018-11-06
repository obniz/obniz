const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './obniz/index.js',
  output: {
    filename: 'obniz.node6_10.js',
    path: path.join(__dirname),

    library: 'Obniz',
    libraryTarget: 'umd',
  },
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.(yml|yaml)$/,
        use: [
          {
            loader: require.resolve('json-loader'),
          },
          {
            // loader: require.resolve('yaml-loader')
            loader: require.resolve(
              './obniz/libs/webpackReplace/yaml-schema-loader'
            ),
          },
        ],
      },
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env', { targets: { node: '6.10' } }]],
          },
        },
      },
    ],
  },
  externals: [nodeExternals()],
  stats: {
    warningsFilter: [
      /(?!require function is used in a way in which dependencies cannot be statically extracted)/,
    ],
  },
};
