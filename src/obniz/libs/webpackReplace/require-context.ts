/**
 * @packageDocumentation
 * @ignore
 */
let baseDir: any;
import fs = require('fs');
import yaml = require('js-yaml');
import path = require('path');

const readdirRecursively = (
  dir: string,
  files: string[] = [],
  recursive = true
) => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = [];
  for (const dirent of dirents) {
    if (dirent.isDirectory()) dirs.push(`${dir}/${dirent.name}`);
    if (dirent.isFile()) files.push(`${dir}/${dirent.name}`);
  }
  if (recursive) {
    for (const d of dirs) {
      files = readdirRecursively(d, files);
    }
  }
  return files;
};

export default (directory: string, recursive: boolean, regExp: RegExp) => {
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

  const keys = readdirRecursively(basepath, [], recursive)
    .filter((file: string) => {
      return file.match(regExp || /\.(json|js)$/);
    })
    .map((file: string) => {
      return path.join('.', file.slice(basepath.length + 1));
    });

  const context: any = (key: string) => {
    const modulePath: any = context.resolve(key);
    if (/\.(json|js)$/.test(modulePath)) {
      return require(modulePath);
    } else if (/\.(yaml|yml)$/.test(modulePath)) {
      return yaml.safeLoad(fs.readFileSync(modulePath, 'utf8'));
    } else {
      throw new Error('unknown type');
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

export const setBaseDir = (base: string) => {
  baseDir = base;
};
