"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// var debug = require('debug')('bindings');
const debug = () => {
};
const events = require("events");
const os = require("os");
const AclStream = require("./acl-stream");
const Gap = require("./gap");
const Gatt = require("./gatt");
class BlenoBindings extends events.EventEmitter {
    constructor(hciProtocol) {
        super();
        this._state = null;
        this._advertising = false;
        this._hci = hciProtocol;
        this._gap = new Gap(this._hci);
        this._gatt = new Gatt(this._hci);
        this._address = null;
        this._handle = null;
        this._aclStream = null;
    }
    startAdvertising(name, serviceUuids) {
        this._advertising = true;
        this._gap.startAdvertising(name, serviceUuids);
    }
    startAdvertisingIBeacon(data) {
        this._advertising = true;
        this._gap.startAdvertisingIBeacon(data);
    }
    startAdvertisingWithEIRData(advertisementData, scanData) {
        this._advertising = true;
        this._gap.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    stopAdvertising() {
        this._advertising = false;
        this._gap.stopAdvertising();
    }
    setServices(services) {
        this._gatt.setServices(services);
        this.emit("servicesSet");
    }
    disconnect() {
        if (this._handle) {
            debug("disconnect by server");
            this._hci.disconnect(this._handle);
        }
    }
    updateRssi() {
        if (this._handle) {
            this._hci.readRssi(this._handle);
        }
    }
    init() {
        this._gap.on("advertisingStart", this.onAdvertisingStart.bind(this));
        this._gap.on("advertisingStop", this.onAdvertisingStop.bind(this));
        this._gatt.on("mtuChange", this.onMtuChange.bind(this));
        this._hci.on("stateChange", this.onStateChange.bind(this));
        this._hci.on("addressChange", this.onAddressChange.bind(this));
        this._hci.on("readLocalVersion", this.onReadLocalVersion.bind(this));
        this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
        this._hci.on("leConnUpdateComplete", this.onLeConnUpdateComplete.bind(this));
        this._hci.on("rssiRead", this.onRssiRead.bind(this));
        this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
        this._hci.on("encryptChange", this.onEncryptChange.bind(this));
        this._hci.on("leLtkNegReply", this.onLeLtkNegReply.bind(this));
        this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));
        this.emit("platform", os.platform());
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        if (state === "unauthorized") {
            console.log("bleno warning: adapter state unauthorized, please run as root or with sudo");
            console.log("               or see README for information on running without root/sudo:");
            console.log("               https://github.com/sandeepmistry/bleno#running-on-linux");
        }
        else if (state === "unsupported") {
            console.log("bleno warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).");
            console.log("               Try to run with environment variable:");
            console.log("               [sudo] BLENO_HCI_DEVICE_ID=x node ...");
        }
        this.emit("stateChange", state);
    }
    onAddressChange(address) {
        this.emit("addressChange", address);
    }
    onReadLocalVersion(hciVer, hciRev, lmpVer, manufacturer, lmpSubVer) {
    }
    onAdvertisingStart(error) {
        this.emit("advertisingStart", error);
    }
    onAdvertisingStop() {
        this.emit("advertisingStop");
    }
    onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 1) {
            // not slave, ignore
            return;
        }
        this._address = address;
        this._handle = handle;
        this._aclStream = new AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
        this._gatt.setAclStream(this._aclStream);
        this.emit("accept", address);
    }
    onLeConnUpdateComplete(handle, interval, latency, supervisionTimeout) {
        // no-op
    }
    onDisconnComplete(handle, reason) {
        if (this._handle !== handle) {
            return; // not peripheral
        }
        if (this._aclStream) {
            this._aclStream.push(null, null);
        }
        const address = this._address;
        this._address = null;
        this._handle = null;
        this._aclStream = null;
        if (address) {
            this.emit("disconnect", address); // TODO: use reason
        }
        if (this._advertising) {
            this._gap.restartAdvertising();
        }
    }
    onEncryptChange(handle, encrypt) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.pushEncrypt(encrypt);
        }
    }
    onLeLtkNegReply(handle) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.pushLtkNegReply();
        }
    }
    onMtuChange(mtu) {
        this.emit("mtuChange", mtu);
    }
    onRssiRead(handle, rssi) {
        this.emit("rssiUpdate", rssi);
    }
    onAclDataPkt(handle, cid, data) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.push(cid, data);
        }
    }
}
exports.default = BlenoBindings;

//# sourceMappingURL=bindings.js.map
