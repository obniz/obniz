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
        settings.activeScan = settings.activeScan !== false;
        this.scanSettings = settings;
        this.scanTarget = target;
        if (this.scanTarget && this.scanTarget.uuids) {
            this.scanTarget.uuids = this.scanTarget.uuids.map((elm) => {
                return bleHelper_1.default.uuidFilter(elm);
            });
        }
        this.scanedPeripherals = [];
        this._setTargetFilterOnDevice();
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
                if (this.scanSettings.duplicate === false) {
                    // duplicate filter
                    if (this.scanedPeripherals.find((e) => e.address === params.address)) {
                        break;
                    }
                }
                if (this.isTarget(params)) {
                    this.scanedPeripherals.push(params);
                    this.emitter.emit(notifyName, params);
                    if (this.onfind) {
                        this.onfind(params);
                    }
                }
                break;
            }
            case "onfinish": {
                this.clearTimeoutTimer();
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
    _setTargetFilterOnDevice() {
        // < 3.2.0
        if (semver_1.default.lt(this.obnizBle.Obniz.firmware_ver, "3.2.0")) {
            return;
        }
        const adFilters = [];
        if (this.scanTarget.uuids) {
            this.scanTarget.uuids.map((elm) => {
                adFilters.push({ uuid: bleHelper_1.default.uuidFilter(elm) });
            });
        }
        if (this.scanTarget.localName) {
            this._arrayWrapper(this.scanTarget.localName).forEach((name) => {
                adFilters.push({ localNamePrefix: name });
            });
        }
        if (this.scanTarget.deviceAddress) {
            this._arrayWrapper(this.scanTarget.deviceAddress).forEach((address) => {
                adFilters.push({ deviceAddress: address });
            });
        }
        if (this.scanTarget.localNamePrefix) {
            this._arrayWrapper(this.scanTarget.localNamePrefix).forEach((name) => {
                adFilters.push({ localNamePrefix: name });
            });
        }
        if (this.scanTarget.binary) {
            if (Array.isArray(this.scanTarget.binary[0])) {
                this.scanTarget.binary.forEach((e) => {
                    adFilters.push({ binary: e });
                });
            }
            else {
                adFilters.push({ binary: this.scanTarget.binary });
            }
        }
        this._setAdvertisementFilter(adFilters);
    }
    isTarget(peripheral) {
        if (!this.scanTarget ||
            Object.keys(this.scanTarget).length === 0
            || this.isLocalNamePrefixTarget(peripheral)
            || this.isLocalNameTarget(peripheral)
            || this.isUuidTarget(peripheral)
            || this.isDeviceAddressTarget(peripheral)
            || this.isBinaryTarget(peripheral)) {
            return true;
        }
        return false;
    }
    clearTimeoutTimer() {
        if (this._timeoutTimer) {
            clearTimeout(this._timeoutTimer);
            this._timeoutTimer = undefined;
        }
    }
    isLocalNameTarget(peripheral) {
        if (this.scanTarget &&
            this.scanTarget.localName) {
            for (const name of this._arrayWrapper(this.scanTarget.localName)) {
                if (name === peripheral.localName) {
                    return true;
                }
            }
        }
        return false;
    }
    isLocalNamePrefixTarget(peripheral) {
        if (this.scanTarget &&
            this.scanTarget.localNamePrefix) {
            for (const name of this._arrayWrapper(this.scanTarget.localNamePrefix)) {
                if (peripheral.localName && peripheral.localName.startsWith(name)) {
                    return true;
                }
            }
        }
        return false;
    }
    isBinaryTarget(peripheral) {
        if (this.scanTarget &&
            this.scanTarget.binary) {
            return true; // cannot detect on obnizjs
        }
        return false;
    }
    isUuidTarget(peripheral) {
        if (this.scanTarget && this.scanTarget.uuids) {
            const uuids = peripheral.advertisementServiceUuids().map((e) => {
                return bleHelper_1.default.uuidFilter(e);
            });
            for (const uuid of this.scanTarget.uuids) {
                if (uuids.includes(uuid)) {
                    return true;
                }
            }
        }
        return false;
    }
    isDeviceAddressTarget(peripheral) {
        if (this.scanTarget && this.scanTarget.deviceAddress) {
            if (this.scanTarget.deviceAddress === peripheral.address) {
                return true;
            }
        }
        return false;
    }
}
exports.default = BleScan;

//# sourceMappingURL=bleScan.js.map
