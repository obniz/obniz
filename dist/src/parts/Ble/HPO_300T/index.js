"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HPO_300T {
    constructor(peripheral, timezoneOffset) {
        if (!peripheral || !HPO_300T.isDevice(peripheral)) {
            throw new Error('peripheral is not HPO_300T');
        }
        this._peripheral = peripheral;
        this._timezoneOffset = timezoneOffset ? timezoneOffset : 9 * 60;
    }
    static info() {
        return {
            name: 'HPO_300T',
        };
    }
    static isDevice(peripheral) {
        if (!peripheral.localName)
            return false;
        return (peripheral.localName.startsWith('BLEsmart_00060002') ||
            peripheral.localName.startsWith('BLESmart_00060002'));
    }
    isPairingMode() {
        var _a;
        if (!this._peripheral) {
            throw new Error('HPO_300T not found');
        }
        // BLEsmart -> paring mode
        // BLESmart -> normal adv
        if ((_a = this._peripheral.localName) === null || _a === void 0 ? void 0 : _a.startsWith('BLEs')) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Pair with the device
     *
     * デバイスとペアリング 電源ボタンを長押しする
     *
     * @returns pairing key ペアリングキー
     */
    async pairingWait() {
        if (!this._peripheral) {
            throw new Error('HPO_300T not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait({
            waitUntilPairing: true,
        });
        const keys = await this._peripheral.getPairingKeysWait();
        const currentTime = this._peripheral.getService('1805');
        const current = await (currentTime === null || currentTime === void 0 ? void 0 : currentTime.getCharacteristic('2a2b'));
        await this.writeCurrentTimeWait(current);
        await this._peripheral.disconnectWait();
        return keys;
    }
    /**
     * Get SpO2, PulseRate Data from Device
     *
     * デバイスから計測データをとる
     *
     * @returns 受け取ったデータ
     */
    async getDataWait(pairingKeys) {
        if (!this._peripheral) {
            throw new Error('HPO_300T not found');
        }
        let result = {};
        await this._peripheral.connectWait({
            pairingOption: { keys: pairingKeys },
        });
        const currentTime = this._peripheral.getService('1805');
        const current = await (currentTime === null || currentTime === void 0 ? void 0 : currentTime.getCharacteristic('2a2b'));
        await this.writeCurrentTimeWait(current);
        const service = this._peripheral.getService('6E400001B5A3F393EFA9E50E24DCCA9E');
        const chara = await (service === null || service === void 0 ? void 0 : service.getCharacteristic('6E4000F1B5A3F393EFA9E50E24DCCA9E'));
        await (chara === null || chara === void 0 ? void 0 : chara.registerNotifyWait((data) => {
            result = this._analyseData(data);
        }));
        const waitDisconnect = new Promise((resolve, reject) => {
            if (!this._peripheral)
                return;
            this._peripheral.ondisconnect = (reason) => {
                resolve(result);
            };
        });
        return await waitDisconnect;
    }
    async writeCurrentTimeWait(chara) {
        const dayFormat = [7, 1, 2, 3, 4, 5, 6];
        const date = new Date();
        date.setTime(Date.now() + 1000 * 60 * this._timezoneOffset);
        const buf = Buffer.alloc(10);
        buf.writeUInt16LE(date.getUTCFullYear(), 0);
        buf.writeUInt8(date.getUTCMonth() + 1, 2);
        buf.writeUInt8(date.getUTCDate(), 3);
        buf.writeUInt8(date.getUTCHours(), 4);
        buf.writeUInt8(date.getUTCMinutes(), 5);
        buf.writeUInt8(date.getUTCSeconds(), 6);
        buf.writeUInt8(dayFormat[date.getUTCDay()], 7);
        buf.writeUInt8(Math.trunc(date.getUTCMilliseconds() / (9999 / 256)), 8);
        buf.writeUInt8(1, 9);
        const arr = Array.from(buf);
        await chara.writeWait(arr);
    }
    _analyseData(data) {
        const buf = Buffer.from(data);
        const result = {};
        result.spo2 = (data[2] << 8) | data[1];
        result.pulseRate = (data[4] << 8) | data[3];
        result.date = {
            year: buf.readUInt16LE(5),
            month: buf.readUInt8(7),
            day: buf.readUInt8(8),
            hour: buf.readUInt8(9),
            minute: buf.readUInt8(10),
            second: buf.readUInt8(11),
        };
        return result;
    }
}
exports.default = HPO_300T;
