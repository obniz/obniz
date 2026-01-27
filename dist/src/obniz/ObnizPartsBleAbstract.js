"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
/* eslint-disable rulesdir/non-ascii */
/* eslint-disable max-classes-per-file */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iBeaconData = exports.iBeaconDataWithStrict = exports.iBeaconCompanyID = exports.ObnizPartsBlePairable = exports.ObnizPartsBleConnectable = exports.ObnizPartsBle = exports.checkEquals = exports.fixByRange = exports.uintToArrayWithBE = exports.uintToArray = exports.intBE = exports.uintBE = exports.int = exports.uint = exports.fixedPoint = exports.notMatchDeviceError = void 0;
const round_to_1 = __importDefault(require("round-to"));
const ObnizError_1 = require("./ObnizError");
const debugFlag = false;
const debug = (...objects) => {
    if (!debugFlag)
        return;
    console.debug(...objects);
};
const ObnizPartsBleModeList = ['Beacon', 'Connectable', 'Pairing'];
exports.notMatchDeviceError = new Error('Is NOT target device.');
const fixedPoint = (value, integerBytes) => {
    const positive = value[0] >> 7 === 0;
    if (!positive) {
        value = value.map((n, i) => (n ^ 0xff) + (i === value.length - 1 ? 1 : 0));
    }
    const val = (positive ? 1 : -1) *
        ((0, exports.uint)(value.slice(0, integerBytes)) +
            (0, exports.uint)(value.slice(integerBytes)) /
                (1 << (8 * (value.length - integerBytes))));
    return val;
};
exports.fixedPoint = fixedPoint;
const uint = (value) => {
    let val = 0;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_logical_operators
    // eslint-disable-next-line prettier/prettier
    value.forEach((v, i) => (val += v * (2 ** (i * 8))));
    return val;
};
exports.uint = uint;
const int = (value) => {
    const num = (0, exports.uint)(value);
    return (num -
        ((num & (0x8 << (value.length * 8 - 4))) !== 0
            ? value.length && value.length >= 28
                ? 0x10000000 * 2 ** (value.length - 28)
                : 0x1 << (value.length * 8)
            : 0));
};
exports.int = int;
const uintBE = (value) => (0, exports.uint)(value.reverse());
exports.uintBE = uintBE;
const intBE = (value) => (0, exports.int)(value.reverse());
exports.intBE = intBE;
const uintToArray = (value, length = 2) => new Uint8Array(length)
    .fill(0)
    .map((v, i) => value % (1 << ((i + 1) * 8)) >> (i * 8));
