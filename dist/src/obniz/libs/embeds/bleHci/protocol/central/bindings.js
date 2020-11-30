"use strict";
/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
const acl_stream_1 = __importDefault(require("./acl-stream"));
const gap_1 = __importDefault(require("./gap"));
const gatt_1 = __importDefault(require("./gatt"));
const signaling_1 = __importDefault(require("./signaling"));
/**
 * @ignore
 */
class NobleBindings extends eventemitter3_1.default {
    constructor(hciProtocol) {
        super();
        this.debugHandler = () => { };
        this._hci = hciProtocol;
        this._gap = new gap_1.default(this._hci);
        this._state = null;
        this._addresses = {};
        this._addresseTypes = {};
        this._connectable = {};
        this._handles = {};
        this._gatts = {};
        this._aclStreams = {};
        this._signalings = {};
        this._connectPromises = [];
        this._hci.on("stateChange", this.onStateChange.bind(this));
        this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
        this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));
        this._gap.on("discover", this.onDiscover.bind(this));
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this._state = null;
        this._addresses = {};
        this._addresseTypes = {};
        this._connectable = {};
        this._handles = {};
        this._gatts = {};
        this._aclStreams = {};
        this._signalings = {};
        this._gap._reset();
        // TODO: It muset be canceled.
        this._connectPromises = [];
    }
    addPeripheralData(uuid, addressType) {
        if (!this._addresses[uuid]) {
            const address = uuid.match(/.{1,2}/g).join(":");
            this._addresses[uuid] = address;
            this._addresseTypes[uuid] = addressType;
            this._connectable[uuid] = true;
        }
    }
    async startScanningWait(serviceUuids, allowDuplicates, activeScan) {
        this._scanServiceUuids = serviceUuids || [];
        await this._gap.startScanningWait(allowDuplicates, activeScan);
    }
    async stopScanningWait() {
        await this._gap.stopScanningWait();
    }
    async connectWait(peripheralUuid, onConnectCallback) {
        const address = this._addresses[peripheralUuid];
        const addressType = this._addresseTypes[peripheralUuid];
        // Block parall connection ongoing for ESP32 bug.
        const doPromise = Promise.all(this._connectPromises)
            .catch((error) => {
            // nothing
        })
            .then(() => {
            return this._hci.createLeConnWait(address, addressType, 90 * 1000); // connection timeout for 90 secs.
        })
            .then((result) => {
            this.onLeConnComplete(result.status, result.handle, result.role, result.addressType, result.address, result.interval, result.latency, result.supervisionTimeout, result.masterClockAccuracy);
            if (onConnectCallback && typeof onConnectCallback === "function") {
                onConnectCallback();
            }
            return this._gatts[result.handle].exchangeMtuWait(256);
        })
            .then((result) => {
            this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
            return Promise.resolve(result);
        }, (error) => {
            this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
            return Promise.reject(error);
        });
        this._connectPromises.push(doPromise);
        return doPromise;
    }
    disconnect(peripheralUuid) {
        this._hci.disconnect(this._handles[peripheralUuid]);
    }
    async updateRssiWait(peripheralUuid) {
        const rssi = await this._hci.readRssiWait(this._handles[peripheralUuid]);
        return rssi;
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        if (state === "unauthorized") {
            console.log("noble warning: adapter state unauthorized, please run as root or with sudo");
            console.log("               or see README for information on running without root/sudo:");
            console.log("               https://github.com/sandeepmistry/noble#running-on-linux");
        }
        else if (state === "unsupported") {
            console.log("noble warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).");
            console.log("               Try to run with environment variable:");
            console.log("               [sudo] NOBLE_HCI_DEVICE_ID=x node ...");
        }
        this.emit("stateChange", state);
    }
    onDiscover(status, address, addressType, connectable, advertisement, rssi) {
        if (this._scanServiceUuids === undefined) {
            return;
        }
        let serviceUuids = advertisement.serviceUuids || [];
        const serviceData = advertisement.serviceData || [];
        let hasScanServiceUuids = this._scanServiceUuids.length === 0;
        if (!hasScanServiceUuids) {
            let i;
            serviceUuids = serviceUuids.slice();
            for (i in serviceData) {
                serviceUuids.push(serviceData[i].uuid);
            }
            for (i in serviceUuids) {
                hasScanServiceUuids = this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1;
                if (hasScanServiceUuids) {
                    break;
                }
            }
        }
        if (hasScanServiceUuids) {
            const uuid = address.split(":").join("");
            this._addresses[uuid] = address;
            this._addresseTypes[uuid] = addressType;
            this._connectable[uuid] = connectable;
            this.emit("discover", uuid, address, addressType, connectable, advertisement, rssi);
        }
    }
    onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 0) {
            // not master, ignore
            return;
        }
        let uuid = null;
        if (status !== 0) {
            throw new ObnizError_1.ObnizBleHciStateError(status);
        }
        uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        const aclStream = new acl_stream_1.default(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
        aclStream.debugHandler = (text) => {
            this.debug(text);
        };
        const gatt = new gatt_1.default(address, aclStream);
        const signaling = new signaling_1.default(handle, aclStream);
        this._gatts[uuid] = this._gatts[handle] = gatt;
        this._signalings[uuid] = this._signalings[handle] = signaling;
        this._aclStreams[handle] = aclStream;
        this._handles[uuid] = handle;
        this._handles[handle] = uuid;
        this._gatts[handle].on("notification", this.onNotification.bind(this));
        this._gatts[handle].on("handleNotify", this.onHandleNotify.bind(this));
        this._signalings[handle].on("connectionParameterUpdateRequest", this.onConnectionParameterUpdateWait.bind(this));
        // public onMtu(address: any, mtu?: any) {}
    }
    onDisconnComplete(handle, reason) {
        const uuid = this._handles[handle];
        if (uuid) {
            const error = new ObnizError_1.ObnizBleHciStateError(reason, { peripheralAddress: uuid });
            this._gatts[handle].onEnd(error);
            this._gatts[handle].removeAllListeners();
            this._signalings[handle].removeAllListeners();
            delete this._gatts[uuid];
            delete this._gatts[handle];
            delete this._signalings[uuid];
            delete this._signalings[handle];
            delete this._aclStreams[handle];
            delete this._handles[uuid];
            delete this._handles[handle];
            this.emit("disconnect", uuid, error); // TODO: handle reason?
        }
        else {
            // maybe disconnect as peripheral
            // console.warn(
            //   'noble warning: unknown handle ' + handle + ' disconnected!'
            // );
        }
    }
    onAclDataPkt(handle, cid, data) {
        const aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.push(cid, data);
        }
    }
    async discoverServicesWait(peripheralUuid, uuids) {
        const gatt = this.getGatt(peripheralUuid);
        const services = await gatt.discoverServicesWait(uuids || []);
        return services;
    }
    async discoverIncludedServicesWait(peripheralUuid, serviceUuid, serviceUuids) {
        const gatt = this.getGatt(peripheralUuid);
        const services = gatt.discoverIncludedServicesWait(serviceUuid, serviceUuids || []);
        return services;
    }
    async discoverCharacteristicsWait(peripheralUuid, serviceUuid, characteristicUuids) {
        const gatt = this.getGatt(peripheralUuid);
        const chars = await gatt.discoverCharacteristicsWait(serviceUuid, characteristicUuids || []);
        return chars;
    }
    async readWait(peripheralUuid, serviceUuid, characteristicUuid) {
        const gatt = this.getGatt(peripheralUuid);
        const data = await gatt.readWait(serviceUuid, characteristicUuid);
        return data;
    }
    async writeWait(peripheralUuid, serviceUuid, characteristicUuid, data, withoutResponse) {
        const gatt = this.getGatt(peripheralUuid);
        await gatt.writeWait(serviceUuid, characteristicUuid, data, withoutResponse);
    }
    async broadcastWait(peripheralUuid, serviceUuid, characteristicUuid, broadcast) {
        const gatt = this.getGatt(peripheralUuid);
        await gatt.broadcastWait(serviceUuid, characteristicUuid, broadcast);
    }
    async notifyWait(peripheralUuid, serviceUuid, characteristicUuid, notify) {
        const gatt = this.getGatt(peripheralUuid);
        await gatt.notifyWait(serviceUuid, characteristicUuid, notify);
    }
    onNotification(address, serviceUuid, characteristicUuid, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("notification", uuid, serviceUuid, characteristicUuid, data, true, true);
    }
    async discoverDescriptorsWait(peripheralUuid, serviceUuid, characteristicUuid) {
        const gatt = this.getGatt(peripheralUuid);
        const descriptors = await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
        return descriptors;
    }
    async readValueWait(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid) {
        const gatt = this.getGatt(peripheralUuid);
        const resp = await gatt.readValueWait(serviceUuid, characteristicUuid, descriptorUuid);
        return resp;
    }
    async writeValueWait(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data) {
        const gatt = this.getGatt(peripheralUuid);
        await gatt.writeValueWait(serviceUuid, characteristicUuid, descriptorUuid, data);
    }
    async readHandleWait(peripheralUuid, attHandle) {
        const gatt = this.getGatt(peripheralUuid);
        const data = await gatt.readHandleWait(attHandle);
        return data;
    }
    async writeHandleWait(peripheralUuid, attHandle, data, withoutResponse) {
        const gatt = this.getGatt(peripheralUuid);
        await gatt.writeHandleWait(attHandle, data, withoutResponse);
    }
    onHandleNotify(address, handle, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleNotify", uuid, handle, data);
    }
    async onConnectionParameterUpdateWait(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        await this._hci.connUpdateLeWait(handle, minInterval, maxInterval, latency, supervisionTimeout);
        // this.onLeConnUpdateComplete(); is nop
    }
    async pairingWait(peripheralUuid, options) {
        options = options || {};
        const gatt = this.getGatt(peripheralUuid);
        const result = await gatt.encryptWait(options);
        return result;
    }
    async setPairingOption(peripheralUuid, options) {
        options = options || {};
        const gatt = this.getGatt(peripheralUuid);
        gatt.setEncryptOption(options);
    }
    getGatt(peripheralUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (!gatt) {
            throw new ObnizError_1.ObnizBleUnknownPeripheralError(peripheralUuid);
        }
        return gatt;
    }
    debug(text) {
        this.debugHandler(`${text}`);
    }
}
exports.default = NobleBindings;
