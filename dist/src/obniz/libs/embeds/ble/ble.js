"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
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
const bleAdvertisement_1 = __importDefault(require("./bleAdvertisement"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const blePeripheral_1 = __importDefault(require("./blePeripheral"));
const bleRemotePeripheral_1 = __importDefault(require("./bleRemotePeripheral"));
const bleScan_1 = __importDefault(require("./bleScan"));
const bleSecurity_1 = __importDefault(require("./bleSecurity"));
const bleService_1 = __importDefault(require("./bleService"));
class ObnizBLE {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.remotePeripherals = [];
        this.service = bleService_1.default;
        this.characteristic = bleCharacteristic_1.default;
        this.descriptor = bleDescriptor_1.default;
        this.peripheral = new blePeripheral_1.default(Obniz);
        this.scanTarget = null;
        this.advertisement = new bleAdvertisement_1.default(Obniz);
        this.scan = new bleScan_1.default(Obniz);
        this.security = new bleSecurity_1.default(Obniz);
        this._reset();
    }
    static _dataArray2uuidHex(data, reverse) {
        let uuid = [];
        for (let i = 0; i < data.length; i++) {
            uuid.push(("00" + data[i].toString(16).toLowerCase()).slice(-2));
        }
        if (reverse) {
            uuid = uuid.reverse();
        }
        let str = uuid.join("");
        if (uuid.length >= 16) {
            str =
                str.slice(0, 8) +
                    "-" +
                    str.slice(8, 12) +
                    "-" +
                    str.slice(12, 16) +
                    "-" +
                    str.slice(16, 20) +
                    "-" +
                    str.slice(20);
        }
        return str;
    }
    // dummy
    initWait() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    _reset() {
    }
    directConnect(uuid, addressType) {
        throw new Error("directConnect cannot use obnizOS < 3.0.0. Please update obnizOS");
    }
    directConnectWait(uuid, addressType) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("directConnectWait cannot use obnizOS < 3.0.0. Please update obnizOS");
        });
    }
    findPeripheral(address) {
        for (const key in this.remotePeripherals) {
            if (this.remotePeripherals[key].address === address) {
                return this.remotePeripherals[key];
            }
        }
        return null;
    }
    notified(obj) {
        if (obj.scan_result) {
            let val = this.findPeripheral(obj.scan_result.address);
            if (!val) {
                val = new bleRemotePeripheral_1.default(this.Obniz, obj.scan_result.address);
                this.remotePeripherals.push(val);
            }
            val.discoverdOnRemote = true;
            val.setParams(obj.scan_result);
            this.scan.notifyFromServer("onfind", val);
        }
        if (obj.scan_result_finish) {
            this.scan.notifyFromServer("onfinish");
        }
        const remotePeripheralCallbackFunc = (val, func, type) => {
            let target = null;
            if (val === undefined) {
                return;
            }
            const p = this.findPeripheral(val.address);
            if (!p) {
                return;
            }
            if (type === "peripheral") {
                target = p;
            }
            else if (type === "service") {
                target = p.findService(val);
            }
            else if (type === "characteristic") {
                target = p.findCharacteristic(val);
            }
            else if (type === "descriptor") {
                target = p.findDescriptor(val);
            }
            if (!target) {
                return;
            }
            func(val, target);
        };
        const paramList = {
            status_update: { name: "statusupdate", obj: "peripheral" },
            get_service_result: { name: "discover", obj: "peripheral" },
            get_service_result_finish: {
                name: "discoverfinished",
                obj: "peripheral",
            },
            get_characteristic_result: { name: "discover", obj: "service" },
            get_characteristic_result_finish: {
                name: "discoverfinished",
                obj: "service",
            },
            write_characteristic_result: { name: "onwrite", obj: "characteristic" },
            read_characteristic_result: { name: "onread", obj: "characteristic" },
            register_notify_characteristic_result: {
                name: "onregisternotify",
                obj: "characteristic",
            },
            // for typo
            register_nofity_characteristic_result: {
                name: "onregisternotify",
                obj: "characteristic",
            },
            unregister_notify_characteristic_result: {
                name: "onunregisternotify",
                obj: "characteristic",
            },
            // for typo
            unregister_nofity_characteristic_result: {
                name: "onunregisternotify",
                obj: "characteristic",
            },
            notify_characteristic: { name: "onnotify", obj: "characteristic" },
            // for typo
            nofity_characteristic: { name: "onnotify", obj: "characteristic" },
            get_descriptor_result: { name: "discover", obj: "characteristic" },
            get_descriptor_result_finish: {
                name: "discoverfinished",
                obj: "characteristic",
            },
            write_descriptor_result: { name: "onwrite", obj: "descriptor" },
            read_descriptor_result: { name: "onread", obj: "descriptor" },
        };
        for (const paramListKey in paramList) {
            remotePeripheralCallbackFunc(obj[paramListKey], (val, bleobj) => {
                bleobj.notifyFromServer(paramList[paramListKey].name, val);
            }, paramList[paramListKey].obj);
        }
        const callbackFunc = (val, func, type) => {
            let target = null;
            if (val === undefined) {
                return;
            }
            if (type === "peripheral") {
                target = this.peripheral;
            }
            else if (type === "service") {
                target = this.peripheral.getService(val);
            }
            else if (type === "characteristic") {
                target = this.peripheral.findCharacteristic(val);
            }
            else if (type === "descriptor") {
                target = this.peripheral.findDescriptor(val);
            }
            if (!target) {
                return;
            }
            func(val, target);
        };
        if (obj.peripheral) {
            callbackFunc(obj.peripheral.connection_status, (val) => {
                this.peripheral.onconnectionupdates(val);
            }, "peripheral");
            const centralParamList = {
                read_characteristic_result: { name: "onread", obj: "characteristic" },
                write_characteristic_result: { name: "onwrite", obj: "characteristic" },
                notify_read_characteristic: {
                    name: "onreadfromremote",
                    obj: "characteristic",
                },
                notify_write_characteristic: {
                    name: "onwritefromremote",
                    obj: "characteristic",
                },
                read_descriptor_result: { name: "onread", obj: "descriptor" },
                write_descriptor_result: { name: "onwrite", obj: "descriptor" },
                notify_read_descriptor: { name: "onreadfromremote", obj: "descriptor" },
                notify_write_descriptor: {
                    name: "onwritefromremote",
                    obj: "descriptor",
                },
            };
            for (const key in centralParamList) {
                callbackFunc(obj.peripheral[key], (val, bleobj) => {
                    bleobj.notifyFromServer(centralParamList[key].name, val);
                }, centralParamList[key].obj);
            }
        }
        if (obj.error) {
            const params = obj.error;
            let handled = false;
            let peripheral;
            let target;
            if (!params.address) {
                peripheral = this.peripheral;
            }
            else {
                peripheral = this.findPeripheral(params.address);
            }
            if (peripheral) {
                if (params.service_uuid &&
                    params.characteristic_uuid &&
                    params.descriptor_uuid) {
                    target = peripheral.findDescriptor(params);
                }
                else if (params.service_uuid && params.characteristic_uuid) {
                    target = peripheral.findCharacteristic(params);
                }
                else if (params.service_uuid) {
                    target = peripheral.findService(params);
                }
                if (target) {
                    target.notifyFromServer("onerror", params);
                    handled = true;
                }
                else {
                    peripheral.onerror(params);
                    handled = true;
                }
            }
            if ([35, 36, 37, 38, 39].includes(params.function_code)) {
                this.security.onerror(params);
                handled = true;
            }
            if (!handled) {
                this.Obniz.error(`ble ${params.message} service=${params.service_uuid} characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${params.descriptor_uuid}`);
            }
        }
    }
}
exports.default = ObnizBLE;

//# sourceMappingURL=ble.js.map
