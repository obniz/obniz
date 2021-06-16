"use strict";
/* eslint-disable max-classes-per-file */
/* eslint-disable rulesdir/non-ascii */
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizPartsBleInterface {
    constructor() {
        /**
         * Internally Used function for connection required devices
         */
        this._peripheral = null;
    }
    /**
     * Utility function for reading 2 byte to signed number.
     */
    static signed16FromBinary(high, low) {
        let val = (high << 8) | low;
        if ((val & 0x8000) !== 0) {
            val = val - 0x10000;
        }
        return val;
    }
    /**
     * Utility function for reading 4 byte to signed number.
     */
    static signed32FromBinary(byte3, byte2, byte1, byte0) {
        let val = (byte3 << (8 * 3)) | (byte2 << (8 * 2)) | (byte1 << (8 * 1)) | byte0;
        if ((val & 0x80000000) !== 0) {
            val = val - 0x100000000;
        }
        return val;
    }
    /**
     * Utility function for reading 1byte fixed point number
     */
    static readFraction(byte) {
        let result = 0;
        let mask = 0b10000000;
        let num = 0.5;
        for (let i = 0; i < 8; i++) {
            if (byte & mask) {
                result += num;
            }
            num /= 2.0;
            mask >>= 1;
        }
        return result;
    }
}
exports.default = ObnizPartsBleInterface;
class UniqueAdData {
}
exports.UniqueAdData = UniqueAdData;
const ObnizPartsBleModeList = ['Beacon', 'Connectable', 'Pairing'];
exports.notMatchDeviceError = new Error("isn't target device.");
exports.uint = (value) => {
    let val = 0;
    value.forEach((v, i) => (val += v << (i * 8)));
    return val;
};
exports.uint16 = (value) => {
    return (value[1] << 8) | value[0];
};
exports.uint16BE = (value) => exports.uint16(value.reverse());
exports.int16 = (value) => {
    let val = exports.uint16(value);
    if ((val & 0x8000) !== 0) {
        val -= 0x10000;
    }
    return val;
};
exports.int16BE = (value) => exports.int16(value.reverse());
exports.unsigned16FromBinary = (high, low) => {
    return (high << 8) | low;
};
/**
 * Utility function for reading 2 byte to signed number.
 */
exports.signed16FromBinary = (high, low) => {
    let val = exports.unsigned16FromBinary(high, low);
    if ((val & 0x8000) !== 0) {
        val -= 0x10000;
    }
    return val;
};
/**
 * Utility function for reading 4 byte to signed number.
 */
