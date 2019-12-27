"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const i2cParts = require('../../../i2cParts');
class DHT12 extends i2cParts {
    static info() {
        return {
            name: 'DHT12',
        };
    }
    i2cInfo() {
        return {
            address: 0x5c,
            clock: 100000,
            voltage: '3v',
        };
    }
    getAllDataWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.readWait(0x00, 5);
            const humidity = data[0] + data[1] * 0.1;
            let temperature = data[2] + (data[3] & 0x7f) * 0.1;
            if (data[3] & 0x80) {
                temperature *= -1;
            }
            const checksum = data[0] + data[1] + data[2] + data[3];
            if (checksum !== data[4]) {
                return null;
            }
            return {
                humidity,
                temperature,
            };
        });
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllDataWait()).temperature;
        });
    }
    getHumdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllDataWait()).humidity;
        });
    }
}
if (typeof module === 'object') {
    module.exports = DHT12;
}
