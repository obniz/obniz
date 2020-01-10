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
    discoverAllHandlesWait() {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            this.emitter.emit(notifyName, params);
            switch (notifyName) {
                case "statusupdate": {
                    if (params.status === "connected") {
                        this.connected = true;
                        yield this.discoverAllHandlesWait();
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
        });
    }
    onerror() {
    }
}
exports.default = BleRemotePeripheral;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlUGVyaXBoZXJhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUEwQztBQUMxQyw0REFBb0M7QUFDcEMsMEVBQWtEO0FBRWxELE1BQU0sbUJBQW1CO0lBaUJ2QixZQUFZLEtBQVUsRUFBRSxPQUFZO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBRXZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDVixhQUFhO1lBQ2IsY0FBYztZQUNkLGdCQUFnQjtZQUNoQixNQUFNO1lBQ04sVUFBVTtZQUNWLFdBQVc7U0FDWixDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFFBQVE7UUFDYixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUM5QixhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDNUIsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sU0FBUyxDQUFDLEdBQVE7UUFDdkIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNoQyxLQUFLLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRTtZQUNyQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3JELElBQVksQ0FBRSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEM7U0FDRjtRQUNELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFTSxvQkFBb0I7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM3QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3QyxNQUFNLE1BQU0sR0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxNQUFNLEdBQUcsR0FBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDL0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDbkM7b0JBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7aUJBQ2hCO2FBQ0Y7WUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUMsTUFBTSxNQUFNLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxHQUFHLEdBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQy9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ3BDO29CQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25DLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO2lCQUNoQjthQUNGO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFTSxhQUFhLENBQUMsSUFBUztRQUM1QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4RCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQzNDLE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDaEIsT0FBTyxPQUFPLENBQUM7YUFDaEI7U0FDRjtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTSxZQUFZO1FBQ2pCLElBQUksSUFBSSxHQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7SUFFTSxVQUFVO1FBQ2YsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUNFLENBQUMsSUFBSTtZQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUNsQjtZQUNBLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE9BQU87U0FDUjtRQUNELE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUNFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDWCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNuQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNuQjtnQkFDQSxJQUFJLElBQUksR0FBRyxDQUFDO2FBQ2I7U0FDRjtRQUVELE1BQU0sS0FBSyxHQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUMsTUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixJQUFJO1lBQ0osS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsT0FBWSxFQUFFLElBQVMsRUFBRSxHQUFRO1FBQ3ZELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPO1NBQ1I7UUFDRCxNQUFNLFVBQVUsR0FBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFO1lBQ25ELE1BQU0sR0FBRyxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUN4RTtJQUNILENBQUM7SUFFTSx5QkFBeUI7UUFDOUIsTUFBTSxPQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxPQUFPO1FBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sR0FBRyxHQUFRO1lBQ2YsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFBRTtvQkFDUCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87aUJBQ3RCO2FBQ0Y7U0FDRixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQVksRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFXLEVBQUUsRUFBRTtnQkFDaEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtvQkFDakMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNmO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7aUJBQ2pEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sVUFBVTtRQUNmLE1BQU0sR0FBRyxHQUFRO1lBQ2YsR0FBRyxFQUFFO2dCQUNILFVBQVUsRUFBRTtvQkFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87aUJBQ3RCO2FBQ0Y7U0FDRixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLGNBQWM7UUFDbkIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQVksRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFXLEVBQUUsRUFBRTtnQkFDaEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLGNBQWMsRUFBRTtvQkFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNmO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sVUFBVSxDQUFDLElBQVM7UUFDekIsSUFBSSxHQUFHLG1CQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDckMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzVCO1NBQ0Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRU0sV0FBVyxDQUFDLEtBQVU7UUFDM0IsTUFBTSxXQUFXLEdBQVEsbUJBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sa0JBQWtCLENBQUMsS0FBVTtRQUNsQyxNQUFNLFdBQVcsR0FBUSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEUsTUFBTSxrQkFBa0IsR0FBUSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRixNQUFNLENBQUMsR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGNBQWMsQ0FBQyxLQUFVO1FBQzlCLE1BQU0sY0FBYyxHQUFRLG1CQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsR0FBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEVBQUU7WUFDTCxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxtQkFBbUI7UUFDeEIsTUFBTSxHQUFHLEdBQVE7WUFDZixHQUFHLEVBQUU7Z0JBQ0gsWUFBWSxFQUFFO29CQUNaLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztpQkFDdEI7YUFDRjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRU0sdUJBQXVCO1FBQzVCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7Z0JBQ3pDLE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7b0JBQ3ZELE9BQU8sR0FBRyxDQUFDLGlCQUFpQixDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFWSxzQkFBc0I7O1lBQ2pDLE1BQU0sU0FBUyxHQUFRLENBQUMsS0FBVSxFQUFFLEtBQVUsRUFBRSxFQUFFO2dCQUNoRCxNQUFNLFFBQVEsR0FBUSxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBVyxFQUFFLE1BQVcsRUFBRSxFQUFFO29CQUN4QyxLQUFLLE1BQU0sRUFBRSxJQUFJLE1BQU0sRUFBRTt3QkFDdkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ25DLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUN0Qjs2QkFBTTs0QkFDTCxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUNuQjtxQkFDRjtnQkFDSCxDQUFDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLFFBQVEsQ0FBQztZQUNsQixDQUFDLENBQUM7WUFFRixNQUFNLFFBQVEsR0FBUSxNQUFNLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQzNELE1BQU0sU0FBUyxHQUFRLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDdEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixFQUFFLENBQUMsQ0FDN0QsQ0FBQztZQUNGLE1BQU0sS0FBSyxHQUFRLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QyxNQUFNLGVBQWUsR0FBUSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQzVDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQ3RELENBQUM7WUFDRiwwQ0FBMEM7WUFDMUMsTUFBTSxXQUFXLEdBQVEsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3RELENBQUM7S0FBQTtJQUVNLFNBQVM7SUFDaEIsQ0FBQztJQUVNLFlBQVk7SUFDbkIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEtBQVU7SUFDbkMsQ0FBQztJQUVNLHlCQUF5QixDQUFDLFFBQWE7SUFDOUMsQ0FBQztJQUVNLFVBQVU7SUFDakIsQ0FBQztJQUVNLGtCQUFrQjtJQUN6QixDQUFDO0lBRVksZ0JBQWdCLENBQUMsVUFBZSxFQUFFLE1BQVc7O1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN0QyxRQUFRLFVBQVUsRUFBRTtnQkFDbEIsS0FBSyxjQUFjLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTt3QkFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7d0JBQ3RCLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7d0JBRXBDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztxQkFDbEI7b0JBQ0QsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLGNBQWMsRUFBRTt3QkFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7d0JBQ3ZCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztxQkFDckI7b0JBQ0QsTUFBTTtpQkFDUDtnQkFDRCxLQUFLLFVBQVUsQ0FBQyxDQUFDO29CQUNmLE1BQU0sSUFBSSxHQUFRLE1BQU0sQ0FBQyxZQUFZLENBQUM7b0JBQ3RDLElBQUksS0FBSyxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ1YsTUFBTSxVQUFVLEdBQVEsSUFBSSwwQkFBZ0IsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7d0JBQ3JELFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDaEMsS0FBSyxHQUFHLFVBQVUsQ0FBQztxQkFDcEI7b0JBQ0QsS0FBSyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5QixNQUFNO2lCQUNQO2dCQUNELEtBQUssa0JBQWtCLENBQUMsQ0FBQztvQkFDdkIsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRTt3QkFDdkQsT0FBTyxHQUFHLENBQUMsaUJBQWlCLENBQUM7b0JBQy9CLENBQUMsQ0FBQyxDQUFDO29CQUNILElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDekMsTUFBTTtpQkFDUDthQUNGO1FBQ0gsQ0FBQztLQUFBO0lBRU0sT0FBTztJQUNkLENBQUM7Q0FDRjtBQUVELGtCQUFlLG1CQUFtQixDQUFDIiwiZmlsZSI6InNyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlUGVyaXBoZXJhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbWl0dGVyID0gcmVxdWlyZShcImV2ZW50ZW1pdHRlcjNcIik7XG5pbXBvcnQgQmxlSGVscGVyIGZyb20gXCIuL2JsZUhlbHBlclwiO1xuaW1wb3J0IEJsZVJlbW90ZVNlcnZpY2UgZnJvbSBcIi4vYmxlUmVtb3RlU2VydmljZVwiO1xuXG5jbGFzcyBCbGVSZW1vdGVQZXJpcGhlcmFsIHtcbiAgcHVibGljIE9ibml6OiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBjb25uZWN0ZWQ6IGFueTtcbiAgcHVibGljIGRldmljZV90eXBlOiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzX3R5cGU6IGFueTtcbiAgcHVibGljIGJsZV9ldmVudF90eXBlOiBhbnk7XG4gIHB1YmxpYyByc3NpOiBhbnk7XG4gIHB1YmxpYyBhZHZfZGF0YTogYW55O1xuICBwdWJsaWMgc2Nhbl9yZXNwOiBhbnk7XG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyBfc2VydmljZXM6IGFueTtcbiAgcHVibGljIGVtaXR0ZXI6IGFueTtcbiAgcHVibGljIGFkdmVydGlzZV9kYXRhX3Jvd3M6IGFueTtcbiAgcHVibGljIGxvY2FsTmFtZTogYW55O1xuICBwdWJsaWMgaUJlYWNvbjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKE9ibml6OiBhbnksIGFkZHJlc3M6IGFueSkge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLmRldmljZV90eXBlID0gbnVsbDtcbiAgICB0aGlzLmFkZHJlc3NfdHlwZSA9IG51bGw7XG4gICAgdGhpcy5ibGVfZXZlbnRfdHlwZSA9IG51bGw7XG4gICAgdGhpcy5yc3NpID0gbnVsbDtcbiAgICB0aGlzLmFkdl9kYXRhID0gbnVsbDtcbiAgICB0aGlzLnNjYW5fcmVzcCA9IG51bGw7XG5cbiAgICB0aGlzLmtleXMgPSBbXG4gICAgICBcImRldmljZV90eXBlXCIsXG4gICAgICBcImFkZHJlc3NfdHlwZVwiLFxuICAgICAgXCJibGVfZXZlbnRfdHlwZVwiLFxuICAgICAgXCJyc3NpXCIsXG4gICAgICBcImFkdl9kYXRhXCIsXG4gICAgICBcInNjYW5fcmVzcFwiLFxuICAgIF07XG5cbiAgICB0aGlzLl9zZXJ2aWNlcyA9IFtdO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBlbWl0dGVyKCk7XG4gIH1cblxuICBnZXQgc2VydmljZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ30ganNvbiB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhZGRyZXNzOiB0aGlzLmFkZHJlc3MsXG4gICAgICBhZGRyZXNzVHlwZTogdGhpcy5hZGRyZXNzX3R5cGUsXG4gICAgICBhZHZlcnRpc2VtZW50OiB0aGlzLmFkdl9kYXRhLFxuICAgICAgc2NhblJlc3BvbnNlOiB0aGlzLnNjYW5fcmVzcCxcbiAgICAgIHJzc2k6IHRoaXMucnNzaSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRQYXJhbXMoZGljOiBhbnkpIHtcbiAgICB0aGlzLmFkdmVydGlzZV9kYXRhX3Jvd3MgPSBudWxsO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGRpYykge1xuICAgICAgaWYgKGRpYy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRoaXMua2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICh0aGlzIGFzIGFueSkgW2tleV0gPSBkaWNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hbmFseXNlQWR2ZXJ0aXNlbWVudCgpO1xuICB9XG5cbiAgcHVibGljIGFuYWx5c2VBZHZlcnRpc2VtZW50KCkge1xuICAgIGlmICghdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzKSB7XG4gICAgICB0aGlzLmFkdmVydGlzZV9kYXRhX3Jvd3MgPSBbXTtcbiAgICAgIGlmICh0aGlzLmFkdl9kYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hZHZfZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGxlbmd0aDogYW55ID0gdGhpcy5hZHZfZGF0YVtpXTtcbiAgICAgICAgICBjb25zdCBhcnI6IGFueSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGFycltqXSA9IHRoaXMuYWR2X2RhdGFbaSArIGogKyAxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzLnB1c2goYXJyKTtcbiAgICAgICAgICBpID0gaSArIGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2Nhbl9yZXNwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zY2FuX3Jlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBsZW5ndGg6IGFueSA9IHRoaXMuc2Nhbl9yZXNwW2ldO1xuICAgICAgICAgIGNvbnN0IGFycjogYW55ID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW5ndGg7IGorKykge1xuICAgICAgICAgICAgYXJyW2pdID0gdGhpcy5zY2FuX3Jlc3BbaSArIGogKyAxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzLnB1c2goYXJyKTtcbiAgICAgICAgICBpID0gaSArIGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRMb2NhbE5hbWUoKTtcbiAgICAgIHRoaXMuc2V0SUJlYWNvbigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZWFyY2hUeXBlVmFsKHR5cGU6IGFueSkge1xuICAgIHRoaXMuYW5hbHlzZUFkdmVydGlzZW1lbnQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWR2ZXJ0aXNlX2RhdGFfcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuYWR2ZXJ0aXNlX2RhdGFfcm93c1tpXVswXSA9PT0gdHlwZSkge1xuICAgICAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXS5jb25jYXQodGhpcy5hZHZlcnRpc2VfZGF0YV9yb3dzW2ldKTtcbiAgICAgICAgcmVzdWx0cy5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRMb2NhbE5hbWUoKSB7XG4gICAgbGV0IGRhdGE6IGFueSA9IHRoaXMuc2VhcmNoVHlwZVZhbCgweDA5KTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIGRhdGEgPSB0aGlzLnNlYXJjaFR5cGVWYWwoMHgwOCk7XG4gICAgfVxuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhpcy5sb2NhbE5hbWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvY2FsTmFtZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldElCZWFjb24oKSB7XG4gICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5zZWFyY2hUeXBlVmFsKDB4ZmYpO1xuICAgIGlmIChcbiAgICAgICFkYXRhIHx8XG4gICAgICBkYXRhWzBdICE9PSAweDRjIHx8XG4gICAgICBkYXRhWzFdICE9PSAweDAwIHx8XG4gICAgICBkYXRhWzJdICE9PSAweDAyIHx8XG4gICAgICBkYXRhWzNdICE9PSAweDE1IHx8XG4gICAgICBkYXRhLmxlbmd0aCAhPT0gMjVcbiAgICApIHtcbiAgICAgIHRoaXMuaUJlYWNvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHV1aWREYXRhOiBhbnkgPSBkYXRhLnNsaWNlKDQsIDIwKTtcbiAgICBsZXQgdXVpZDogYW55ID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHV1aWREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB1dWlkID0gdXVpZCArIChcIjAwXCIgKyB1dWlkRGF0YVtpXS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgICAgIGlmIChcbiAgICAgICAgaSA9PT0gNCAtIDEgfHxcbiAgICAgICAgaSA9PT0gNCArIDIgLSAxIHx8XG4gICAgICAgIGkgPT09IDQgKyAyICogMiAtIDEgfHxcbiAgICAgICAgaSA9PT0gNCArIDIgKiAzIC0gMVxuICAgICAgKSB7XG4gICAgICAgIHV1aWQgKz0gXCItXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWFqb3I6IGFueSA9IChkYXRhWzIwXSA8PCA4KSArIGRhdGFbMjFdO1xuICAgIGNvbnN0IG1pbm9yOiBhbnkgPSAoZGF0YVsyMl0gPDwgOCkgKyBkYXRhWzIzXTtcbiAgICBjb25zdCBwb3dlcjogYW55ID0gZGF0YVsyNF07XG5cbiAgICB0aGlzLmlCZWFjb24gPSB7XG4gICAgICB1dWlkLFxuICAgICAgbWFqb3IsXG4gICAgICBtaW5vcixcbiAgICAgIHBvd2VyLFxuICAgICAgcnNzaTogdGhpcy5yc3NpLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgX2FkZFNlcnZpY2VVdWlkcyhyZXN1bHRzOiBhbnksIGRhdGE6IGFueSwgYml0OiBhbnkpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdXVpZExlbmd0aDogYW55ID0gYml0IC8gNDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpID0gaSArIHV1aWRMZW5ndGgpIHtcbiAgICAgIGNvbnN0IG9uZTogYW55ID0gZGF0YS5zbGljZShpLCBpICsgdXVpZExlbmd0aCk7XG4gICAgICByZXN1bHRzLnB1c2godGhpcy5PYm5pei5ibGUuY29uc3RydWN0b3IuX2RhdGFBcnJheTJ1dWlkSGV4KG9uZSwgdHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZHZlcnRpc2VtZW50U2VydmljZVV1aWRzKCkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IFtdO1xuICAgIHRoaXMuX2FkZFNlcnZpY2VVdWlkcyhyZXN1bHRzLCB0aGlzLnNlYXJjaFR5cGVWYWwoMHgwMiksIDE2KTtcbiAgICB0aGlzLl9hZGRTZXJ2aWNlVXVpZHMocmVzdWx0cywgdGhpcy5zZWFyY2hUeXBlVmFsKDB4MDMpLCAxNik7XG4gICAgdGhpcy5fYWRkU2VydmljZVV1aWRzKHJlc3VsdHMsIHRoaXMuc2VhcmNoVHlwZVZhbCgweDA0KSwgMzIpO1xuICAgIHRoaXMuX2FkZFNlcnZpY2VVdWlkcyhyZXN1bHRzLCB0aGlzLnNlYXJjaFR5cGVWYWwoMHgwNSksIDMyKTtcbiAgICB0aGlzLl9hZGRTZXJ2aWNlVXVpZHMocmVzdWx0cywgdGhpcy5zZWFyY2hUeXBlVmFsKDB4MDYpLCA2NCk7XG4gICAgdGhpcy5fYWRkU2VydmljZVV1aWRzKHJlc3VsdHMsIHRoaXMuc2VhcmNoVHlwZVZhbCgweDA3KSwgNjQpO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgcHVibGljIGNvbm5lY3QoKSB7XG4gICAgdGhpcy5PYm5pei5ibGUuc2Nhbi5lbmQoKTtcbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICBjb25uZWN0OiB7XG4gICAgICAgICAgYWRkcmVzczogdGhpcy5hZGRyZXNzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVibGljIGNvbm5lY3RXYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoXCJzdGF0dXN1cGRhdGVcIiwgKHBhcmFtczogYW55KSA9PiB7XG4gICAgICAgIGlmIChwYXJhbXMuc3RhdHVzID09PSBcImNvbm5lY3RlZFwiKSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiY29ubmVjdGlvbiBub3QgZXN0YWJsaXNoZWRcIikpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRpc2Nvbm5lY3QoKSB7XG4gICAgY29uc3Qgb2JqOiBhbnkgPSB7XG4gICAgICBibGU6IHtcbiAgICAgICAgZGlzY29ubmVjdDoge1xuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuYWRkcmVzcyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb25uZWN0V2FpdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwic3RhdHVzdXBkYXRlXCIsIChwYXJhbXM6IGFueSkgPT4ge1xuICAgICAgICBpZiAocGFyYW1zLnN0YXR1cyA9PT0gXCJkaXNjb25uZWN0ZWRcIikge1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcImRpc2Nvbm5lY3RXYWl0IGZhaWxlZFwiKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VydmljZSh1dWlkOiBhbnkpIHtcbiAgICB1dWlkID0gQmxlSGVscGVyLnV1aWRGaWx0ZXIodXVpZCk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fc2VydmljZXMpIHtcbiAgICAgIGlmICh0aGlzLl9zZXJ2aWNlc1trZXldLnV1aWQgPT09IHV1aWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZmluZFNlcnZpY2UocGFyYW06IGFueSkge1xuICAgIGNvbnN0IHNlcnZpY2VVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5zZXJ2aWNlX3V1aWQpO1xuICAgIHJldHVybiB0aGlzLmdldFNlcnZpY2Uoc2VydmljZVV1aWQpO1xuICB9XG5cbiAgcHVibGljIGZpbmRDaGFyYWN0ZXJpc3RpYyhwYXJhbTogYW55KSB7XG4gICAgY29uc3Qgc2VydmljZVV1aWQ6IGFueSA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHBhcmFtLnNlcnZpY2VfdXVpZCk7XG4gICAgY29uc3QgY2hhcmFjdGVyaXN0aWNVdWlkOiBhbnkgPSBCbGVIZWxwZXIudXVpZEZpbHRlcihwYXJhbS5jaGFyYWN0ZXJpc3RpY191dWlkKTtcbiAgICBjb25zdCBzOiBhbnkgPSB0aGlzLmdldFNlcnZpY2Uoc2VydmljZVV1aWQpO1xuICAgIGlmIChzKSB7XG4gICAgICByZXR1cm4gcy5nZXRDaGFyYWN0ZXJpc3RpYyhjaGFyYWN0ZXJpc3RpY1V1aWQpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kRGVzY3JpcHRvcihwYXJhbTogYW55KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvclV1aWQ6IGFueSA9IEJsZUhlbHBlci51dWlkRmlsdGVyKHBhcmFtLmRlc2NyaXB0b3JfdXVpZCk7XG4gICAgY29uc3QgYzogYW55ID0gdGhpcy5maW5kQ2hhcmFjdGVyaXN0aWMocGFyYW0pO1xuICAgIGlmIChjKSB7XG4gICAgICByZXR1cm4gYy5nZXREZXNjcmlwdG9yKGRlc2NyaXB0b3JVdWlkKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJBbGxTZXJ2aWNlcygpIHtcbiAgICBjb25zdCBvYmo6IGFueSA9IHtcbiAgICAgIGJsZToge1xuICAgICAgICBnZXRfc2VydmljZXM6IHtcbiAgICAgICAgICBhZGRyZXNzOiB0aGlzLmFkZHJlc3MsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBwdWJsaWMgZGlzY292ZXJBbGxTZXJ2aWNlc1dhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwiZGlzY292ZXJmaW5pc2hlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBhbnkgPSB0aGlzLl9zZXJ2aWNlcy5maWx0ZXIoKGVsbTogYW55KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVsbS5kaXNjb3ZlcmRPblJlbW90ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoY2hpbGRyZW4pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc2NvdmVyQWxsU2VydmljZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkaXNjb3ZlckFsbEhhbmRsZXNXYWl0KCkge1xuICAgIGNvbnN0IEFycmF5RmxhdDogYW55ID0gKGFycmF5OiBhbnksIGRlcHRoOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGZsYXR0ZW5kOiBhbnkgPSBbXTtcbiAgICAgIGNvbnN0IGZsYXQgPSAoX2FycmF5OiBhbnksIF9kZXB0aDogYW55KSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgX2FycmF5KSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWwpICYmIF9kZXB0aCA+IDApIHtcbiAgICAgICAgICAgIGZsYXQoZWwsIF9kZXB0aCAtIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmbGF0dGVuZC5wdXNoKGVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBmbGF0KGFycmF5LCBNYXRoLmZsb29yKGRlcHRoKSB8fCAxKTtcbiAgICAgIHJldHVybiBmbGF0dGVuZDtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2VydmljZXM6IGFueSA9IGF3YWl0IHRoaXMuZGlzY292ZXJBbGxTZXJ2aWNlc1dhaXQoKTtcbiAgICBjb25zdCBjaGFyc05lc3Q6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgc2VydmljZXMubWFwKChzOiBhbnkpID0+IHMuZGlzY292ZXJBbGxDaGFyYWN0ZXJpc3RpY3NXYWl0KCkpLFxuICAgICk7XG4gICAgY29uc3QgY2hhcnM6IGFueSA9IEFycmF5RmxhdChjaGFyc05lc3QpO1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzTmVzdDogYW55ID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBjaGFycy5tYXAoKGM6IGFueSkgPT4gYy5kaXNjb3ZlckFsbERlc2NyaXB0b3JzV2FpdCgpKSxcbiAgICApO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzOiBhbnkgPSBBcnJheUZsYXQoZGVzY3JpcHRvcnNOZXN0KTtcbiAgfVxuXG4gIHB1YmxpYyBvbmNvbm5lY3QoKSB7XG4gIH1cblxuICBwdWJsaWMgb25kaXNjb25uZWN0KCkge1xuICB9XG5cbiAgcHVibGljIG9uZGlzY292ZXJzZXJ2aWNlKGNoaWxkOiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyc2VydmljZWZpbmlzaGVkKGNoaWxkcmVuOiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbmRpc2NvdmVyKCkge1xuICB9XG5cbiAgcHVibGljIG9uZGlzY292ZXJmaW5pc2hlZCgpIHtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWU6IGFueSwgcGFyYW1zOiBhbnkpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChub3RpZnlOYW1lLCBwYXJhbXMpO1xuICAgIHN3aXRjaCAobm90aWZ5TmFtZSkge1xuICAgICAgY2FzZSBcInN0YXR1c3VwZGF0ZVwiOiB7XG4gICAgICAgIGlmIChwYXJhbXMuc3RhdHVzID09PSBcImNvbm5lY3RlZFwiKSB7XG4gICAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuZGlzY292ZXJBbGxIYW5kbGVzV2FpdCgpO1xuXG4gICAgICAgICAgdGhpcy5vbmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLnN0YXR1cyA9PT0gXCJkaXNjb25uZWN0ZWRcIikge1xuICAgICAgICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5vbmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJkaXNjb3ZlclwiOiB7XG4gICAgICAgIGNvbnN0IHV1aWQ6IGFueSA9IHBhcmFtcy5zZXJ2aWNlX3V1aWQ7XG4gICAgICAgIGxldCBjaGlsZDogYW55ID0gdGhpcy5nZXRTZXJ2aWNlKHV1aWQpO1xuICAgICAgICBpZiAoIWNoaWxkKSB7XG4gICAgICAgICAgY29uc3QgbmV3U2VydmljZTogYW55ID0gbmV3IEJsZVJlbW90ZVNlcnZpY2Uoe3V1aWR9KTtcbiAgICAgICAgICBuZXdTZXJ2aWNlLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5fc2VydmljZXMucHVzaChuZXdTZXJ2aWNlKTtcbiAgICAgICAgICBjaGlsZCA9IG5ld1NlcnZpY2U7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQuZGlzY292ZXJkT25SZW1vdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLm9uZGlzY292ZXJzZXJ2aWNlKGNoaWxkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFwiZGlzY292ZXJmaW5pc2hlZFwiOiB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBhbnkgPSB0aGlzLl9zZXJ2aWNlcy5maWx0ZXIoKGVsbTogYW55KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVsbS5kaXNjb3ZlcmRPblJlbW90ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub25kaXNjb3ZlcnNlcnZpY2VmaW5pc2hlZChjaGlsZHJlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbmVycm9yKCkge1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZVJlbW90ZVBlcmlwaGVyYWw7XG4iXX0=
