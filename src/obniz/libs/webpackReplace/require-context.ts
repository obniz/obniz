/**
 * @packageDocumentation
 * @ignore
 */
let baseDir: any;
import fs = require("fs");
import yaml = require("js-yaml");
import nodeDir = require("node-dir");
import path = require("path");

export default (directory: string, recursive: boolean, regExp: RegExp): any => {
  // Assume absolute path by default
  let basepath: any = directory;

  if (directory[0] === ".") {
    // Relative path
    let dir: any = __dirname;
    if (baseDir) {
      dir = baseDir;
    }
    basepath = path.join(dir, directory);
  } else if (!path.isAbsolute(directory)) {
    // Module path
    basepath = require.resolve(directory);
  }

  const keys: any = (nodeDir as any)
    .files(basepath, {
      sync: true,
      recursive: recursive || false,
    })
    .filter((file: string) => {
      return file.match(regExp || /\.(json|js)$/);
    })
    .map((file: string) => {
      return path.join(".", file.slice(basepath.length + 1));
    });

  const context: any = (key: string) => {
    const modulePath: any = context.resolve(key);
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

export let setBaseDir = (base: string) => {
  baseDir = base;
};
