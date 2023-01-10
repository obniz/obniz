"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
const js_yaml_1 = __importDefault(require("js-yaml"));
exports.default = (source) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
    if (self.cacheable) {
        self.cacheable();
    }
    try {
        const src = js_yaml_1.default.safeLoad(source);
        const excludeKeys = ['example', 'description'];
        const res = filter(src, excludeKeys);
        // console.log("src",src);
        // console.log("res",res);
        return JSON.stringify(res, undefined, '\t');
    }
    catch (err) {
        self.emitError(err);
        return null;
    }
};
const filter = (target, excludeKeys) => {
    if (typeof target !== 'object') {
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
};
