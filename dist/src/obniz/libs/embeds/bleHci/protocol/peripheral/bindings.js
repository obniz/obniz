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
exports.BlenoBindings = void 0;
/**
 * @ignore
 */
const debug = () => {
    // do nothing.
};
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const acl_stream_1 = require("./acl-stream");
const gap_1 = require("./gap");
const gatt_1 = require("./gatt");
/**
 * @ignore
 */
class BlenoBindings extends eventemitter3_1.default {
    constructor(hciProtocol) {
        super();
        this._state = null;
        this._extended = false;
        this._advertising = false;
        this._hci = hciProtocol;
        this._gap = new gap_1.Gap(this._hci);
        this._gatt = new gatt_1.GattPeripheral();
        this._gatt.on('mtuChange', this.onMtuChange.bind(this));
        this._hci.on('stateChange', this.onStateChange.bind(this));
        this._hci.on('leConnComplete', this.onLeConnComplete.bind(this));
        this._hci.on('leConnUpdateComplete', this.onLeConnUpdateComplete.bind(this));
        this._hci.on('disconnComplete', this.onDisconnCompleteWait.bind(this));
        this._hci.on('encryptChange', this.onEncryptChange.bind(this));
        this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));
        this._address = null;
        this._handle = null;
        this._aclStream = null;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this._state = null;
        this._advertising = false;
        this._gap._reset();
        this._gatt._reset();
        this._address = null;
        this._handle = null;
        this._aclStream = null;
    }
    async startAdvertisingWait(name, serviceUuids) {
        this._advertising = true;
        await this._gap.startAdvertisingWait(name, serviceUuids);
    }
    async startAdvertisingIBeaconWait(data) {
        this._advertising = true;
        await this._gap.startAdvertisingIBeaconWait(data);
    }
    async startAdvertisingWithEIRDataWait(advertisementData, scanData) {
        this._advertising = true;
        await this._gap.startAdvertisingWithEIRDataWait(advertisementData, scanData);
    }
    async stopAdvertisingWait() {
        this._advertising = false;
        await this._gap.stopAdvertisingWait();
    }
    async setExtendedAdvertisingParametersWait(handle, eventProperties, primaryAdvertisingPhy, secondaryAdvertisingPhy, txPower) {
        await this._gap.setExtendedAdvertiseParametersWait(handle, eventProperties, primaryAdvertisingPhy, secondaryAdvertisingPhy, txPower);
    }
    async setExtendedAdvertisingDataWait(handle, data) {
        await this._gap.setExtendedAdvertisingDataWait(handle, data);
    }
    async setExtendedAdvertisingScanResponseDataWait(handle, data) {
        await this._gap.setExtendedAdvertisingScanResponseDataWait(handle, data);
    }
    async startExtendedAdvertisingWait(handle) {
        this._advertising = true;
        this._extended = true;
        await this._gap.startExtendedAdvertisingWait(handle);
    }
    async stopExtendedAdvertisingWait(handle) {
        this._advertising = false;
        this._extended = false;
        await this._gap.stopExtendedAdvertisingWait(handle);
    }
    setServices(services) {
        this._gatt.setServices(services);
    }
    disconnect() {
        if (this._handle) {
            debug('disconnect by server');
            this._hci.disconnect(this._handle);
        }
    }
    async updateRssiWait() {
        if (this._handle) {
            const rssi = await this._hci.readRssiWait(this._handle);
            return rssi;
        }
        return null;
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        if (state === 'unauthorized') {
            console.log('bleno warning: adapter state unauthorized, please run as root or with sudo');
            console.log('               or see README for information on running without root/sudo:');
            console.log('               https://github.com/sandeepmistry/bleno#running-on-linux');
        }
        else if (state === 'unsupported') {
            console.log('bleno warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).');
            console.log('               Try to run with environment variable:');
            console.log('               [sudo] BLENO_HCI_DEVICE_ID=x node ...');
        }
        this.emit('stateChange', state);
    }
    onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 1) {
            // not slave, ignore
            return;
        }
        this._address = address;
        this._handle = handle;
        this._aclStream = new acl_stream_1.AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
        this._gatt.setAclStream(this._aclStream);
        this.emit('accept', address);
    }
    onLeConnUpdateComplete(handle, interval, latency, supervisionTimeout) {
        // no-op
    }
    async onDisconnCompleteWait(handle, reason) {
        if (this._handle !== handle) {
            return; // not peripheral
        }
        if (this._aclStream) {
            this._aclStream.end();
            this._aclStream = null;
        }
        const address = this._address;
        this._address = null;
        this._handle = null;
        if (address) {
            this.emit('disconnect', address, reason); // TODO: use reason
        }
        if (this._advertising) {
            if (this._extended) {
                await this._gap.restartExtendedAdvertisingWait(0);
            }
            else {
                await this._gap.restartAdvertisingWait();
            }
        }
    }
    onEncryptChange(handle, encrypt) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.pushEncrypt(encrypt);
        }
    }
    onMtuChange(mtu) {
        this.emit('mtuChange', mtu);
    }
    onAclDataPkt(handle, cid, data) {
        if (this._handle === handle && this._aclStream) {
            this._aclStream.push(cid, data);
        }
    }
}
exports.BlenoBindings = BlenoBindings;
