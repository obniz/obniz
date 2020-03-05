"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
const emitter = require("eventemitter3");
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteService_1 = __importDefault(require("./bleRemoteService"));
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
class BleRemotePeripheral {
    constructor(Obniz, address) {
        this.Obniz = Obniz;
        this.address = address;
        this.connected = false;
        this.device_type = null;
        this.address_type = null;
        this.ble_event_type = null;
        this.rssi = null;
        this.adv_data = null;
        this.scan_resp = null;
        this.keys = [
            "device_type",
            "address_type",
            "ble_event_type",
            "rssi",
            "adv_data",
            "scan_resp",
        ];
        this._services = [];
        this.emitter = new emitter();
    }
    get services() {
        return this._services;
    }
    /**
     *
     * @return {String} json value
     */
    toString() {
        return JSON.stringify({
            address: this.address,
            addressType: this.address_type,
            advertisement: this.adv_data,
            scanResponse: this.scan_resp,
            rssi: this.rssi,
        });
    }
    setParams(dic) {
        this.advertise_data_rows = null;
        for (const key in dic) {
            if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
                this[key] = dic[key];
            }
        }
        this.analyseAdvertisement();
    }
    analyseAdvertisement() {
        if (!this.advertise_data_rows) {
            this.advertise_data_rows = [];
            if (this.adv_data) {
                for (let i = 0; i < this.adv_data.length; i++) {
                    const length = this.adv_data[i];
                    const arr = new Array(length);
                    for (let j = 0; j < length; j++) {
                        arr[j] = this.adv_data[i + j + 1];
                    }
                    this.advertise_data_rows.push(arr);
                    i = i + length;
                }
            }
            if (this.scan_resp) {
                for (let i = 0; i < this.scan_resp.length; i++) {
                    const length = this.scan_resp[i];
                    const arr = new Array(length);
                    for (let j = 0; j < length; j++) {
                        arr[j] = this.scan_resp[i + j + 1];
                    }
                    this.advertise_data_rows.push(arr);
                    i = i + length;
                }
            }
            this.setLocalName();
            this.setIBeacon();
        }
    }
    searchTypeVal(type) {
        this.analyseAdvertisement();
        for (let i = 0; i < this.advertise_data_rows.length; i++) {
            if (this.advertise_data_rows[i][0] === type) {
                const results = [].concat(this.advertise_data_rows[i]);
                results.shift();
                return results;
            }
        }
        return undefined;
    }
    setLocalName() {
        let data = this.searchTypeVal(0x09);
        if (!data) {
            data = this.searchTypeVal(0x08);
        }
        if (!data) {
            this.localName = null;
        }
        else {
            this.localName = String.fromCharCode.apply(null, data);
        }
    }
    setIBeacon() {
        const data = this.searchTypeVal(0xff);
        if (!data ||
            data[0] !== 0x4c ||
            data[1] !== 0x00 ||
            data[2] !== 0x02 ||
            data[3] !== 0x15 ||
            data.length !== 25) {
            this.iBeacon = null;
            return;
        }
        const uuidData = data.slice(4, 20);
        let uuid = "";
        for (let i = 0; i < uuidData.length; i++) {
            uuid = uuid + ("00" + uuidData[i].toString(16)).slice(-2);
            if (i === 4 - 1 ||
                i === 4 + 2 - 1 ||
                i === 4 + 2 * 2 - 1 ||
                i === 4 + 2 * 3 - 1) {
                uuid += "-";
            }
        }
        const major = (data[20] << 8) + data[21];
        const minor = (data[22] << 8) + data[23];
        const power = data[24];
        this.iBeacon = {
            uuid,
            major,
            minor,
            power,
            rssi: this.rssi,
        };
    }
    _addServiceUuids(results, data, bit) {
        if (!data) {
            return;
        }
        const uuidLength = bit / 4;
        for (let i = 0; i < data.length; i = i + uuidLength) {
            const one = data.slice(i, i + uuidLength);
            results.push(this.Obniz.ble.constructor._dataArray2uuidHex(one, true));
        }
    }
    advertisementServiceUuids() {
        const results = [];
        this._addServiceUuids(results, this.searchTypeVal(0x02), 16);
        this._addServiceUuids(results, this.searchTypeVal(0x03), 16);
        this._addServiceUuids(results, this.searchTypeVal(0x04), 32);
        this._addServiceUuids(results, this.searchTypeVal(0x05), 32);
        this._addServiceUuids(results, this.searchTypeVal(0x06), 64);
        this._addServiceUuids(results, this.searchTypeVal(0x07), 64);
        return results;
    }
    connect() {
        this.Obniz.ble.scan.end();
        const obj = {
            ble: {
                connect: {
                    address: this.address,
                },
            },
        };
        this.Obniz.send(obj);
    }
    connectWait() {
        return new Promise((resolve, reject) => {
            this.emitter.once("statusupdate", (params) => {
                if (params.status === "connected") {
                    resolve(true);
                }
                else {
                    reject(new Error("connection not established"));
                }
            });
            this.connect();
        });
    }
    disconnect() {
        const obj = {
            ble: {
                disconnect: {
                    address: this.address,
                },
            },
        };
        this.Obniz.send(obj);
    }
    disconnectWait() {
        return new Promise((resolve, reject) => {
            this.emitter.once("statusupdate", (params) => {
                if (params.status === "disconnected") {
                    resolve(true);
                }
                else {
                    reject(new Error("disconnectWait failed"));
                }
            });
            this.disconnect();
        });
    }
    getService(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        for (const key in this._services) {
            if (this._services[key].uuid === uuid) {
                return this._services[key];
            }
        }
        return undefined;
    }
    findService(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        return this.getService(serviceUuid);
    }
    findCharacteristic(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        const characteristicUuid = bleHelper_1.default.uuidFilter(param.characteristic_uuid);
        const s = this.getService(serviceUuid);
        if (s) {
            return s.getCharacteristic(characteristicUuid);
        }
        return null;
    }
    findDescriptor(param) {
        const descriptorUuid = bleHelper_1.default.uuidFilter(param.descriptor_uuid);
        const c = this.findCharacteristic(param);
        if (c) {
            return c.getDescriptor(descriptorUuid);
        }
        return null;
    }
    discoverAllServices() {
        const obj = {
            ble: {
                get_services: {
                    address: this.address,
                },
            },
        };
        this.Obniz.send(obj);
    }
    discoverAllServicesWait() {
        return new Promise((resolve) => {
            this.emitter.once("discoverfinished", () => {
                const children = this._services.filter((elm) => {
                    return elm.discoverdOnRemote;
                });
                resolve(children);
            });
            this.discoverAllServices();
        });
    }
    async discoverAllHandlesWait() {
        const ArrayFlat = (array, depth) => {
            const flattend = [];
            const flat = (_array, _depth) => {
                for (const el of _array) {
                    if (Array.isArray(el) && _depth > 0) {
                        flat(el, _depth - 1);
                    }
                    else {
                        flattend.push(el);
                    }
                }
            };
            flat(array, Math.floor(depth) || 1);
            return flattend;
        };
        const services = await this.discoverAllServicesWait();
        const charsNest = await Promise.all(services.map((s) => s.discoverAllCharacteristicsWait()));
        const chars = ArrayFlat(charsNest);
        const descriptorsNest = await Promise.all(chars.map((c) => c.discoverAllDescriptorsWait()));
        // eslint-disable-next-line no-unused-vars
        const descriptors = ArrayFlat(descriptorsNest);
    }
    onconnect() {
    }
    ondisconnect() {
    }
    ondiscoverservice(child) {
    }
    ondiscoverservicefinished(children) {
    }
    ondiscover() {
    }
    ondiscoverfinished() {
    }
    async notifyFromServer(notifyName, params) {
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
            case "statusupdate": {
                if (params.status === "connected") {
                    this.connected = true;
                    await this.discoverAllHandlesWait();
                    this.onconnect();
                }
                if (params.status === "disconnected") {
                    this.connected = false;
                    this.ondisconnect();
                }
                break;
            }
            case "discover": {
                const uuid = params.service_uuid;
                let child = this.getService(uuid);
                if (!child) {
                    const newService = new bleRemoteService_1.default({ uuid });
                    newService.parent = this;
                    this._services.push(newService);
                    child = newService;
                }
                child.discoverdOnRemote = true;
                this.ondiscoverservice(child);
                break;
            }
            case "discoverfinished": {
                const children = this._services.filter((elm) => {
                    return elm.discoverdOnRemote;
                });
                this.ondiscoverservicefinished(children);
                break;
            }
        }
    }
    onerror() {
    }
}
exports.default = BleRemotePeripheral;
//# sourceMappingURL=bleRemotePeripheral.js.map