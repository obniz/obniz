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
        super(4, "I2C error.");
    }
}
exports.ObnizI2cWarning = ObnizI2cWarning;
class ObnizBleUnknownPeripheralError extends ObnizError {
    constructor(peripheralUuid) {
        super(5, "unknown peripheral :" + peripheralUuid);
        this.peripheralUuid = peripheralUuid;
    }
}
exports.ObnizBleUnknownPeripheralError = ObnizBleUnknownPeripheralError;
class ObnizBleUnknownCharacteristicError extends ObnizError {
    constructor(peripheralUuid, serviceUuid, characteristicUuid) {
        super(5, "unknown characteristic.  peripheral :" +
            peripheralUuid +
            " service :" +
            serviceUuid +
            " characteristic :" +
            characteristicUuid);
        this.peripheralUuid = peripheralUuid;
        this.serviceUuid = serviceUuid;
        this.characteristicUuid = characteristicUuid;
    }
}
exports.ObnizBleUnknownCharacteristicError = ObnizBleUnknownCharacteristicError;
class ObnizBleOpError extends ObnizError {
    constructor() {
        super(5, "BLE operation error");
    }
}
exports.ObnizBleOpError = ObnizBleOpError;

//# sourceMappingURL=ObnizError.js.map
