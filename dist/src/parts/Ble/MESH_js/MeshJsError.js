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
            property +
            ' must be ' +
            min +
            ' ~ ' +
            max +
            '.');
        this.property = property;
    }
}
exports.MeshJsOutOfRangeError = MeshJsOutOfRangeError;
class MeshJsInvalidValueError extends MeshJsError {
    constructor(property) {
        super(2, property + ' is invalid value.');
        this.property = property;
    }
}
exports.MeshJsInvalidValueError = MeshJsInvalidValueError;
class MeshJsTimeOutError extends MeshJsError {
    constructor(property) {
        super(3, property + ' is time out.');
        this.property = property;
    }
}
exports.MeshJsTimeOutError = MeshJsTimeOutError;
