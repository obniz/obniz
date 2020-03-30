"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizError extends Error {
    constructor(code, e) {
        super(e);
        this.code = code;
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype); // for ES3, ES5
    }
}
exports.ObnizError = ObnizError;
class ObnizOfflineError extends ObnizError {
    constructor() {
        super(1, "obniz is not online.");
    }
}
exports.ObnizOfflineError = ObnizOfflineError;
class ObnizTimeoutError extends ObnizError {
    constructor() {
        super(2, "Receive data timeout.");
    }
}
exports.ObnizTimeoutError = ObnizTimeoutError;
class ObnizI2cError extends ObnizError {
    constructor() {
        super(3, "I2C error.");
    }
}
exports.ObnizI2cError = ObnizI2cError;
class ObnizI2cWarning extends ObnizError {
    constructor() {
        super(3, "I2C error.");
    }
}
exports.ObnizI2cWarning = ObnizI2cWarning;

//# sourceMappingURL=ObnizError.js.map
