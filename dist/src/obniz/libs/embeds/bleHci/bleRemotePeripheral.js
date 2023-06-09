"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleRemotePeripheral = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../ObnizError");
const ble_1 = require("./ble");
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteService_1 = require("./bleRemoteService");
const retry_1 = require("../../utils/retry");
/**
 * @category Use as Central
 */
class BleRemotePeripheral {
    constructor(obnizBle, address) {
        this.advertisingDataRows = {};
        this.scanResponseDataRows = {};
        /**
         * @ignore
         */
        this._connectSetting = {};
        /**
         * Indicating this peripheral is found by scan or set from software.
         *
         * @ignore
         */
        this.discoverdOnRemote = undefined;
        this.keys = [
            'device_type',
            'address_type',
            'ble_event_type',
            'rssi',
            'adv_data',
            'scan_resp',
            'service_data',
            'primary_phy',
            'secondary_phy',
        ];
        this._extended = false;
        this.obnizBle = obnizBle;
        this.address = address;
        this.connected = false;
        this.connected_at = null;
        this.device_type = null;
        this.address_type = null;
        this.ble_event_type = null;
        this.rssi = null;
        this.primary_phy = null;
        this.secondary_phy = null;
        // this.adv_data = null;
        this.scan_resp = null;
        this.localName = null;
        this.manufacturerSpecificData = null;
        this.manufacturerSpecificDataInScanResponse = null;
        this.serviceData = null;
        this.iBeacon = null;
        this._services = [];
        this.emitter = new eventemitter3_1.default();
        this.service_data = null;
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
            // eslint-disable-next-line no-prototype-builtins
            if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
                this[key] = dic[key];
            }
        }
        this.analyseAdvertisement();
    }
    /**
     * @ignore
     * @param extendedMode
     */
    setExtendFlg(extendedMode) {
        this._extended = extendedMode;
    }
    /**
     * @deprecated As of release 3.5.0, replaced by {@link #connectWait()}
     */
    connect(setting) {
        // noinspection JSIgnoredPromiseFromCall
        this.connectWait(setting); // background
    }
    /**
     * This connects obniz to the peripheral.
     * If ble scanning is undergoing, scan will be terminated immidiately.
     *
     * It throws when connection establish failed.
     *
     * when connection established, all service/characteristics/desriptors will be discovered automatically.
     * This function will wait until all discovery done.
     *
     * About Failures
     * Connection fails some reasons. You can find reason from thrown error.
     * Also obniz provide 90 seconds timeout for connection establish.
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
     * There are options for connection
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
     *   await peripheral.connectWait({
     *
     *   });
     *   console.log("connected");
     * } catch(e) {
     *   console.log("can't connect");
     * }
     * ```
     *
     */
    async connectWait(setting) {
        var _a;
        if (this.connected && (setting === null || setting === void 0 ? void 0 : setting.forceConnect) === false)
            return;
        this._connectSetting = setting || {};
        this._connectSetting.autoDiscovery =
            this._connectSetting.autoDiscovery !== false;
        this._connectSetting.mtuRequest =
            this._connectSetting.mtuRequest === undefined
                ? 256
                : this._connectSetting.mtuRequest;
        if (this._connectSetting.usePyh1m === undefined) {
            this._connectSetting.usePyh1m = true;
        }
        if (this._connectSetting.usePyh2m === undefined) {
            this._connectSetting.usePyh2m = true;
        }
        if (this._connectSetting.usePyhCoded === undefined) {
            this._connectSetting.usePyhCoded = true;
        }
        await this.obnizBle.scan.endWait();
        // for only typescript type
        const mtuRequest = this._connectSetting.mtuRequest;
        await (0, retry_1.retry)((_a = this._connectSetting.retry) !== null && _a !== void 0 ? _a : 1, async () => {
            try {
                if (this._extended) {
                    await this.obnizBle.centralBindings.connectExtendedWait(this.address, mtuRequest, () => {
                        if (this._connectSetting.pairingOption) {
                            this.setPairingOption(this._connectSetting.pairingOption);
                        }
                    }, this._connectSetting.usePyh1m, this._connectSetting.usePyh2m, this._connectSetting.usePyhCoded);
                }
                else {
                    await this.obnizBle.centralBindings.connectWait(this.address, mtuRequest, () => {
                        if (this._connectSetting.pairingOption) {
                            this.setPairingOption(this._connectSetting.pairingOption);
                        }
                    });
                }
            }
            catch (e) {
                if (e instanceof ObnizError_1.ObnizTimeoutError) {
                    await this.obnizBle.resetWait();
                    throw new Error(`Connection to device(address=${this.address}) was timedout. ble have been reseted`);
                }
                throw e;
            }
            this.connected = true;
            this.connected_at = new Date();
            try {
                if (this._connectSetting.waitUntilPairing &&
                    !(await this.isPairingFinishedWait())) {
                    // console.log('waitUntilPairing');
                    await this.pairingWait(this._connectSetting.pairingOption);
                    // console.log('waitUntilPairing finished');
                }
                if (this._connectSetting.autoDiscovery) {
                    await this.discoverAllHandlesWait();
                }
            }
            catch (e) {
                try {
                    await this.disconnectWait();
                }
                catch (e2) {
                    // nothing
                }
                throw e;
            }
        }, async (err) => {
            // console.log('connection fail, retry', err);
        });
        this.obnizBle.Obniz._runUserCreatedFunction(this.onconnect);
        this.emitter.emit('connect');
    }
    /**
     * @deprecated replaced by {@link #disconnectWait()}
     */
    disconnect() {
        // noinspection JSIgnoredPromiseFromCall
        this.disconnectWait(); // background
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
            if (!this.connected) {
                resolve();
                return;
            }
            const cuttingFailedError = new Error(`cutting connection to peripheral name=${this.localName} address=${this.address} was failed`);
            this.emitter.once('statusupdate', (params) => {
                clearTimeout(timeoutTimer);
                if (params.status === 'disconnected') {
                    resolve(true); // for compatibility
                }
                else {
                    reject(cuttingFailedError);
                }
            });
            const timeoutError = new ObnizError_1.ObnizTimeoutError(`cutting connection to peripheral name=${this.localName} address=${this.address} was failed`);
            const timeoutTimer = setTimeout(() => {
                reject(timeoutError);
            }, 90 * 1000);
            this.obnizBle.centralBindings.disconnect(this.address);
        });
    }
    /**
     * Check the PHY used in the connection
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
     *   const phy = await peripheral.readPhyWait()
     *   console.log(phy)
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     */
    async readPhyWait() {
        const phyToStr = (phy) => {
            switch (phy) {
                case 1:
                    return '1m';
                case 2:
                    return '2m';
                case 3:
                    return 'coded';
                default:
                    throw new Error('decode Phy Error');
            }
        };
        const data = await this.obnizBle.centralBindings.readPhyWait(this.address);
        if (data.status === 0) {
            return { txPhy: phyToStr(data.txPhy), rxPhy: phyToStr(data.rxPhy) };
        }
    }
    /**
     * Check the PHY used in the connection.
     * Request to change the current PHY
     *
     * It will be changed if it corresponds to the PHY set by the other party.
     *
     * Changes can be seen on onUpdatePhy
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * obniz.ble.onUpdatePhy = ((txPhy, rxPhy) => {
     *  console.log("txPhy "+txPhy+" rxPhy "+rxPhy);
     * });
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
     *   await peripheral.setPhyWait(false,false,true,true,true);//Request Only PHY Coded
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     *
     */
    async setPhyWait(usePhy1m, usePhy2m, usePhyCoded, useCodedModeS8, useCodedModeS2) {
        await this.obnizBle.centralBindings.setPhyWait(this.address, usePhy1m, usePhy2m, usePhyCoded, useCodedModeS8, useCodedModeS2);
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
     *
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
     *      peripheral.connectWait({autoDiscovery:false});
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     */
    async discoverAllServicesWait() {
        const serviceUuids = await this.obnizBle.centralBindings.discoverServicesWait(this.address);
        for (const uuid of serviceUuids) {
            let child = this.getService(uuid);
            if (!child) {
                const newService = new bleRemoteService_1.BleRemoteService({ uuid });
                newService.parent = this;
                this._services.push(newService);
                child = newService;
            }
            child.discoverdOnRemote = true;
            this.obnizBle.Obniz._runUserCreatedFunction(this.ondiscoverservice, child);
        }
        const children = this._services.filter((elm) => {
            return elm.discoverdOnRemote;
        });
        this.obnizBle.Obniz._runUserCreatedFunction(this.ondiscoverservicefinished, children);
        return children;
    }
    /**
     * @ignore
     */
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            case 'statusupdate': {
                if (params.status === 'disconnected') {
                    const pre = this.connected;
                    this.connected = false;
                    this.connected_at = null;
                    if (pre) {
                        this.obnizBle.Obniz._runUserCreatedFunction(this.ondisconnect, params.reason);
                        this.emitter.emit('disconnect', params.reason);
                    }
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
        this._addServiceUuids(results, this.searchTypeVal(0x06), 128);
        this._addServiceUuids(results, this.searchTypeVal(0x07), 128);
        return results;
    }
    /**
     * Start pairing.
     * This function return `keys` which you can use next time pairing with same device.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = async function(){
     *          console.log("success");
     *          const keys = await peripheral.pairingWait();
     *
     *          // Please store `keys` if you want to bond.
     *      }
     *      await peripheral.connectWait();
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     *
     *
     *
     * If you have already keys, please use options.keys
     *
     * ```javascript
     * // Javascript Example
     *
     * const keys = "xxxxx";
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = async function(){
     *          console.log("success");
     *          await peripheral.pairingWait({keys});  // pairing with stored keys.
     *
     *      }
     *      await peripheral.connectWait();
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     *
     * Go to [[BlePairingOptions]] to see more option.
     *
     * @param options BlePairingOptions
     */
    async pairingWait(options) {
        const result = await this.obnizBle.centralBindings.pairingWait(this.address, options);
        return result;
    }
    async getPairingKeysWait() {
        const result = await this.obnizBle.centralBindings.getPairingKeysWait(this.address);
        return result;
    }
    async isPairingFinishedWait() {
        const result = await this.obnizBle.centralBindings.isPairingFinishedWait(this.address);
        return result;
    }
    setPairingOption(options) {
        this.obnizBle.centralBindings.setPairingOption(this.address, options);
    }
    analyseAdvertisement() {
        if (this.advertise_data_rows)
            return;
        this.advertise_data_rows = [];
        if (this.adv_data) {
            for (let i = 0; i < this.adv_data.length; i++) {
                const length = this.adv_data[i];
                const arr = new Array(length);
                for (let j = 0; j < length; j++) {
                    arr[j] = this.adv_data[i + j + 1];
                }
                this.advertise_data_rows.push(arr);
                this.advertisingDataRows[this.adv_data[i + 1]] = this.adv_data.slice(i + 2, i + length + 1);
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
                this.scanResponseDataRows[this.scan_resp[i + 1]] = this.scan_resp.slice(i + 2, i + length + 1);
                i = i + length;
            }
        }
        this.setLocalName();
        this.setManufacturerSpecificData();
        this.setServiceData();
        this.setIBeacon();
    }
    searchTypeVal(type, fromScanResponseData = false) {
        this.analyseAdvertisement();
        if (this.advertisingDataRows[type] && !fromScanResponseData)
            return this.advertisingDataRows[type];
        else if (this.scanResponseDataRows[type])
            return this.scanResponseDataRows[type];
        else
            return undefined;
    }
    setLocalName() {
        var _a;
        const data = (_a = this.searchTypeVal(0x09)) !== null && _a !== void 0 ? _a : this.searchTypeVal(0x08);
        this.localName = data ? String.fromCharCode.apply(null, data) : null;
    }
    setManufacturerSpecificData() {
        var _a, _b;
        this.manufacturerSpecificData = (_a = this.searchTypeVal(0xff)) !== null && _a !== void 0 ? _a : null;
        this.manufacturerSpecificDataInScanResponse =
            (_b = this.searchTypeVal(0xff, true)) !== null && _b !== void 0 ? _b : null;
    }
    setServiceData() {
        var _a;
        this.serviceData = (_a = this.searchTypeVal(0x16)) !== null && _a !== void 0 ? _a : null;
    }
    setIBeacon() {
        const data = this.manufacturerSpecificData;
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
        let uuid = '';
        for (let i = 0; i < uuidData.length; i++) {
            uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
            if (i === 4 - 1 ||
                i === 4 + 2 - 1 ||
                i === 4 + 2 * 2 - 1 ||
                i === 4 + 2 * 3 - 1) {
                uuid += '-';
            }
        }
        const major = (data[20] << 8) + data[21];
        const minor = (data[22] << 8) + data[23];
        const power = Buffer.from([data[24]]).readInt8(0);
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
            results.push(ble_1.ObnizBLE._dataArray2uuidHex(one, true));
        }
    }
}
exports.BleRemotePeripheral = BleRemotePeripheral;
