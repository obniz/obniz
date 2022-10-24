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
const bleHelper_1 = __importDefault(require("../../bleHelper"));
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
        this._scanServiceUuids = null;
        this.debugHandler = () => {
            // do nothing.
        };
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
        this._hci.on('stateChange', this.onStateChange.bind(this));
        this._hci.on('disconnComplete', this.onDisconnComplete.bind(this));
        this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));
        this._hci.on('updatePhy', this.onPhy.bind(this));
        this._gap.on('discover', this.onDiscover.bind(this));
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this._state = null;
        this._handles = {};
        this._gatts = {};
        this._aclStreams = {};
        this._signalings = {};
        this._gap._reset();
        // TODO: It must be canceled.
        this._connectPromises = [];
    }
    addPeripheralData(uuid, addressType) {
        if (!this._addresses[uuid]) {
            const address = bleHelper_1.default.reverseHexString(uuid, ':');
            this._addresses[uuid] = address;
            this._addresseTypes[uuid] = addressType;
            this._connectable[uuid] = true;
        }
    }
    async startExtendedScanningWait(serviceUuids, allowDuplicates, activeScan, usePhy1m, usePhyCoded) {
        if (!usePhy1m && !usePhyCoded) {
            throw new ObnizError_1.ObnizBleInvalidParameterError('Please make either true', `usePhy1M:${usePhy1m} usePhyCoded:${usePhyCoded}`);
        }
        this._scanServiceUuids = serviceUuids !== null && serviceUuids !== void 0 ? serviceUuids : null;
        await this._gap.startExtendedScanningWait(allowDuplicates, activeScan, usePhy1m, usePhyCoded);
    }
    async startScanningWait(serviceUuids, allowDuplicates, activeScan) {
        this._scanServiceUuids = serviceUuids !== null && serviceUuids !== void 0 ? serviceUuids : null;
        await this._gap.startScanningWait(allowDuplicates, activeScan);
    }
    async stopScanningWait() {
        await this._gap.stopScanningWait();
    }
    async stopExtendedScanningWait() {
        await this._gap.stopExtendedScanningWait();
    }
    /**
     * Connect to BLE device
     *
     * @param peripheralDeviceAddress ex: 0123456789ab
     * @param peripheralAddressType public | random | rpa_public | rpa_random
     * @param mtu bytes
     * @param onConnectCallback
     */
    async connectWait(peripheralUuid, mtu, onConnectCallback) {
        const address = this._addresses[peripheralUuid];
        const addressType = this._addresseTypes[peripheralUuid];
        if (!address) {
            throw new ObnizError_1.ObnizBleUnknownPeripheralError(address);
        }
        // Block parall connection ongoing for ESP32 bug.
        const doPromise = Promise.all(this._connectPromises)
            .catch((error) => {
            // nothing
        })
            .then(async () => {
            const conResult = await this._hci.createLeConnWait(address, addressType, 90 * 1000, (result) => {
                // on connect success
                this.onLeConnComplete(result.status, result.handle, result.role, result.addressType, result.address, result.interval, result.latency, result.supervisionTimeout, result.masterClockAccuracy);
                if (onConnectCallback && typeof onConnectCallback === 'function') {
                    onConnectCallback();
                }
            }); // connection timeout for 90 secs.
            return await this._gatts[address].exchangeMtuWait(mtu);
        })
            .then(() => {
            this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
            return Promise.resolve();
        }, (error) => {
            this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
            return Promise.reject(error);
        });
        this._connectPromises.push(doPromise);
        return doPromise;
    }
    async setDefaultPhyWait(usePhy1m, usePhy2m, usePhyCoded) {
        if (!usePhy1m && !usePhyCoded && !usePhy2m) {
            throw new ObnizError_1.ObnizBleInvalidParameterError('Please make either true', `usePhy1M:${usePhy1m} usePhy2M:${usePhy2m} usePhyCoded:${usePhyCoded}`);
        }
        const booleanToNumber = (flg) => (flg ? 1 : 0);
        const setPhy = booleanToNumber(usePhy1m) +
            booleanToNumber(usePhy2m) * 2 +
            booleanToNumber(usePhyCoded) * 4;
        await this._hci.leSetDefaultPhyCommandWait(0, setPhy, setPhy);
    }
    async readPhyWait(address) {
        return await this._hci.leReadPhyCommandWait(this._handles[address]);
    }
    async setPhyWait(address, usePhy1m, usePhy2m, usePhyCoded, useCodedModeS8, useCodedModeS2) {
        if (!usePhy1m && !usePhyCoded && !usePhy2m) {
            throw new ObnizError_1.ObnizBleInvalidParameterError('Please make either true', `usePhy1M:${usePhy1m} usePhy2M:${usePhy2m} usePhyCoded:${usePhyCoded}`);
        }
        if (usePhyCoded && !useCodedModeS8 && !useCodedModeS2) {
            throw new ObnizError_1.ObnizBleInvalidParameterError('Please make either true', `useCodedModeS8:${useCodedModeS8} useCodedModeS2:${useCodedModeS2}`);
        }
        const booleanToNumber = (flg) => (flg ? 1 : 0);
        const setPhy = booleanToNumber(usePhy1m) +
            booleanToNumber(usePhy2m) * 2 +
            booleanToNumber(usePhyCoded) * 4;
        await this._hci.leSetPhyCommandWait(this._handles[address], 0, setPhy, setPhy, booleanToNumber(useCodedModeS8) * 2 + booleanToNumber(useCodedModeS2));
    }
    onPhy(handler, txPhy, rxPhy) {
        this.emit('updatePhy', handler, txPhy, rxPhy);
    }
    async connectExtendedWait(peripheralUuid, mtu, onConnectCallback, usePhy1m = true, usePhy2m = true, usePhyCoded = true) {
        if (!usePhy1m && !usePhyCoded && !usePhy2m) {
            throw new ObnizError_1.ObnizBleInvalidParameterError('Please make either true', `usePhy1M:${usePhy1m} usePhy2M:${usePhy2m} usePhyCoded:${usePhyCoded}`);
        }
        const address = this._addresses[peripheralUuid];
        const addressType = this._addresseTypes[peripheralUuid];
        if (!address) {
            throw new ObnizError_1.ObnizBleUnknownPeripheralError(peripheralUuid);
        }
        // Block parall connection ongoing for ESP32 bug.
        const doPromise = Promise.all(this._connectPromises)
            .catch((error) => {
            // nothing
        })
            .then(async () => {
            const conResult = await this._hci.createLeExtendedConnWait(address, addressType, 90 * 1000, (result) => {
                // on connect success
                this.onLeConnComplete(result.status, result.handle, result.role, result.addressType, result.address, result.interval, result.latency, result.supervisionTimeout, result.masterClockAccuracy);
                if (onConnectCallback && typeof onConnectCallback === 'function') {
                    onConnectCallback();
                }
            }, usePhy1m, usePhy2m, usePhyCoded); // connection timeout for 90 secs.
            return await this._gatts[conResult.handle].exchangeMtuWait(mtu);
        })
            .then(() => {
            this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
            return Promise.resolve();
        }, (error) => {
            this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
            return Promise.reject(error);
        });
        this._connectPromises.push(doPromise);
        return doPromise;
    }
    disconnect(address) {
        this._hci.disconnect(this._handles[address]);
    }
    async updateRssiWait(address) {
        const rssi = await this._hci.readRssiWait(this._handles[address]);
        return rssi;
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        this.emit('stateChange', state);
    }
    onDiscover(status, addressWithColon, addressType, connectable, advertisement, rssi) {
        if (this._scanServiceUuids === null) {
            // scan not started ?
            return;
        }
        let serviceUuids = advertisement.serviceUuids || [];
        const serviceData = advertisement.serviceData || [];
        let hasScanServiceUuids = this._scanServiceUuids.length === 0;
        if (!hasScanServiceUuids) {
            serviceUuids = serviceUuids.slice();
            for (const i in serviceData) {
                serviceUuids.push(serviceData[i].uuid);
            }
            for (const i in serviceUuids) {
                hasScanServiceUuids =
                    this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1;
                if (hasScanServiceUuids) {
                    break;
                }
            }
        }
        if (hasScanServiceUuids) {
            const address = addressWithColon.split(':').join('');
            this.emit('discover', address, addressType, connectable, advertisement, rssi);
        }
    }
    onLeConnComplete(status, handle, role, addressType, addressWithColon, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 0) {
            // not master, ignore
            return;
        }
        if (status !== 0) {
            throw new ObnizError_1.ObnizBleHciStateError(status);
        }
        const address = addressWithColon.split(':').join('').toLowerCase();
        const aclStream = new acl_stream_1.default(this._hci, handle, this._hci.addressType, this._hci.address, addressType, addressWithColon);
        aclStream.debugHandler = (text) => {
            this.debug(text);
        };
        const gatt = new gatt_1.default(addressWithColon, aclStream);
        const signaling = new signaling_1.default(handle, aclStream);
        this._gatts[address] = gatt;
        this._signalings[address] = signaling;
        this._aclStreams[address] = aclStream;
        this._handles[address] = handle;
        this._addresses[handle] = address;
        this._gatts[address].on('notification', this.onNotification.bind(this));
        this._gatts[address].on('handleNotify', this.onHandleNotify.bind(this));
        this._signalings[address].on('connectionParameterUpdateRequest', this.onConnectionParameterUpdateWait.bind(this));
        // public onMtu(address: any, mtu?: any) {}
    }
    onDisconnComplete(handle, reason) {
        const address = this._addresses[handle];
        if (address) {
            const error = new ObnizError_1.ObnizBleHciStateError(reason, {
                peripheralAddress: address,
            });
            this._gatts[address].onEnd(error);
            this._gatts[address].removeAllListeners();
            this._signalings[address].removeAllListeners();
            delete this._gatts[address];
            delete this._signalings[address];
            delete this._aclStreams[address];
            delete this._handles[address];
            delete this._addresses[handle];
            this.emit('disconnect', address, error); // TODO: handle reason?
        }
        else {
            // maybe disconnect as peripheral
            // console.warn(
            //   'noble warning: unknown handle ' + handle + ' disconnected!'
            // );
        }
    }
    /** not used */
    onAclDataPkt(handle, cid, data) {
        const address = this._addresses[handle];
        const aclStream = this._aclStreams[address];
        if (aclStream) {
            aclStream.push(cid, data);
        }
    }
    async discoverServicesWait(address, uuids) {
        const gatt = this.getGatt(address);
        const services = await gatt.discoverServicesWait(uuids || []);
        return services;
    }
    /** not used */
    async discoverIncludedServicesWait(address, serviceUuid, serviceUuids) {
        const gatt = this.getGatt(address);
        const services = gatt.discoverIncludedServicesWait(serviceUuid, serviceUuids || []);
        return services;
    }
    async discoverCharacteristicsWait(address, serviceUuid, characteristicUuids) {
        const gatt = this.getGatt(address);
        const chars = await gatt.discoverCharacteristicsWait(serviceUuid, characteristicUuids || []);
        return chars;
    }
    async readWait(address, serviceUuid, characteristicUuid) {
        const gatt = this.getGatt(address);
        const data = await gatt.readWait(serviceUuid, characteristicUuid);
        return data;
    }
    async writeWait(address, serviceUuid, characteristicUuid, data, withoutResponse) {
        const gatt = this.getGatt(address);
        await gatt.writeWait(serviceUuid, characteristicUuid, data, withoutResponse);
    }
    /** not used */
    async broadcastWait(address, serviceUuid, characteristicUuid, broadcast) {
        const gatt = this.getGatt(address);
        await gatt.broadcastWait(serviceUuid, characteristicUuid, broadcast);
    }
    async notifyWait(address, serviceUuid, characteristicUuid, notify) {
        const gatt = this.getGatt(address);
        await gatt.notifyWait(serviceUuid, characteristicUuid, notify);
    }
    onNotification(addressWithColon, serviceUuid, characteristicUuid, data) {
        const address = addressWithColon.split(':').join('').toLowerCase();
        this.emit('notification', address, serviceUuid, characteristicUuid, data, true, true);
    }
    async discoverDescriptorsWait(address, serviceUuid, characteristicUuid) {
        const gatt = this.getGatt(address);
        return await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
    }
    async readValueWait(address, serviceUuid, characteristicUuid, descriptorUuid) {
        const gatt = this.getGatt(address);
        return await gatt.readValueWait(serviceUuid, characteristicUuid, descriptorUuid);
    }
    async writeValueWait(address, serviceUuid, characteristicUuid, descriptorUuid, data) {
        const gatt = this.getGatt(address);
        await gatt.writeValueWait(serviceUuid, characteristicUuid, descriptorUuid, data);
    }
    /** not used */
    async readHandleWait(address, attHandle) {
        const gatt = this.getGatt(address);
        const data = await gatt.readHandleWait(attHandle);
        return data;
    }
    /** not used */
    async writeHandleWait(address, attHandle, data, withoutResponse) {
        const gatt = this.getGatt(address);
        await gatt.writeHandleWait(attHandle, data, withoutResponse);
    }
    onHandleNotify(addressWithColon, handle, data) {
        const address = addressWithColon.split(':').join('').toLowerCase();
        this.emit('handleNotify', address, handle, data);
    }
    onConnectionParameterUpdateWait(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        this._hci
            .connUpdateLeWait(handle, minInterval, maxInterval, latency, supervisionTimeout)
            .then(() => {
            // do nothing.
        })
            .catch((e) => {
            // TODO:
            // This must passed to Obniz class.
            // console.error(e);
        });
        // this.onLeConnUpdateComplete(); is nop
    }
    async isPairingFinishedWait(peripheralUuid) {
        const gatt = this.getGatt(peripheralUuid);
        const result = gatt.hasEncryptKeys();
        return result;
    }
    async getPairingKeysWait(peripheralUuid) {
        const gatt = this.getGatt(peripheralUuid);
        const result = gatt.getEncryptKeys();
        return result;
    }
    async pairingWait(address, options) {
        options = options || {};
        const gatt = this.getGatt(address);
        const result = await gatt.encryptWait(options);
        return result;
    }
    setPairingOption(address, options) {
        options = options || {};
        const gatt = this.getGatt(address);
        gatt.setEncryptOption(options);
    }
    getGatt(address) {
        const gatt = this._gatts[address];
        if (!gatt) {
            throw new ObnizError_1.ObnizBleUnknownPeripheralError(address);
        }
        return gatt;
    }
    debug(text) {
        this.debugHandler(`${text}`);
    }
}
exports.default = NobleBindings;
