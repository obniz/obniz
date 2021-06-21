"use strict";
/* eslint-disable max-classes-per-file */
/* eslint-disable rulesdir/non-ascii */
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizError_1 = require("./ObnizError");
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
const ObnizPartsBleModeList = ['Beacon', 'Connectable', 'Pairing'];
exports.notMatchDeviceError = new Error('Is NOT target device.');
exports.uint = (value) => {
    let val = 0;
    value.forEach((v, i) => (val += v << (i * 8)));
    return val;
};
exports.int = (value) => {
    const num = exports.uint(value);
    return (num -
        ((num & (0x8 << (value.length * 8 - 4))) !== 0
            ? value.length && value.length >= 28
                ? 0x10000000 * 2 ** (value.length - 28)
                : 0x1 << (value.length * 8)
            : 0));
};
exports.uintBE = (value) => exports.uint(value.reverse());
exports.intBE = (value) => exports.int(value.reverse());
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
        this._mode = mode;
        this.peripheral = peripheral;
        this.address = peripheral.address;
        this.beaconData = this.peripheral.manufacturerSpecificData;
        if (this.beaconData)
            this.beaconData = this.beaconData.slice(2);
        this.beaconDataInScanResponse = this.peripheral.manufacturerSpecificDataInScanResponse;
        if (this.beaconDataInScanResponse)
            this.beaconDataInScanResponse = this.beaconDataInScanResponse.slice(2);
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
    /**
     * Get Peripheral Mode.
     *
     * ペリフェラルのモードを取得
     *
     * @param peripheral BleRemotePeripheral
     * @returns If the corresponding device is that mode, it must be null if not applicable 該当するデバイスならばそのモード、該当しなければnull
     */
    static getDeviceMode(peripheral) {
        const result = (this.AvailableBleMode instanceof Array
            ? this.AvailableBleMode
            : [this.AvailableBleMode])
            .map((mode) => this.isDeviceWithMode(peripheral, mode) ? mode : undefined)
            .find((mode) => mode);
        return (result !== null && result !== void 0 ? result : null);
    }
    /**
     * Check if peripherals and modes match the library.
     *
     * ペリフェラルとモードがライブラリと合致するかチェック
     *
     * @param peripheral BleRemotePeripheral
     * @param mode Beacon | Connectable | Pairing
     * @returns Whether to match 合致するかどうか
     */
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
     * Form advertising data into an associative array.
     *
     * アドバタイジングデータを連想配列に成形
     *
     * @deprecated
     */
    static getData(peripheral) {
        const mode = this.getDeviceMode(peripheral);
        if (!mode)
            return null;
        const lib = new this(peripheral, mode);
        try {
            return lib.getData();
        }
        catch (e) {
            console.error(e);
            return null;
        }
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
    get mode() {
        return this._mode;
    }
    checkMode(force = false) {
        if (this.mode && !force)
            return this.mode;
        const mode = this.static.getDeviceMode(this.peripheral);
        if (!mode)
            throw exports.notMatchDeviceError;
        return (this._mode = mode);
    }
    /**
     * アドバタイジングデータを連想配列に成形
     * 利用可能なモード: Beacon, Connectable(一部のみ)
     * Form advertising data into an associative array
     * Available modes: Beacon, Connectable(only part)
     */
    getData() {
        this.checkMode();
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
            var _a, _b, _c;
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
                const num = (config.type.indexOf('u') === 0 ? exports.uint : exports.int)(config.type.indexOf('BE') >= 0 ? data.reverse() : data);
                return [name, num * multi];
            }
        })
            .filter((v) => v[0]));
    }
    getTriaxial(data) {
        return {
            x: exports.int(data.slice(0, 2)),
            y: exports.int(data.slice(2, 4)),
            z: exports.int(data.slice(4, 6)),
        };
    }
}
exports.ObnizPartsBle = ObnizPartsBle;
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.Address = undefined;
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.LocalName = undefined;
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.CompanyID = undefined;
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.CompanyID_ScanResponse = undefined;
class ObnizPartsBleConnectable extends ObnizPartsBle {
    constructor(peripheral, mode) {
        super(peripheral, mode);
        this.peripheral.ondisconnect = async (reason) => {
            await this.beforeOnDisconnectWait(reason);
            if (this.ondisconnect)
                await this.ondisconnect(reason);
        };
    }
    /**
     * Connect to peripherals with validation.
     *
     * バリデーションのあるペリフェラルへの接続
     *
     * @param keys: Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
     */
    async connectWait(keys) {
        // TODO: Enable Validation
        // if (this.mode !== 'Connectable')
        //   throw new Error(
        //     `Connection can only be used in connectable mode, the current mode is ${this.mode}`
        //   );
        await this.peripheral.connectWait({
            pairingOption: {
                keys,
            },
        });
    }
    /**
     * Disconnect from peripheral.
     *
     * ペリフェラルから切断
     */
    async disconnectWait() {
        await this.peripheral.disconnectWait();
    }
    /**
     * Check if connected.
     *
     * 接続しているかどうかチェック
     *
     * @param connected Connection status (default: true)
     */
    checkConnected(connected = true) {
        if (this.peripheral.connected !== connected)
            throw new Error(connected
                ? 'Peripheral is NOT connected!!'
                : 'Peripheral IS connected!!');
    }
    /**
     * Get any characteristic from any service.
     *
     * 任意のサービスから任意のキャラクタリスティックを取得
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @returns Instance of BleRemoteCharacteristic
     */
    getChar(serviceUuid, characteristicUuid) {
        const service = this.peripheral.getService(serviceUuid);
        if (!service)
            throw new ObnizError_1.ObnizBleUnknownServiceError(this.peripheral.address, serviceUuid);
        const char = service.getCharacteristic(characteristicUuid);
        if (!char)
            throw new ObnizError_1.ObnizBleUnknownCharacteristicError(this.peripheral.address, serviceUuid, characteristicUuid);
        return char;
    }
    /**
     * Read data from any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックからデータを読み取り
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @returns Data read result データ読み取り結果
     */
    async readCharWait(serviceUuid, characteristicUuid) {
        const char = this.getChar(serviceUuid, characteristicUuid);
        return await char.readWait();
    }
    /**
     * Write data to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックへデータを書き込み
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @param data Write data
     * @returns Data write result
     */
    async writeCharWait(serviceUuid, characteristicUuid, data, needResponse) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        return await characteristic.writeWait(data, needResponse);
    }
    /**
     * Register notification to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックへ通知を登録
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @param callback It is called when data comes
     */
    async subscribeWait(serviceUuid, characteristicUuid, callback) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        await characteristic.registerNotifyWait((callback !== null && callback !== void 0 ? callback : (() => {
            // do nothing.
        })));
    }
}
exports.ObnizPartsBleConnectable = ObnizPartsBleConnectable;
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
