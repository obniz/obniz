"use strict";
/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SCBTGAAAC {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "SCBTGAAAC",
        };
    }
    static isDevice(peripheral) {
        return SCBTGAAAC.getData(peripheral) !== null;
    }
    static getData(peripheral) {
        const data = SCBTGAAAC.searchTypeVal(peripheral.advertise_data_rows, 0xff);
        if (!data || data[0] !== 0x31 || data[1] !== 0x07 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) {
            return null;
        }
        const uuidData = data.slice(4, 20);
        let uuid = "";
        for (let i = 0; i < uuidData.length; i++) {
            uuid = uuid + ("00" + uuidData[i].toString(16)).slice(-2);
            if (i === 4 - 1 || i === 4 + 2 - 1 || i === 4 + 2 * 2 - 1 || i === 4 + 2 * 3 - 1) {
                uuid += "-";
            }
        }
        const major = (data[20] << 8) + data[21];
        const minor = (data[22] << 8) + data[23];
        const power = data[24];
        if (uuid === "5d490d6c-7eb9-474e-8160-45bde999119a" && major === 3) {
            return `03-${minor}`;
        }
        return null;
    }
    static searchTypeVal(advertise_data_rows, type) {
        for (let i = 0; i < advertise_data_rows.length; i++) {
            if (advertise_data_rows[i][0] === type) {
                const results = [].concat(advertise_data_rows[i]);
                results.shift();
                return results;
            }
        }
        return undefined;
    }
}
exports.default = SCBTGAAAC;
