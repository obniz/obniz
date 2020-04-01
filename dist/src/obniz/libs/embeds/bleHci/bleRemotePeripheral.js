"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ble_1 = __importDefault(require("./ble"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteService_1 = __importDefault(require("./bleRemoteService"));
/**
 * @category Use as Central
 */
class BleRemotePeripheral {
    constructor(obnizBle, address) {
        /**
         * @ignore
         */
        this._connectSetting = {};
        this.obnizBle = obnizBle;
        this.address = address;
        this.connected = false;
        this.device_type = null;
        this.address_type = null;
        this.ble_event_type = null;
        this.rssi = null;
        this.adv_data = null;
        this.scan_resp = null;
        this.localName = null;
        this.iBeacon = null;
        this.keys = ["device_type", "address_type", "ble_event_type", "rssi", "adv_data", "scan_resp"];
        this._services = [];
        this.emitter = new eventemitter3_1.default();
    }
    /**
     * It contains all discovered services in a peripheral as an array.
     * It is discovered when connection automatically.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *     console.log('no such peripheral')
     *     return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   for (var service of peripheral.services) {
     *       console.log(service.uuid)
     *   }
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     */
    get services() {
        return this._services;
    }
    /**
     * @ignore
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
    /**
     * @ignore
     * @param dic
     */
    setParams(dic) {
        this.advertise_data_rows = null;
        for (const key in dic) {
            if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
                this[key] = dic[key];
            }
        }
        this.analyseAdvertisement();
    }
    /**
     * This function will try to connect a peripheral.
     * [[onconnect]] will be caled when connected or [[ondisconnect]] will be called when failed.
     *
     * If ble scanning is undergoing, scan will be terminated immediately.
     *
     * when connection established, all service/characteristics/descriptors will be discovered automatically.
     * [[onconnect]] will be called after all discovery done.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = function(){
     *          console.log("success");
     *      }
     *      peripheral.connect();
     *     }
     * }
     * obniz.ble.scan.start();
     * ```
     */
    connect(setting) { }
    /**
     * This connects obniz to the peripheral.
     * If ble scannning is undergoing, scan will be terminated immidiately.
     *
     * It throws when connection establish failed.
     *
     * when connection established, all service/characteristics/desriptors will be discovered automatically.
     * This function will wait until all discovery done.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *    uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *    console.log('no such peripheral')
     *    return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     * } catch(e) {
     *   console.log("can't connect");
     * }
     * ```
     *
     */
    async connectWait(setting) {
        this._connectSetting = setting || {};
        this._connectSetting.autoDiscovery = this._connectSetting.autoDiscovery !== false;
        this.obnizBle.scan.end();
        const p1 = this.obnizBle.centralBindings.connectWait(this.address);
        const p2 = new Promise((resolve, reject) => this.emitter.once("disconnect", () => {
            reject(new Error(`connection to peripheral name=${this.localName} address=${this.address} can't be established`));
        }));
        await Promise.race([p1, p2]);
        if (this._connectSetting.autoDiscovery) {
            await this.discoverAllHandlesWait();
        }
    }
    /**
     * This disconnects obniz from peripheral.
     *
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *  uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *   console.log('no such peripheral')
     *   return;
     * }
     *
     * peripheral.connect();
     * peripheral.onconnect = ()=>{
     *   console.log("connected");
     *   peripheral.disconnect();
     * }
     *
     * ```
     */
    disconnect() {
        this.obnizBle.centralBindings.disconnect(this.address);
    }
    /**
     * This disconnects obniz from peripheral.
     *
     * It throws when failed
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *  uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *   console.log('no such peripheral')
     *   return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await peripheral.disconnectWait();
     *   console.log("disconnected");
     * } catch(e) {
     *    console.log("can't connect / can't disconnect");
     * }
     * ```
     */
    disconnectWait() {
        return new Promise((resolve, reject) => {
            // if (!this.connected) {
            //   resolve();
            //   return;
            // }
            this.emitter.once("statusupdate", (params) => {
                if (params.status === "disconnected") {
                    resolve(true); // for compatibility
                }
                else {
                    reject(new Error(`cutting connection to peripheral name=${this.localName} address=${this.address} was failed`));
                }
            });
            this.disconnect();
        });
    }
    /**
     * It returns a service which having specified uuid in [[services]].
     * Case is ignored. So aa00 and AA00 are the same.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *   console.log('no such peripheral')
     *   return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   var service = peripheral.getService("1800")
     *   if (!service) {
     *     console.log("service not found")
     *     return;
     *   }
     *   console.log(service.uuid)
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     * @param uuid
     */
    getService(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        for (const key in this._services) {
            if (this._services[key].uuid === uuid) {
                return this._services[key];
            }
        }
        return null;
    }
    /**
     * @ignore
     * @param param
     */
    findService(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        return this.getService(serviceUuid);
    }
    /**
     * @ignore
     * @param param
     */
    findCharacteristic(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        const characteristicUuid = bleHelper_1.default.uuidFilter(param.characteristic_uuid);
        const s = this.getService(serviceUuid);
        if (s) {
            return s.getCharacteristic(characteristicUuid);
        }
        return null;
    }
    /**
     * @ignore
     * @param param
     */
    findDescriptor(param) {
        const descriptorUuid = bleHelper_1.default.uuidFilter(param.descriptor_uuid);
        const c = this.findCharacteristic(param);
        if (c) {
            return c.getDescriptor(descriptorUuid);
        }
        return null;
    }
    /**
     * Discover services.
     *
     * If connect setting param 'autoDiscovery' is true(default),
     * services are automatically disvocer on connection established.
     *
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = async function(){
     *          console.log("success");
     *          await peripheral.discoverAllServicesWait(); //manually discover
     *          let service = peripheral.getService("1800");
     *      }
     *      peripheral.connect({autoDiscovery:false});
     *     }
     * }
     * obniz.ble.scan.start();
     * ```
     */
    async discoverAllServicesWait() {
        const serviceUuids = await this.obnizBle.centralBindings.discoverServicesWait(this.address);
        for (const uuid of serviceUuids) {
            let child = this.getService(uuid);
            if (!child) {
                const newService = new bleRemoteService_1.default({ uuid });
                newService.parent = this;
                this._services.push(newService);
                child = newService;
            }
            child.discoverdOnRemote = true;
            if (this.ondiscoverservice) {
                this.ondiscoverservice(child);
            }
        }
        const children = this._services.filter((elm) => {
            return elm.discoverdOnRemote;
        });
        if (this.ondiscoverservicefinished) {
            this.ondiscoverservicefinished(children);
        }
        return children;
    }
    /**
     * @ignore
     */
    async discoverAllHandlesWait() {
        const ArrayFlat = (array, depth) => {
            const flattend = [];
            (function flat(_array, _depth) {
                for (const el of _array) {
                    if (Array.isArray(el) && _depth > 0) {
                        flat(el, _depth - 1);
                    }
                    else {
                        flattend.push(el);
                    }
                }
            })(array, Math.floor(depth) || 1);
            return flattend;
        };
        const services = await this.discoverAllServicesWait();
        console.warn("discoverAllCharacteristicsWait");
        const charsNest = await Promise.all(services.map((s) => s.discoverAllCharacteristicsWait()));
        const chars = ArrayFlat(charsNest);
        console.warn("discoverAllDescriptorsWait");
        const descriptorsNest = await Promise.all(chars.map((c) => c.discoverAllDescriptorsWait()));
        // eslint-disable-next-line no-unused-vars
        const descriptors = ArrayFlat(descriptorsNest);
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
            case "statusupdate": {
                if (params.status === "connected") {
                    this.connected = true;
                    if (this.onconnect) {
                        this.onconnect();
                    }
                    this.emitter.emit("connect");
                }
                if (params.status === "disconnected") {
                    this.connected = false;
                    if (this.ondisconnect) {
                        this.ondisconnect();
                    }
                    this.emitter.emit("disconnect");
                }
                break;
            }
        }
    }
    /**
     * @ignore
     */
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
    pairingWait(keys) {
        return new Promise((resolve) => {
            this.obnizBle.centralBindings.pairing(this.address, keys, resolve);
        });
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
        if (!data || data[0] !== 0x4c || data[1] !== 0x00 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) {
            this.iBeacon = null;
            return;
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
        const uuidLength = bit / 8;
        for (let i = 0; i < data.length; i = i + uuidLength) {
            const one = data.slice(i, i + uuidLength);
            results.push(ble_1.default._dataArray2uuidHex(one, true));
        }
    }
}
exports.default = BleRemotePeripheral;

//# sourceMappingURL=bleRemotePeripheral.js.map
