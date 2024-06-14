"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBaseDir = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
let baseDir;
const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");
const readdirRecursively = (dir, files = [], recursive = true) => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const dirs = [];
    for (const dirent of dirents) {
        if (dirent.isDirectory())
            dirs.push(`${dir}/${dirent.name}`);
        if (dirent.isFile())
            files.push(`${dir}/${dirent.name}`);
    }
    if (recursive) {
        for (const d of dirs) {
            files = readdirRecursively(d, files);
        }
    }
    return files;
};
exports.default = (directory, recursive, regExp) => {
    // Assume absolute path by default
    let basepath = directory;
    if (directory[0] === '.') {
        // Relative path
        let dir = __dirname;
        if (baseDir) {
            dir = baseDir;
        }
        basepath = path.join(dir, directory);
    }
    else if (!path.isAbsolute(directory)) {
        // Module path
        basepath = require.resolve(directory);
    }
    const keys = readdirRecursively(basepath, [], recursive)
        .filter((file) => {
        return file.match(regExp || /\.(json|js)$/);
    })
        .map((file) => {
        return path.join('.', file.slice(basepath.length + 1));
    });
    const context = (key) => {
        const modulePath = context.resolve(key);
        if (/\.(json|js)$/.test(modulePath)) {
            return require(modulePath);
        }
        else if (/\.(yaml|yml)$/.test(modulePath)) {
            return yaml.safeLoad(fs.readFileSync(modulePath, 'utf8'));
        }
        else {
            throw new Error('unknown type');
        }
    };
    context.resolve = (key) => {
        return path.join(basepath, key);
    };
    context.keys = () => {
        return keys;
    };
    return context;
};
const setBaseDir = (base) => {
    baseDir = base;
};
exports.setBaseDir = setBaseDir;
