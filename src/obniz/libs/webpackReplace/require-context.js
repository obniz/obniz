let baseDir = undefined;
let yaml = require('js-yaml');
let fs = require('fs');

module.exports = function(directory, recursive, regExp) {
  let dir = require('node-dir');
  let path = require('path');

  // Assume absolute path by default
  let basepath = directory;

  if (directory[0] === '.') {
    // Relative path
    let dir = __dirname;
    if (baseDir) {
      dir = baseDir;
    }
    basepath = path.join(dir, directory);
  } else if (!path.isAbsolute(directory)) {
    // Module path
    basepath = require.resolve(directory);
  }

  let keys = dir
    .files(basepath, {
      sync: true,
      recursive: recursive || false,
    })
    .filter(function(file) {
      return file.match(regExp || /\.(json|js)$/);
    })
    .map(function(file) {
      return path.join('.', file.slice(basepath.length + 1));
    });

  let context = function(key) {
    let path = context.resolve(key);
    if (/\.(json|js)$/.test(path)) {
      return require(path);
    } else if (/\.(yaml|yml)$/.test(path)) {
      return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    } else {
      throw new Error('unknown type');
    }
  };

  context.resolve = function(key) {
    return path.join(basepath, key);
  };

  context.keys = function() {
    return keys;
  };

  return context;
};

module.exports.setBaseDir = function(base) {
  baseDir = base;
};
