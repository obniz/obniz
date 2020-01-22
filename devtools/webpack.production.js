const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, '../dist/src/obniz/index.js'),
  output: {
    filename: 'obniz.js',
    path: path.join(__dirname, '../'),

    library: 'Obniz',
  },
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
              '../dist/src/obniz/libs/webpackReplace/yaml-schema-loader'
            ),
          },
        ],
      },
      {
        test: /package.json$/,
        use: [
          {
            loader: require.resolve(
              '../dist/src/obniz/libs/webpackReplace/packagejson-loader'
            ),
          },
        ],
      },
    ],
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        include: ['devDependencies'],
      },
    }),
  ],
  stats: {
    warningsFilter: [
      /(?!require function is used in a way in which dependencies cannot be statically extracted)/,
    ],
  },
};
