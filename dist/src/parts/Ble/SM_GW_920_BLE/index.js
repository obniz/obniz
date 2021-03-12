"use strict";
/**
 * @packageDocumentation
 * @module Parts.SM_GW_920_BLE
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SM_GW_920_BLE {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "SM_GW_920_BLE",
        };
    }
    static isDevice(peripheral) {
        if (this.deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < this.deviceAdv.length; index++) {
            if (this.deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === this.deviceAdv[index]) {
                continue;
            }
            return false;
        }
        return (peripheral.adv_data[18] === 0xff &&
            peripheral.adv_data[19] === 0xff &&
            peripheral.adv_data[20] === 0xff &&
            peripheral.adv_data[21] === 0xff &&
            peripheral.adv_data[22] === 0xff &&
            peripheral.adv_data[23] === 0xff &&
            peripheral.adv_data[24] === 0xff &&
            peripheral.adv_data[25] === 0xff);
    }
    static getData(peripheral) {
        if (!this.isDevice(peripheral)) {
            return null;
        }
        const deviceTypeList = {
            0x03: "leakage",
            0x04: "gateway",
        };
        const deviceType = deviceTypeList[peripheral.adv_data[7]] || "unknown";
        const deviceId = (peripheral.adv_data[11] << 24) +
            (peripheral.adv_data[12] << 16) +
            (peripheral.adv_data[13] << 8) +
            (peripheral.adv_data[14] << 0);
        const eventTypeList = {
            0x01: "alive",
            0x02: "leak",
        };
        const eventType = eventTypeList[peripheral.adv_data[15]] || "unknown";
        const battery = peripheral.adv_data[16];
        const rssi = peripheral.adv_data[17];
        return {
            deviceType,
            deviceId,
            eventType,
            battery,
            rssi,
        };
    }
}
exports.default = SM_GW_920_BLE;
SM_GW_920_BLE.deviceAdv = [
    0x02,
    0x01,
    0x04,
    0x16,
    0xff,
    0x65,
    0x02,
    -1,
    0x11,
    0x01,
    0x00,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
];
