"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleScan = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const assert_1 = require("assert");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const semver_1 = __importDefault(require("semver"));
const ObnizError_1 = require("../../../ObnizError");
const util_1 = require("../../utils/util");
const bleHelper_1 = __importDefault(require("./bleHelper"));
/**
 * @category Use as Central
 */
class BleScan {
    constructor(obnizBle) {
        this.state = 'stopped';
        this._delayNotifyTimers = [];
        this.obnizBle = obnizBle;
        this.emitter = new eventemitter3_1.default();
        this.scanTarget = {};
        this.scanSettings = {};
        this.scanedPeripherals = [];
        this._timeoutTimer = undefined;
        this.obnizBle.Obniz.on('_close', () => {
            this.clearTimeoutTimer();
        });
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.scanTarget = {};
        this.scanSettings = {};
        this.scanedPeripherals = [];
        this.clearTimeoutTimer();
        this.finish(new Error(`Reset Occurred while scanning.`));
    }
    /**
     * Use startWait() instead.
     *
     * @deprecated
     */
    start(target = {}, settings = {}) {
        console.log(`start() is deprecated since 3.5.0. Use startWait() instead`);
        this.startWait(target, settings)
            .then(() => {
            // do nothing.
        })
            .catch((e) => {
            throw e;
        });
    }
    /**
     * This starts scanning BLE.
     *
     * You can filter uuids or localName using the target param.
     *
     * ```javascript
     * // Javascript Example
     * var target = {
     *     uuids: ["fff0","FFF1"],     //scan only has uuids "fff0" and "FFF1"
     *     localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
     * };
     *
     * var setting = {
     *    duration : 10  //scan duration time in seconds. default is 30 sec.
     * }
     *
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait(target, setting);
     * ```
     *
     * This is also possible without params being valid.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.scan.startWait();
     * ```
     *
     * Scanning starts with no error and results with not advertisement found while a device is trying to connect a peripheral.
     * Before start scannnig. Establishing connection must be completed or canceled.
     *
     * @param target
     * @param settings
     */
    async startWait(target = {}, settings = {}) {
        this.obnizBle.warningIfNotInitialize();
        if (this.isContainingBleScanSettingProperty(target)) {
            this.obnizBle.Obniz.warning({
                alert: 'warning',
                message: `Unexpected arguments. It might be contained the second argument keys. Please check object keys and order of 'startWait()' / 'startOneWait()' / 'startAllWait()' arguments. `,
            });
        }
        const ble5DeviceFilterSupportVersion = '4.1.0';
        if (settings.filterOnDevice === true &&
            this.obnizBle.hci._extended === true &&
            semver_1.default.lt(semver_1.default.coerce(this.obnizBle.Obniz.firmware_ver), ble5DeviceFilterSupportVersion)) {
            this.obnizBle.Obniz.warning({
                alert: 'warning',
                message: `filterOnDevice=true on BLE5.0 is not supported obnizOS ${this.obnizBle.Obniz.firmware_ver}. Please use filterOnDevice=false or obniz.ble.initWait({extended:false}) for BLE4.2 scan`,
            });
        }
        this.state = 'starting';
        try {
            const timeout = settings.duration === undefined ? 30 : settings.duration;
            settings.duplicate = !!settings.duplicate;
            settings.filterOnDevice = !!settings.filterOnDevice;
            settings.activeScan = settings.activeScan !== false;
            settings.waitBothAdvertisementAndScanResponse =
                settings.waitBothAdvertisementAndScanResponse !== false;
            this.scanSettings = settings;
            this.scanTarget = {};
            target = target || {};
            this.scanTarget.binary = target.binary;
            if (target && target.deviceAddress) {
                this.scanTarget.deviceAddress = this._arrayWrapper(target.deviceAddress).map((elm) => {
                    return bleHelper_1.default.deviceAddressFilter(elm);
                });
            }
            this.scanTarget.localName = target.localName;
            this.scanTarget.localNamePrefix = target.localNamePrefix;
            this.scanTarget.uuids = [];
            if (target && target.uuids) {
                this.scanTarget.uuids = target.uuids.map((elm) => {
                    return bleHelper_1.default.uuidFilter(elm);
                });
            }
            this.scanedPeripherals = [];
            this._clearDelayNotifyTimer();
            if (settings.filterOnDevice) {
                this._setTargetFilterOnDevice(this.scanTarget);
            }
            else {
                this._setTargetFilterOnDevice({}); // clear
            }
            if (settings.usePhyCoded === undefined) {
                settings.usePhyCoded = true;
            }
            if (settings.usePhy1m === undefined) {
                settings.usePhy1m = true;
            }
            if (this.obnizBle.hci._extended) {
                await this.obnizBle.centralBindings.startExtendedScanningWait([], settings.duplicate, settings.activeScan, settings.usePhy1m, settings.usePhyCoded);
            }
            else {
                await this.obnizBle.centralBindings.startScanningWait([], settings.duplicate, settings.activeScan);
            }
            this.clearTimeoutTimer();
            if (timeout !== null) {
                this._timeoutTimer = setTimeout(async () => {
                    this._timeoutTimer = undefined;
                    try {
                        await this.endWait();
                    }
                    catch (e) {
                        this.finish(e instanceof Error ? e : new Error(`${e}`));
                    }
                }, timeout * 1000);
            }
            this.state = 'started';
        }
        catch (e) {
            this.state = 'stopped';
            throw e;
        }
    }
    /**
     * This scans and returns the first peripheral that was found among the objects specified in the target.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     *
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * console.log(peripheral);
     * ```
     *
     * @param target
     * @param settings
     */
    async startOneWait(target, settings = {}) {
        await this.startWait(target, settings);
        return new Promise((resolve, reject) => {
            this.emitter.once('onfind', async (peripheral, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(peripheral);
                await this.endWait();
            });
            this.emitter.once('onfinish', (peripherals, error) => {
                if (error) {
                    (0, assert_1.rejects)(error);
                    return;
                }
                resolve(null);
            });
        });
    }
    /**
     * This scans and returns all the peripherals found.
     *
     * This function does not return until scanning gets timed out.(default 30sec)
     * If you want to change the default duration, you can do so with the duration param.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *  uuids: ["fff0"],
     * };
     * var setting = {
     *   duration : 10
     * }
     *
     * var peripherals = await obniz.ble.scan.startAllWait(target,setting);
     *
     * for(var peripheral of peripherals){
     *   console.log(peripheral);
     * }
     * ```
     *
     * @param target
     * @param settings
     */
    async startAllWait(target, settings) {
        await this.startWait(target, settings);
        return new Promise((resolve, reject) => {
            this.emitter.once('onfinish', (peripherals, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(this.scanedPeripherals);
            });
        });
    }
    /**
     * Use endWait() instead
     *
     * @deprecated
     */
    end() {
        console.log(`end() is deprecated since 3.5.0. Use endWait() instead`);
        this.endWait()
            .then(() => {
            // do nothing.
        })
            .catch((e) => {
            throw e;
        });
    }
    /**
     * This stops scanning BLE.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait();
     * await obniz.wait(5000);
     * await obniz.ble.scan.endWait();
     * ```
     */
    async endWait() {
        if (this.state === 'started' || this.state === 'starting') {
            this.state = 'stopping';
            this.clearTimeoutTimer();
            if (this.obnizBle.hci._extended) {
                await this.obnizBle.centralBindings.stopExtendedScanningWait();
            }
            else {
                await this.obnizBle.centralBindings.stopScanningWait();
            }
            this.finish(); // state will changed to stopped inside of this function.
        }
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case 'obnizClose': {
                this.finish(new ObnizError_1.ObnizOfflineError());
                break;
            }
            case 'onfind': {
                const peripheral = params;
                const alreadyGotCompleteAdveData = peripheral.adv_data &&
                    peripheral.adv_data.length > 0 &&
                    peripheral.scan_resp &&
                    peripheral.scan_resp.length > 0;
                const nonConnectable = peripheral.ble_event_type === 'non_connectable_advertising';
                const maybeAdvOnly = this._delayNotifyTimers.find((e) => e.peripheral.address === peripheral.address) &&
                    (!peripheral.scan_resp || peripheral.scan_resp.length === 0);
                // wait for adv_data + scan resp
                // 10 seconds timeout
                if (alreadyGotCompleteAdveData ||
                    nonConnectable ||
                    maybeAdvOnly ||
                    this.scanSettings.activeScan === false || // only receive adv
                    this.scanSettings.waitBothAdvertisementAndScanResponse === false) {
                    this._removeDelayNotifyTimer(peripheral.address);
                    this._notifyOnFind(peripheral);
                }
                else {
                    const timer = setTimeout(() => {
                        this._notifyOnFind(peripheral);
                    }, 10 * 1000);
                    this._delayNotifyTimers.push({ timer, peripheral });
                }
                break;
            }
        }
    }
    /**
     * Clear advertisement filter.
     */
    clearAdvertisementFilter() {
        this.obnizBle.Obniz.send({
            ble: {
                hci: {
                    advertisement_filter: [],
                },
            },
        });
    }
    _setAdvertisementFilter(filterVals) {
        // < 3.2.0
        if (semver_1.default.lt(this.obnizBle.Obniz.firmware_ver, '3.2.0')) {
            return;
        }
        // #define BLE_AD_REPORT_DEVICE_ADDRESS_INDEX 2
        // #define BLE_AD_REPORT_ADVERTISMENT_INDEX 9
        const filters = [];
        filterVals.forEach((filterVal) => {
            if (filterVal.localNamePrefix) {
                filters.push({
                    range: {
                        index: 9,
                        length: 255,
                    },
                    value: [0x08, ...util_1.ObnizUtil.string2dataArray(filterVal.localNamePrefix)],
                });
                filters.push({
                    range: {
                        index: 9,
                        length: 255,
                    },
                    value: [0x09, ...util_1.ObnizUtil.string2dataArray(filterVal.localNamePrefix)],
                });
            }
            if (filterVal.deviceAddress) {
                filters.push({
                    range: {
                        index: 2,
                        length: 6,
                    },
                    value: util_1.ObnizUtil.hexToBinary(filterVal.deviceAddress, true),
                });
            }
            if (filterVal.uuid) {
                const binary = util_1.ObnizUtil.hexToBinary(filterVal.uuid, true);
                filters.push({
                    range: {
                        index: 9,
                        length: 255,
                    },
                    value: binary,
                });
            }
            if (filterVal.binary) {
                filters.push({
                    range: {
                        index: 0,
                        length: 255,
                    },
                    value: filterVal.binary,
                });
            }
        });
        this.obnizBle.Obniz.send({
            ble: {
                hci: {
                    advertisement_filter: filters,
                },
            },
        });
    }
    _arrayWrapper(val) {
        if (Array.isArray(val)) {
            return val;
        }
        else {
            return [val];
        }
    }
    _setTargetFilterOnDevice(scanTarget) {
        // < 3.2.0
        if (semver_1.default.lt(this.obnizBle.Obniz.firmware_ver, '3.2.0')) {
            return;
        }
        const adFilters = [];
        if (scanTarget.uuids) {
            scanTarget.uuids.map((elm) => {
                adFilters.push({ uuid: bleHelper_1.default.uuidFilter(elm) });
            });
        }
        if (scanTarget.localName) {
            this._arrayWrapper(scanTarget.localName).forEach((name) => {
                adFilters.push({ localNamePrefix: name });
            });
        }
        if (scanTarget.deviceAddress) {
            this._arrayWrapper(scanTarget.deviceAddress).forEach((address) => {
                adFilters.push({ deviceAddress: address });
            });
        }
        if (scanTarget.localNamePrefix) {
            this._arrayWrapper(scanTarget.localNamePrefix).forEach((name) => {
                adFilters.push({ localNamePrefix: name });
            });
        }
        if (scanTarget.binary) {
            if (Array.isArray(scanTarget.binary)) {
                scanTarget.binary.forEach((e) => {
                    adFilters.push({ binary: e });
                });
            }
            else {
                adFilters.push({ binary: scanTarget.binary });
            }
        }
        this._setAdvertisementFilter(adFilters);
    }
    isTarget(peripheral) {
        const functionBinding = {
            localNamePrefix: this.isLocalNamePrefixTarget.bind(this),
            localName: this.isLocalNameTarget.bind(this),
            uuids: this.isUuidTarget.bind(this),
            deviceAddress: this.isDeviceAddressTarget.bind(this),
            binary: this.isBinaryTarget.bind(this),
        };
        if (!this.scanTarget) {
            // no filter
            return true;
        }
        let noFilter = true;
        // no filter
        for (const key in functionBinding) {
            const oneTarget = this.scanTarget[key];
            if (oneTarget) {
                if (Array.isArray(oneTarget) && oneTarget.length > 0) {
                    noFilter = false;
                }
                else if (!Array.isArray(oneTarget) && oneTarget) {
                    noFilter = false;
                }
            }
        }
        if (noFilter) {
            return true;
        }
        let isTarget = false;
        for (const key in functionBinding) {
            const targetDetectFunc = functionBinding[key];
            isTarget = isTarget || targetDetectFunc(peripheral);
        }
        return isTarget;
    }
    clearTimeoutTimer() {
        if (this._timeoutTimer) {
            clearTimeout(this._timeoutTimer);
            this._timeoutTimer = undefined;
        }
    }
    finish(error) {
        if (this.state !== 'stopped') {
            this.clearTimeoutTimer();
            this._delayNotifyTimers.forEach((e) => this._notifyOnFind(e.peripheral));
            this._clearDelayNotifyTimer();
            this.state = 'stopped';
            this.emitter.emit('onfinish', this.scanedPeripherals, error);
            this.obnizBle.Obniz._runUserCreatedFunction(this.onfinish, this.scanedPeripherals, error);
        }
    }
    _notifyOnFind(peripheral) {
        if (this.scanSettings.duplicate === false) {
            // duplicate filter
            if (this.scanedPeripherals.find((e) => e.address === peripheral.address)) {
                return;
            }
        }
        if (this.isTarget(peripheral)) {
            this.scanedPeripherals.push(peripheral);
            this.emitter.emit('onfind', peripheral);
            this.obnizBle.Obniz._runUserCreatedFunction(this.onfind, peripheral);
        }
    }
    isLocalNameTarget(peripheral) {
        if (!this.scanTarget.localName) {
            return false;
        }
        for (const name of this._arrayWrapper(this.scanTarget.localName)) {
            if (name === peripheral.localName) {
                return true;
            }
        }
        return false;
    }
    isLocalNamePrefixTarget(peripheral) {
        if (!this.scanTarget.localNamePrefix) {
            return false;
        }
        for (const name of this._arrayWrapper(this.scanTarget.localNamePrefix)) {
            if (peripheral.localName && peripheral.localName.startsWith(name)) {
                return true;
            }
        }
        return false;
    }
    isBinaryTarget(peripheral) {
        if (!this.scanTarget.binary) {
            return false;
        }
        return true; // cannot detect on obnizjs
    }
    isUuidTarget(peripheral) {
        if (!this.scanTarget.uuids || this.scanTarget.uuids.length === 0) {
            return false;
        }
        const uuids = peripheral.advertisementServiceUuids().map((e) => {
            return bleHelper_1.default.uuidFilter(e);
        });
        for (const uuid of this._arrayWrapper(this.scanTarget.uuids)) {
            if (uuids.includes(uuid)) {
                return true;
            }
        }
        return false;
    }
    isDeviceAddressTarget(peripheral) {
        if (!this.scanTarget.deviceAddress) {
            return false;
        }
        for (const deviceAddress of this._arrayWrapper(this.scanTarget.deviceAddress)) {
            if (deviceAddress === peripheral.address) {
                return true;
            }
        }
        return false;
    }
    isContainingBleScanSettingProperty(arg) {
        if (arg === null) {
            return false;
        }
        else if ('duration' in arg ||
            'duplicate' in arg ||
            'activeScan' in arg ||
            'filterOnDevice' in arg ||
            'waitBothAdvertisementAndScanResponse' in arg) {
            return true;
        }
        return false;
    }
    _clearDelayNotifyTimer() {
        this._delayNotifyTimers.forEach((e) => {
            clearTimeout(e.timer);
        });
        this._delayNotifyTimers = [];
    }
    _removeDelayNotifyTimer(targetAddress) {
        this._delayNotifyTimers = this._delayNotifyTimers.filter((e) => {
            if (e.peripheral.address === targetAddress) {
                clearTimeout(e.timer);
                return false;
            }
            return true;
        });
    }
}
exports.BleScan = BleScan;
