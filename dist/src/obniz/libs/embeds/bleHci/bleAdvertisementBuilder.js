"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleAdvertisementBuilder = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleHelper_1 = __importDefault(require("./bleHelper"));
/**
 * @category Use as Peripheral
 */
class BleAdvertisementBuilder {
    constructor(json, extendedFlg = false) {
        this.rows = {};
        this._extendedFlg = extendedFlg;
        this._serviceData = [];
        if (json) {
            if (json.localName) {
                this.setCompleteLocalName(json.localName);
            }
            if (json.manufacturerData &&
                json.manufacturerData.companyCode &&
                json.manufacturerData.data) {
                this.setManufacturerSpecificData(json.manufacturerData.companyCode, json.manufacturerData.data);
            }
            if (json.serviceUuids) {
                for (const uuid of json.serviceUuids) {
                    this.setUuid(uuid);
                }
            }
            if (json.serviceData) {
                for (const service of json.serviceData) {
                    this.setServiceData(service.uuid, service.data);
                }
            }
        }
        if (typeof this.extendEvalJson === 'function') {
            this.extendEvalJson(json);
        }
    }
    setRow(type, data) {
        this.rows[type] = data;
    }
    getRow(type) {
        return this.rows[type] || [];
    }
    build() {
        const data = [];
        for (const key in this.rows) {
            if (this.rows[key].length === 0) {
                continue;
            }
            data.push(this.rows[key].length + 1);
            data.push(parseInt(key));
            Array.prototype.push.apply(data, this.rows[key]);
        }
        if (this._serviceData.length !== 0) {
            Array.prototype.push.apply(data, this._serviceData);
        }
        if (this._extendedFlg) {
            if (data.length > 1650) {
                throw new Error('Too large data. Advertise/ScanResponse data are must be less than 1650 byte.');
            }
        }
        else {
            if (data.length > 31) {
                throw new Error('Too large data. Advertise/ScanResponse data are must be less than 32 byte.');
            }
        }
        return data;
    }
    setStringData(type, string) {
        const data = [];
        for (let i = 0; i < string.length; i++) {
            data.push(string.charCodeAt(i));
        }
        this.setRow(type, data);
    }
    setServiceData(uuid, data) {
        const row = [];
        row.push(uuid & 0xff);
        row.push((uuid >> 8) & 0xff);
        if (data.length > 252) {
            throw new Error('ServiceData Length Over UUID' + uuid);
        }
        for (const d of data) {
            row.push(d & 0xff);
        }
        this._serviceData.push(row.length + 1);
        this._serviceData.push(0x16);
        Array.prototype.push.apply(this._serviceData, row);
    }
    setShortenedLocalName(name) {
        this.setStringData(0x08, name);
    }
    setCompleteLocalName(name) {
        this.setStringData(0x09, name);
    }
    setManufacturerSpecificData(companyCode, data) {
        const row = [];
        row.push(companyCode & 0xff);
        row.push((companyCode >> 8) & 0xff);
        Array.prototype.push.apply(row, data);
        this.setRow(0xff, row);
    }
    setUuid(uuid) {
        const uuidData = this.convertUuid(uuid);
        const type = { 16: 0x06, 4: 0x04, 2: 0x02 }[uuidData.length];
        this.setRow(type, uuidData);
    }
    convertUuid(uuid) {
        const uuidNumeric = bleHelper_1.default.uuidFilter(uuid);
        if (uuidNumeric.length !== 32 &&
            uuidNumeric.length !== 8 &&
            uuidNumeric.length !== 4) {
            throw new Error('BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)');
        }
        const data = [];
        for (let i = uuidNumeric.length; i > 1; i -= 2) {
            data.push(parseInt(uuidNumeric[i - 2] + uuidNumeric[i - 1], 16));
        }
        return data;
    }
    setIbeaconData(uuid, major, minor, txPower) {
        const data = [];
        data.push(0x02, 0x15); // fixed data
        const uuidData = this.convertUuid(uuid);
        Array.prototype.push.apply(data, uuidData);
        data.push((major >> 8) & 0xff);
        data.push((major >> 0) & 0xff);
        data.push((minor >> 8) & 0xff);
        data.push((minor >> 0) & 0xff);
        data.push((txPower >> 0) & 0xff);
        this.setManufacturerSpecificData(0x004c, data);
        return;
    }
    setLeLimitedDiscoverableModeFlag() {
        this.setFlags(0x01);
    }
    setLeGeneralDiscoverableModeFlag() {
        this.setFlags(0x02);
    }
    setBrEdrNotSupportedFlag() {
        this.setFlags(0x04);
    }
    setLeBrEdrControllerFlag() {
        this.setFlags(0x08);
    }
    setLeBrEdrHostFlag() {
        this.setFlags(0x10);
    }
    extendEvalJson(json) {
        if (json) {
            if (json.flags) {
                if (json.flags.includes('limited_discoverable_mode')) {
                    this.setLeLimitedDiscoverableModeFlag();
                }
                if (json.flags.includes('general_discoverable_mode')) {
                    this.setLeGeneralDiscoverableModeFlag();
                }
                if (json.flags.includes('br_edr_not_supported')) {
                    this.setBrEdrNotSupportedFlag();
                }
                if (json.flags.includes('le_br_edr_controller')) {
                    this.setLeBrEdrControllerFlag();
                }
                if (json.flags.includes('le_br_edr_host')) {
                    this.setLeBrEdrHostFlag();
                }
            }
        }
    }
    setFlags(flag) {
        const data = this.getRow(0x01);
        data[0] = (data[0] || 0) | flag;
        this.setRow(0x01, data);
    }
}
exports.BleAdvertisementBuilder = BleAdvertisementBuilder;
