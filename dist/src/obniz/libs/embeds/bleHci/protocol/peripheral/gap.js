"use strict";
/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('gap');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @ignore
 */
const debug = () => { };
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const hci_1 = __importDefault(require("../hci"));
/**
 * @ignore
 */
class Gap extends eventemitter3_1.default {
    constructor(hci) {
        super();
        this._hci = hci;
        this._advertiseState = null;
        this._hci.on("error", this.onHciError.bind(this));
    }
    async startAdvertisingWait(name, serviceUuids) {
        debug("startAdvertising: name = " + name + ", serviceUuids = " + JSON.stringify(serviceUuids, null, 2));
        let advertisementDataLength = 3;
        let scanDataLength = 0;
        const serviceUuids16bit = [];
        const serviceUuids128bit = [];
        let i = 0;
        if (name && name.length) {
            scanDataLength += 2 + name.length;
        }
        if (serviceUuids && serviceUuids.length) {
            for (i = 0; i < serviceUuids.length; i++) {
                const serviceUuid = Buffer.from(serviceUuids[i]
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""), "hex");
                if (serviceUuid.length === 2) {
                    serviceUuids16bit.push(serviceUuid);
                }
                else if (serviceUuid.length === 16) {
                    serviceUuids128bit.push(serviceUuid);
                }
            }
        }
        if (serviceUuids16bit.length) {
            advertisementDataLength += 2 + 2 * serviceUuids16bit.length;
        }
        if (serviceUuids128bit.length) {
            advertisementDataLength += 2 + 16 * serviceUuids128bit.length;
        }
        const advertisementData = Buffer.alloc(advertisementDataLength);
        const scanData = Buffer.alloc(scanDataLength);
        // flags
        advertisementData.writeUInt8(2, 0);
        advertisementData.writeUInt8(0x01, 1);
        advertisementData.writeUInt8(0x06, 2);
        let advertisementDataOffset = 3;
        if (serviceUuids16bit.length) {
            advertisementData.writeUInt8(1 + 2 * serviceUuids16bit.length, advertisementDataOffset);
            advertisementDataOffset++;
            advertisementData.writeUInt8(0x03, advertisementDataOffset);
            advertisementDataOffset++;
            for (i = 0; i < serviceUuids16bit.length; i++) {
                serviceUuids16bit[i].copy(advertisementData, advertisementDataOffset);
                advertisementDataOffset += serviceUuids16bit[i].length;
            }
        }
        if (serviceUuids128bit.length) {
            advertisementData.writeUInt8(1 + 16 * serviceUuids128bit.length, advertisementDataOffset);
            advertisementDataOffset++;
            advertisementData.writeUInt8(0x06, advertisementDataOffset);
            advertisementDataOffset++;
            for (i = 0; i < serviceUuids128bit.length; i++) {
                serviceUuids128bit[i].copy(advertisementData, advertisementDataOffset);
                advertisementDataOffset += serviceUuids128bit[i].length;
            }
        }
        // name
        if (name && name.length) {
            const nameBuffer = Buffer.alloc(name);
            scanData.writeUInt8(1 + nameBuffer.length, 0);
            scanData.writeUInt8(0x08, 1);
            nameBuffer.copy(scanData, 2);
        }
        await this.startAdvertisingWithEIRDataWait(advertisementData, scanData);
    }
    async startAdvertisingIBeaconWait(data) {
        debug("startAdvertisingIBeacon: data = " + data.toString("hex"));
        const dataLength = data.length;
        const manufacturerDataLength = 4 + dataLength;
        const advertisementDataLength = 5 + manufacturerDataLength;
        // let scanDataLength = 0;
        const advertisementData = Buffer.alloc(advertisementDataLength);
        const scanData = Buffer.alloc(0);
        // flags
        advertisementData.writeUInt8(2, 0);
        advertisementData.writeUInt8(0x01, 1);
        advertisementData.writeUInt8(0x06, 2);
        advertisementData.writeUInt8(manufacturerDataLength + 1, 3);
        advertisementData.writeUInt8(0xff, 4);
        advertisementData.writeUInt16LE(0x004c, 5); // Apple Company Identifier LE (16 bit)
        advertisementData.writeUInt8(0x02, 7); // type, 2 => iBeacon
        advertisementData.writeUInt8(dataLength, 8);
        data.copy(advertisementData, 9);
        await this.startAdvertisingWithEIRDataWait(advertisementData, scanData);
    }
    async startAdvertisingWithEIRDataWait(advertisementData, scanData) {
        advertisementData = advertisementData || Buffer.alloc(0);
        scanData = scanData || Buffer.alloc(0);
        debug("startAdvertisingWithEIRData: advertisement data = " +
            advertisementData.toString("hex") +
            ", scan data = " +
            scanData.toString("hex"));
        if (advertisementData.length > 31) {
            throw new Error("Advertisement data is over maximum limit of 31 bytes");
        }
        else if (scanData.length > 31) {
            throw new Error("Scan data is over maximum limit of 31 bytes");
        }
        this._advertiseState = "starting";
        const p1 = this._hci.setScanResponseDataWait(scanData); // background
        const p2 = this._hci.setAdvertisingDataWait(advertisementData); // background
        await Promise.all([p1, p2]);
        const p3 = this._hci.setAdvertiseEnableWait(true); // background
        const p4 = this._hci.setScanResponseDataWait(scanData); // background
        const p5 = this._hci.setAdvertisingDataWait(advertisementData); // background
        await Promise.all([p3, p4, p5]);
        const status = await p3;
        if (this._advertiseState === "starting") {
            this._advertiseState = "started";
            let error = null;
            if (status) {
                error = new Error(hci_1.default.STATUS_MAPPER[status] || "Unknown (" + status + ")");
            }
            this.emit("advertisingStart", error);
        }
        else if (this._advertiseState === "stopping") {
            this._advertiseState = "stopped";
            this.emit("advertisingStop");
        }
    }
    async restartAdvertisingWait() {
        this._advertiseState = "restarting";
        await this._hci.setAdvertiseEnableWait(true);
    }
    async stopAdvertisingWait() {
        this._advertiseState = "stopping";
        await this._hci.setAdvertiseEnableWait(false);
    }
    onHciError(error) { }
}
exports.default = Gap;

//# sourceMappingURL=gap.js.map
