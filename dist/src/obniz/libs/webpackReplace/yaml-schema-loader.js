"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
const yaml = require("js-yaml");
exports.default = (source) => {
    // @ts-ignore
    const self = this;
    if (self.cacheable) {
        self.cacheable();
    }
    try {
        const src = yaml.safeLoad(source);
        const excludeKeys = ["example", "description"];
        const res = filter(src, excludeKeys);
        // console.log("src",src);
        // console.log("res",res);
        return JSON.stringify(res, undefined, "\t");
    }
    catch (err) {
        self.emitError(err);
        return null;
    }
};
function filter(target, excludeKeys) {
    if (typeof target !== "object") {
        return target;
    }
    if (target === null) {
        return target;
    }
    if (Array.isArray(target)) {
        const newArr = [];
        for (const key in target) {
            if (!excludeKeys.includes(key)) {
                newArr[key] = filter(target[key], excludeKeys);
            }
        }
        return target;
    }
    const newObj = {};
    for (const key in target) {
        if (!excludeKeys.includes(key)) {
            newObj[key] = filter(target[key], excludeKeys);
        }
    }
    return newObj;
}
