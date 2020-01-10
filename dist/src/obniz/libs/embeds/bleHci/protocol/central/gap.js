"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// let debug = require('debug')('gap');
const debug = () => {
};
const events = require("events");
const Hci = require("../hci");
class Gap extends events.EventEmitter {
    constructor(hci) {
        super();
        this._hci = hci;
        this._scanState = null;
        this._scanFilterDuplicates = null;
        this._discoveries = {};
        this._hci.on("error", this.onHciError.bind(this));
        this._hci.on("leScanParametersSet", this.onHciLeScanParametersSet.bind(this));
        this._hci.on("leScanEnableSet", this.onHciLeScanEnableSet.bind(this));
        this._hci.on("leAdvertisingReport", this.onHciLeAdvertisingReport.bind(this));
        this._hci.on("leScanEnableSetCmd", this.onLeScanEnableSetCmd.bind(this));
        this._hci.on("leAdvertisingParametersSet", this.onHciLeAdvertisingParametersSet.bind(this));
        this._hci.on("leAdvertisingDataSet", this.onHciLeAdvertisingDataSet.bind(this));
        this._hci.on("leScanResponseDataSet", this.onHciLeScanResponseDataSet.bind(this));
        this._hci.on("leAdvertiseEnableSet", this.onHciLeAdvertiseEnableSet.bind(this));
    }
    startScanning(allowDuplicates) {
        this._scanState = "starting";
        this._scanFilterDuplicates = !allowDuplicates;
        // Always set scan parameters before scanning
        // https://www.bluetooth.org/docman/handlers/downloaddoc.ashx?doc_id=229737
        // p106 - p107
        this._hci.setScanEnabled(false, true);
        this._hci.setScanParameters();
        this._hci.setScanEnabled(true, this._scanFilterDuplicates);
    }
    stopScanning() {
        this._scanState = "stopping";
        this._hci.setScanEnabled(false, true);
    }
    onHciLeScanParametersSet() {
    }
    // Called when receive an event "Command Complete" for "LE Set Scan Enable"
    onHciLeScanEnableSet(status) {
        // Check the status we got from the command complete function.
        if (status !== 0) {
            // If it is non-zero there was an error, and we should not change
            // our status as a result.
            return;
        }
        if (this._scanState === "starting") {
            this._scanState = "started";
            this.emit("scanStart", this._scanFilterDuplicates);
        }
        else if (this._scanState === "stopping") {
            this._scanState = "stopped";
            this.emit("scanStop");
        }
    }
    // Called when we see the actual command "LE Set Scan Enable"
    onLeScanEnableSetCmd(enable, filterDuplicates) {
        // Check to see if the new settings differ from what we expect.
        // If we are scanning, then a change happens if the new command stops
        // scanning or if duplicate filtering changes.
        // If we are not scanning, then a change happens if scanning was enabled.
        if (this._scanState === "starting" || this._scanState === "started") {
            if (!enable) {
                this.emit("scanStop");
            }
            else if (this._scanFilterDuplicates !== filterDuplicates) {
                this._scanFilterDuplicates = filterDuplicates;
                this.emit("scanStart", this._scanFilterDuplicates);
            }
        }
        else if ((this._scanState === "stopping" || this._scanState === "stopped") &&
            enable) {
            // Someone started scanning on us.
            this.emit("scanStart", this._scanFilterDuplicates);
        }
    }
    onHciLeAdvertisingReport(status, type, address, addressType, eir, rssi) {
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
        if (type === 0x04) {
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
                debug("invalid EIR data, length = " + length);
                break;
            }
            const eirType = eir.readUInt8(i + 1); // https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
            if (i + length + 1 > eir.length) {
                debug("invalid EIR data, out of range of buffer length");
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
                        serviceUuid = bytes
                            .slice(j, j + 16)
                            .toString("hex")
                            .match(/.{1,2}/g)
                            .reverse()
                            .join("");
                        if (advertisement.serviceUuids.indexOf(serviceUuid) === -1) {
                            advertisement.serviceUuids.push(serviceUuid);
                        }
                    }
                    break;
                case 0x08: // Shortened Local Name
                case 0x09: // Complete Local Name
                    advertisement.localName = bytes.toString("utf8");
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
                        serviceSolicitationUuid = bytes
                            .slice(j, j + 16)
                            .toString("hex")
                            .match(/.{1,2}/g)
                            .reverse()
                            .join("");
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                }
                case 0x16: {
                    // 16-bit Service Data, there can be multiple occurences
                    const serviceDataUuid = bytes
                        .slice(0, 2)
                        .toString("hex")
                        .match(/.{1,2}/g)
                        .reverse()
                        .join("");
                    const serviceData = bytes.slice(2, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceDataUuid,
                        data: serviceData,
                    });
                    break;
                }
                case 0x20: {
                    // 32-bit Service Data, there can be multiple occurences
                    const serviceData32Uuid = bytes
                        .slice(0, 4)
                        .toString("hex")
                        .match(/.{1,2}/g)
                        .reverse()
                        .join("");
                    const serviceData32 = bytes.slice(4, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceData32Uuid,
                        data: serviceData32,
                    });
                    break;
                }
                case 0x21: {
                    // 128-bit Service Data, there can be multiple occurences
                    const serviceData128Uuid = bytes
                        .slice(0, 16)
                        .toString("hex")
                        .match(/.{1,2}/g)
                        .reverse()
                        .join("");
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
        debug("advertisement = " + JSON.stringify(advertisement, null, 0));
        const connectable = type === 0x04 && previouslyDiscovered
            ? this._discoveries[address].connectable
            : type !== 0x03;
        this._discoveries[address] = {
            address,
            addressType,
            connectable,
            advertisement,
            rssi,
            count: discoveryCount,
            hasScanResponse,
        };
        // only report after a scan response event or if non-connectable or more than one discovery without a scan response, so more data can be collected
        if (type === 0x04 ||
            !connectable ||
            (discoveryCount > 1 && !hasScanResponse) ||
            process.env.NOBLE_REPORT_ALL_HCI_EVENTS) {
            this.emit("discover", status, address, addressType, connectable, advertisement, rssi);
        }
    }
    startAdvertising(name, serviceUuids) {
        debug("startAdvertising: name = " +
            name +
            ", serviceUuids = " +
            JSON.stringify(serviceUuids, null, 2));
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
            const nameBuffer = Buffer.from(name);
            scanData.writeUInt8(1 + nameBuffer.length, 0);
            scanData.writeUInt8(0x08, 1);
            nameBuffer.copy(scanData, 2);
        }
        this.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    startAdvertisingIBeacon(data) {
        debug("startAdvertisingIBeacon: data = " + data.toString("hex"));
        const dataLength = data.length;
        const manufacturerDataLength = 4 + dataLength;
        const advertisementDataLength = 5 + manufacturerDataLength;
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
        this.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    startAdvertisingWithEIRData(advertisementData, scanData) {
        advertisementData = advertisementData || Buffer.alloc(0);
        scanData = scanData || Buffer.alloc(0);
        debug("startAdvertisingWithEIRData: advertisement data = " +
            advertisementData.toString("hex") +
            ", scan data = " +
            scanData.toString("hex"));
        let error = null;
        if (advertisementData.length > 31) {
            error = new Error("Advertisement data is over maximum limit of 31 bytes");
        }
        else if (scanData.length > 31) {
            error = new Error("Scan data is over maximum limit of 31 bytes");
        }
        if (error) {
            this.emit("advertisingStart", error);
        }
        else {
            this._advertiseState = "starting";
            this._hci.setScanResponseData(scanData);
            this._hci.setAdvertisingData(advertisementData);
            this._hci.setAdvertiseEnable(true);
            this._hci.setScanResponseData(scanData);
            this._hci.setAdvertisingData(advertisementData);
        }
    }
    restartAdvertising() {
        this._advertiseState = "restarting";
        this._hci.setAdvertiseEnable(true);
    }
    stopAdvertising() {
        this._advertiseState = "stopping";
        this._hci.setAdvertiseEnable(false);
    }
    onHciError(error) {
    }
    onHciLeAdvertisingParametersSet(status) {
    }
    onHciLeAdvertisingDataSet(status) {
    }
    onHciLeScanResponseDataSet(status) {
    }
    onHciLeAdvertiseEnableSet(status) {
        if (this._advertiseState === "starting") {
            this._advertiseState = "started";
            let error = null;
            if (status) {
                error = new Error(Hci.STATUS_MAPPER[status] || "Unknown (" + status + ")");
            }
            this.emit("advertisingStart", error);
        }
        else if (this._advertiseState === "stopping") {
            this._advertiseState = "stopped";
            this.emit("advertisingStop");
        }
    }
}
exports.default = Gap;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9nYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBdUM7QUFDdkMsTUFBTSxLQUFLLEdBQVEsR0FBRyxFQUFFO0FBQ3hCLENBQUMsQ0FBQztBQUVGLE1BQU0sTUFBTSxHQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBUSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFbkMsTUFBTSxHQUFJLFNBQVEsTUFBTSxDQUFDLFlBQVk7SUFRbkMsWUFBWSxHQUFRO1FBQ2xCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFFaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDVixxQkFBcUIsRUFDckIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDekMsQ0FBQztRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDVixxQkFBcUIsRUFDckIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDekMsQ0FBQztRQUVGLElBQUksQ0FBQyxJQUFJLENBQUMs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LE1BQVc7SUFDNUMsQ0FBQztJQUVNLDBCQUEwQixDQUFDLE1BQVc7SUFDN0MsQ0FBQztJQUVNLHlCQUF5QixDQUFDLE1BQVc7UUFDMUMsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFVBQVUsRUFBRTtZQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztZQUVqQyxJQUFJLEtBQUssR0FBUSxJQUFJLENBQUM7WUFFdEIsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsS0FBSyxHQUFHLElBQUksS0FBSyxDQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQ3hELENBQUM7YUFDSDtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEM7YUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssVUFBVSxFQUFFO1lBQzlDLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1lBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLEdBQUcsQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL3Byb3RvY29sL2NlbnRyYWwvZ2FwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGV0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnZ2FwJyk7XG5jb25zdCBkZWJ1ZzogYW55ID0gKCkgPT4ge1xufTtcblxuY29uc3QgZXZlbnRzOiBhbnkgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuY29uc3QgSGNpOiBhbnkgPSByZXF1aXJlKFwiLi4vaGNpXCIpO1xuXG5jbGFzcyBHYXAgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgcHVibGljIF9oY2k6IGFueTtcbiAgcHVibGljIF9zY2FuU3RhdGU6IGFueTtcbiAgcHVibGljIF9zY2FuRmlsdGVyRHVwbGljYXRlczogYW55O1xuICBwdWJsaWMgX2Rpc2NvdmVyaWVzOiBhbnk7XG4gIHB1YmxpYyBlbWl0OiBhbnk7XG4gIHB1YmxpYyBfYWR2ZXJ0aXNlU3RhdGU6IGFueTtcblxuICBjb25zdHJ1Y3RvcihoY2k6IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faGNpID0gaGNpO1xuXG4gICAgdGhpcy5fc2NhblN0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyA9IG51bGw7XG4gICAgdGhpcy5fZGlzY292ZXJpZXMgPSB7fTtcblxuICAgIHRoaXMuX2hjaS5vbihcImVycm9yXCIsIHRoaXMub25IY2lFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oXG4gICAgICBcImxlU2NhblBhcmFtZXRlcnNTZXRcIixcbiAgICAgIHRoaXMub25IY2lMZVNjYW5QYXJhbWV0ZXJzU2V0LmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLl9oY2kub24oXCJsZVNjYW5FbmFibGVTZXRcIiwgdGhpcy5vbkhjaUxlU2NhbkVuYWJsZVNldC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oXG4gICAgICBcImxlQWR2ZXJ0aXNpbmdSZXBvcnRcIixcbiAgICAgIHRoaXMub25IY2lMZUFkdmVydGlzaW5nUmVwb3J0LmJpbmQodGhpcyksXG4gICAgKTtcblxuICAgIHRoaXMuX2hjaS5vbihcImxlU2NhbkVuYWJsZVNldENtZFwiLCB0aGlzLm9uTGVTY2FuRW5hYmxlU2V0Q21kLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5faGNpLm9uKFxuICAgICAgXCJsZUFkdmVydGlzaW5nUGFyYW1ldGVyc1NldFwiLFxuICAgICAgdGhpcy5vbkhjaUxlQWR2ZXJ0aXNpbmdQYXJhbWV0ZXJzU2V0LmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLl9oY2kub24oXG4gICAgICBcImxlQWR2ZXJ0aXNpbmdEYXRhU2V0XCIsXG4gICAgICB0aGlzLm9uSGNpTGVBZHZlcnRpc2luZ0RhdGFTZXQuYmluZCh0aGlzKSxcbiAgICApO1xuICAgIHRoaXMuX2hjaS5vbihcbiAgICAgIFwibGVTY2FuUmVzcG9uc2VEYXRhU2V0XCIsXG4gICAgICB0aGlzLm9uSGNpTGVTY2FuUmVzcG9uc2VEYXRhU2V0LmJpbmQodGhpcyksXG4gICAgKTtcbiAgICB0aGlzLl9oY2kub24oXG4gICAgICBcImxlQWR2ZXJ0aXNlRW5hYmxlU2V0XCIsXG4gICAgICB0aGlzLm9uSGNpTGVBZHZlcnRpc2VFbmFibGVTZXQuYmluZCh0aGlzKSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0U2Nhbm5pbmcoYWxsb3dEdXBsaWNhdGVzOiBhbnkpIHtcbiAgICB0aGlzLl9zY2FuU3RhdGUgPSBcInN0YXJ0aW5nXCI7XG4gICAgdGhpcy5fc2NhbkZpbHRlckR1cGxpY2F0ZXMgPSAhYWxsb3dEdXBsaWNhdGVzO1xuXG4gICAgLy8gQWx3YXlzIHNldCBzY2FuIHBhcmFtZXRlcnMgYmVmb3JlIHNjYW5uaW5nXG4gICAgLy8gaHR0cHM6Ly93d3cuYmx1ZXRvb3RoLm9yZy9kb2NtYW4vaGFuZGxlcnMvZG93bmxvYWRkb2MuYXNoeD9kb2NfaWQ9MjI5NzM3XG4gICAgLy8gcDEwNiAtIHAxMDdcbiAgICB0aGlzLl9oY2kuc2V0U2NhbkVuYWJsZWQoZmFsc2UsIHRydWUpO1xuICAgIHRoaXMuX2hjaS5zZXRTY2FuUGFyYW1ldGVycygpO1xuICAgIHRoaXMuX2hjaS5zZXRTY2FuRW5hYmxlZCh0cnVlLCB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyk7XG4gIH1cblxuICBwdWJsaWMgc3RvcFNjYW5uaW5nKCkge1xuICAgIHRoaXMuX3NjYW5TdGF0ZSA9IFwic3RvcHBpbmdcIjtcblxuICAgIHRoaXMuX2hjaS5zZXRTY2FuRW5hYmxlZChmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgb25IY2lMZVNjYW5QYXJhbWV0ZXJzU2V0KCkge1xuICB9XG5cbiAgLy8gQ2FsbGVkIHdoZW4gcmVjZWl2ZSBhbiBldmVudCBcIkNvbW1hbmQgQ29tcGxldGVcIiBmb3IgXCJMRSBTZXQgU2NhbiBFbmFibGVcIlxuICBwdWJsaWMgb25IY2lMZVNjYW5FbmFibGVTZXQoc3RhdHVzOiBhbnkpIHtcbiAgICAvLyBDaGVjayB0aGUgc3RhdHVzIHdlIGdvdCBmcm9tIHRoZSBjb21tYW5kIGNvbXBsZXRlIGZ1bmN0aW9uLlxuICAgIGlmIChzdGF0dXMgIT09IDApIHtcbiAgICAgIC8vIElmIGl0IGlzIG5vbi16ZXJvIHRoZXJlIHdhcyBhbiBlcnJvciwgYW5kIHdlIHNob3VsZCBub3QgY2hhbmdlXG4gICAgICAvLyBvdXIgc3RhdHVzIGFzIGEgcmVzdWx0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zY2FuU3RhdGUgPT09IFwic3RhcnRpbmdcIikge1xuICAgICAgdGhpcy5fc2NhblN0YXRlID0gXCJzdGFydGVkXCI7XG5cbiAgICAgIHRoaXMuZW1pdChcInNjYW5TdGFydFwiLCB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zY2FuU3RhdGUgPT09IFwic3RvcHBpbmdcIikge1xuICAgICAgdGhpcy5fc2NhblN0YXRlID0gXCJzdG9wcGVkXCI7XG5cbiAgICAgIHRoaXMuZW1pdChcInNjYW5TdG9wXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxlZCB3aGVuIHdlIHNlZSB0aGUgYWN0dWFsIGNvbW1hbmQgXCJMRSBTZXQgU2NhbiBFbmFibGVcIlxuICBwdWJsaWMgb25MZVNjYW5FbmFibGVTZXRDbWQoZW5hYmxlOiBhbnksIGZpbHRlckR1cGxpY2F0ZXM/OiBhbnkpIHtcbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIG5ldyBzZXR0aW5ncyBkaWZmZXIgZnJvbSB3aGF0IHdlIGV4cGVjdC5cbiAgICAvLyBJZiB3ZSBhcmUgc2Nhbm5pbmcsIHRoZW4gYSBjaGFuZ2UgaGFwcGVucyBpZiB0aGUgbmV3IGNvbW1hbmQgc3RvcHNcbiAgICAvLyBzY2FubmluZyBvciBpZiBkdXBsaWNhdGUgZmlsdGVyaW5nIGNoYW5nZXMuXG4gICAgLy8gSWYgd2UgYXJlIG5vdCBzY2FubmluZywgdGhlbiBhIGNoYW5nZSBoYXBwZW5zIGlmIHNjYW5uaW5nIHdhcyBlbmFibGVkLlxuICAgIGlmICh0aGlzLl9zY2FuU3RhdGUgPT09IFwic3RhcnRpbmdcIiB8fCB0aGlzLl9zY2FuU3RhdGUgPT09IFwic3RhcnRlZFwiKSB7XG4gICAgICBpZiAoIWVuYWJsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJzY2FuU3RvcFwiKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2NhbkZpbHRlckR1cGxpY2F0ZXMgIT09IGZpbHRlckR1cGxpY2F0ZXMpIHtcbiAgICAgICAgdGhpcy5fc2NhbkZpbHRlckR1cGxpY2F0ZXMgPSBmaWx0ZXJEdXBsaWNhdGVzO1xuXG4gICAgICAgIHRoaXMuZW1pdChcInNjYW5TdGFydFwiLCB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICh0aGlzLl9zY2FuU3RhdGUgPT09IFwic3RvcHBpbmdcIiB8fCB0aGlzLl9zY2FuU3RhdGUgPT09IFwic3RvcHBlZFwiKSAmJlxuICAgICAgZW5hYmxlXG4gICAgKSB7XG4gICAgICAvLyBTb21lb25lIHN0YXJ0ZWQgc2Nhbm5pbmcgb24gdXMuXG4gICAgICB0aGlzLmVtaXQoXCJzY2FuU3RhcnRcIiwgdGhpcy5fc2NhbkZpbHRlckR1cGxpY2F0ZXMpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkhjaUxlQWR2ZXJ0aXNpbmdSZXBvcnQoc3RhdHVzOiBhbnksIHR5cGU/OiBhbnksIGFkZHJlc3M/OiBhbnksIGFkZHJlc3NUeXBlPzogYW55LCBlaXI/OiBhbnksIHJzc2k/OiBhbnkpIHtcbiAgICBjb25zdCBwcmV2aW91c2x5RGlzY292ZXJlZDogYW55ID0gISF0aGlzLl9kaXNjb3Zlcmllc1thZGRyZXNzXTtcbiAgICBjb25zdCBhZHZlcnRpc2VtZW50OiBhbnkgPSBwcmV2aW91c2x5RGlzY292ZXJlZFxuICAgICAgPyB0aGlzLl9kaXNjb3Zlcmllc1thZGRyZXNzXS5hZHZlcnRpc2VtZW50XG4gICAgICA6IHtcbiAgICAgICAgbG9jYWxOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHR4UG93ZXJMZXZlbDogdW5kZWZpbmVkLFxuICAgICAgICBtYW51ZmFjdHVyZXJEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIHNlcnZpY2VEYXRhOiBbXSxcbiAgICAgICAgc2VydmljZVV1aWRzOiBbXSxcbiAgICAgICAgc29saWNpdGF0aW9uU2VydmljZVV1aWRzOiBbXSxcbiAgICAgICAgYWR2ZXJ0aXNlbWVudFJhdzogW10sXG4gICAgICAgIHNjYW5SZXNwb25zZVJhdzogW10sXG4gICAgICAgIHJhdzogW10sXG4gICAgICB9O1xuXG4gICAgbGV0IGRpc2NvdmVyeUNvdW50OiBhbnkgPSBwcmV2aW91c2x5RGlzY292ZXJlZFxuICAgICAgPyB0aGlzLl9kaXNjb3Zlcmllc1thZGRyZXNzXS5jb3VudFxuICAgICAgOiAwO1xuICAgIGxldCBoYXNTY2FuUmVzcG9uc2U6IGFueSA9IHByZXZpb3VzbHlEaXNjb3ZlcmVkXG4gICAgICA/IHRoaXMuX2Rpc2NvdmVyaWVzW2FkZHJlc3NdLmhhc1NjYW5SZXNwb25zZVxuICAgICAgOiBmYWxzZTtcblxuICAgIGlmICh0eXBlID09PSAweDA0KSB7XG4gICAgICBoYXNTY2FuUmVzcG9uc2UgPSB0cnVlO1xuXG4gICAgICBpZiAoZWlyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWR2ZXJ0aXNlbWVudC5zY2FuUmVzcG9uc2VSYXcgPSBBcnJheS5mcm9tKGVpcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlc2V0IHNlcnZpY2UgZGF0YSBldmVyeSBub24tc2NhbiByZXNwb25zZSBldmVudFxuICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlRGF0YSA9IFtdO1xuICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlVXVpZHMgPSBbXTtcbiAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzID0gW107XG5cbiAgICAgIGlmIChlaXIubGVuZ3RoID4gMCkge1xuICAgICAgICBhZHZlcnRpc2VtZW50LmFkdmVydGlzZW1lbnRSYXcgPSBBcnJheS5mcm9tKGVpcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzY292ZXJ5Q291bnQrKztcblxuICAgIGxldCBpOiBhbnkgPSAwO1xuICAgIGxldCBqOiBhbnkgPSAwO1xuICAgIGxldCBzZXJ2aWNlVXVpZDogYW55ID0gbnVsbDtcbiAgICBsZXQgc2VydmljZVNvbGljaXRhdGlvblV1aWQ6IGFueSA9IG51bGw7XG5cbiAgICB3aGlsZSAoaSArIDEgPCBlaXIubGVuZ3RoKSB7XG4gICAgICBjb25zdCBsZW5ndGg6IGFueSA9IGVpci5yZWFkVUludDgoaSk7XG5cbiAgICAgIGlmIChsZW5ndGggPCAxKSB7XG4gICAgICAgIGRlYnVnKFwiaW52YWxpZCBFSVIgZGF0YSwgbGVuZ3RoID0gXCIgKyBsZW5ndGgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgZWlyVHlwZTogYW55ID0gZWlyLnJlYWRVSW50OChpICsgMSk7IC8vIGh0dHBzOi8vd3d3LmJsdWV0b290aC5vcmcvZW4tdXMvc3BlY2lmaWNhdGlvbi9hc3NpZ25lZC1udW1iZXJzL2dlbmVyaWMtYWNjZXNzLXByb2ZpbGVcblxuICAgICAgaWYgKGkgKyBsZW5ndGggKyAxID4gZWlyLmxlbmd0aCkge1xuICAgICAgICBkZWJ1ZyhcImludmFsaWQgRUlSIGRhdGEsIG91dCBvZiByYW5nZSBvZiBidWZmZXIgbGVuZ3RoXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgYnl0ZXM6IGFueSA9IGVpci5zbGljZShpICsgMikuc2xpY2UoMCwgbGVuZ3RoIC0gMSk7XG5cbiAgICAgIHN3aXRjaCAoZWlyVHlwZSkge1xuICAgICAgICBjYXNlIDB4MDI6IC8vIEluY29tcGxldGUgTGlzdCBvZiAxNi1iaXQgU2VydmljZSBDbGFzcyBVVUlEXG4gICAgICAgIGNhc2UgMHgwMzogLy8gQ29tcGxldGUgTGlzdCBvZiAxNi1iaXQgU2VydmljZSBDbGFzcyBVVUlEc1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBieXRlcy5sZW5ndGg7IGogKz0gMikge1xuICAgICAgICAgICAgc2VydmljZVV1aWQgPSBieXRlcy5yZWFkVUludDE2TEUoaikudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgaWYgKGFkdmVydGlzZW1lbnQuc2VydmljZVV1aWRzLmluZGV4T2Yoc2VydmljZVV1aWQpID09PSAtMSkge1xuICAgICAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VVdWlkcy5wdXNoKHNlcnZpY2VVdWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweDA2OiAvLyBJbmNvbXBsZXRlIExpc3Qgb2YgMTI4LWJpdCBTZXJ2aWNlIENsYXNzIFVVSURzXG4gICAgICAgIGNhc2UgMHgwNzogLy8gQ29tcGxldGUgTGlzdCBvZiAxMjgtYml0IFNlcnZpY2UgQ2xhc3MgVVVJRHNcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYnl0ZXMubGVuZ3RoOyBqICs9IDE2KSB7XG4gICAgICAgICAgICBzZXJ2aWNlVXVpZCA9IGJ5dGVzXG4gICAgICAgICAgICAgIC5zbGljZShqLCBqICsgMTYpXG4gICAgICAgICAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgICAgICAgaWYgKGFkdmVydGlzZW1lbnQuc2VydmljZVV1aWRzLmluZGV4T2Yoc2VydmljZVV1aWQpID09PSAtMSkge1xuICAgICAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VVdWlkcy5wdXNoKHNlcnZpY2VVdWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweDA4OiAvLyBTaG9ydGVuZWQgTG9jYWwgTmFtZVxuICAgICAgICBjYXNlIDB4MDk6IC8vIENvbXBsZXRlIExvY2FsIE5hbWVcbiAgICAgICAgICBhZHZlcnRpc2VtZW50LmxvY2FsTmFtZSA9IGJ5dGVzLnRvU3RyaW5nKFwidXRmOFwiKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4MGE6IHtcbiAgICAgICAgICAvLyBUeCBQb3dlciBMZXZlbFxuICAgICAgICAgIGFkdmVydGlzZW1lbnQudHhQb3dlckxldmVsID0gYnl0ZXMucmVhZEludDgoMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAweDE0OiB7XG4gICAgICAgICAgLy8gTGlzdCBvZiAxNiBiaXQgc29saWNpdGF0aW9uIFVVSURzXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGJ5dGVzLmxlbmd0aDsgaiArPSAyKSB7XG4gICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCA9IGJ5dGVzLnJlYWRVSW50MTZMRShqKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgc2VydmljZVNvbGljaXRhdGlvblV1aWQsXG4gICAgICAgICAgICAgICkgPT09IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlU29saWNpdGF0aW9uVXVpZHMucHVzaChcbiAgICAgICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAweDE1OiB7XG4gICAgICAgICAgLy8gTGlzdCBvZiAxMjggYml0IHNvbGljaXRhdGlvbiBVVUlEc1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBieXRlcy5sZW5ndGg7IGogKz0gMTYpIHtcbiAgICAgICAgICAgIHNlcnZpY2VTb2xpY2l0YXRpb25VdWlkID0gYnl0ZXNcbiAgICAgICAgICAgICAgLnNsaWNlKGosIGogKyAxNilcbiAgICAgICAgICAgICAgLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgICAgLmpvaW4oXCJcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgc2VydmljZVNvbGljaXRhdGlvblV1aWQsXG4gICAgICAgICAgICAgICkgPT09IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlU29saWNpdGF0aW9uVXVpZHMucHVzaChcbiAgICAgICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAweDE2OiB7XG4gICAgICAgICAgLy8gMTYtYml0IFNlcnZpY2UgRGF0YSwgdGhlcmUgY2FuIGJlIG11bHRpcGxlIG9jY3VyZW5jZXNcbiAgICAgICAgICBjb25zdCBzZXJ2aWNlRGF0YVV1aWQ6IGFueSA9IGJ5dGVzXG4gICAgICAgICAgICAuc2xpY2UoMCwgMilcbiAgICAgICAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgICAgIGNvbnN0IHNlcnZpY2VEYXRhOiBhbnkgPSBieXRlcy5zbGljZSgyLCBieXRlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlRGF0YS5wdXNoKHtcbiAgICAgICAgICAgIHV1aWQ6IHNlcnZpY2VEYXRhVXVpZCxcbiAgICAgICAgICAgIGRhdGE6IHNlcnZpY2VEYXRhLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMHgyMDoge1xuICAgICAgICAgIC8vIDMyLWJpdCBTZXJ2aWNlIERhdGEsIHRoZXJlIGNhbiBiZSBtdWx0aXBsZSBvY2N1cmVuY2VzXG4gICAgICAgICAgY29uc3Qgc2VydmljZURhdGEzMlV1aWQ6IGFueSA9IGJ5dGVzXG4gICAgICAgICAgICAuc2xpY2UoMCwgNClcbiAgICAgICAgICAgIC50b1N0cmluZyhcImhleFwiKVxuICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgICAgIGNvbnN0IHNlcnZpY2VEYXRhMzI6IGFueSA9IGJ5dGVzLnNsaWNlKDQsIGJ5dGVzLmxlbmd0aCk7XG5cbiAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VEYXRhLnB1c2goe1xuICAgICAgICAgICAgdXVpZDogc2VydmljZURhdGEzMlV1aWQsXG4gICAgICAgICAgICBkYXRhOiBzZXJ2aWNlRGF0YTMyLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMHgyMToge1xuICAgICAgICAgIC8vIDEyOC1iaXQgU2VydmljZSBEYXRhLCB0aGVyZSBjYW4gYmUgbXVsdGlwbGUgb2NjdXJlbmNlc1xuXG4gICAgICAgICAgY29uc3Qgc2VydmljZURhdGExMjhVdWlkOiBhbnkgPSBieXRlc1xuICAgICAgICAgICAgLnNsaWNlKDAsIDE2KVxuICAgICAgICAgICAgLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLmpvaW4oXCJcIik7XG4gICAgICAgICAgY29uc3Qgc2VydmljZURhdGExMjg6IGFueSA9IGJ5dGVzLnNsaWNlKDE2LCBieXRlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlRGF0YS5wdXNoKHtcbiAgICAgICAgICAgIHV1aWQ6IHNlcnZpY2VEYXRhMTI4VXVpZCxcbiAgICAgICAgICAgIGRhdGE6IHNlcnZpY2VEYXRhMTI4LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMHgxZjogLy8gTGlzdCBvZiAzMiBiaXQgc29saWNpdGF0aW9uIFVVSURzXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGJ5dGVzLmxlbmd0aDsgaiArPSA0KSB7XG4gICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCA9IGJ5dGVzLnJlYWRVSW50MzJMRShqKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgc2VydmljZVNvbGljaXRhdGlvblV1aWQsXG4gICAgICAgICAgICAgICkgPT09IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlU29saWNpdGF0aW9uVXVpZHMucHVzaChcbiAgICAgICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweGZmOiAvLyBNYW51ZmFjdHVyZXIgU3BlY2lmaWMgRGF0YVxuICAgICAgICAgIGFkdmVydGlzZW1lbnQubWFudWZhY3R1cmVyRGF0YSA9IGJ5dGVzO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpICs9IGxlbmd0aCArIDE7XG4gICAgfVxuXG4gICAgZGVidWcoXCJhZHZlcnRpc2VtZW50ID0gXCIgKyBKU09OLnN0cmluZ2lmeShhZHZlcnRpc2VtZW50LCBudWxsLCAwKSk7XG5cbiAgICBjb25zdCBjb25uZWN0YWJsZTogYW55ID1cbiAgICAgIHR5cGUgPT09IDB4MDQgJiYgcHJldmlvdXNseURpc2NvdmVyZWRcbiAgICAgICAgPyB0aGlzLl9kaXNjb3Zlcmllc1thZGRyZXNzXS5jb25uZWN0YWJsZVxuICAgICAgICA6IHR5cGUgIT09IDB4MDM7XG5cbiAgICB0aGlzLl9kaXNjb3Zlcmllc1thZGRyZXNzXSA9IHtcbiAgICAgIGFkZHJlc3MsXG4gICAgICBhZGRyZXNzVHlwZSxcbiAgICAgIGNvbm5lY3RhYmxlLFxuICAgICAgYWR2ZXJ0aXNlbWVudCxcbiAgICAgIHJzc2ksXG4gICAgICBjb3VudDogZGlzY292ZXJ5Q291bnQsXG4gICAgICBoYXNTY2FuUmVzcG9uc2UsXG4gICAgfTtcblxuICAgIC8vIG9ubHkgcmVwb3J0IGFmdGVyIGEgc2NhbiByZXNwb25zZSBldmVudCBvciBpZiBub24tY29ubmVjdGFibGUgb3IgbW9yZSB0aGFuIG9uZSBkaXNjb3Zlcnkgd2l0aG91dCBhIHNjYW4gcmVzcG9uc2UsIHNvIG1vcmUgZGF0YSBjYW4gYmUgY29sbGVjdGVkXG4gICAgaWYgKFxuICAgICAgdHlwZSA9PT0gMHgwNCB8fFxuICAgICAgIWNvbm5lY3RhYmxlIHx8XG4gICAgICAoZGlzY292ZXJ5Q291bnQgPiAxICYmICFoYXNTY2FuUmVzcG9uc2UpIHx8XG4gICAgICBwcm9jZXNzLmVudi5OT0JMRV9SRVBPUlRfQUxMX0hDSV9FVkVOVFNcbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgXCJkaXNjb3ZlclwiLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFkZHJlc3NUeXBlLFxuICAgICAgICBjb25uZWN0YWJsZSxcbiAgICAgICAgYWR2ZXJ0aXNlbWVudCxcbiAgICAgICAgcnNzaSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXJ0QWR2ZXJ0aXNpbmcobmFtZTogYW55LCBzZXJ2aWNlVXVpZHM6IGFueSkge1xuICAgIGRlYnVnKFxuICAgICAgXCJzdGFydEFkdmVydGlzaW5nOiBuYW1lID0gXCIgK1xuICAgICAgbmFtZSArXG4gICAgICBcIiwgc2VydmljZVV1aWRzID0gXCIgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkoc2VydmljZVV1aWRzLCBudWxsLCAyKSxcbiAgICApO1xuXG4gICAgbGV0IGFkdmVydGlzZW1lbnREYXRhTGVuZ3RoOiBhbnkgPSAzO1xuICAgIGxldCBzY2FuRGF0YUxlbmd0aDogYW55ID0gMDtcblxuICAgIGNvbnN0IHNlcnZpY2VVdWlkczE2Yml0OiBhbnkgPSBbXTtcbiAgICBjb25zdCBzZXJ2aWNlVXVpZHMxMjhiaXQ6IGFueSA9IFtdO1xuICAgIGxldCBpOiBhbnkgPSAwO1xuXG4gICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGgpIHtcbiAgICAgIHNjYW5EYXRhTGVuZ3RoICs9IDIgKyBuYW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc2VydmljZVV1aWRzICYmIHNlcnZpY2VVdWlkcy5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJ2aWNlVXVpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2VydmljZVV1aWQ6IGFueSA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIHNlcnZpY2VVdWlkc1tpXVxuICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgIFwiaGV4XCIsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHNlcnZpY2VVdWlkLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIHNlcnZpY2VVdWlkczE2Yml0LnB1c2goc2VydmljZVV1aWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlcnZpY2VVdWlkLmxlbmd0aCA9PT0gMTYpIHtcbiAgICAgICAgICBzZXJ2aWNlVXVpZHMxMjhiaXQucHVzaChzZXJ2aWNlVXVpZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VydmljZVV1aWRzMTZiaXQubGVuZ3RoKSB7XG4gICAgICBhZHZlcnRpc2VtZW50RGF0YUxlbmd0aCArPSAyICsgMiAqIHNlcnZpY2VVdWlkczE2Yml0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc2VydmljZVV1aWRzMTI4Yml0Lmxlbmd0aCkge1xuICAgICAgYWR2ZXJ0aXNlbWVudERhdGFMZW5ndGggKz0gMiArIDE2ICogc2VydmljZVV1aWRzMTI4Yml0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBjb25zdCBhZHZlcnRpc2VtZW50RGF0YTogYW55ID0gQnVmZmVyLmFsbG9jKGFkdmVydGlzZW1lbnREYXRhTGVuZ3RoKTtcbiAgICBjb25zdCBzY2FuRGF0YTogYW55ID0gQnVmZmVyLmFsbG9jKHNjYW5EYXRhTGVuZ3RoKTtcblxuICAgIC8vIGZsYWdzXG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OCgyLCAwKTtcbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KDB4MDEsIDEpO1xuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHgwNiwgMik7XG5cbiAgICBsZXQgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQ6IGFueSA9IDM7XG5cbiAgICBpZiAoc2VydmljZVV1aWRzMTZiaXQubGVuZ3RoKSB7XG4gICAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KFxuICAgICAgICAxICsgMiAqIHNlcnZpY2VVdWlkczE2Yml0Lmxlbmd0aCxcbiAgICAgICAgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQsXG4gICAgICApO1xuICAgICAgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQrKztcblxuICAgICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OCgweDAzLCBhZHZlcnRpc2VtZW50RGF0YU9mZnNldCk7XG4gICAgICBhZHZlcnRpc2VtZW50RGF0YU9mZnNldCsrO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgc2VydmljZVV1aWRzMTZiaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2VydmljZVV1aWRzMTZiaXRbaV0uY29weShhZHZlcnRpc2VtZW50RGF0YSwgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQpO1xuICAgICAgICBhZHZlcnRpc2VtZW50RGF0YU9mZnNldCArPSBzZXJ2aWNlVXVpZHMxNmJpdFtpXS5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlcnZpY2VVdWlkczEyOGJpdC5sZW5ndGgpIHtcbiAgICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoXG4gICAgICAgIDEgKyAxNiAqIHNlcnZpY2VVdWlkczEyOGJpdC5sZW5ndGgsXG4gICAgICAgIGFkdmVydGlzZW1lbnREYXRhT2Zmc2V0LFxuICAgICAgKTtcbiAgICAgIGFkdmVydGlzZW1lbnREYXRhT2Zmc2V0Kys7XG5cbiAgICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHgwNiwgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQpO1xuICAgICAgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQrKztcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHNlcnZpY2VVdWlkczEyOGJpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBzZXJ2aWNlVXVpZHMxMjhiaXRbaV0uY29weShhZHZlcnRpc2VtZW50RGF0YSwgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQpO1xuICAgICAgICBhZHZlcnRpc2VtZW50RGF0YU9mZnNldCArPSBzZXJ2aWNlVXVpZHMxMjhiaXRbaV0ubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5hbWVcbiAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCkge1xuICAgICAgY29uc3QgbmFtZUJ1ZmZlcjogYW55ID0gQnVmZmVyLmZyb20obmFtZSk7XG5cbiAgICAgIHNjYW5EYXRhLndyaXRlVUludDgoMSArIG5hbWVCdWZmZXIubGVuZ3RoLCAwKTtcbiAgICAgIHNjYW5EYXRhLndyaXRlVUludDgoMHgwOCwgMSk7XG4gICAgICBuYW1lQnVmZmVyLmNvcHkoc2NhbkRhdGEsIDIpO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnRBZHZlcnRpc2luZ1dpdGhFSVJEYXRhKGFkdmVydGlzZW1lbnREYXRhLCBzY2FuRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnRBZHZlcnRpc2luZ0lCZWFjb24oZGF0YTogYW55KSB7XG4gICAgZGVidWcoXCJzdGFydEFkdmVydGlzaW5nSUJlYWNvbjogZGF0YSA9IFwiICsgZGF0YS50b1N0cmluZyhcImhleFwiKSk7XG5cbiAgICBjb25zdCBkYXRhTGVuZ3RoOiBhbnkgPSBkYXRhLmxlbmd0aDtcbiAgICBjb25zdCBtYW51ZmFjdHVyZXJEYXRhTGVuZ3RoOiBhbnkgPSA0ICsgZGF0YUxlbmd0aDtcbiAgICBjb25zdCBhZHZlcnRpc2VtZW50RGF0YUxlbmd0aDogYW55ID0gNSArIG1hbnVmYWN0dXJlckRhdGFMZW5ndGg7XG5cbiAgICBjb25zdCBhZHZlcnRpc2VtZW50RGF0YTogYW55ID0gQnVmZmVyLmFsbG9jKGFkdmVydGlzZW1lbnREYXRhTGVuZ3RoKTtcbiAgICBjb25zdCBzY2FuRGF0YTogYW55ID0gQnVmZmVyLmFsbG9jKDApO1xuXG4gICAgLy8gZmxhZ3NcbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KDIsIDApO1xuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHgwMSwgMSk7XG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OCgweDA2LCAyKTtcblxuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgobWFudWZhY3R1cmVyRGF0YUxlbmd0aCArIDEsIDMpO1xuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHhmZiwgNCk7XG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50MTZMRSgweDAwNGMsIDUpOyAvLyBBcHBsZSBDb21wYW55IElkZW50aWZpZXIgTEUgKDE2IGJpdClcbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KDB4MDIsIDcpOyAvLyB0eXBlLCAyID0+IGlCZWFjb25cbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KGRhdGFMZW5ndGgsIDgpO1xuXG4gICAgZGF0YS5jb3B5KGFkdmVydGlzZW1lbnREYXRhLCA5KTtcblxuICAgIHRoaXMuc3RhcnRBZHZlcnRpc2luZ1dpdGhFSVJEYXRhKGFkdmVydGlzZW1lbnREYXRhLCBzY2FuRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnRBZHZlcnRpc2luZ1dpdGhFSVJEYXRhKGFkdmVydGlzZW1lbnREYXRhOiBhbnksIHNjYW5EYXRhOiBhbnkpIHtcbiAgICBhZHZlcnRpc2VtZW50RGF0YSA9IGFkdmVydGlzZW1lbnREYXRhIHx8IEJ1ZmZlci5hbGxvYygwKTtcbiAgICBzY2FuRGF0YSA9IHNjYW5EYXRhIHx8IEJ1ZmZlci5hbGxvYygwKTtcblxuICAgIGRlYnVnKFxuICAgICAgXCJzdGFydEFkdmVydGlzaW5nV2l0aEVJUkRhdGE6IGFkdmVydGlzZW1lbnQgZGF0YSA9IFwiICtcbiAgICAgIGFkdmVydGlzZW1lbnREYXRhLnRvU3RyaW5nKFwiaGV4XCIpICtcbiAgICAgIFwiLCBzY2FuIGRhdGEgPSBcIiArXG4gICAgICBzY2FuRGF0YS50b1N0cmluZyhcImhleFwiKSxcbiAgICApO1xuXG4gICAgbGV0IGVycm9yOiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKGFkdmVydGlzZW1lbnREYXRhLmxlbmd0aCA+IDMxKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcIkFkdmVydGlzZW1lbnQgZGF0YSBpcyBvdmVyIG1heGltdW0gbGltaXQgb2YgMzEgYnl0ZXNcIik7XG4gICAgfSBlbHNlIGlmIChzY2FuRGF0YS5sZW5ndGggPiAzMSkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXCJTY2FuIGRhdGEgaXMgb3ZlciBtYXhpbXVtIGxpbWl0IG9mIDMxIGJ5dGVzXCIpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5lbWl0KFwiYWR2ZXJ0aXNpbmdTdGFydFwiLCBlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkdmVydGlzZVN0YXRlID0gXCJzdGFydGluZ1wiO1xuXG4gICAgICB0aGlzLl9oY2kuc2V0U2NhblJlc3BvbnNlRGF0YShzY2FuRGF0YSk7XG4gICAgICB0aGlzLl9oY2kuc2V0QWR2ZXJ0aXNpbmdEYXRhKGFkdmVydGlzZW1lbnREYXRhKTtcblxuICAgICAgdGhpcy5faGNpLnNldEFkdmVydGlzZUVuYWJsZSh0cnVlKTtcbiAgICAgIHRoaXMuX2hjaS5zZXRTY2FuUmVzcG9uc2VEYXRhKHNjYW5EYXRhKTtcbiAgICAgIHRoaXMuX2hjaS5zZXRBZHZlcnRpc2luZ0RhdGEoYWR2ZXJ0aXNlbWVudERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZXN0YXJ0QWR2ZXJ0aXNpbmcoKSB7XG4gICAgdGhpcy5fYWR2ZXJ0aXNlU3RhdGUgPSBcInJlc3RhcnRpbmdcIjtcblxuICAgIHRoaXMuX2hjaS5zZXRBZHZlcnRpc2VFbmFibGUodHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgc3RvcEFkdmVydGlzaW5nKCkge1xuICAgIHRoaXMuX2FkdmVydGlzZVN0YXRlID0gXCJzdG9wcGluZ1wiO1xuXG4gICAgdGhpcy5faGNpLnNldEFkdmVydGlzZUVuYWJsZShmYWxzZSk7XG4gIH1cblxuICBwdWJsaWMgb25IY2lFcnJvcihlcnJvcjogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgb25IY2lMZUFkdmVydGlzaW5nUGFyYW1ldGVyc1NldChzdGF0dXM6IGFueSkge1xuICB9XG5cbiAgcHVibGljIG9uSGNpTGVBZHZlcnRpc2luZ0RhdGFTZXQoc3RhdHVzOiBhbnkpIHtcbiAgfVxuXG4gIHB1YmxpYyBvbkhjaUxlU2NhblJlc3BvbnNlRGF0YVNldChzdGF0dXM6IGFueSkge1xuICB9XG5cbiAgcHVibGljIG9uSGNpTGVBZHZlcnRpc2VFbmFibGVTZXQoc3RhdHVzOiBhbnkpIHtcbiAgICBpZiAodGhpcy5fYWR2ZXJ0aXNlU3RhdGUgPT09IFwic3RhcnRpbmdcIikge1xuICAgICAgdGhpcy5fYWR2ZXJ0aXNlU3RhdGUgPSBcInN0YXJ0ZWRcIjtcblxuICAgICAgbGV0IGVycm9yOiBhbnkgPSBudWxsO1xuXG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAgIEhjaS5TVEFUVVNfTUFQUEVSW3N0YXR1c10gfHwgXCJVbmtub3duIChcIiArIHN0YXR1cyArIFwiKVwiLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXQoXCJhZHZlcnRpc2luZ1N0YXJ0XCIsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2FkdmVydGlzZVN0YXRlID09PSBcInN0b3BwaW5nXCIpIHtcbiAgICAgIHRoaXMuX2FkdmVydGlzZVN0YXRlID0gXCJzdG9wcGVkXCI7XG5cbiAgICAgIHRoaXMuZW1pdChcImFkdmVydGlzaW5nU3RvcFwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FwO1xuIl19