exports.uintToArray = uintToArray;
const uintToArrayWithBE = (value, length = 2) => (0, exports.uintToArray)(value, length).reverse();
exports.uintToArrayWithBE = uintToArrayWithBE;
const fixByRange = (name, value, min, max) => {
    if (value < min) {
        console.warn(`Since ${name} ranges from ${min} to ${max}, ${min} is used.`);
        return min;
    }
    if (value > max) {
        console.warn(`Since ${name} ranges from ${min} to ${max}, ${max} is used.`);
        return max;
    }
    return value;
};
exports.fixByRange = fixByRange;
const checkEquals = (base, target) => base.filter((v, i) => v !== target[i]).length === 0;
exports.checkEquals = checkEquals;
class ObnizPartsBle {
    constructor(peripheral, mode) {
        this._mode = mode;
        this.peripheral = peripheral;
        this.address = peripheral.address;
        this.beaconData = this.peripheral.manufacturerSpecificData;
        if (this.beaconData)
            this.beaconData = this.beaconData.slice(2);
        this.beaconDataInScanResponse = this.peripheral.manufacturerSpecificDataInScanResponse;
        if (this.beaconDataInScanResponse)
            this.beaconDataInScanResponse = this.beaconDataInScanResponse.slice(2);
        this.serviceData = this.peripheral.serviceData;
        if (this.serviceData)
            this.serviceData = this.serviceData.slice(2);
    }
    /**
     * Information of parts.
     * name: PartsName
     */
    static info() {
        return { name: this.PartsName };
    }
    /**
     * Available BLE modes (Beacon | Connectable | Pairing)
     *
     * 利用可能なBLEのモード (Beacon | Connectable | Pairing)
     */
    static getAvailableBleMode() {
        const availableBleMode = this
            .AvailableBleMode;
        return availableBleMode instanceof Array
            ? availableBleMode
            : [availableBleMode];
    }
    static getServiceUuids(mode) {
        const uuids = this.ServiceUuids instanceof Array ||
            typeof this.ServiceUuids === 'string' ||
            this.ServiceUuids === null ||
            this.ServiceUuids === undefined
            ? this.ServiceUuids
            : this.ServiceUuids[mode];
        return typeof uuids === 'string' ? [uuids] : uuids;
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
        debug('getAvailableBleMode()', this.getAvailableBleMode());
        for (const mode of this.getAvailableBleMode()) {
            const check = this.isDeviceWithMode(peripheral, mode);
            if (check) {
                debug(`getDeviceMode(p) => ${mode}`, peripheral.address);
                return mode;
            }
        }
        debug('getDeviceMode(p) => null', peripheral.address);
        return null;
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
        debug(`isDeviceWithMode(peripheral, ${mode})`);
        if (!this.getAvailableBleMode().includes(mode))
            return false;
        if (this.Address) {
            const defaultAddress = this.Address instanceof RegExp ? this.Address : this.Address[mode];
            debug('defaultAddress', defaultAddress);
            if (defaultAddress !== undefined &&
                !defaultAddress.test(peripheral.address)) {
                debug(`defaultAddress.test(${peripheral.address}) === false`);
                return false;
            }
        }
        if (this.LocalName) {
            const defaultLocalName = this.LocalName instanceof RegExp
                ? this.LocalName
                : this.LocalName[mode];
            debug('defaultLocalName', defaultLocalName);
            if (defaultLocalName !== undefined &&
                !defaultLocalName.test((_a = peripheral.localName) !== null && _a !== void 0 ? _a : 'null')) {
                debug(`defaultLocalName.test(${peripheral.localName} ?? 'null') === false`);
                return false;
            }
        }
        if (this.ServiceUuids) {
            const defaultServiceUuids = this.getServiceUuids(mode);
            debug('defaultServiceUuids', defaultServiceUuids);
            if (defaultServiceUuids !== undefined) {
                const uuids = peripheral.advertisementServiceUuids();
                debug('uuids', uuids);
                if (defaultServiceUuids === null && uuids.length !== 0)
                    return false;
                if (defaultServiceUuids !== null && uuids.length === 0)
                    return false;
                if (defaultServiceUuids !== null &&
                    defaultServiceUuids.some((u) => !uuids.includes(u.toLowerCase()))) {
                    debug('defaultServiceUuids.some((u) => !uuids.includes(u.toLowerCase())) === true');
                    return false;
                }
            }
        }
        if (!this.checkCustomData(mode, peripheral.address, peripheral.manufacturerSpecificData, this.BeaconDataLength, this.CompanyID, this.BeaconDataStruct)) {
            debug('this.checkCustomData(mode, p.address, p.manufacturerSpecificData, this.BeaconDataLength, this.CompanyID, this.BeaconDataStruct) === false');
            return false;
        }
        if (!this.checkCustomData(mode, peripheral.address, peripheral.manufacturerSpecificDataInScanResponse, this.BeaconDataLength_ScanResponse, this.CompanyID_ScanResponse, this.BeaconDataStruct, true)) {
            debug('this.checkCustomData(mode, p.address, p.manufacturerSpecificDataInScanResponse, this.BeaconDataLength_ScanResponse, this.CompanyID_ScanResponse, this.BeaconDataStruct, true) === false');
            return false;
        }
        if (!this.checkCustomData(mode, peripheral.address, peripheral.serviceData, this.ServiceDataLength, this.ServiceDataUUID, this.ServiceDataStruct)) {
            debug('this.checkCustomData(mode, p.address, p.serviceData, this.ServiceDataLength, this.ServiceDataUUID, this.ServiceDataStruct) === false');
            return false;
        }
        return true;
    }
    static checkCustomData(mode, address, rawData, dataLength, headID, dataStruct, inScanResponse = false) {
        var _a, _b, _c;
        debug(`checkCustomData(mode, address, ${rawData}, ${dataLength}, ${headID}, ${dataStruct}, ${inScanResponse})`);
        const data = rawData ? new Uint8Array(rawData) : null;
        if (headID !== undefined) {
            const defHeadID = headID instanceof Array || headID === null || headID === undefined
                ? headID
                : headID[mode];
            if (defHeadID !== undefined) {
                if (defHeadID === null && data !== null)
                    return false;
                if (defHeadID !== null && data === null)
                    return false;
                if (defHeadID !== null &&
                    data !== null &&
                    (defHeadID[0] !== data[0] || defHeadID[1] !== data[1]))
                    return false;
            }
        }
        if (dataLength !== undefined) {
            const defDataLength = typeof dataLength === 'number' ||
                dataLength === null ||
                dataLength === undefined
                ? dataLength
                : dataLength[mode];
            if (defDataLength !== undefined) {
                if (defDataLength === null && data !== null)
                    return false;
                if (defDataLength !== null && data === null)
                    return false;
                if (defDataLength !== null &&
                    data !== null &&
                    data.length + 1 !== defDataLength)
                    return false;
            }
        }
        if (typeof dataStruct === 'object' && dataStruct !== null) {
            // ひとまずモードで選択してみる
            const defDataStructByMode = dataStruct[mode];
            // モードで選択した変数がオブジェクトまたはnullならばそのまま使い、そうでなければモードで選択せずに使用
            const defDataStruct = (typeof defDataStructByMode === 'object'
                ? defDataStructByMode
                : dataStruct);
            if (defDataStruct !== undefined) {
                // TODO: macAddress_ -> macAddress
                if (defDataStruct && ((_a = defDataStruct.macAddress_) === null || _a === void 0 ? void 0 : _a.type) === 'check') {
                    defDataStruct.macAddress_ = Object.assign(Object.assign({}, defDataStruct.macAddress_), { data: new Array(6)
                            .fill(0)
                            .map((v, i) => parseInt(address.slice(i * 2, (i + 1) * 2), 16))
                            .reverse() });
                }
                if (defDataStruct === null && data === null) {
                    // OK
                }
                else if (defDataStruct !== null && data === null) {
                    // defDataStructではNULLであるべきかどうかを
                    // AdvertisementDataとScanResponseData別に明記できないため、判定をスキップ
                }
                else if (defDataStruct === null && data !== null) {
                    // どちらかが明示的に空なのに存在するため、ミスマッチ
                    return false;
                }
                else if (defDataStruct !== null && data !== null) {
                    // チェック対象となる設定を抽出
                    const configs = Object.values(defDataStruct).filter((config) => {
                        var _a;
                        return inScanResponse === ((_a = config.scanResponse) !== null && _a !== void 0 ? _a : false) &&
                            config.type === 'check';
                    });
                    for (const config of configs) {
                        // チェック対象となるバイト列
                        const targetData = data.slice(2 + config.index, 2 + config.index + ((_b = config.length) !== null && _b !== void 0 ? _b : 1));
                        if (typeof config.func === 'function') {
                            // funcが関数ならば、実行して確認
                            const result = config.func(targetData);
                            if (!result) {
                                return false;
                            }
                        }
                        else if (typeof config.data === 'number' ||
                            Array.isArray(config.data)) {
                            // dataに値や配列があれば、それらを比較
                            const baseData = typeof config.data === 'number'
                                ? [config.data]
                                : (_c = config.data) !== null && _c !== void 0 ? _c : [];
                            if (!(0, exports.checkEquals)(baseData, targetData)) {
                                return false;
                            }
                        }
                    }
                }
            }
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
    get mode() {
        return this._mode;
    }
    checkMode(force = false) {
        if (this.mode && !force)
            return this.mode;
        const mode = this.staticClass.getDeviceMode(this.peripheral);
        if (!mode)
            throw exports.notMatchDeviceError;
        return (this._mode = mode);
    }
    /**
     * アドバタイジングデータを連想配列に成形
     *
     * 利用可能なモード: Beacon, Connectable(一部のみ)
     *
     * Form advertising data into an associative array
     *
     * Available modes: Beacon, Connectable(only part)
     */
    getData() {
        var _a;
        this.checkMode();
        const dataStruct = (_a = this.staticClass.BeaconDataStruct) !== null && _a !== void 0 ? _a : this.staticClass.ServiceDataStruct;
        if (!dataStruct)
            throw new Error('Data analysis is not defined.');
        const data = this.staticClass.BeaconDataStruct
            ? this.beaconData
            : this.staticClass.ServiceDataStruct
                ? this.serviceData
                : null;
        if (!data)
            throw new Error('Manufacturer specific data is null.');
        // ひとまずモードで選択してみる
        const defDataStructByMode = dataStruct[this.mode];
        // モードで選択した変数がオブジェクトまたはnullならばそのまま使い、そうでなければモードで選択せずに使用
        const defDataStruct = (typeof defDataStructByMode === 'object'
            ? defDataStructByMode
            : dataStruct);
        if (defDataStruct === null)
            throw new Error('Data analysis is not defined.');
        return Object.fromEntries(Object.entries(defDataStruct)
            .map(([name, config]) => {
            var _a, _b, _c, _d;
            if (config.type === 'check')
                return [];
            if (!(config.scanResponse ? this.beaconDataInScanResponse : data))
                throw new Error('manufacturerSpecificData is null.');
            const vals = ((_a = (config.scanResponse ? this.beaconDataInScanResponse : data)) !== null && _a !== void 0 ? _a : []).slice(config.index, config.index + ((_b = config.length) !== null && _b !== void 0 ? _b : 1));
            if (config.type.indexOf('bool') === 0)
                return [name, (vals[0] & parseInt(config.type.slice(4), 2)) > 0];
            else if (config.type === 'string')
                return [
                    name,
                    Buffer.from(vals.slice(0, vals.indexOf(0))).toString(),
                ];
            else if (config.type === 'xyz') {
                if (!config.length)
                    config.length = 6;
                if (config.length % 6 !== 0)
                    return [];
                else if (config.length === 6)
                    return [
                        name,
                        this.getTriaxial(vals, config.fixedIntegerBytes, config.round),
                    ];
                else
                    return [
                        name,
                        [...Array(config.length / 6).keys()].map((v) => this.getTriaxial(vals.slice(v * 6, (v + 1) * 6), config.fixedIntegerBytes, config.round)),
                    ];
            }
            else if (config.type === 'custom')
                if (!config.func)
                    return [];
                else
                    return [name, config.func(vals, this.peripheral)];
            else {
                const base = (_c = config.base) !== null && _c !== void 0 ? _c : 0;
                const multi = (_d = config.multiple) !== null && _d !== void 0 ? _d : 1;
                const f = (d) => config.fixedIntegerBytes !== undefined
                    ? (0, exports.fixedPoint)(d, config.fixedIntegerBytes)
                    : (config.type.indexOf('u') === 0 ? exports.uint : exports.int)(config.type.indexOf('BE') >= 0 ? d.reverse() : d);
                const num = base + f(vals) * multi;
                return [
                    name,
                    config.round !== undefined ? (0, round_to_1.default)(num, config.round) : num,
                ];
            }
        })
            .filter((v) => v[0]));
    }
    getTriaxial(data, fixedIntegerBytes, round) {
        const f = (d) => fixedIntegerBytes !== undefined
            ? (0, exports.fixedPoint)(d, fixedIntegerBytes)
            : (0, exports.int)(d);
        const ff = (d) => round !== undefined ? (0, round_to_1.default)(f(d), round) : f(d);
        return {
            x: ff(data.slice(0, 2)),
            y: ff(data.slice(2, 4)),
            z: ff(data.slice(4, 6)),
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
ObnizPartsBle.ServiceUuids = undefined;
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.BeaconDataLength = undefined;
/**
 * Overall length of manufacturer-specific data.
 * Used as a condition of isDevice() by default.
 *
 * 製造者固有データ全体の長さ
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.BeaconDataLength_ScanResponse = undefined;
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
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.ServiceDataLength = undefined;
/**
 * Used as a condition of isDevice() by default.
 *
 * 標準でisDevice()の条件として使用
 */
ObnizPartsBle.ServiceDataUUID = undefined;
class ObnizPartsBleConnectable extends ObnizPartsBle {
    constructor(peripheral, mode) {
        super(peripheral, mode);
        this.disconnectedListeners = [];
        this.peripheral.ondisconnect = (reason) => {
            this.disconnectedListeners.forEach((func) => func(reason));
            if (this.ondisconnect)
                this.ondisconnect(reason);
        };
    }
    /**
     * Register functions to be called on disconnection.
     *
     * Note: Registration is reset upon connection, so please register after connection.
     *
     * 切断時に呼ばれる関数を登録
     *
     * 注意: 接続時に登録がリセットされるため、接続後に登録してください
     *
     * @param func Function to be registered 登録したい関数
     */
    registerDisconnected(func) {
        this.disconnectedListeners.push(func);
    }
    /**
     * Connect to peripherals with validation.
     *
     * バリデーションのあるペリフェラルへの接続
     *
     * @param keys: Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
     * @param setting: Additional settings when connecting 接続時の追加設定
     */
    async connectWait(keys, setting) {
        var _a;
        if (this.peripheral.connected) {
            return;
        }
        // 切断時に呼ぶ関数一覧を全て削除
        this.disconnectedListeners.splice(0);
        // TODO: Enable Validation
        // if (this.mode !== 'Connectable')
        //   throw new Error(
        //     `Connection can only be used in connectable mode, the current mode is ${this.mode}`
        //   );
        await this.peripheral.connectWait(Object.assign({ pairingOption: Object.assign({ keys }, ((_a = setting === null || setting === void 0 ? void 0 : setting.pairingOption) !== null && _a !== void 0 ? _a : {})) }, (setting !== null && setting !== void 0 ? setting : {})));
    }
    /**
     * Disconnect from peripheral.
     *
     * ペリフェラルから切断
     */
    async disconnectWait() {
        if (!this.peripheral.connected) {
            return;
        }
        await this.peripheral.disconnectWait();
        // 切断時に呼ぶ関数一覧を全て削除
        this.disconnectedListeners.splice(0);
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
     * @param data Write data 書き込むデータ
     * @returns Data write result データ書き込み結果
     */
    async writeCharWait(serviceUuid, characteristicUuid, data, needResponse) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        return await characteristic.writeWait(data instanceof Uint8Array ? Array.from(data) : data, needResponse);
    }
    /**
     * Register notification to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックへ通知を登録
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @param callback Function called when data arrives データが来たときに呼ばれる関数
     */
    async subscribeWait(serviceUuid, characteristicUuid, callback) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        await characteristic.registerNotifyWait(callback !== null && callback !== void 0 ? callback : (() => {
            // do nothing.
        }));
    }
    /**
     * Unregister notification to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックから通知登録を削除
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     */
    async unsubscribeWait(serviceUuid, characteristicUuid) {
        const characteristic = this.getChar(serviceUuid, characteristicUuid);
        await characteristic.unregisterNotifyWait();
    }
}
exports.ObnizPartsBleConnectable = ObnizPartsBleConnectable;
class ObnizPartsBlePairable extends ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        /**
         * Disconnect request after pairing
         *
         * ペアリング後に切断要求を行う
         */
        this.requestDisconnectAfterPairing = true;
        /**
         * Wait for disconnect event at the end of pairing
         *
         * ペアリングの終了時には切断イベントを待つ
         */
        this.waitDisconnectAfterPairing = true;
    }
    /**
     * After pairing and before disconnect
     *
     * ペアリング後、切断前に行う操作
     */
    async afterPairingWait() {
        // do nothing
    }
    /**
     * Perform pairing
     *
     * ペアリングを実行
     *
     * @returns Pairing key ペアリングキー
     */
    async pairingWait() {
        // 接続と同時にペアリングを実行
        await this.connectWait(undefined, {
            waitUntilPairing: true,
        });
        // ペアリングキーを取得
        const keys = await this.peripheral.getPairingKeysWait();
        /**
          以下の実装と同じ
          await this._peripheral.connectWait({
            pairingOption: {
              onPairedCallback: (keys) => {
                gotKeys = keys;
              },
              onPairingFailed: (e) => {
                throw e;
              },
            },
          });
         */
        // 任意のコードを実行
        await this.afterPairingWait();
        const promise = new Promise((resolve) => {
            this.registerDisconnected(() => {
                // ペアリングキーを返す
                resolve(keys);
            });
        });
        // 切断要求を送信
        if (this.requestDisconnectAfterPairing) {
            await this.disconnectWait();
        }
        if (this.waitDisconnectAfterPairing) {
            // 切断完了を待つ
            return await promise;
        }
        else {
            // 切断完了を待たずにペアリングキーを返す
            return keys;
        }
    }
}
exports.ObnizPartsBlePairable = ObnizPartsBlePairable;
exports.iBeaconCompanyID = [0x4c, 0x00];
exports.iBeaconDataWithStrict = 
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
        func: (d, p) => { var _a; return (_a = p.rssi) !== null && _a !== void 0 ? _a : 0; },
    },
};
exports.iBeaconData = exports.iBeaconDataWithStrict;
