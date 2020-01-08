let baseDir: string;
import fs = require("fs");
import yaml = require("js-yaml");

module.exports =  (directory: string, recursive: boolean, regExp: RegExp): any => {
  const nodeDir = require("node-dir");
  const path = require("path");

  // Assume absolute path by default
  let basepath = directory;

  if (directory[0] === ".") {
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

  const keys = nodeDir
    .files(basepath, {
      sync: true,
      recursive: recursive || false,
    })
    .filter( (file: string) => {
      return file.match(regExp || /\.(json|js)$/);
    })
    .map( (file: string ) => {
      return path.join(".", file.slice(basepath.length + 1));
    });

  const context =  (key: string) => {
    const modulePath = context.resolve(key);
    if (/\.(json|js)$/.test(modulePath)) {
      return require(modulePath);
    } else if (/\.(yaml|yml)$/.test(modulePath)) {
      return yaml.safeLoad(fs.readFileSync(modulePath, "utf8"));
    } else {
      throw new Error("unknown type");
    }
  };

  context.resolve = (key: string) => {
    return path.join(basepath, key);
  };

  context.keys = () => {
    return keys;
  };

  return context;
};

module.exports.setBaseDir = (base: string) => {
  baseDir = base;
};