exports.signed32FromBinary = (byte3, byte2, byte1, byte0) => {
    let val = (byte3 << (8 * 3)) | (byte2 << (8 * 2)) | (byte1 << (8 * 1)) | byte0;
    if ((val & 0x80000000) !== 0) {
        val -= 0x100000000;
    }
    return val;
};
class ObnizPartsBle {
    constructor(peripheral, mode) {
        /**
         * NEED IMPLEMENTATION
         */
        this.static = ObnizPartsBle;
        if (!mode) {
            const m = this.static.getDeviceMode(peripheral);
            if (!m)
                throw exports.notMatchDeviceError;
            else
                mode = m;
        }
        this.mode = mode;
        this.peripheral = peripheral;
        this.beaconData = this.peripheral.manufacturerSpecificData;
        if (this.beaconData)
            this.beaconData = this.beaconData.slice(2);
        this.beaconDataInScanResponse = this.peripheral.manufacturerSpecificDataInScanResponse;
        if (this.beaconDataInScanResponse)
            this.beaconDataInScanResponse = this.beaconDataInScanResponse.slice(2);
        this.peripheral.ondisconnect = (reason) => {
            if (this._onDisconnect)
                this._onDisconnect(reason);
            if (this.onDisconnect)
                this.onDisconnect(reason);
        };
    }
    /**
     * Information of parts.
     * name: PartsName
     */
    static info() {
        return { name: this.PartsName };
    }
    /**
     * @deprecated
     */
    static isDevice(peripheral) {
        return this.getDeviceMode(peripheral) !== null;
    }
    static getDeviceMode(peripheral) {
        const result = (this.AvailableBleMode instanceof Array
            ? this.AvailableBleMode
            : [this.AvailableBleMode])
            .map((mode) => this.isDeviceWithMode(peripheral, mode) ? mode : undefined)
            .find((mode) => mode);
        return (result !== null && result !== void 0 ? result : null);
    }
    static isDeviceWithMode(peripheral, mode) {
        var _a;
        if (typeof this.AvailableBleMode === 'string'
            ? this.AvailableBleMode !== mode
            : !this.AvailableBleMode.includes(mode))
            return false;
        if (this.Address) {
            const defaultAddress = this.Address instanceof RegExp ? this.Address : this.Address[mode];
            if (defaultAddress === undefined ||
                !defaultAddress.test(peripheral.address))
                return false;
        }
        if (this.LocalName) {
            const defaultLocalName = this.LocalName instanceof RegExp
                ? this.LocalName
                : this.LocalName[mode];
            if (defaultLocalName === undefined ||
                !defaultLocalName.test((_a = peripheral.localName, (_a !== null && _a !== void 0 ? _a : 'null'))))
                return false;
        }
        if (!this.checkManufacturerSpecificData(mode, peripheral.manufacturerSpecificData, this.CompanyID, false))
            return false;
        if (!this.checkManufacturerSpecificData(mode, peripheral.manufacturerSpecificDataInScanResponse, this.CompanyID_ScanResponse, true))
            return false;
        return true;
    }
    static checkManufacturerSpecificData(mode, beaconData, companyID, inScanResponse) {
        if (companyID !== undefined) {
            const defaultCompanyID = companyID instanceof Array || companyID === null
                ? companyID
                : companyID[mode];
            if (!(defaultCompanyID === null && beaconData === null) &&
                (defaultCompanyID === undefined ||
                    defaultCompanyID === null ||
                    beaconData === null ||
                    defaultCompanyID[0] !== beaconData[0] ||
                    defaultCompanyID[1] !== beaconData[1]))
                return false;
        }
        if (this.BeaconDataStruct !== undefined) {
            const defaultBeaconDataStruct = (this.BeaconDataStruct !== null &&
                (this.BeaconDataStruct.Beacon ||
                    this.BeaconDataStruct.Connectable ||
                    this.BeaconDataStruct.Pairing)
                ? this.BeaconDataStruct[mode]
                : this.BeaconDataStruct);
            if (defaultBeaconDataStruct === undefined ||
                defaultBeaconDataStruct === null ||
                Object.values(defaultBeaconDataStruct).filter((config) => {
                    var _a, _b;
                    return inScanResponse === (_a = config.scanResponse, (_a !== null && _a !== void 0 ? _a : false)) &&
                        config.type === 'check' &&
                        ((beaconData !== null && beaconData !== void 0 ? beaconData : []))
                            .slice(2 + config.index, 2 + config.index + (_b = config.length, (_b !== null && _b !== void 0 ? _b : 1)))
                            .filter((d, i) => {
                            var _a;
                            return d !==
                                (typeof config.data === 'number'
                                    ? [config.data]
                                    : (_a = config.data, (_a !== null && _a !== void 0 ? _a : [])))[i];
                        }).length !== 0;
                }).length !== 0)
                return false;
        }
        return true;
    }
    /**
     * アドバタイジングデータを連想配列に成形
     * Form advertising data into an associative array
     */
    // public static getData: (peripheral: BleRemotePeripheral | null) => unknown;
    /**
     * Utility function for reading 1byte fixed point number
     */
    static readFraction(byte) {
        let result = 0;
        let mask = 0b10000000;
        let num = 0.5;
        for (let i = 0; i < 8; i++) {
            if (byte & mask) {
                result += num;
            }
            num /= 2.0;
            mask >>= 1;
        }
        return result;
    }
    /**
     * アドバタイジングデータを連想配列に成形
     * 利用可能なモード: Beacon, Connectable(一部のみ)
     * Form advertising data into an associative array
     * Available modes: Beacon, Connectable(only part)
     */
    getData() {
        if (!this.static.BeaconDataStruct)
            throw new Error('Data analysis is not defined.');
        if (!this.beaconData)
            throw new Error('Manufacturer specific data is null.');
        const defaultBeaconDataStruct = (this.static.BeaconDataStruct.Beacon ||
            this.static.BeaconDataStruct.Connectable ||
            this.static.BeaconDataStruct.Pairing
            ? this.static.BeaconDataStruct[this.mode]
            : this.static.BeaconDataStruct);
        if (defaultBeaconDataStruct === null)
            throw new Error('Data analysis is not defined.');
        return Object.fromEntries(Object.entries(defaultBeaconDataStruct)
            .map(([name, c]) => {
            var _a, _b, _c, _d, _e;
            if (c.type === 'check')
                return [];
            const config = c;
            if (!(config.scanResponse
                ? this.beaconDataInScanResponse
                : this.beaconData))
                throw new Error('manufacturerSpecificData is null.');
            const data = (_a = (config.scanResponse
                ? this.beaconDataInScanResponse
                : this.beaconData), (_a !== null && _a !== void 0 ? _a : [])).slice(config.index, config.index + (_b = config.length, (_b !== null && _b !== void 0 ? _b : 1)));
            if (config.type.indexOf('bool') === 0)
                return [name, (data[0] & parseInt(config.type.slice(4), 2)) > 0];
            else if (config.type === 'string')
                return [name, Buffer.from(data).toString()];
            else if (config.type === 'xyz') {
                if (!config.length)
                    config.length = 6;
                if (config.length % 6 !== 0)
                    return [];
                else if (config.length === 6)
                    return [name, this.getTriaxial(data)];
                else
                    return [
                        name,
                        [...Array(config.length / 6).keys()].map((v) => this.getTriaxial(data.slice(v * 6, (v + 1) * 6))),
                    ];
            }
            else if (config.type === 'custom')
                if (!config.func)
                    return [];
                else
                    return [name, config.func(data, this.peripheral)];
            else {
                const multi = (_c = config.multiple, (_c !== null && _c !== void 0 ? _c : 1));
                const num = exports.uint(config.type.indexOf('BE') > 0 ? data.reverse() : data);
                return [
                    name,
                    (num -
                        (config.type.indexOf('u') !== 0 &&
                            (num & (0x8 << ((_d = config.length, (_d !== null && _d !== void 0 ? _d : 1)) * 8 - 4))) !== 0
                            ? 0x1 << ((_e = config.length, (_e !== null && _e !== void 0 ? _e : 1)) * 8)
                            : 0)) *
                        multi,
                ];
            }
        })
            .filter((v) => v[0]));
    }
    getTriaxial(data) {
        return {
            x: exports.int16(data.slice(0, 2)),
            y: exports.int16(data.slice(2, 4)),
            z: exports.int16(data.slice(4, 6)),
        };
    }
    /**
     * 任意のサービスから任意のキャラクタリスクを取得
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @returns 該当するものがあればキャラクタリスク、なければnull
     */
    getChar(serviceUuid, characteristicUuid) {
        const service = this.peripheral.getService(serviceUuid);
        if (!service)
            return null;
        return service.getCharacteristic(characteristicUuid);
    }
    /**
     * 任意のサービスの任意のキャラクタリスクからデータを読み取り
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @returns 該当するものがあればデータ読み取り結果、なければnull
     */
    async readCharWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        if (!characteristic)
            return null;
        return await characteristic.readWait();
    }
    /**
     * 任意のサービスの任意のキャラクタリスクへデータを書き込み
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @param data 書き込むデータ
     * @returns 該当するものがあればデータ書き込み結果、なければfalse
     */
    async writeCharWait(serviceUuid, characteristicUuid, data) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        if (!characteristic)
            return false;
        return await characteristic.writeWait(data);
    }
    /**
     * 任意のサービスの任意のキャラクタリスクへ通知を登録
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @param callback データが来たとき呼ばれる関数
     * @returns 該当するものがあればtrue、なければfalse
     */
    async subscribeWait(serviceUuid, characteristicUuid, callback) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        if (!characteristic)
            return false;
        await characteristic.registerNotifyWait((callback !== null && callback !== void 0 ? callback : (() => {
            // do nothing.
        })));
        return true;
    }
}
exports.ObnizPartsBle = ObnizPartsBle;
/**
 * 標準でisDevice()の条件として使用
 * Used as a condition of isDevice() by default
 */
