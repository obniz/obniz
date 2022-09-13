"use strict";
/**
 * @packageDocumentation
 * @module Parts.HN_300T2
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
class HN_300T2 {
    constructor(peripheral, timezoneOffset) {
        if (!peripheral || !HN_300T2.isDevice(peripheral)) {
            throw new Error('peripheral is not HN_300TN');
        }
        this._peripheral = peripheral;
        this._timezoneOffset = timezoneOffset ? timezoneOffset : 9;
    }
    static info() {
        return {
            name: 'HN_300T2',
        };
    }
    static isDevice(peripheral) {
        return (peripheral.localName && peripheral.localName.startsWith('BLESmart_0001'));
    }
    isPairingMode() {
        if (!this._peripheral) {
            throw new Error('HN_300TN not found');
        }
        if ((this._peripheral.adv_data[15] & 8) === 8) {
            return true;
        }
        else {
            return false;
        }
    }
    async pairingWait({ disconnect } = { disconnect: true }) {
        if (!this.isPairingMode()) {
            throw new Error('HN_300TN is not pairing mode.');
        }
        const keys = await new Promise((resolve, reject) => {
            this._peripheral
                .connectWait({
                pairingOption: {
                    onPairedCallback: (pairingKey) => {
                        resolve(pairingKey);
                    },
                },
            })
                .then(() => {
                // retry
                return this._peripheral.pairingWait();
            })
                .catch(reject);
        });
        if (disconnect) {
            await this._peripheral.disconnectWait();
        }
        return keys;
    }
    async getDataWait(pairingKeys) {
        if (!this._peripheral) {
            throw new Error('HN_300T2 not found');
        }
        await this._peripheral.connectWait({
            pairingOption: { keys: pairingKeys },
        });
        const results = [];
        const deviceInfoService = this._peripheral.getService('1805');
        const currentTimeChara = deviceInfoService.getCharacteristic('2A2B');
        await this.writeCurrentTimeWait(currentTimeChara);
        const service = this._peripheral.getService('181D');
        const waitDisconnect = new Promise((resolve, reject) => {
            if (!this._peripheral)
                return;
            this._peripheral.ondisconnect = (reason) => {
                resolve(results);
            };
        });
        const WeightMeasurementChara = service.getCharacteristic('2A9D');
        await WeightMeasurementChara.registerNotifyWait(async (data) => {
            results.push(this._analyseWeightMesureData(data));
            return;
        });
        return await waitDisconnect;
    }
    _analyseWeightMesureData(data) {
        const buf = Buffer.from(data);
        const result = {};
        result.weight = ((data[2] << 8) | data[1]) * 0.005;
        result.date = {
            year: buf.readUInt16LE(3),
            month: buf.readUInt8(5),
            day: buf.readUInt8(6),
            hour: buf.readUInt8(7),
            minute: buf.readUInt8(8),
            second: buf.readUInt8(9),
        };
        const user = buf.readUInt8(10);
        return result;
    }
    async writeCurrentTimeWait(chara) {
        const dayFormat = [7, 1, 2, 3, 4, 5, 6];
        const date = new Date();
        date.setTime(Date.now() + 1000 * 60 * 60 * this._timezoneOffset);
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
}
exports.default = HN_300T2;
