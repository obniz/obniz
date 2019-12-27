"use strict";
module.exports = function (source) {
    this.cacheable && this.cacheable();
    try {
        let src = JSON.parse(source);
        let output = {};
        for (let key of Object.keys(src)) {
            if (key.startsWith('_')) {
                continue;
            }
            output[key] = src[key];
        }
        return JSON.stringify(output, undefined, '\t');
    }
    catch (err) {
        this.emitError(err);
        return null;
    }
};