ObnizPartsBle.Address = undefined;
/**
 * 標準でisDevice()の条件として使用
 * Used as a condition of isDevice() by default
 */
ObnizPartsBle.LocalName = undefined;
/**
 * 標準でisDevice()の条件として使用
 * Used as a condition of isDevice() by default
 */
ObnizPartsBle.CompanyID = undefined;
/**
 * 標準でisDevice()の条件として使用
 * Used as a condition of isDevice() by default
 */
ObnizPartsBle.CompanyID_ScanResponse = undefined;
exports.iBeaconCompanyID = [0x4c, 0x00];
exports.iBeaconData = 
// length !== 25
{
    type: {
        index: 0,
        length: 2,
        type: 'check',
        data: [0x02, 0x15],
    },
    uuid: {
        index: 2,
        length: 16,
        type: 'custom',
        func: (data) => data
            .map((d, i) => ([2, 3, 4, 5].includes(i / 2) ? '-' : '') +
            ('00' + d.toString(16)).slice(-2))
            .join(''),
    },
    major: {
        index: 18,
        length: 2,
        type: 'unsignedNumBE',
    },
    minor: {
        index: 20,
        length: 2,
        type: 'unsignedNumBE',
    },
    power: {
        index: 22,
        type: 'numLE',
    },
    rssi: {
        index: 0,
        type: 'custom',
        func: (d, p) => { var _a; return _a = p.rssi, (_a !== null && _a !== void 0 ? _a : 0); },
    },
};
