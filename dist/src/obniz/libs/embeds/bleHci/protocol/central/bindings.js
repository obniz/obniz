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
const events_1 = __importDefault(require("events"));
const hci_1 = __importDefault(require("../hci"));
const acl_stream_1 = __importDefault(require("./acl-stream"));
const gap_1 = __importDefault(require("./gap"));
const gatt_1 = __importDefault(require("./gatt"));
const signaling_1 = __importDefault(require("./signaling"));
/**
 * @ignore
 */
class NobleBindings extends events_1.default.EventEmitter {
    constructor(hciProtocol) {
        super();
        this._state = null;
        this._addresses = {};
        this._addresseTypes = {};
        this._connectable = {};
        this._pendingConnectionUuid = null;
        this._connectionQueue = [];
        this._handles = {};
        this._gatts = {};
        this._aclStreams = {};
        this._signalings = {};
        this._hci = hciProtocol;
        this._gap = new gap_1.default(this._hci);
    }
    startScanning(serviceUuids, allowDuplicates, activeScan) {
        this._scanServiceUuids = serviceUuids || [];
        this._gap.startScanning(allowDuplicates, activeScan);
    }
    stopScanning() {
        this._gap.stopScanning();
    }
    connect(peripheralUuid) {
        const address = this._addresses[peripheralUuid];
        const addressType = this._addresseTypes[peripheralUuid];
        if (!this._pendingConnectionUuid) {
            this._pendingConnectionUuid = peripheralUuid;
            this._hci.createLeConn(address, addressType);
        }
        else {
            this._connectionQueue.push(peripheralUuid);
        }
    }
    disconnect(peripheralUuid) {
        this._hci.disconnect(this._handles[peripheralUuid]);
    }
    updateRssi(peripheralUuid) {
        this._hci.readRssi(this._handles[peripheralUuid]);
    }
    init() {
        this._gap.on("scanStart", this.onScanStart.bind(this));
        this._gap.on("scanStop", this.onScanStop.bind(this));
        this._gap.on("discover", this.onDiscover.bind(this));
        this._hci.on("stateChange", this.onStateChange.bind(this));
        this._hci.on("addressChange", this.onAddressChange.bind(this));
        this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
        this._hci.on("leConnUpdateComplete", this.onLeConnUpdateComplete.bind(this));
        this._hci.on("rssiRead", this.onRssiRead.bind(this));
        this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
        this._hci.on("encryptChange", this.onEncryptChange.bind(this));
        this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));
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
    onAddressChange(address) {
        this.emit("addressChange", address);
    }
    onScanStart(filterDuplicates) {
        this.emit("scanStart", filterDuplicates);
    }
    onScanStop() {
        this.emit("scanStop");
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
        let error = null;
        if (status === 0) {
            uuid = address
                .split(":")
                .join("")
                .toLowerCase();
            const aclStream = new acl_stream_1.default(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
            const gatt = new gatt_1.default(address, aclStream);
            const signaling = new signaling_1.default(handle, aclStream);
            this._gatts[uuid] = this._gatts[handle] = gatt;
            this._signalings[uuid] = this._signalings[handle] = signaling;
            this._aclStreams[handle] = aclStream;
            this._handles[uuid] = handle;
            this._handles[handle] = uuid;
            this._gatts[handle].on("mtu", this.onMtu.bind(this));
            this._gatts[handle].on("servicesDiscover", this.onServicesDiscovered.bind(this));
            this._gatts[handle].on("includedServicesDiscover", this.onIncludedServicesDiscovered.bind(this));
            this._gatts[handle].on("characteristicsDiscover", this.onCharacteristicsDiscovered.bind(this));
            this._gatts[handle].on("read", this.onRead.bind(this));
            this._gatts[handle].on("write", this.onWrite.bind(this));
            this._gatts[handle].on("broadcast", this.onBroadcast.bind(this));
            this._gatts[handle].on("notify", this.onNotify.bind(this));
            this._gatts[handle].on("notification", this.onNotification.bind(this));
            this._gatts[handle].on("descriptorsDiscover", this.onDescriptorsDiscovered.bind(this));
            this._gatts[handle].on("valueRead", this.onValueRead.bind(this));
            this._gatts[handle].on("valueWrite", this.onValueWrite.bind(this));
            this._gatts[handle].on("handleRead", this.onHandleRead.bind(this));
            this._gatts[handle].on("handleWrite", this.onHandleWrite.bind(this));
            this._gatts[handle].on("handleNotify", this.onHandleNotify.bind(this));
            this._signalings[handle].on("connectionParameterUpdateRequest", this.onConnectionParameterUpdateRequest.bind(this));
            this._gatts[handle].exchangeMtu(256);
        }
        else {
            uuid = this._pendingConnectionUuid;
            let statusMessage = hci_1.default.STATUS_MAPPER[status] || "HCI Error: Unknown";
            const errorCode = " (0x" + status.toString(16) + ")";
            statusMessage = statusMessage + errorCode;
            error = new Error(statusMessage);
        }
        this.emit("connect", uuid, error);
        if (this._connectionQueue.length > 0) {
            const peripheralUuid = this._connectionQueue.shift();
            address = this._addresses[peripheralUuid];
            addressType = this._addresseTypes[peripheralUuid];
            this._pendingConnectionUuid = peripheralUuid;
            this._hci.createLeConn(address, addressType);
        }
        else {
            this._pendingConnectionUuid = null;
        }
    }
    onLeConnUpdateComplete(handle, interval, latency, supervisionTimeout) {
        // no-op
    }
    onDisconnComplete(handle, reason) {
        const uuid = this._handles[handle];
        if (uuid) {
            this._aclStreams[handle].push(null, null);
            this._gatts[handle].removeAllListeners();
            this._signalings[handle].removeAllListeners();
            delete this._gatts[uuid];
            delete this._gatts[handle];
            delete this._signalings[uuid];
            delete this._signalings[handle];
            delete this._aclStreams[handle];
            delete this._handles[uuid];
            delete this._handles[handle];
            this.emit("disconnect", uuid); // TODO: handle reason?
        }
        else {
            // maybe disconnect as peripheral
            // console.warn(
            //   'noble warning: unknown handle ' + handle + ' disconnected!'
            // );
        }
    }
    onEncryptChange(handle, encrypt) {
        const aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.pushEncrypt(encrypt);
        }
    }
    onMtu(address, mtu) { }
    onRssiRead(handle, rssi) {
        this.emit("rssiUpdate", this._handles[handle], rssi);
    }
    onAclDataPkt(handle, cid, data) {
        const aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.push(cid, data);
        }
    }
    discoverServices(peripheralUuid, uuids) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverServices(uuids || []);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onServicesDiscovered(address, serviceUuids) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("servicesDiscover", uuid, serviceUuids);
    }
    discoverIncludedServices(peripheralUuid, serviceUuid, serviceUuids) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverIncludedServices(serviceUuid, serviceUuids || []);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onIncludedServicesDiscovered(address, serviceUuid, includedServiceUuids) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("includedServicesDiscover", uuid, serviceUuid, includedServiceUuids);
    }
    discoverCharacteristics(peripheralUuid, serviceUuid, characteristicUuids) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverCharacteristics(serviceUuid, characteristicUuids || []);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onCharacteristicsDiscovered(address, serviceUuid, characteristics) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("characteristicsDiscover", uuid, serviceUuid, characteristics);
    }
    read(peripheralUuid, serviceUuid, characteristicUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.read(serviceUuid, characteristicUuid);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onRead(address, serviceUuid, characteristicUuid, data, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("read", uuid, serviceUuid, characteristicUuid, data, false, isSuccess);
    }
    write(peripheralUuid, serviceUuid, characteristicUuid, data, withoutResponse) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.write(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onWrite(address, serviceUuid, characteristicUuid, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("write", uuid, serviceUuid, characteristicUuid, isSuccess);
    }
    broadcast(peripheralUuid, serviceUuid, characteristicUuid, broadcast) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.broadcast(serviceUuid, characteristicUuid, broadcast);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onBroadcast(address, serviceUuid, characteristicUuid, state) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("broadcast", uuid, serviceUuid, characteristicUuid, state);
    }
    notify(peripheralUuid, serviceUuid, characteristicUuid, notify) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.notify(serviceUuid, characteristicUuid, notify);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onNotify(address, serviceUuid, characteristicUuid, state) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("notify", uuid, serviceUuid, characteristicUuid, state);
    }
    onNotification(address, serviceUuid, characteristicUuid, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("read", uuid, serviceUuid, characteristicUuid, data, true, true);
    }
    discoverDescriptors(peripheralUuid, serviceUuid, characteristicUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverDescriptors(serviceUuid, characteristicUuid);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onDescriptorsDiscovered(address, serviceUuid, characteristicUuid, descriptorUuids) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("descriptorsDiscover", uuid, serviceUuid, characteristicUuid, descriptorUuids);
    }
    readValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.readValue(serviceUuid, characteristicUuid, descriptorUuid);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onValueRead(address, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("valueRead", uuid, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess);
    }
    writeValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.writeValue(serviceUuid, characteristicUuid, descriptorUuid, data);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onValueWrite(address, serviceUuid, characteristicUuid, descriptorUuid, isSuccess) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("valueWrite", uuid, serviceUuid, characteristicUuid, descriptorUuid, isSuccess);
    }
    readHandle(peripheralUuid, attHandle) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.readHandle(attHandle);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onHandleRead(address, handle, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleRead", uuid, handle, data);
    }
    writeHandle(peripheralUuid, attHandle, data, withoutResponse) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.writeHandle(attHandle, data, withoutResponse);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
    onHandleWrite(address, handle) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleWrite", uuid, handle);
    }
    onHandleNotify(address, handle, data) {
        const uuid = address
            .split(":")
            .join("")
            .toLowerCase();
        this.emit("handleNotify", uuid, handle, data);
    }
    onConnectionParameterUpdateRequest(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        this._hci.connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout);
    }
    pairing(peripheralUuid, keys, callback) {
        const handle = this._handles[peripheralUuid];
        const gatt = this._gatts[handle];
        if (gatt) {
            gatt.encrypt(callback, keys);
        }
        else {
            console.warn("noble warning: unknown peripheral " + peripheralUuid);
        }
    }
}
exports.default = NobleBindings;

//# sourceMappingURL=bindings.js.map
