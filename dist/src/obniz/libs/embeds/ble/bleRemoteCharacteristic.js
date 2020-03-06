"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
const bleRemoteDescriptor_1 = __importDefault(require("./bleRemoteDescriptor"));
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
class BleRemoteCharacteristic extends bleRemoteAttributeAbstract_1.default {
    constructor(params) {
        super(params);
        this.properties = params.properties || [];
        if (!Array.isArray(this.properties)) {
            this.properties = [this.properties];
        }
    }
    get parentName() {
        return "service";
    }
    get childrenClass() {
        return bleRemoteDescriptor_1.default;
    }
    get childrenName() {
        return "descriptors";
    }
    get descriptors() {
        return this.children;
    }
    addDescriptor(params) {
        return this.addChild(params);
    }
    //
    // getCharacteristic(params) {
    //   return this.getChild(params)
    // }
    getDescriptor(uuid) {
        return this.getChild(uuid);
    }
    async registerNotify(callback) {
        this.onnotify = callback;
        const cccd = this.getDescriptor("2902");
        await cccd.writeWait([0x01, 0x00]);
        const obj = {
            ble: {
                register_notify_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    registerNotifyWait(callback) {
        return new Promise((resolve) => {
            this.emitter.once("onregisternotify", () => {
                resolve();
            });
            this.registerNotify(callback);
        });
    }
    unregisterNotify() {
        this.onnotify = () => { };
        const obj = {
            ble: {
                unregister_notify_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    unregisterNotifyWait() {
        return new Promise((resolve) => {
            this.emitter.once("onunregisternotify", () => {
                resolve();
            });
            this.unregisterNotify();
        });
    }
    read() {
        const obj = {
            ble: {
                read_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    write(array, needResponse) {
        if (needResponse === undefined) {
            needResponse = true;
        }
        const obj = {
            ble: {
                write_characteristic: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    data: array,
                    needResponse,
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    discoverChildren() {
        const obj = {
            ble: {
                get_descriptors: {
                    address: this.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.service.peripheral.Obniz.send(obj);
    }
    discoverAllDescriptors() {
        return this.discoverChildren();
    }
    discoverAllDescriptorsWait() {
        return this.discoverChildrenWait();
    }
    toJSON() {
        const obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        return obj;
    }
    canBroadcast() {
        return this.properties.includes("broadcast");
    }
    canNotify() {
        return this.properties.includes("notify");
    }
    canRead() {
        return this.properties.includes("read");
    }
    canWrite() {
        return this.properties.includes("write");
    }
    canWriteWithoutResponse() {
        return this.properties.includes("write_without_response");
    }
    canIndicate() {
        return this.properties.includes("indicate");
    }
    ondiscover(descriptor) {
        this.ondiscoverdescriptor(descriptor);
    }
    ondiscoverfinished(descriptors) {
        this.ondiscoverdescriptorfinished(descriptors);
    }
    ondiscoverdescriptor(descriptors) { }
    ondiscoverdescriptorfinished(descriptors) { }
    onregisternotify() { }
    onunregisternotify() { }
    onnotify(data) { }
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        switch (notifyName) {
            case "onregisternotify": {
                this.onregisternotify();
                break;
            }
            case "onunregisternotify": {
                this.onunregisternotify();
                break;
            }
            case "onnotify": {
                this.onnotify(params.data || undefined);
                break;
            }
        }
    }
}
exports.default = BleRemoteCharacteristic;

//# sourceMappingURL=bleRemoteCharacteristic.js.map
