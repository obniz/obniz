"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
function default_1(source) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
    if (self.cacheable) {
        self.cacheable();
    }
    try {
        const src = JSON.parse(source);
        const output = {};
        for (const key of Object.keys(src)) {
            if (key.startsWith('_')) {
                continue;
            }
            output[key] = src[key];
        }
        return JSON.stringify(output, undefined, '\t');
    }
    catch (err) {
        self.emitError(err);
        return null;
    }
}
exports.default = default_1;
