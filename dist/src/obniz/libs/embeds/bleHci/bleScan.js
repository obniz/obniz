"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const semver_1 = __importDefault(require("semver"));
const util_1 = __importDefault(require("../../utils/util"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
/**
 * @category Use as Central
 */
class BleScan {
    constructor(obnizBle) {
        this._delayNotifyTimers = [];
        this.scanTarget = {};
        this.scanSettings = {};
        this.obnizBle = obnizBle;
        this.emitter = new eventemitter3_1.default();
        this.scanedPeripherals = [];
        this._timeoutTimer = undefined;
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
     * obniz.ble.scan.start(target, setting);
     * ```
     *
     * This is also possible without params being valid.
     *
     * ```javascript
     * // Javascript Example
     * obniz.ble.scan.start();
     * ```
     *
     * @param target
     * @param settings
     */
    start(target = {}, settings = {}) {
        this.obnizBle.warningIfNotInitialize();
        const timeout = settings.duration === undefined ? 30 : settings.duration;
        settings.duplicate = !!settings.duplicate;
        settings.filterOnDevice = !!settings.filterOnDevice;
        settings.activeScan = settings.activeScan !== false;
        this.scanSettings = settings;
        target = target || {};
        this.scanTarget.binary = target.binary;
        this.scanTarget.deviceAddress = target.deviceAddress;
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
        this.obnizBle.centralBindings.startScanning(null, false, settings.activeScan);
        this.clearTimeoutTimer();
        if (timeout !== null) {
            this._timeoutTimer = setTimeout(() => {
                this._timeoutTimer = undefined;
                this.end();
            }, timeout * 1000);
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
    startOneWait(target, settings) {
        let state = 0;
        return new Promise((resolve) => {
            this.emitter.once("onfind", (param) => {
                if (state === 0) {
                    state = 1;
                    this.end();
                    resolve(param);
                }
            });
            this.emitter.once("onfinish", () => {
                if (state === 0) {
                    state = 1;
                    resolve(null);
                }
            });
            this.start(target, settings);
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
    startAllWait(target, settings) {
        return new Promise((resolve) => {
            this.emitter.once("onfinish", () => {
                resolve(this.scanedPeripherals);
            });
            this.start(target, settings);
        });
    }
    /**
     * This stops scanning BLE.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.scan.start();
     * await obniz.wait(5000);
     * obniz.ble.scan.end();
     * ```
     */
    end() {
        this.clearTimeoutTimer();
        this.obnizBle.centralBindings.stopScanning();
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case "onfind": {
                const peripheral = params;
                const alreadyGotCompleteAdveData = peripheral.adv_data &&
                    peripheral.adv_data.length > 0 &&
                    peripheral.scan_resp &&
                    peripheral.scan_resp.length > 0;
                const nonConnectable = peripheral.ble_event_type === "non_connectable_advertising";
                const maybeAdvOnly = this._delayNotifyTimers.find((e) => e.peripheral.address === peripheral.address) &&
                    (!peripheral.scan_resp || peripheral.scan_resp.length === 0);
                // wait for adv_data + scan resp
                // 10 seconds timeout
                if (alreadyGotCompleteAdveData || nonConnectable || maybeAdvOnly) {
                    this._removeDelayNotifyTimer(peripheral.address);
                    this._notifyOnFind(peripheral);
                }
                else {
                    const timer = setInterval(() => {
                        this._notifyOnFind(peripheral);
                    }, 10000);
                    this._delayNotifyTimers.push({ timer, peripheral });
                }
                break;
            }
            case "onfinish": {
                this.clearTimeoutTimer();
                this._delayNotifyTimers.forEach((e) => this._notifyOnFind(e.peripheral));
                this._clearDelayNotifyTimer();
                this.emitter.emit(notifyName, this.scanedPeripherals);
                if (this.onfinish) {
                    this.onfinish(this.scanedPeripherals);
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
        if (semver_1.default.lt(this.obnizBle.Obniz.firmware_ver, "3.2.0")) {
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
                    value: [0x08, ...util_1.default.string2dataArray(filterVal.localNamePrefix)],
                });
                filters.push({
                    range: {
                        index: 9,
                        length: 255,
                    },
                    value: [0x09, ...util_1.default.string2dataArray(filterVal.localNamePrefix)],
                });
            }
            if (filterVal.deviceAddress) {
                filters.push({
                    range: {
                        index: 2,
                        length: 6,
                    },
                    value: util_1.default.hexToBinary(filterVal.deviceAddress, true),
                });
            }
            if (filterVal.uuid) {
                const binary = util_1.default.hexToBinary(filterVal.uuid, true);
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
        if (semver_1.default.lt(this.obnizBle.Obniz.firmware_ver, "3.2.0")) {
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
            if (Array.isArray(scanTarget.binary[0])) {
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
    _notifyOnFind(peripheral) {
        if (this.scanSettings.duplicate === false) {
            // duplicate filter
            if (this.scanedPeripherals.find((e) => e.address === peripheral.address)) {
                return;
            }
        }
        if (this.isTarget(peripheral)) {
            this.scanedPeripherals.push(peripheral);
            this.emitter.emit("onfind", peripheral);
            if (this.onfind) {
                this.onfind(peripheral);
            }
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
        return false;
    }
    isUuidTarget(peripheral) {
        if (!this.scanTarget.uuids || this.scanTarget.uuids.length === 0) {
            return false;
        }
        const uuids = peripheral.advertisementServiceUuids().map((e) => {
            return bleHelper_1.default.uuidFilter(e);
        });
        for (const uuid of this.scanTarget.uuids) {
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
        if (this.scanTarget.deviceAddress === peripheral.address) {
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
exports.default = BleScan;

//# sourceMappingURL=bleScan.js.map
