"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MeshJsError extends Error {
    constructor(code, e) {
        super(e);
        this.code = code;
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.MeshJsError = MeshJsError;
class MeshJsOutOfRangeError extends MeshJsError {
    constructor(property, min, max) {
        super(1, property +
            ' is out of range. ' +
            (min !== void 0 && max !== void 0
                ? property + ' must be ' + min + ' ~ ' + max + '.'
                : ''));
        this.property = property;
    }
}
exports.MeshJsOutOfRangeError = MeshJsOutOfRangeError;
class MeshJsInvalidValueError extends MeshJsError {
    constructor(property) {
        super(2, property + 'is invalid value.');
        this.property = property;
    }
}
exports.MeshJsInvalidValueError = MeshJsInvalidValueError;
