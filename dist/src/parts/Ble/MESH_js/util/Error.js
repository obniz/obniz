"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MESHJsError extends Error {
    constructor(code, e) {
        super(e);
        this.code = code;
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.MESHJsError = MESHJsError;
class MESHJsBlockVersionError extends MESHJsError {
    constructor(major, minor, release) {
        super(1, 'please UPDATE block version to 1.2.5 more. (current block version ' +
            major +
            '.' +
            minor +
            '.' +
            release +
            ')');
        this.major = major;
    }
}
exports.MESHJsBlockVersionError = MESHJsBlockVersionError;
class MESHJsOutOfRangeError extends MESHJsError {
    constructor(property, min, max) {
        super(2, property +
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
exports.MESHJsOutOfRangeError = MESHJsOutOfRangeError;
class MESHJsInvalidValueError extends MESHJsError {
    constructor(property) {
        super(3, property + ' is invalid value.');
        this.property = property;
    }
}
exports.MESHJsInvalidValueError = MESHJsInvalidValueError;
class MESHJsTimeOutError extends MESHJsError {
    constructor(property) {
        super(4, property + ' is time out.');
        this.property = property;
    }
}
exports.MESHJsTimeOutError = MESHJsTimeOutError;
