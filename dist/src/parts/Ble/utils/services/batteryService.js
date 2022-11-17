"use strict";
/**
 * @packageDocumentation
 * @module Parts.utils.services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleBatteryService = void 0;
class BleBatteryService {
    constructor(service) {
        this._service = service;
    }
    async getBatteryLevelWait() {
        const char = this._service.getCharacteristic('2A19');
        if (!char) {
            return null;
        }
        return await char.readNumberWait();
    }
    getBatteryLevel() {
        return this.getBatteryLevelWait();
    }
}
exports.BleBatteryService = BleBatteryService;
