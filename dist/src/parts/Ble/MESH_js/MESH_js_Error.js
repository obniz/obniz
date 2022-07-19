"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MESH_js_Error extends Error {
    constructor(code, e) {
        super(e);
        this.code = code;
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.MESH_js_Error = MESH_js_Error;
class MESHOutOfRangeError extends MESH_js_Error {
    constructor(property, min, max) {
        super(1, property +
            ' is out of range. ' +
            (min !== void 0 && max !== void 0
                ? property + ' must be ' + min + ' ~ ' + max + '.'
                : ''));
        this.property = property;
    }
}
exports.MESHOutOfRangeError = MESHOutOfRangeError;
