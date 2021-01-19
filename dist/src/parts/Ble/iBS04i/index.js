"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS04I {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "iBS04i",
        };
    }
    static isDevice(peripheral) {
        return IBS04I.getDeviceArray(peripheral) !== null;
    }
    static getData(peripheral) {
        const adv = IBS04I.getDeviceArray(peripheral);
        if (adv === null) {
            return null;
        }
        const data = {
            battery: (adv[5] + adv[6] * 256) * 0.01,
            button: Boolean(adv[7]),
            uuid: peripheral.iBeacon.uuid,
            major: peripheral.iBeacon.major,
            minor: peripheral.iBeacon.minor,
            power: peripheral.iBeacon.power,
            rssi: peripheral.iBeacon.rssi,
            address: peripheral.address,
        };
        return data;
    }
    static getDeviceArray(peripheral) {
        const advertise = peripheral.advertise_data_rows.filter((adv) => {
            let find = false;
            if (this.deviceAdv.length > adv.length) {
                return find;
            }
            for (let index = 0; index < this.deviceAdv.length; index++) {
                if (this.deviceAdv[index] === -1) {
                    continue;
                }
                if (adv[index] === this.deviceAdv[index]) {
                    find = true;
                    continue;
                }
                find = false;
                break;
            }
            return find;
        });
        if (advertise.length !== 1) {
            return null;
        }
        const type = advertise[0][14];
        if (type !== 24) {
            // iBS04i以外
            return null;
        }
        return advertise[0];
    }
}
exports.default = IBS04I;
IBS04I.deviceAdv = [
    0xff,
    0x0d,
    0x00,
    0x83,
    0xbc,
    -1,
    -1,
    -1,
    0xff,
    0xff,
    0xff,
    0xff,
    0x00,
    -1,
    -1,
    -1,
    -1,
    -1,
];
