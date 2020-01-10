"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter = require("eventemitter3");
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteService_1 = __importDefault(require("./bleRemoteService"));
class BleRemotePeripheral {
    constructor(obnizBle, address) {
        this.obnizBle = obnizBle;
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
            results.push(this.obnizBle.constructor._dataArray2uuidHex(one, true));
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
        this.obnizBle.scan.end();
        this.obnizBle.centralBindings.connect(this.address);
    }
    connectWait() {
        return new Promise((resolve, reject) => {
            // if (this.connected) {
            //   resolve();
            //   return;
            // }
            this.emitter.once("statusupdate", (params) => {
                if (params.status === "connected") {
                    resolve(true); // for compatibility
                }
                else {
                    reject(new Error(`connection to peripheral name=${this.localName} address=${this.address} can't be established`));
                }
            });
            this.connect();
        });
    }
    disconnect() {
        this.obnizBle.centralBindings.disconnect(this.address);
    }
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
    get services() {
        return this._services;
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
        this.obnizBle.centralBindings.discoverServices(this.address);
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
    discoverAllHandlesWait() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const services = yield this.discoverAllServicesWait();
            const charsNest = yield Promise.all(services.map((s) => s.discoverAllCharacteristicsWait()));
            const chars = ArrayFlat(charsNest);
            const descriptorsNest = yield Promise.all(chars.map((c) => c.discoverAllDescriptorsWait()));
            // eslint-disable-next-line no-unused-vars
            const descriptors = ArrayFlat(descriptorsNest);
        });
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
    notifyFromServer(notifyName, params) {
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
            case "statusupdate": {
                if (params.status === "connected") {
                    this.connected = true;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlUmVtb3RlUGVyaXBoZXJhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUEwQztBQUMxQyw0REFBb0M7QUFDcEMsMEVBQWtEO0FBRWxELE1BQU0sbUJBQW1CO0lBaUJ2QixZQUFZLFFBQWEsRUFBRSxPQUFZO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBRXZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDVixhQUFhO1lBQ2IsY0FBYztZQUNkLGdCQUFnQjtZQUNoQixNQUFNO1lBQ04sVUFBVTtZQUNWLFdBQVc7U0FDWixDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRDs7O09BR0c7SUFDSSxRQUFRO1FBQ2IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDOUIsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQzVCLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUztZQUM1QixJ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USxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO29CQUN2RCxPQUFPLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7SUFFTSxPQUFPO0lBQ2QsQ0FBQztDQUNGO0FBRUQsa0JBQWUsbUJBQW1CLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9ibGVSZW1vdGVQZXJpcGhlcmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcbmltcG9ydCBCbGVIZWxwZXIgZnJvbSBcIi4vYmxlSGVscGVyXCI7XG5pbXBvcnQgQmxlUmVtb3RlU2VydmljZSBmcm9tIFwiLi9ibGVSZW1vdGVTZXJ2aWNlXCI7XG5cbmNsYXNzIEJsZVJlbW90ZVBlcmlwaGVyYWwge1xuICBwdWJsaWMgb2JuaXpCbGU6IGFueTtcbiAgcHVibGljIGFkZHJlc3M6IGFueTtcbiAgcHVibGljIGNvbm5lY3RlZDogYW55O1xuICBwdWJsaWMgZGV2aWNlX3R5cGU6IGFueTtcbiAgcHVibGljIGFkZHJlc3NfdHlwZTogYW55O1xuICBwdWJsaWMgYmxlX2V2ZW50X3R5cGU6IGFueTtcbiAgcHVibGljIHJzc2k6IGFueTtcbiAgcHVibGljIGFkdl9kYXRhOiBhbnk7XG4gIHB1YmxpYyBzY2FuX3Jlc3A6IGFueTtcbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIF9zZXJ2aWNlczogYW55O1xuICBwdWJsaWMgZW1pdHRlcjogYW55O1xuICBwdWJsaWMgYWR2ZXJ0aXNlX2RhdGFfcm93czogYW55O1xuICBwdWJsaWMgbG9jYWxOYW1lOiBhbnk7XG4gIHB1YmxpYyBpQmVhY29uOiBhbnk7XG5cbiAgY29uc3RydWN0b3Iob2JuaXpCbGU6IGFueSwgYWRkcmVzczogYW55KSB7XG4gICAgdGhpcy5vYm5pekJsZSA9IG9ibml6QmxlO1xuICAgIHRoaXMuYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZGV2aWNlX3R5cGUgPSBudWxsO1xuICAgIHRoaXMuYWRkcmVzc190eXBlID0gbnVsbDtcbiAgICB0aGlzLmJsZV9ldmVudF90eXBlID0gbnVsbDtcbiAgICB0aGlzLnJzc2kgPSBudWxsO1xuICAgIHRoaXMuYWR2X2RhdGEgPSBudWxsO1xuICAgIHRoaXMuc2Nhbl9yZXNwID0gbnVsbDtcblxuICAgIHRoaXMua2V5cyA9IFtcbiAgICAgIFwiZGV2aWNlX3R5cGVcIixcbiAgICAgIFwiYWRkcmVzc190eXBlXCIsXG4gICAgICBcImJsZV9ldmVudF90eXBlXCIsXG4gICAgICBcInJzc2lcIixcbiAgICAgIFwiYWR2X2RhdGFcIixcbiAgICAgIFwic2Nhbl9yZXNwXCIsXG4gICAgXTtcblxuICAgIHRoaXMuX3NlcnZpY2VzID0gW107XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IGVtaXR0ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IGpzb24gdmFsdWVcbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYWRkcmVzczogdGhpcy5hZGRyZXNzLFxuICAgICAgYWRkcmVzc1R5cGU6IHRoaXMuYWRkcmVzc190eXBlLFxuICAgICAgYWR2ZXJ0aXNlbWVudDogdGhpcy5hZHZfZGF0YSxcbiAgICAgIHNjYW5SZXNwb25zZTogdGhpcy5zY2FuX3Jlc3AsXG4gICAgICByc3NpOiB0aGlzLnJzc2ksXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0UGFyYW1zKGRpYzogYW55KSB7XG4gICAgdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkaWMpIHtcbiAgICAgIGlmIChkaWMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0aGlzLmtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSBkaWNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hbmFseXNlQWR2ZXJ0aXNlbWVudCgpO1xuICB9XG5cbiAgcHVibGljIGFuYWx5c2VBZHZlcnRpc2VtZW50KCkge1xuICAgIGlmICghdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzKSB7XG4gICAgICB0aGlzLmFkdmVydGlzZV9kYXRhX3Jvd3MgPSBbXTtcbiAgICAgIGlmICh0aGlzLmFkdl9kYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hZHZfZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGxlbmd0aDogYW55ID0gdGhpcy5hZHZfZGF0YVtpXTtcbiAgICAgICAgICBjb25zdCBhcnI6IGFueSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGFycltqXSA9IHRoaXMuYWR2X2RhdGFbaSArIGogKyAxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzLnB1c2goYXJyKTtcbiAgICAgICAgICBpID0gaSArIGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2Nhbl9yZXNwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zY2FuX3Jlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBsZW5ndGg6IGFueSA9IHRoaXMuc2Nhbl9yZXNwW2ldO1xuICAgICAgICAgIGNvbnN0IGFycjogYW55ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW5ndGg7IGorKykge1xuICAgICAgICAgICAgYXJyW2pdID0gdGhpcy5zY2FuX3Jlc3BbaSArIGogKyAxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzLnB1c2goYXJyKTtcbiAgICAgICAgICBpID0gaSArIGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRMb2NhbE5hbWUoKTtcbiAgICAgIHRoaXMuc2V0SUJlYWNvbigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZWFyY2hUeXBlVmFsKHR5cGU6IGFueSkge1xuICAgIHRoaXMuYW5hbHlzZUFkdmVydGlzZW1lbnQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWR2ZXJ0aXNlX2RhdGFfcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuYWR2ZXJ0aXNlX2RhdGFfcm93c1tpXVswXSA9PT0gdHlwZSkge1xuICAgICAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXS5jb25jYXQodGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzW2ldKTtcbiAgICAgICAgcmVzdWx0cy5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRMb2NhbE5hbWUoKSB7XG4gICAgbGV0IGRhdGE6IGFueSA9IHRoaXMuc2VhcmNoVHlwZVZhbCgweDA5KTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIGRhdGEgPSB0aGlzLnNlYXJjaFR5cGVWYWwoMHgwOCk7XG4gICAgfVxuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhpcy5sb2NhbE5hbWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvY2FsTmFtZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldElCZWFjb24oKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5zZWFyY2hUeXBlVmFsKDB4ZmYpO1xuICAgIGlmIChcbiAgICAgICFkYXRhIHx8XG4gICAgICBkYXRhWzBdICE9PSAweDRjIHx8XG4gICAgICBkYXRhWzFdICE9PSAweDAwIHx8XG4gICAgICBkYXRhWzJdICE9PSAweDAyIHx8XG4gICAgICBkYXRhWzNdICE9PSAweDE1IHx8XG4gICAgICBkYXRhLmxlbmd0aCAhPT0gMjVcbiAgICApIHtcbiAgICAgIHRoaXMuaUJlYWNvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHV1aWREYXRhOiBhbnkgPSBkYXRhLnNsaWNlKDQsIDIwKTtcbiAgICBsZXQgdXVpZDogYW55ID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHV1aWREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB1dWlkID0gdXVpZCArIChcIjAwXCIgKyB1dWlkRGF0YVtpXS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgICAgIGlmIChcbiAgICAgICAgaSA9PT0gNCAtIDEgfHxcbiAgICAgICAgaSA9PT0gNCArIDIgLSAxIHx8XG4gICAgICAgIGkgPT09IDQgKyAyICogMiAtIDEgfHxcbiAgICAgICAgaSA9PT0gNCArIDIgKiAzIC0gMVxuICAgICAgKSB7XG4gICAgICAgIHV1aWQgKz0gXCItXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWFqb3I6IGFueSA9IChkYXRhWzIwXSA8PCA4KSArIGRhdGFbMjFdO1xuICAgIGNvbnN0IG1pbm9yOiBhbnkgPSAoZGF0YVsyMl0gPDwgOCkgKyBkYXRhWzIzXTtcbiAgICBjb25zdCBwb3dlcjogYW55ID0gZGF0YVsyNF07XG5cbiAgICB0aGlzLmlCZWFjb24gPSB7XG4gICAgICB1dWlkLFxuICAgICAgbWFqb3IsXG4gICAgICBtaW5vcixcbiAgICAgIHBvd2VyLFxuICAgICAgcnNzaTogdGhpcy5yc3NpLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgX2FkZFNlcnZpY2VVdWlkcyhyZXN1bHRzOiBhbnksIGRhdGE6IGFueSwgYml0OiBhbnkpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdXVpZExlbmd0aDogYW55ID0gYml0IC8gNDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpID0gaSArIHV1aWRMZW5ndGgpIHtcbiAgICAgIGNvbnN0IG9uZTogYW55ID0gZGF0YS5zbGljZShpLCBpICsgdXVpZExlbmd0aCk7XG4gICAgICByZXN1bHRzLnB1c2godGhpcy5vYm5pekJsZS5jb25zdHJ1Y3Rvci5fZGF0YUFycmF5MnV1aWRIZXgob25lLCB0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkdmVydGlzZW1lbnRTZXJ2aWNlVXVpZHMoKSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG4gICAgdGhpcy5fYWRkU2VydmljZVV1aWRzKHJlc3VsdHMsIHRoaXMuc2VhcmNoVHlwZVZhbCgweDAyKSwgMTYpO1xuICAgIHRoaXMuX2FkZFNlcnZpY2VVdWlkcyhyZXN1bHRzLCB0aGlzLnNlYXJjaFR5cGVWYWwoMHgwMyksIDE2KTtcbiAgICB0aGlzLl9hZGRTZXJ2aWNlVXVpZHMocmVzdWx0cywgdGhpcy5zZWFyY2hUeXBlVmFsKDB4MDQpLCAzMik7XG4gICAgdGhpcy5fYWRkU2VydmljZVV1aWRzKHJlc3VsdHMsIHRoaXMuc2VhcmNoVHlwZVZhbCgweDA1KSwgMzIpO1xuICAgIHRoaXMuX2FkZFNlcnZpY2VVdWlkcyhyZXN1bHRzLCB0aGlzLnNlYXJjaFR5cGVWYWwoMHgwNiksIDY0KTtcbiAgICB0aGlzLl9hZGRTZXJ2aWNlVXVpZHMocmVzdWx0cywgdGhpcy5zZWFyY2hUeXBlVmFsKDB4MDcpLCA2NCk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBwdWJsaWMgY29ubmVjdCgpIHtcbiAgICB0aGlzLm9ibml6QmxlLnNjYW4uZW5kKCk7XG4gICAgdGhpcy5vYm5pekJsZS5jZW50cmFsQmluZGluZ3MuY29ubmVjdCh0aGlzLmFkZHJlc3MpO1xuICB9XG5cbiAgcHVibGljIGNvbm5lY3RXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xuICAgICAgLy8gaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAvLyAgIHJlc29sdmUoKTtcbiAgICAgIC8vICAgcmV0dXJuO1xuICAgICAgLy8gfVxuICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoXCJzdGF0dXN1cGRhdGVcIiwgKHBhcmFtczogYW55ICkgPT4ge1xuICAgICAgICBpZiAocGFyYW1zLnN0YXR1cyA9PT0gXCJjb25uZWN0ZWRcIikge1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7IC8vIGZvciBjb21wYXRpYmlsaXR5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KFxuICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgY29ubmVjdGlvbiB0byBwZXJpcGhlcmFsIG5hbWU9JHt0aGlzLmxvY2FsTmFtZX0gYWRkcmVzcz0ke1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkcmVzc1xuICAgICAgICAgICAgICB9IGNhbid0IGJlIGVzdGFibGlzaGVkYCxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMub2JuaXpCbGUuY2VudHJhbEJpbmRpbmdzLmRpc2Nvbm5lY3QodGhpcy5hZGRyZXNzKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb25uZWN0V2FpdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcbiAgICAgIC8vIGlmICghdGhpcy5jb25uZWN0ZWQpIHtcbiAgICAgIC8vICAgcmVzb2x2ZSgpO1xuICAgICAgLy8gICByZXR1cm47XG4gICAgICAvLyB9XG4gICAgICB0aGlzLmVtaXR0ZXIub25jZShcInN0YXR1c3VwZGF0ZVwiLCAocGFyYW1zOiBhbnkgKSA9PiB7XG4gICAgICAgIGlmIChwYXJhbXMuc3RhdHVzID09PSBcImRpc2Nvbm5lY3RlZFwiKSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTsgLy8gZm9yIGNvbXBhdGliaWxpdHlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoXG4gICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBjdXR0aW5nIGNvbm5lY3Rpb24gdG8gcGVyaXBoZXJhbCBuYW1lPSR7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbE5hbWVcbiAgICAgICAgICAgICAgfSBhZGRyZXNzPSR7dGhpcy5hZGRyZXNzfSB3YXMgZmFpbGVkYCxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzZXJ2aWNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmljZXM7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VydmljZSh1dWlkOiBhbnkpIHtcbiAgICB1dWlkID0gQmxlSGVscGVyLnV1aWRGaWx0ZXIodXVpZCk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fc2VydmljZXMpIHtcbiAgICAgIGlmICh0aGlzLl9zZXJ2aWNlc1trZXldLnV1aWQgPT09IHV1aWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZmluZFNlcnZpY2UocGFyYW06IGFueSkge1xuICAgIGNvbnN0IHNlcnZpY2VVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5zZXJ2aWNlX3V1aWQpO1xuICAgIHJldHVybiB0aGlzLmdldFNlcnZpY2Uoc2VydmljZVV1aWQpO1xuICB9XG5cbiAgcHVibGljIGZpbmRDaGFyYWN0ZXJpc3RpYyhwYXJhbTogYW55KSB7XG4gICAgY29uc3Qgc2VydmljZVV1aWQ6IGFueSA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHBhcmFtLnNlcnZpY2VfdXVpZCk7XG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5jaGFyYWN0ZXJpc3RpY191dWlkKTtcbiAgICBjb25zdCBzOiBhbnkgPSB0aGlzLmdldFNlcnZpY2Uoc2VydmljZVV1aWQpO1xuICAgIGlmIChzKSB7XG4gICAgICByZXR1cm4gcy5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY1V1aWQpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kRGVzY3JpcHRvcihwYXJhbTogYW55KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvclV1aWQ6IGFueSA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHBhcmFtLmRlc2NyaXB0b3JfdXVpZCk7XG4gICAgY29uc3QgYzogYW55ID0gdGhpcy5maW5kQ2hhcmFjdGVyaXN0aWMocGFyYW0pO1xuICAgIGlmIChjKSB7XG4gICAgICByZXR1cm4gYy5nZXREZXNjcmlwdG9yKGRlc2NyaXB0b3JVdWlkKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJBbGxTZXJ2aWNlcygpIHtcbiAgICB0aGlzLm9ibml6QmxlLmNlbnRyYWxCaW5kaW5ncy5kaXNjb3ZlclNlcnZpY2VzKHRoaXMuYWRkcmVzcyk7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJBbGxTZXJ2aWNlc1dhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlICgocmVzb2x2ZTogYW55ICkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoXCJkaXNjb3ZlcmZpbmlzaGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW46IGFueSA9IHRoaXMuX3NlcnZpY2VzLmZpbHRlciAoKGVsbTogYW55ICkgPT4ge1xuICAgICAgICAgIHJldHVybiBlbG0uZGlzY292ZXJkT25SZW1vdGU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKGNoaWxkcmVuKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNjb3ZlckFsbFNlcnZpY2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGlzY292ZXJBbGxIYW5kbGVzV2FpdCgpIHtcbiAgICBjb25zdCBBcnJheUZsYXQ6IGFueSA9IChhcnJheTogYW55LCBkZXB0aDogYW55KSA9PiB7XG4gICAgICBjb25zdCBmbGF0dGVuZDogYW55ID0gW107XG4gICAgICAoZnVuY3Rpb24gZmxhdChfYXJyYXk6IGFueSwgX2RlcHRoOiBhbnkpIHtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBfYXJyYXkpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbCkgJiYgX2RlcHRoID4gMCkge1xuICAgICAgICAgICAgZmxhdChlbCwgX2RlcHRoIC0gMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZsYXR0ZW5kLnB1c2goZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkoYXJyYXksIE1hdGguZmxvb3IoZGVwdGgpIHx8IDEpO1xuICAgICAgcmV0dXJuIGZsYXR0ZW5kO1xuICAgIH07XG5cbiAgICBjb25zdCBzZXJ2aWNlczogYW55ID0gYXdhaXQgdGhpcy5kaXNjb3ZlckFsbFNlcnZpY2VzV2FpdCgpO1xuICAgIGNvbnN0IGNoYXJzTmVzdDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBzZXJ2aWNlcy5tYXAoKHM6IGFueSkgPT4gcy5kaXNjb3ZlckFsbENoYXJhY3RlcmlzdGljc1dhaXQoKSksXG4gICAgKTtcbiAgICBjb25zdCBjaGFyczogYW55ID0gQXJyYXlGbGF0KGNoYXJzTmVzdCk7XG4gICAgY29uc3QgZGVzY3JpcHRvcnNOZXN0OiBhbnkgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGNoYXJzLm1hcCgoYzogYW55KSA9PiBjLmRpc2NvdmVyQWxsRGVzY3JpcHRvcnNXYWl0KCkpLFxuICAgICk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICBjb25zdCBkZXNjcmlwdG9yczogYW55ID0gQXJyYXlGbGF0KGRlc2NyaXB0b3JzTmVzdCk7XG4gIH1cblxuICBwdWJsaWMgb25jb25uZWN0KCkge1xuICB9XG5cbiAgcHVibGljIG9uZGlzY29ubmVjdCgpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyc2VydmljZShjaGlsZDogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcnNlcnZpY2VmaW5pc2hlZChjaGlsZHJlbjogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb3ZlcigpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyZmluaXNoZWQoKSB7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RnJvbVNlcnZlcihub3RpZnlOYW1lOiBhbnksIHBhcmFtczogYW55KSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQobm90aWZ5TmFtZSwgcGFyYW1zKTtcbiAgICBzd2l0Y2ggKG5vdGlmeU5hbWUpIHtcbiAgICAgIGNhc2UgXCJzdGF0dXN1cGRhdGVcIjoge1xuICAgICAgICBpZiAocGFyYW1zLnN0YXR1cyA9PT0gXCJjb25uZWN0ZWRcIikge1xuICAgICAgICAgIHRoaXMuY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLm9uY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuc3RhdHVzID09PSBcImRpc2Nvbm5lY3RlZFwiKSB7XG4gICAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLm9uZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBcImRpc2NvdmVyXCI6IHtcbiAgICAgICAgY29uc3QgdXVpZDogYW55ID0gcGFyYW1zLnNlcnZpY2VfdXVpZDtcbiAgICAgICAgbGV0IGNoaWxkOiBhbnkgPSB0aGlzLmdldFNlcnZpY2UodXVpZCk7XG4gICAgICAgIGlmICghY2hpbGQpIHtcbiAgICAgICAgICBjb25zdCBuZXdTZXJ2aWNlOiBhbnkgPSBuZXcgQmxlUmVtb3RlU2VydmljZSh7dXVpZH0pO1xuICAgICAgICAgIG5ld1NlcnZpY2UucGFyZW50ID0gdGhpcztcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlcy5wdXNoKG5ld1NlcnZpY2UpO1xuICAgICAgICAgIGNoaWxkID0gbmV3U2VydmljZTtcbiAgICAgICAgfVxuICAgICAgICBjaGlsZC5kaXNjb3ZlcmRPblJlbW90ZSA9IHRydWU7XG4gICAgICAgIHRoaXMub25kaXNjb3ZlcnNlcnZpY2UoY2hpbGQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJkaXNjb3ZlcmZpbmlzaGVkXCI6IHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW46IGFueSA9IHRoaXMuX3NlcnZpY2VzLmZpbHRlcigoZWxtOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gZWxtLmRpc2NvdmVyZE9uUmVtb3RlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbmRpc2NvdmVyc2VydmljZWZpbmlzaGVkKGNoaWxkcmVuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uZXJyb3IoKSB7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxlUmVtb3RlUGVyaXBoZXJhbDtcbiJdfQ==
