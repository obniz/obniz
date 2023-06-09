"use strict";
/**
 * @packageDocumentation
 *
 * @ignore
 */
// let debug = require('debug')('gap');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gap = void 0;
/**
 * @ignore
 */
const debug = (message) => {
    // do nothing.
    // console.log('gap debug', message);
};
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
const bleHelper_1 = __importDefault(require("../../bleHelper"));
const LegacyAdvertisingPduMask = 0b0010000;
const LegacyAdvertising_ADV_SCAN_RESP_TO_ADV_IND = 0b0011011;
const LegacyAdvertising_ADV_SCAN_RESP_TO_SCAN_IND = 0b0011010;
const LegacyAdvertising_ADV_NONCONN_IND = 0b0010000;
/**
 * @ignore
 */
class Gap extends eventemitter3_1.default {
    constructor(hci) {
        super();
        this._scanState = null;
        this._scanFilterDuplicates = null;
        this._discoveries = {};
        this._hci = hci;
        this._reset();
        this._hci.on('leAdvertisingReport', this.onHciLeAdvertisingReport.bind(this));
        this._hci.on('leExtendedAdvertisingReport', this.onHciLeExtendedAdvertisingReport.bind(this));
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this._scanState = null;
        this._scanFilterDuplicates = null;
        this._discoveries = {};
    }
    async startScanningWait(allowDuplicates, activeScan) {
        this._scanFilterDuplicates = !allowDuplicates;
        this._discoveries = {};
        // Always set scan parameters before scanning
        // https://www.bluetooth.org/docman/handlers/downloaddoc.ashx?doc_id=229737
        // p106 - p107
        try {
            if (this._scanState === 'starting' || this._scanState === 'started') {
                await this.setScanEnabledWait(false, true);
            }
        }
        catch (e) {
            if (e instanceof ObnizError_1.ObnizBleScanStartError) {
                // If not started yet. this error may called. just ignore it.
            }
            else {
                throw e;
            }
        }
        this._scanState = 'starting';
        const status = await this._hci.setScanParametersWait(activeScan);
        if (status !== 0) {
            throw new ObnizError_1.ObnizBleScanStartError(status, `startScanning Error setting active scan=${activeScan} was failed`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.setScanEnabledWait(true, this._scanFilterDuplicates);
    }
    async stopScanningWait() {
        try {
            if (this._scanState === 'starting' || this._scanState === 'started') {
                await this.setScanEnabledWait(false, true);
            }
        }
        catch (e) {
            if (e instanceof ObnizError_1.ObnizBleScanStartError) {
                // If not started yet. this error may called. just ignore it.
            }
            else {
                throw e;
            }
        }
    }
    async stopExtendedScanningWait() {
        try {
            if (this._scanState === 'starting' || this._scanState === 'started') {
                await this.setExtendedScanEnabledWait(false, true);
            }
        }
        catch (e) {
            if (e instanceof ObnizError_1.ObnizBleScanStartError) {
                // If not started yet. this error may called. just ignore it.
            }
            else {
                throw e;
            }
        }
    }
    async startExtendedScanningWait(allowDuplicates, activeScan, usePhy1m, usePhyCoded) {
        this._scanFilterDuplicates = !allowDuplicates;
        this._discoveries = {};
        // Always set scan parameters before scanning
        // https://www.bluetooth.org/docman/handlers/DownloadDoc.ashx?doc_id=421043
        // p2729
        try {
            if (this._scanState === 'starting' || this._scanState === 'started') {
                await this.setExtendedScanEnabledWait(false, true);
            }
        }
        catch (e) {
            if (e instanceof ObnizError_1.ObnizBleScanStartError) {
                // If not started yet. this error may called. just ignore it.
            }
            else {
                throw e;
            }
        }
        this._scanState = 'starting';
        const status = await this._hci.setExtendedScanParametersWait(activeScan, usePhy1m, usePhyCoded);
        if (status !== 0) {
            throw new ObnizError_1.ObnizBleScanStartError(status, `startExtendedScanning Error setting active scan=${activeScan} was failed`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.setExtendedScanEnabledWait(true, this._scanFilterDuplicates);
    }
    onHciLeExtendedAdvertisingReport(status, type, address, addressType, eir, rssi, primaryPhy, secondaryPhy, sid, txPower, periodicAdvertisingInterval, directAddressType, directAddress) {
        debug('onHciLeExtendedAdvertisingReport', type, address, addressType, eir, rssi, primaryPhy, secondaryPhy, sid, txPower, periodicAdvertisingInterval, directAddressType, directAddress);
        this.onHciLeAdvertisingReport(status, type, address, addressType, eir, rssi, true, primaryPhy, secondaryPhy);
    }
    isAdvOrScanResp(type, extended) {
        if (extended) {
            if ((type & LegacyAdvertisingPduMask) !== 0) {
                // legacy advertising PDU
                if (type === LegacyAdvertising_ADV_SCAN_RESP_TO_ADV_IND ||
                    type === LegacyAdvertising_ADV_SCAN_RESP_TO_SCAN_IND) {
                    return 'scanResponse';
                }
                else {
                    return 'advertisement';
                }
            }
            else {
                if ((type & 0b00010000) === 0) {
                    return 'advertisement';
                }
                else {
                    return 'scanResponse';
                }
            }
        }
        else {
            if (type === 0x04) {
                return 'scanResponse';
            }
            else if (type === 0x00 ||
                type === 0x01 ||
                type === 0x02 ||
                type === 0x03) {
                return 'advertisement';
            }
        }
        return null;
    }
    onHciLeAdvertisingReport(status, type, address, addressType, eir, rssi, extended, primaryPhy, secondaryPhy) {
        const previouslyDiscovered = !!this._discoveries[address];
        const advertisement = previouslyDiscovered
            ? this._discoveries[address].advertisement
            : {
                localName: undefined,
                txPowerLevel: undefined,
                manufacturerData: undefined,
                serviceData: [],
                serviceUuids: [],
                solicitationServiceUuids: [],
                advertisementRaw: [],
                scanResponseRaw: [],
                raw: [],
            };
        let discoveryCount = previouslyDiscovered
            ? this._discoveries[address].count
            : 0;
        let hasScanResponse = previouslyDiscovered
            ? this._discoveries[address].hasScanResponse
            : false;
        const advType = this.isAdvOrScanResp(type, extended);
        if (advType === 'scanResponse') {
            hasScanResponse = true;
            if (eir.length > 0) {
                advertisement.scanResponseRaw = Array.from(eir);
            }
        }
        else {
            // reset service data every non-scan response event
            advertisement.serviceData = [];
            advertisement.serviceUuids = [];
            advertisement.serviceSolicitationUuids = [];
            if (eir.length > 0) {
                advertisement.advertisementRaw = Array.from(eir);
            }
        }
        discoveryCount++;
        let i = 0;
        let j = 0;
        let serviceUuid = null;
        let serviceSolicitationUuid = null;
        while (i + 1 < eir.length) {
            const length = eir.readUInt8(i);
            if (length < 1) {
                debug('invalid EIR data, length = ' + length);
                break;
            }
            const eirType = eir.readUInt8(i + 1); // https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
            if (i + length + 1 > eir.length) {
                debug('invalid EIR data, out of range of buffer length');
                break;
            }
            const bytes = eir.slice(i + 2).slice(0, length - 1);
            switch (eirType) {
                case 0x02: // Incomplete List of 16-bit Service Class UUID
                case 0x03: // Complete List of 16-bit Service Class UUIDs
                    for (j = 0; j < bytes.length; j += 2) {
                        serviceUuid = bytes.readUInt16LE(j).toString(16);
                        if (advertisement.serviceUuids.indexOf(serviceUuid) === -1) {
                            advertisement.serviceUuids.push(serviceUuid);
                        }
                    }
                    break;
                case 0x06: // Incomplete List of 128-bit Service Class UUIDs
                case 0x07: // Complete List of 128-bit Service Class UUIDs
                    for (j = 0; j < bytes.length; j += 16) {
                        serviceUuid = bleHelper_1.default.buffer2reversedHex(bytes.slice(j, j + 16));
                        if (advertisement.serviceUuids.indexOf(serviceUuid) === -1) {
                            advertisement.serviceUuids.push(serviceUuid);
                        }
                    }
                    break;
                case 0x08: // Shortened Local Name
                case 0x09: // Complete Local Name
                    advertisement.localName = bytes.toString('utf8');
                    break;
                case 0x0a: {
                    // Tx Power Level
                    advertisement.txPowerLevel = bytes.readInt8(0);
                    break;
                }
                case 0x14: {
                    // List of 16 bit solicitation UUIDs
                    for (j = 0; j < bytes.length; j += 2) {
                        serviceSolicitationUuid = bytes.readUInt16LE(j).toString(16);
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                }
                case 0x15: {
                    // List of 128 bit solicitation UUIDs
                    for (j = 0; j < bytes.length; j += 16) {
                        serviceSolicitationUuid = bleHelper_1.default.buffer2reversedHex(bytes.slice(j, j + 16));
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                }
                case 0x16: {
                    // 16-bit Service Data, there can be multiple occurences
                    const serviceDataUuid = bleHelper_1.default.buffer2reversedHex(bytes.slice(0, 2));
                    const serviceData = bytes.slice(2, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceDataUuid,
                        data: serviceData,
                    });
                    break;
                }
                case 0x20: {
                    // 32-bit Service Data, there can be multiple occurences
                    const serviceData32Uuid = bleHelper_1.default.buffer2reversedHex(bytes.slice(0, 4));
                    const serviceData32 = bytes.slice(4, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceData32Uuid,
                        data: serviceData32,
                    });
                    break;
                }
                case 0x21: {
                    // 128-bit Service Data, there can be multiple occurences
                    const serviceData128Uuid = bleHelper_1.default.buffer2reversedHex(bytes.slice(0, 16));
                    const serviceData128 = bytes.slice(16, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceData128Uuid,
                        data: serviceData128,
                    });
                    break;
                }
                case 0x1f: // List of 32 bit solicitation UUIDs
                    for (j = 0; j < bytes.length; j += 4) {
                        serviceSolicitationUuid = bytes.readUInt32LE(j).toString(16);
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                case 0xff: // Manufacturer Specific Data
                    advertisement.manufacturerData = bytes;
                    break;
            }
            i += length + 1;
        }
        debug('advertisement = ' + JSON.stringify(advertisement, null, 0));
        let connectable;
        if (extended) {
            if ((type & LegacyAdvertisingPduMask) !== 0) {
                // legacy advertising PDU
                if (type === LegacyAdvertising_ADV_SCAN_RESP_TO_ADV_IND ||
                    type === LegacyAdvertising_ADV_SCAN_RESP_TO_SCAN_IND) {
                    connectable = this._discoveries[address].connectable;
                }
                else {
                    connectable = type !== LegacyAdvertising_ADV_NONCONN_IND;
                }
            }
            else {
                connectable = (type & 0b00000001) !== 0;
            }
        }
        else {
            if (type === 0x04 && previouslyDiscovered) {
                connectable = this._discoveries[address].connectable;
            }
            else {
                connectable = type !== 0x03;
            }
        }
        this._discoveries[address] = {
            address,
            addressType,
            connectable,
            advertisement,
            rssi,
            count: discoveryCount,
            hasScanResponse,
        };
        this.emit('discover', status, address, addressType, connectable, advertisement, rssi, primaryPhy, secondaryPhy);
    }
    async setExtendedScanEnabledWait(enabled, filterDuplicates) {
        const status = await this._hci.setExtendedScanEnabledWait(enabled, filterDuplicates);
        // Check the status we got from the command complete function.
        if (status !== 0) {
            // If it is non-zero there was an error, and we should not change
            // our status as a result.
            throw new ObnizError_1.ObnizBleScanStartError(status, `startExtendedScanning enable=${enabled} was failed. Maybe Connection to a device is under going.`);
        }
        else {
            if (this._scanState === 'starting') {
                this._scanState = 'started';
            }
            else if (this._scanState === 'stopping') {
                this._scanState = 'stopped';
            }
        }
    }
    async setScanEnabledWait(enabled, filterDuplicates) {
        const status = await this._hci.setScanEnabledWait(enabled, filterDuplicates);
        // Check the status we got from the command complete function.
        if (status !== 0) {
            // If it is non-zero there was an error, and we should not change
            // our status as a result.
            throw new ObnizError_1.ObnizBleScanStartError(status, `startScanning enable=${enabled} was failed. Maybe Connection to a device is under going.`);
        }
        else {
            if (this._scanState === 'starting') {
                this._scanState = 'started';
            }
            else if (this._scanState === 'stopping') {
                this._scanState = 'stopped';
            }
        }
    }
}
exports.Gap = Gap;
