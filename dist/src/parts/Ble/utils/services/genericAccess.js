"use strict";
/**
 * @packageDocumentation
 * @module Parts.utils.services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleGenericAccess = void 0;
class BleGenericAccess {
    constructor(service) {
        this._service = service;
    }
    async getDeviceNameWait() {
        const char = this._service.getCharacteristic('2A00');
        if (!char) {
            return null;
        }
        return await char.readTextWait();
    }
}
exports.BleGenericAccess = BleGenericAccess;
