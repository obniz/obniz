"use strict";
/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const advertising_1 = __importDefault(require("./modules/advertising"));
const device_1 = __importDefault(require("./modules/device"));
/** products supporting Linking management class Linking対応製品を管理するクラス */
class Linking {
    constructor(params) {
        /** not used */
        this.PRIMARY_SERVICE_UUID_LIST = [
            'b3b3690150d34044808d50835b13a6cd',
            'fe4e',
        ];
        this.initialized = false;
        this.keys = [];
        this.requiredKeys = [];
        this.peripheral = null;
        this.onadvertisement = null;
        this.ondiscover = null;
        // Private properties
        this._discover_status = false;
        this._discover_wait = 3000; // ms
        this._discover_timer = null;
        this._peripherals = {};
    }
    static info() {
        return {
            name: 'Linking',
        };
    }
    get LinkingAdvertising() {
        return advertising_1.default;
    }
    get LinkingDevice() {
        return device_1.default;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    /**
     * Use {@linkplain initWait}
     *
     * {@linkplain initWait} を使ってください
     *
     * @deprecated
     */
    init() {
        return this.initWait();
    }
    /**
     * Initialize BLE module
     *
     * BLEを初期化
     */
    async initWait() {
        await this.obniz.ble.initWait();
        this.initialized = true;
    }
    /**
     * Use {@linkplain discoverWait}
     *
     * {@linkplain discoverWait} を使ってください
     *
     * @deprecated
     * @param p
     */
    discover(p) {
        return this.discoverWait(p);
    }
    /**
     * Search for devices with specified parameters
     *
     * 指定したパラメータのデバイスを探索
     *
     * @param p Parameters for device デバイスに関するパラメータ
     *
     * @returns Array of device objects found {@linkplain LinkingDevice}
     *
     * 見つかったデバイスオブジェクトの配列 {@linkplain LinkingDevice}
     */
    discoverWait(p) {
        this._checkInitialized();
        let duration = 5000;
        let name_filter = '';
        let id_filter = '';
        let quick = false;
        if (p && typeof p === 'object') {
            if (p.duration !== undefined && p.duration !== null) {
                duration = p.duration;
                if (duration < 1000) {
                    duration = 1000;
                }
            }
            if (p.nameFilter !== undefined && p.nameFilter !== null) {
                name_filter = p.nameFilter;
            }
            if (p.idFilter !== undefined && p.idFilter !== null) {
                id_filter = p.idFilter;
            }
            if (p.quick !== undefined && p.quick !== null) {
                quick = p.quick;
            }
        }
        return new Promise((resolve, reject) => {
            let timer = null;
            const finishDiscovery = () => {
                if (timer) {
                    clearTimeout(timer);
                }
                this.stopScan();
                const device_list = [];
                for (const addr in this._peripherals) {
                    device_list.push(this._peripherals[addr]);
                }
                resolve(device_list);
            };
            this._peripherals = {};
            this.obniz.ble.scan.onfind = (peripheral) => {
                const dev = this._discoveredDevice(peripheral, name_filter, id_filter);
                if (quick && dev) {
                    finishDiscovery();
                    return;
                }
            };
            this._scanDevices();
            this._discover_status = true;
            timer = setTimeout(() => {
                finishDiscovery();
            }, duration);
        });
    }
    _checkInitialized() {
        if (this.initialized === false) {
            throw new Error('The `init()` method has not been called yet.');
        }
        if (this._discover_status === true) {
            throw new Error('The `discover()` or the `startScan()` method is in progress.');
        }
    }
    _discoveredDevice(peripheral, name_filter, id_filter) {
        if (!peripheral.localName) {
            return null;
        }
        // if (!peripheral.id) {
        //   return null;
        // }
        if (name_filter && peripheral.localName.indexOf(name_filter) !== 0) {
            return null;
        }
        // if (id_filter && peripheral.id.indexOf(id_filter) !== 0) {
        //   return null;
        // }
        const addr = peripheral.address;
        if (this._peripherals[addr]) {
            return null;
        }
        const device = new device_1.default(peripheral);
        if (this.ondiscover && typeof this.ondiscover === 'function') {
            this.ondiscover(device);
        }
        this._peripherals[addr] = device;
        return device;
    }
    _scanDevices() {
        this.obniz.ble.scan.onfinish = () => {
            // console.log("scan timeout!")
            this._discover_status = false;
        };
        // var target = {
        //   uuids: this.PRIMARY_SERVICE_UUID_LIST
        // };
        this.obniz.ble.scan.startWait();
        this._discover_status = true;
    }
    /**
     * Finish scanning device
     *
     * デバイスのスキャンを終了
     */
    stopScan() {
        if (this._discover_status === true) {
            this._discover_status = false;
            if (this._discover_timer !== null) {
                clearTimeout(this._discover_timer);
                this._discover_timer = null;
            }
            this.obniz.ble.scan.endWait();
        }
    }
    /**
     * Start scanning the device
     *
     * デバイスのスキャンを開始
     *
     * @param p Parameters for device デバイスに関するパラメータ
     */
    startScan(p) {
        this._checkInitialized();
        let name_filter = '';
        let id_filter = '';
        if (p && typeof p === 'object') {
            if (p.nameFilter !== undefined && p.nameFilter !== null) {
                name_filter = p.nameFilter;
            }
            if (p.idFilter !== undefined && p.idFilter !== null) {
                id_filter = p.idFilter;
            }
        }
        this.obniz.ble.scan.onfind = (peripheral) => {
            if (!peripheral.localName) {
                return;
            }
            if (name_filter && peripheral.localName.indexOf(name_filter) !== 0) {
                return;
            }
            // TODO
            // if (id_filter && peripheral.id.indexOf(id_filter) !== 0) {
            //   return;
            // }
            if (typeof this.onadvertisement === 'function') {
                const parsed = advertising_1.default.parse(peripheral);
                if (parsed) {
                    this.onadvertisement(parsed);
                }
            }
        };
        this._scanDevices();
    }
}
exports.default = Linking;
