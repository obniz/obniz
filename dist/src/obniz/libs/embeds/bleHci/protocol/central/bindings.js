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
exports.NobleBindings = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
const bleHelper_1 = __importDefault(require("../../bleHelper"));
const acl_stream_1 = require("./acl-stream");
const gap_1 = require("./gap");
const gatt_1 = require("./gatt");
const signaling_1 = require("./signaling");
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
        this._gap = new gap_1.Gap(this._hci);
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
        this._addresses = {};
        this._addresseTypes = {};
        this._connectable = {};
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
            const address = bleHelper_1.default.addColon(uuid);
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
    async connectWait(peripheralUuid, mtu, onConnectCallback) {
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
            const conResult = await this._hci.createLeConnWait(address, addressType, 90 * 1000, (result) => {
                // on connect success
                this.onLeConnComplete(result.status, result.handle, result.role, result.addressType, result.address, result.interval, result.latency, result.supervisionTimeout, result.masterClockAccuracy);
                if (onConnectCallback && typeof onConnectCallback === 'function') {
                    onConnectCallback();
                }
            }); // connection timeout for 90 secs.
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
        this.emit('stateChange', state);
    }
    onDiscover(status, address, addressType, connectable, advertisement, rssi, primaryPhy, secondaryPhy) {
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
            const uuid = address.split(':').join('');
            this._addresses[uuid] = address;
            this._addresseTypes[uuid] = addressType;
            this._connectable[uuid] = connectable;
            this.emit('discover', uuid, address, addressType, connectable, advertisement, rssi, primaryPhy, secondaryPhy);
        }
    }
    onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
        if (role !== 0) {
            // not master, ignore
            return;
        }
        if (status !== 0) {
            throw new ObnizError_1.ObnizBleHciStateError(status);
        }
        const uuid = address.split(':').join('').toLowerCase();
        const aclStream = new acl_stream_1.AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
        aclStream.debugHandler = (text) => {
            this.debug(text);
        };
        const gatt = new gatt_1.GattCentral(address, aclStream);
        const signaling = new signaling_1.Signaling(handle, aclStream);
        this._gatts[uuid] = this._gatts[handle] = gatt;
        this._signalings[uuid] = this._signalings[handle] = signaling;
        this._aclStreams[handle] = aclStream;
        this._handles[uuid] = handle;
        this._handles[handle] = uuid;
        this._gatts[handle].on('notification', this.onNotification.bind(this));
        this._gatts[handle].on('handleNotify', this.onHandleNotify.bind(this));
        this._signalings[handle].on('connectionParameterUpdateRequest', this.onConnectionParameterUpdateWait.bind(this));
        // public onMtu(address: any, mtu?: any) {}
    }
    onDisconnComplete(handle, reason) {
        const uuid = this._handles[handle];
        if (uuid) {
            const error = new ObnizError_1.ObnizBleHciStateError(reason, {
                peripheralAddress: uuid,
            });
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
            this.emit('disconnect', uuid, error); // TODO: handle reason?
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
        const uuid = address.split(':').join('').toLowerCase();
        this.emit('notification', uuid, serviceUuid, characteristicUuid, data, true, true);
    }
    async discoverDescriptorsWait(peripheralUuid, serviceUuid, characteristicUuid) {
        const gatt = this.getGatt(peripheralUuid);
        return await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
    }
    async readValueWait(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid) {
        const gatt = this.getGatt(peripheralUuid);
        return await gatt.readValueWait(serviceUuid, characteristicUuid, descriptorUuid);
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
        const uuid = address.split(':').join('').toLowerCase();
        this.emit('handleNotify', uuid, handle, data);
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
    async pairingWait(peripheralUuid, options) {
        options = options || {};
        const gatt = this.getGatt(peripheralUuid);
        const result = await gatt.encryptWait(options);
        return result;
    }
    setPairingOption(peripheralUuid, options) {
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
exports.NobleBindings = NobleBindings;
