"use strict";
// let debug = require('debug')('gap');
const debug = () => { };
let events = require('events');
let Hci = require('../hci');
class Gap extends events.EventEmitter {
    constructor(hci) {
        super();
        this._hci = hci;
        this._scanState = null;
        this._scanFilterDuplicates = null;
        this._discoveries = {};
        this._hci.on('error', this.onHciError.bind(this));
        this._hci.on('leScanParametersSet', this.onHciLeScanParametersSet.bind(this));
        this._hci.on('leScanEnableSet', this.onHciLeScanEnableSet.bind(this));
        this._hci.on('leAdvertisingReport', this.onHciLeAdvertisingReport.bind(this));
        this._hci.on('leScanEnableSetCmd', this.onLeScanEnableSetCmd.bind(this));
        this._hci.on('leAdvertisingParametersSet', this.onHciLeAdvertisingParametersSet.bind(this));
        this._hci.on('leAdvertisingDataSet', this.onHciLeAdvertisingDataSet.bind(this));
        this._hci.on('leScanResponseDataSet', this.onHciLeScanResponseDataSet.bind(this));
        this._hci.on('leAdvertiseEnableSet', this.onHciLeAdvertiseEnableSet.bind(this));
    }
    startScanning(allowDuplicates) {
        this._scanState = 'starting';
        this._scanFilterDuplicates = !allowDuplicates;
        // Always set scan parameters before scanning
        // https://www.bluetooth.org/docman/handlers/downloaddoc.ashx?doc_id=229737
        // p106 - p107
        this._hci.setScanEnabled(false, true);
        this._hci.setScanParameters();
        this._hci.setScanEnabled(true, this._scanFilterDuplicates);
    }
    stopScanning() {
        this._scanState = 'stopping';
        this._hci.setScanEnabled(false, true);
    }
    onHciLeScanParametersSet() { }
    // Called when receive an event "Command Complete" for "LE Set Scan Enable"
    onHciLeScanEnableSet(status) {
        // Check the status we got from the command complete function.
        if (status !== 0) {
            // If it is non-zero there was an error, and we should not change
            // our status as a result.
            return;
        }
        if (this._scanState === 'starting') {
            this._scanState = 'started';
            this.emit('scanStart', this._scanFilterDuplicates);
        }
        else if (this._scanState === 'stopping') {
            this._scanState = 'stopped';
            this.emit('scanStop');
        }
    }
    // Called when we see the actual command "LE Set Scan Enable"
    onLeScanEnableSetCmd(enable, filterDuplicates) {
        // Check to see if the new settings differ from what we expect.
        // If we are scanning, then a change happens if the new command stops
        // scanning or if duplicate filtering changes.
        // If we are not scanning, then a change happens if scanning was enabled.
        if (this._scanState == 'starting' || this._scanState == 'started') {
            if (!enable) {
                this.emit('scanStop');
            }
            else if (this._scanFilterDuplicates !== filterDuplicates) {
                this._scanFilterDuplicates = filterDuplicates;
                this.emit('scanStart', this._scanFilterDuplicates);
            }
        }
        else if ((this._scanState == 'stopping' || this._scanState == 'stopped') &&
            enable) {
            // Someone started scanning on us.
            this.emit('scanStart', this._scanFilterDuplicates);
        }
    }
    onHciLeAdvertisingReport(status, type, address, addressType, eir, rssi) {
        let previouslyDiscovered = !!this._discoveries[address];
        let advertisement = previouslyDiscovered
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
            let length = eir.readUInt8(i);
            if (length < 1) {
                debug('invalid EIR data, length = ' + length);
                break;
            }
            let eirType = eir.readUInt8(i + 1); // https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
            if (i + length + 1 > eir.length) {
                debug('invalid EIR data, out of range of buffer length');
                break;
            }
            let bytes = eir.slice(i + 2).slice(0, length - 1);
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
                            .toString('hex')
                            .match(/.{1,2}/g)
                            .reverse()
                            .join('');
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
                        serviceSolicitationUuid = bytes
                            .slice(j, j + 16)
                            .toString('hex')
                            .match(/.{1,2}/g)
                            .reverse()
                            .join('');
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                }
                case 0x16: {
                    // 16-bit Service Data, there can be multiple occurences
                    let serviceDataUuid = bytes
                        .slice(0, 2)
                        .toString('hex')
                        .match(/.{1,2}/g)
                        .reverse()
                        .join('');
                    let serviceData = bytes.slice(2, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceDataUuid,
                        data: serviceData,
                    });
                    break;
                }
                case 0x20: {
                    // 32-bit Service Data, there can be multiple occurences
                    let serviceData32Uuid = bytes
                        .slice(0, 4)
                        .toString('hex')
                        .match(/.{1,2}/g)
                        .reverse()
                        .join('');
                    let serviceData32 = bytes.slice(4, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceData32Uuid,
                        data: serviceData32,
                    });
                    break;
                }
                case 0x21: {
                    // 128-bit Service Data, there can be multiple occurences
                    let serviceData128Uuid = bytes
                        .slice(0, 16)
                        .toString('hex')
                        .match(/.{1,2}/g)
                        .reverse()
                        .join('');
                    let serviceData128 = bytes.slice(16, bytes.length);
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
        let connectable = type === 0x04 && previouslyDiscovered
            ? this._discoveries[address].connectable
            : type !== 0x03;
        this._discoveries[address] = {
            address: address,
            addressType: addressType,
            connectable: connectable,
            advertisement: advertisement,
            rssi: rssi,
            count: discoveryCount,
            hasScanResponse: hasScanResponse,
        };
        // only report after a scan response event or if non-connectable or more than one discovery without a scan response, so more data can be collected
        if (type === 0x04 ||
            !connectable ||
            (discoveryCount > 1 && !hasScanResponse) ||
            process.env.NOBLE_REPORT_ALL_HCI_EVENTS) {
            this.emit('discover', status, address, addressType, connectable, advertisement, rssi);
        }
    }
    startAdvertising(name, serviceUuids) {
        debug('startAdvertising: name = ' +
            name +
            ', serviceUuids = ' +
            JSON.stringify(serviceUuids, null, 2));
        let advertisementDataLength = 3;
        let scanDataLength = 0;
        let serviceUuids16bit = [];
        let serviceUuids128bit = [];
        let i = 0;
        if (name && name.length) {
            scanDataLength += 2 + name.length;
        }
        if (serviceUuids && serviceUuids.length) {
            for (i = 0; i < serviceUuids.length; i++) {
                let serviceUuid = Buffer.from(serviceUuids[i]
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(''), 'hex');
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
        let advertisementData = Buffer.alloc(advertisementDataLength);
        let scanData = Buffer.alloc(scanDataLength);
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
            let nameBuffer = Buffer.from(name);
            scanData.writeUInt8(1 + nameBuffer.length, 0);
            scanData.writeUInt8(0x08, 1);
            nameBuffer.copy(scanData, 2);
        }
        this.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    startAdvertisingIBeacon(data) {
        debug('startAdvertisingIBeacon: data = ' + data.toString('hex'));
        let dataLength = data.length;
        let manufacturerDataLength = 4 + dataLength;
        let advertisementDataLength = 5 + manufacturerDataLength;
        let advertisementData = Buffer.alloc(advertisementDataLength);
        let scanData = Buffer.alloc(0);
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
        debug('startAdvertisingWithEIRData: advertisement data = ' +
            advertisementData.toString('hex') +
            ', scan data = ' +
            scanData.toString('hex'));
        let error = null;
        if (advertisementData.length > 31) {
            error = new Error('Advertisement data is over maximum limit of 31 bytes');
        }
        else if (scanData.length > 31) {
            error = new Error('Scan data is over maximum limit of 31 bytes');
        }
        if (error) {
            this.emit('advertisingStart', error);
        }
        else {
            this._advertiseState = 'starting';
            this._hci.setScanResponseData(scanData);
            this._hci.setAdvertisingData(advertisementData);
            this._hci.setAdvertiseEnable(true);
            this._hci.setScanResponseData(scanData);
            this._hci.setAdvertisingData(advertisementData);
        }
    }
    restartAdvertising() {
        this._advertiseState = 'restarting';
        this._hci.setAdvertiseEnable(true);
    }
    stopAdvertising() {
        this._advertiseState = 'stopping';
        this._hci.setAdvertiseEnable(false);
    }
    onHciError(error) { }
    onHciLeAdvertisingParametersSet(status) { }
    onHciLeAdvertisingDataSet(status) { }
    onHciLeScanResponseDataSet(status) { }
    onHciLeAdvertiseEnableSet(status) {
        if (this._advertiseState === 'starting') {
            this._advertiseState = 'started';
            let error = null;
            if (status) {
                error = new Error(Hci.STATUS_MAPPER[status] || 'Unknown (' + status + ')');
            }
            this.emit('advertisingStart', error);
        }
        else if (this._advertiseState === 'stopping') {
            this._advertiseState = 'stopped';
            this.emit('advertisingStop');
        }
    }
}
module.exports = Gap;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9nYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxNQUFNLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7QUFFdkIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUU1QixNQUFNLEdBQUksU0FBUSxNQUFNLENBQUMsWUFBWTtJQUNuQyxZQUFZLEdBQUc7UUFDYixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBRWhCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ1YscUJBQXFCLEVBQ3JCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3pDLENBQUM7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ1YscUJBQXFCLEVBQ3JCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3pDLENBQUM7UUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLEVB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RyxDQUFDO0lBRXBCLCtCQUErQixDQUFDLE1BQU0sSUFBRyxDQUFDO0lBRTFDLHlCQUF5QixDQUFDLE1BQU0sSUFBRyxDQUFDO0lBRXBDLDBCQUEwQixDQUFDLE1BQU0sSUFBRyxDQUFDO0lBRXJDLHlCQUF5QixDQUFDLE1BQU07UUFDOUIsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFVBQVUsRUFBRTtZQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztZQUVqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFFakIsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsS0FBSyxHQUFHLElBQUksS0FBSyxDQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQ3hELENBQUM7YUFDSDtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEM7YUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssVUFBVSxFQUFFO1lBQzlDLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1lBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9wcm90b2NvbC9jZW50cmFsL2dhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxldCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2dhcCcpO1xuY29uc3QgZGVidWcgPSAoKSA9PiB7fTtcblxubGV0IGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xubGV0IEhjaSA9IHJlcXVpcmUoJy4uL2hjaScpO1xuXG5jbGFzcyBHYXAgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoaGNpKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9oY2kgPSBoY2k7XG5cbiAgICB0aGlzLl9zY2FuU3RhdGUgPSBudWxsO1xuICAgIHRoaXMuX3NjYW5GaWx0ZXJEdXBsaWNhdGVzID0gbnVsbDtcbiAgICB0aGlzLl9kaXNjb3ZlcmllcyA9IHt9O1xuXG4gICAgdGhpcy5faGNpLm9uKCdlcnJvcicsIHRoaXMub25IY2lFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oXG4gICAgICAnbGVTY2FuUGFyYW1ldGVyc1NldCcsXG4gICAgICB0aGlzLm9uSGNpTGVTY2FuUGFyYW1ldGVyc1NldC5iaW5kKHRoaXMpXG4gICAgKTtcbiAgICB0aGlzLl9oY2kub24oJ2xlU2NhbkVuYWJsZVNldCcsIHRoaXMub25IY2lMZVNjYW5FbmFibGVTZXQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKFxuICAgICAgJ2xlQWR2ZXJ0aXNpbmdSZXBvcnQnLFxuICAgICAgdGhpcy5vbkhjaUxlQWR2ZXJ0aXNpbmdSZXBvcnQuYmluZCh0aGlzKVxuICAgICk7XG5cbiAgICB0aGlzLl9oY2kub24oJ2xlU2NhbkVuYWJsZVNldENtZCcsIHRoaXMub25MZVNjYW5FbmFibGVTZXRDbWQuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLl9oY2kub24oXG4gICAgICAnbGVBZHZlcnRpc2luZ1BhcmFtZXRlcnNTZXQnLFxuICAgICAgdGhpcy5vbkhjaUxlQWR2ZXJ0aXNpbmdQYXJhbWV0ZXJzU2V0LmJpbmQodGhpcylcbiAgICApO1xuICAgIHRoaXMuX2hjaS5vbihcbiAgICAgICdsZUFkdmVydGlzaW5nRGF0YVNldCcsXG4gICAgICB0aGlzLm9uSGNpTGVBZHZlcnRpc2luZ0RhdGFTZXQuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5faGNpLm9uKFxuICAgICAgJ2xlU2NhblJlc3BvbnNlRGF0YVNldCcsXG4gICAgICB0aGlzLm9uSGNpTGVTY2FuUmVzcG9uc2VEYXRhU2V0LmJpbmQodGhpcylcbiAgICApO1xuICAgIHRoaXMuX2hjaS5vbihcbiAgICAgICdsZUFkdmVydGlzZUVuYWJsZVNldCcsXG4gICAgICB0aGlzLm9uSGNpTGVBZHZlcnRpc2VFbmFibGVTZXQuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBzdGFydFNjYW5uaW5nKGFsbG93RHVwbGljYXRlcykge1xuICAgIHRoaXMuX3NjYW5TdGF0ZSA9ICdzdGFydGluZyc7XG4gICAgdGhpcy5fc2NhbkZpbHRlckR1cGxpY2F0ZXMgPSAhYWxsb3dEdXBsaWNhdGVzO1xuXG4gICAgLy8gQWx3YXlzIHNldCBzY2FuIHBhcmFtZXRlcnMgYmVmb3JlIHNjYW5uaW5nXG4gICAgLy8gaHR0cHM6Ly93d3cuYmx1ZXRvb3RoLm9yZy9kb2NtYW4vaGFuZGxlcnMvZG93bmxvYWRkb2MuYXNoeD9kb2NfaWQ9MjI5NzM3XG4gICAgLy8gcDEwNiAtIHAxMDdcbiAgICB0aGlzLl9oY2kuc2V0U2NhbkVuYWJsZWQoZmFsc2UsIHRydWUpO1xuICAgIHRoaXMuX2hjaS5zZXRTY2FuUGFyYW1ldGVycygpO1xuICAgIHRoaXMuX2hjaS5zZXRTY2FuRW5hYmxlZCh0cnVlLCB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyk7XG4gIH1cblxuICBzdG9wU2Nhbm5pbmcoKSB7XG4gICAgdGhpcy5fc2NhblN0YXRlID0gJ3N0b3BwaW5nJztcblxuICAgIHRoaXMuX2hjaS5zZXRTY2FuRW5hYmxlZChmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBvbkhjaUxlU2NhblBhcmFtZXRlcnNTZXQoKSB7fVxuXG4gIC8vIENhbGxlZCB3aGVuIHJlY2VpdmUgYW4gZXZlbnQgXCJDb21tYW5kIENvbXBsZXRlXCIgZm9yIFwiTEUgU2V0IFNjYW4gRW5hYmxlXCJcbiAgb25IY2lMZVNjYW5FbmFibGVTZXQoc3RhdHVzKSB7XG4gICAgLy8gQ2hlY2sgdGhlIHN0YXR1cyB3ZSBnb3QgZnJvbSB0aGUgY29tbWFuZCBjb21wbGV0ZSBmdW5jdGlvbi5cbiAgICBpZiAoc3RhdHVzICE9PSAwKSB7XG4gICAgICAvLyBJZiBpdCBpcyBub24temVybyB0aGVyZSB3YXMgYW4gZXJyb3IsIGFuZCB3ZSBzaG91bGQgbm90IGNoYW5nZVxuICAgICAgLy8gb3VyIHN0YXR1cyBhcyBhIHJlc3VsdC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc2NhblN0YXRlID09PSAnc3RhcnRpbmcnKSB7XG4gICAgICB0aGlzLl9zY2FuU3RhdGUgPSAnc3RhcnRlZCc7XG5cbiAgICAgIHRoaXMuZW1pdCgnc2NhblN0YXJ0JywgdGhpcy5fc2NhbkZpbHRlckR1cGxpY2F0ZXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2NhblN0YXRlID09PSAnc3RvcHBpbmcnKSB7XG4gICAgICB0aGlzLl9zY2FuU3RhdGUgPSAnc3RvcHBlZCc7XG5cbiAgICAgIHRoaXMuZW1pdCgnc2NhblN0b3AnKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsZWQgd2hlbiB3ZSBzZWUgdGhlIGFjdHVhbCBjb21tYW5kIFwiTEUgU2V0IFNjYW4gRW5hYmxlXCJcbiAgb25MZVNjYW5FbmFibGVTZXRDbWQoZW5hYmxlLCBmaWx0ZXJEdXBsaWNhdGVzKSB7XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBuZXcgc2V0dGluZ3MgZGlmZmVyIGZyb20gd2hhdCB3ZSBleHBlY3QuXG4gICAgLy8gSWYgd2UgYXJlIHNjYW5uaW5nLCB0aGVuIGEgY2hhbmdlIGhhcHBlbnMgaWYgdGhlIG5ldyBjb21tYW5kIHN0b3BzXG4gICAgLy8gc2Nhbm5pbmcgb3IgaWYgZHVwbGljYXRlIGZpbHRlcmluZyBjaGFuZ2VzLlxuICAgIC8vIElmIHdlIGFyZSBub3Qgc2Nhbm5pbmcsIHRoZW4gYSBjaGFuZ2UgaGFwcGVucyBpZiBzY2FubmluZyB3YXMgZW5hYmxlZC5cbiAgICBpZiAodGhpcy5fc2NhblN0YXRlID09ICdzdGFydGluZycgfHwgdGhpcy5fc2NhblN0YXRlID09ICdzdGFydGVkJykge1xuICAgICAgaWYgKCFlbmFibGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzY2FuU3RvcCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyAhPT0gZmlsdGVyRHVwbGljYXRlcykge1xuICAgICAgICB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyA9IGZpbHRlckR1cGxpY2F0ZXM7XG5cbiAgICAgICAgdGhpcy5lbWl0KCdzY2FuU3RhcnQnLCB0aGlzLl9zY2FuRmlsdGVyRHVwbGljYXRlcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICh0aGlzLl9zY2FuU3RhdGUgPT0gJ3N0b3BwaW5nJyB8fCB0aGlzLl9zY2FuU3RhdGUgPT0gJ3N0b3BwZWQnKSAmJlxuICAgICAgZW5hYmxlXG4gICAgKSB7XG4gICAgICAvLyBTb21lb25lIHN0YXJ0ZWQgc2Nhbm5pbmcgb24gdXMuXG4gICAgICB0aGlzLmVtaXQoJ3NjYW5TdGFydCcsIHRoaXMuX3NjYW5GaWx0ZXJEdXBsaWNhdGVzKTtcbiAgICB9XG4gIH1cblxuICBvbkhjaUxlQWR2ZXJ0aXNpbmdSZXBvcnQoc3RhdHVzLCB0eXBlLCBhZGRyZXNzLCBhZGRyZXNzVHlwZSwgZWlyLCByc3NpKSB7XG4gICAgbGV0IHByZXZpb3VzbHlEaXNjb3ZlcmVkID0gISF0aGlzLl9kaXNjb3Zlcmllc1thZGRyZXNzXTtcbiAgICBsZXQgYWR2ZXJ0aXNlbWVudCA9IHByZXZpb3VzbHlEaXNjb3ZlcmVkXG4gICAgICA/IHRoaXMuX2Rpc2NvdmVyaWVzW2FkZHJlc3NdLmFkdmVydGlzZW1lbnRcbiAgICAgIDoge1xuICAgICAgICAgIGxvY2FsTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgIHR4UG93ZXJMZXZlbDogdW5kZWZpbmVkLFxuICAgICAgICAgIG1hbnVmYWN0dXJlckRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzZXJ2aWNlRGF0YTogW10sXG4gICAgICAgICAgc2VydmljZVV1aWRzOiBbXSxcbiAgICAgICAgICBzb2xpY2l0YXRpb25TZXJ2aWNlVXVpZHM6IFtdLFxuICAgICAgICAgIGFkdmVydGlzZW1lbnRSYXc6IFtdLFxuICAgICAgICAgIHNjYW5SZXNwb25zZVJhdzogW10sXG4gICAgICAgICAgcmF3OiBbXSxcbiAgICAgICAgfTtcblxuICAgIGxldCBkaXNjb3ZlcnlDb3VudCA9IHByZXZpb3VzbHlEaXNjb3ZlcmVkXG4gICAgICA/IHRoaXMuX2Rpc2NvdmVyaWVzW2FkZHJlc3NdLmNvdW50XG4gICAgICA6IDA7XG4gICAgbGV0IGhhc1NjYW5SZXNwb25zZSA9IHByZXZpb3VzbHlEaXNjb3ZlcmVkXG4gICAgICA/IHRoaXMuX2Rpc2NvdmVyaWVzW2FkZHJlc3NdLmhhc1NjYW5SZXNwb25zZVxuICAgICAgOiBmYWxzZTtcblxuICAgIGlmICh0eXBlID09PSAweDA0KSB7XG4gICAgICBoYXNTY2FuUmVzcG9uc2UgPSB0cnVlO1xuXG4gICAgICBpZiAoZWlyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWR2ZXJ0aXNlbWVudC5zY2FuUmVzcG9uc2VSYXcgPSBBcnJheS5mcm9tKGVpcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlc2V0IHNlcnZpY2UgZGF0YSBldmVyeSBub24tc2NhbiByZXNwb25zZSBldmVudFxuICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlRGF0YSA9IFtdO1xuICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlVXVpZHMgPSBbXTtcbiAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzID0gW107XG5cbiAgICAgIGlmIChlaXIubGVuZ3RoID4gMCkge1xuICAgICAgICBhZHZlcnRpc2VtZW50LmFkdmVydGlzZW1lbnRSYXcgPSBBcnJheS5mcm9tKGVpcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzY292ZXJ5Q291bnQrKztcblxuICAgIGxldCBpID0gMDtcbiAgICBsZXQgaiA9IDA7XG4gICAgbGV0IHNlcnZpY2VVdWlkID0gbnVsbDtcbiAgICBsZXQgc2VydmljZVNvbGljaXRhdGlvblV1aWQgPSBudWxsO1xuXG4gICAgd2hpbGUgKGkgKyAxIDwgZWlyLmxlbmd0aCkge1xuICAgICAgbGV0IGxlbmd0aCA9IGVpci5yZWFkVUludDgoaSk7XG5cbiAgICAgIGlmIChsZW5ndGggPCAxKSB7XG4gICAgICAgIGRlYnVnKCdpbnZhbGlkIEVJUiBkYXRhLCBsZW5ndGggPSAnICsgbGVuZ3RoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCBlaXJUeXBlID0gZWlyLnJlYWRVSW50OChpICsgMSk7IC8vIGh0dHBzOi8vd3d3LmJsdWV0b290aC5vcmcvZW4tdXMvc3BlY2lmaWNhdGlvbi9hc3NpZ25lZC1udW1iZXJzL2dlbmVyaWMtYWNjZXNzLXByb2ZpbGVcblxuICAgICAgaWYgKGkgKyBsZW5ndGggKyAxID4gZWlyLmxlbmd0aCkge1xuICAgICAgICBkZWJ1ZygnaW52YWxpZCBFSVIgZGF0YSwgb3V0IG9mIHJhbmdlIG9mIGJ1ZmZlciBsZW5ndGgnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCBieXRlcyA9IGVpci5zbGljZShpICsgMikuc2xpY2UoMCwgbGVuZ3RoIC0gMSk7XG5cbiAgICAgIHN3aXRjaCAoZWlyVHlwZSkge1xuICAgICAgICBjYXNlIDB4MDI6IC8vIEluY29tcGxldGUgTGlzdCBvZiAxNi1iaXQgU2VydmljZSBDbGFzcyBVVUlEXG4gICAgICAgIGNhc2UgMHgwMzogLy8gQ29tcGxldGUgTGlzdCBvZiAxNi1iaXQgU2VydmljZSBDbGFzcyBVVUlEc1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBieXRlcy5sZW5ndGg7IGogKz0gMikge1xuICAgICAgICAgICAgc2VydmljZVV1aWQgPSBieXRlcy5yZWFkVUludDE2TEUoaikudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgaWYgKGFkdmVydGlzZW1lbnQuc2VydmljZVV1aWRzLmluZGV4T2Yoc2VydmljZVV1aWQpID09PSAtMSkge1xuICAgICAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VVdWlkcy5wdXNoKHNlcnZpY2VVdWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweDA2OiAvLyBJbmNvbXBsZXRlIExpc3Qgb2YgMTI4LWJpdCBTZXJ2aWNlIENsYXNzIFVVSURzXG4gICAgICAgIGNhc2UgMHgwNzogLy8gQ29tcGxldGUgTGlzdCBvZiAxMjgtYml0IFNlcnZpY2UgQ2xhc3MgVVVJRHNcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYnl0ZXMubGVuZ3RoOyBqICs9IDE2KSB7XG4gICAgICAgICAgICBzZXJ2aWNlVXVpZCA9IGJ5dGVzXG4gICAgICAgICAgICAgIC5zbGljZShqLCBqICsgMTYpXG4gICAgICAgICAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgICAgICBpZiAoYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlVXVpZHMuaW5kZXhPZihzZXJ2aWNlVXVpZCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVV1aWRzLnB1c2goc2VydmljZVV1aWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4MDg6IC8vIFNob3J0ZW5lZCBMb2NhbCBOYW1lXG4gICAgICAgIGNhc2UgMHgwOTogLy8gQ29tcGxldGUgTG9jYWwgTmFtZVxuICAgICAgICAgIGFkdmVydGlzZW1lbnQubG9jYWxOYW1lID0gYnl0ZXMudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4MGE6IHtcbiAgICAgICAgICAvLyBUeCBQb3dlciBMZXZlbFxuICAgICAgICAgIGFkdmVydGlzZW1lbnQudHhQb3dlckxldmVsID0gYnl0ZXMucmVhZEludDgoMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAweDE0OiB7XG4gICAgICAgICAgLy8gTGlzdCBvZiAxNiBiaXQgc29saWNpdGF0aW9uIFVVSURzXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGJ5dGVzLmxlbmd0aDsgaiArPSAyKSB7XG4gICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCA9IGJ5dGVzLnJlYWRVSW50MTZMRShqKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgc2VydmljZVNvbGljaXRhdGlvblV1aWRcbiAgICAgICAgICAgICAgKSA9PT0gLTFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VTb2xpY2l0YXRpb25VdWlkcy5wdXNoKFxuICAgICAgICAgICAgICAgIHNlcnZpY2VTb2xpY2l0YXRpb25VdWlkXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMHgxNToge1xuICAgICAgICAgIC8vIExpc3Qgb2YgMTI4IGJpdCBzb2xpY2l0YXRpb24gVVVJRHNcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYnl0ZXMubGVuZ3RoOyBqICs9IDE2KSB7XG4gICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZCA9IGJ5dGVzXG4gICAgICAgICAgICAgIC5zbGljZShqLCBqICsgMTYpXG4gICAgICAgICAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZVNvbGljaXRhdGlvblV1aWRzLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgc2VydmljZVNvbGljaXRhdGlvblV1aWRcbiAgICAgICAgICAgICAgKSA9PT0gLTFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VTb2xpY2l0YXRpb25VdWlkcy5wdXNoKFxuICAgICAgICAgICAgICAgIHNlcnZpY2VTb2xpY2l0YXRpb25VdWlkXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMHgxNjoge1xuICAgICAgICAgIC8vIDE2LWJpdCBTZXJ2aWNlIERhdGEsIHRoZXJlIGNhbiBiZSBtdWx0aXBsZSBvY2N1cmVuY2VzXG4gICAgICAgICAgbGV0IHNlcnZpY2VEYXRhVXVpZCA9IGJ5dGVzXG4gICAgICAgICAgICAuc2xpY2UoMCwgMilcbiAgICAgICAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgICAgbGV0IHNlcnZpY2VEYXRhID0gYnl0ZXMuc2xpY2UoMiwgYnl0ZXMubGVuZ3RoKTtcblxuICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZURhdGEucHVzaCh7XG4gICAgICAgICAgICB1dWlkOiBzZXJ2aWNlRGF0YVV1aWQsXG4gICAgICAgICAgICBkYXRhOiBzZXJ2aWNlRGF0YSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDB4MjA6IHtcbiAgICAgICAgICAvLyAzMi1iaXQgU2VydmljZSBEYXRhLCB0aGVyZSBjYW4gYmUgbXVsdGlwbGUgb2NjdXJlbmNlc1xuICAgICAgICAgIGxldCBzZXJ2aWNlRGF0YTMyVXVpZCA9IGJ5dGVzXG4gICAgICAgICAgICAuc2xpY2UoMCwgNClcbiAgICAgICAgICAgIC50b1N0cmluZygnaGV4JylcbiAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgICAgbGV0IHNlcnZpY2VEYXRhMzIgPSBieXRlcy5zbGljZSg0LCBieXRlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlRGF0YS5wdXNoKHtcbiAgICAgICAgICAgIHV1aWQ6IHNlcnZpY2VEYXRhMzJVdWlkLFxuICAgICAgICAgICAgZGF0YTogc2VydmljZURhdGEzMixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDB4MjE6IHtcbiAgICAgICAgICAvLyAxMjgtYml0IFNlcnZpY2UgRGF0YSwgdGhlcmUgY2FuIGJlIG11bHRpcGxlIG9jY3VyZW5jZXNcblxuICAgICAgICAgIGxldCBzZXJ2aWNlRGF0YTEyOFV1aWQgPSBieXRlc1xuICAgICAgICAgICAgLnNsaWNlKDAsIDE2KVxuICAgICAgICAgICAgLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5qb2luKCcnKTtcbiAgICAgICAgICBsZXQgc2VydmljZURhdGExMjggPSBieXRlcy5zbGljZSgxNiwgYnl0ZXMubGVuZ3RoKTtcblxuICAgICAgICAgIGFkdmVydGlzZW1lbnQuc2VydmljZURhdGEucHVzaCh7XG4gICAgICAgICAgICB1dWlkOiBzZXJ2aWNlRGF0YTEyOFV1aWQsXG4gICAgICAgICAgICBkYXRhOiBzZXJ2aWNlRGF0YTEyOCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDB4MWY6IC8vIExpc3Qgb2YgMzIgYml0IHNvbGljaXRhdGlvbiBVVUlEc1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBieXRlcy5sZW5ndGg7IGogKz0gNCkge1xuICAgICAgICAgICAgc2VydmljZVNvbGljaXRhdGlvblV1aWQgPSBieXRlcy5yZWFkVUludDMyTEUoaikudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBhZHZlcnRpc2VtZW50LnNlcnZpY2VTb2xpY2l0YXRpb25VdWlkcy5pbmRleE9mKFxuICAgICAgICAgICAgICAgIHNlcnZpY2VTb2xpY2l0YXRpb25VdWlkXG4gICAgICAgICAgICAgICkgPT09IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlU29saWNpdGF0aW9uVXVpZHMucHVzaChcbiAgICAgICAgICAgICAgICBzZXJ2aWNlU29saWNpdGF0aW9uVXVpZFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4ZmY6IC8vIE1hbnVmYWN0dXJlciBTcGVjaWZpYyBEYXRhXG4gICAgICAgICAgYWR2ZXJ0aXNlbWVudC5tYW51ZmFjdHVyZXJEYXRhID0gYnl0ZXM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGkgKz0gbGVuZ3RoICsgMTtcbiAgICB9XG5cbiAgICBkZWJ1ZygnYWR2ZXJ0aXNlbWVudCA9ICcgKyBKU09OLnN0cmluZ2lmeShhZHZlcnRpc2VtZW50LCBudWxsLCAwKSk7XG5cbiAgICBsZXQgY29ubmVjdGFibGUgPVxuICAgICAgdHlwZSA9PT0gMHgwNCAmJiBwcmV2aW91c2x5RGlzY292ZXJlZFxuICAgICAgICA/IHRoaXMuX2Rpc2NvdmVyaWVzW2FkZHJlc3NdLmNvbm5lY3RhYmxlXG4gICAgICAgIDogdHlwZSAhPT0gMHgwMztcblxuICAgIHRoaXMuX2Rpc2NvdmVyaWVzW2FkZHJlc3NdID0ge1xuICAgICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICAgIGFkZHJlc3NUeXBlOiBhZGRyZXNzVHlwZSxcbiAgICAgIGNvbm5lY3RhYmxlOiBjb25uZWN0YWJsZSxcbiAgICAgIGFkdmVydGlzZW1lbnQ6IGFkdmVydGlzZW1lbnQsXG4gICAgICByc3NpOiByc3NpLFxuICAgICAgY291bnQ6IGRpc2NvdmVyeUNvdW50LFxuICAgICAgaGFzU2NhblJlc3BvbnNlOiBoYXNTY2FuUmVzcG9uc2UsXG4gICAgfTtcblxuICAgIC8vIG9ubHkgcmVwb3J0IGFmdGVyIGEgc2NhbiByZXNwb25zZSBldmVudCBvciBpZiBub24tY29ubmVjdGFibGUgb3IgbW9yZSB0aGFuIG9uZSBkaXNjb3Zlcnkgd2l0aG91dCBhIHNjYW4gcmVzcG9uc2UsIHNvIG1vcmUgZGF0YSBjYW4gYmUgY29sbGVjdGVkXG4gICAgaWYgKFxuICAgICAgdHlwZSA9PT0gMHgwNCB8fFxuICAgICAgIWNvbm5lY3RhYmxlIHx8XG4gICAgICAoZGlzY292ZXJ5Q291bnQgPiAxICYmICFoYXNTY2FuUmVzcG9uc2UpIHx8XG4gICAgICBwcm9jZXNzLmVudi5OT0JMRV9SRVBPUlRfQUxMX0hDSV9FVkVOVFNcbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ2Rpc2NvdmVyJyxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBhZGRyZXNzLFxuICAgICAgICBhZGRyZXNzVHlwZSxcbiAgICAgICAgY29ubmVjdGFibGUsXG4gICAgICAgIGFkdmVydGlzZW1lbnQsXG4gICAgICAgIHJzc2lcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRBZHZlcnRpc2luZyhuYW1lLCBzZXJ2aWNlVXVpZHMpIHtcbiAgICBkZWJ1ZyhcbiAgICAgICdzdGFydEFkdmVydGlzaW5nOiBuYW1lID0gJyArXG4gICAgICAgIG5hbWUgK1xuICAgICAgICAnLCBzZXJ2aWNlVXVpZHMgPSAnICtcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2VydmljZVV1aWRzLCBudWxsLCAyKVxuICAgICk7XG5cbiAgICBsZXQgYWR2ZXJ0aXNlbWVudERhdGFMZW5ndGggPSAzO1xuICAgIGxldCBzY2FuRGF0YUxlbmd0aCA9IDA7XG5cbiAgICBsZXQgc2VydmljZVV1aWRzMTZiaXQgPSBbXTtcbiAgICBsZXQgc2VydmljZVV1aWRzMTI4Yml0ID0gW107XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGgpIHtcbiAgICAgIHNjYW5EYXRhTGVuZ3RoICs9IDIgKyBuYW1lLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc2VydmljZVV1aWRzICYmIHNlcnZpY2VVdWlkcy5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJ2aWNlVXVpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHNlcnZpY2VVdWlkID0gQnVmZmVyLmZyb20oXG4gICAgICAgICAgc2VydmljZVV1aWRzW2ldXG4gICAgICAgICAgICAubWF0Y2goLy57MSwyfS9nKVxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLmpvaW4oJycpLFxuICAgICAgICAgICdoZXgnXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHNlcnZpY2VVdWlkLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIHNlcnZpY2VVdWlkczE2Yml0LnB1c2goc2VydmljZVV1aWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlcnZpY2VVdWlkLmxlbmd0aCA9PT0gMTYpIHtcbiAgICAgICAgICBzZXJ2aWNlVXVpZHMxMjhiaXQucHVzaChzZXJ2aWNlVXVpZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VydmljZVV1aWRzMTZiaXQubGVuZ3RoKSB7XG4gICAgICBhZHZlcnRpc2VtZW50RGF0YUxlbmd0aCArPSAyICsgMiAqIHNlcnZpY2VVdWlkczE2Yml0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc2VydmljZVV1aWRzMTI4Yml0Lmxlbmd0aCkge1xuICAgICAgYWR2ZXJ0aXNlbWVudERhdGFMZW5ndGggKz0gMiArIDE2ICogc2VydmljZVV1aWRzMTI4Yml0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBsZXQgYWR2ZXJ0aXNlbWVudERhdGEgPSBCdWZmZXIuYWxsb2MoYWR2ZXJ0aXNlbWVudERhdGFMZW5ndGgpO1xuICAgIGxldCBzY2FuRGF0YSA9IEJ1ZmZlci5hbGxvYyhzY2FuRGF0YUxlbmd0aCk7XG5cbiAgICAvLyBmbGFnc1xuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMiwgMCk7XG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OCgweDAxLCAxKTtcbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KDB4MDYsIDIpO1xuXG4gICAgbGV0IGFkdmVydGlzZW1lbnREYXRhT2Zmc2V0ID0gMztcblxuICAgIGlmIChzZXJ2aWNlVXVpZHMxNmJpdC5sZW5ndGgpIHtcbiAgICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoXG4gICAgICAgIDEgKyAyICogc2VydmljZVV1aWRzMTZiaXQubGVuZ3RoLFxuICAgICAgICBhZHZlcnRpc2VtZW50RGF0YU9mZnNldFxuICAgICAgKTtcbiAgICAgIGFkdmVydGlzZW1lbnREYXRhT2Zmc2V0Kys7XG5cbiAgICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHgwMywgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQpO1xuICAgICAgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQrKztcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHNlcnZpY2VVdWlkczE2Yml0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNlcnZpY2VVdWlkczE2Yml0W2ldLmNvcHkoYWR2ZXJ0aXNlbWVudERhdGEsIGFkdmVydGlzZW1lbnREYXRhT2Zmc2V0KTtcbiAgICAgICAgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQgKz0gc2VydmljZVV1aWRzMTZiaXRbaV0ubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZXJ2aWNlVXVpZHMxMjhiaXQubGVuZ3RoKSB7XG4gICAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KFxuICAgICAgICAxICsgMTYgKiBzZXJ2aWNlVXVpZHMxMjhiaXQubGVuZ3RoLFxuICAgICAgICBhZHZlcnRpc2VtZW50RGF0YU9mZnNldFxuICAgICAgKTtcbiAgICAgIGFkdmVydGlzZW1lbnREYXRhT2Zmc2V0Kys7XG5cbiAgICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHgwNiwgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQpO1xuICAgICAgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQrKztcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHNlcnZpY2VVdWlkczEyOGJpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBzZXJ2aWNlVXVpZHMxMjhiaXRbaV0uY29weShhZHZlcnRpc2VtZW50RGF0YSwgYWR2ZXJ0aXNlbWVudERhdGFPZmZzZXQpO1xuICAgICAgICBhZHZlcnRpc2VtZW50RGF0YU9mZnNldCArPSBzZXJ2aWNlVXVpZHMxMjhiaXRbaV0ubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5hbWVcbiAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCkge1xuICAgICAgbGV0IG5hbWVCdWZmZXIgPSBCdWZmZXIuZnJvbShuYW1lKTtcblxuICAgICAgc2NhbkRhdGEud3JpdGVVSW50OCgxICsgbmFtZUJ1ZmZlci5sZW5ndGgsIDApO1xuICAgICAgc2NhbkRhdGEud3JpdGVVSW50OCgweDA4LCAxKTtcbiAgICAgIG5hbWVCdWZmZXIuY29weShzY2FuRGF0YSwgMik7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydEFkdmVydGlzaW5nV2l0aEVJUkRhdGEoYWR2ZXJ0aXNlbWVudERhdGEsIHNjYW5EYXRhKTtcbiAgfVxuXG4gIHN0YXJ0QWR2ZXJ0aXNpbmdJQmVhY29uKGRhdGEpIHtcbiAgICBkZWJ1Zygnc3RhcnRBZHZlcnRpc2luZ0lCZWFjb246IGRhdGEgPSAnICsgZGF0YS50b1N0cmluZygnaGV4JykpO1xuXG4gICAgbGV0IGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICBsZXQgbWFudWZhY3R1cmVyRGF0YUxlbmd0aCA9IDQgKyBkYXRhTGVuZ3RoO1xuICAgIGxldCBhZHZlcnRpc2VtZW50RGF0YUxlbmd0aCA9IDUgKyBtYW51ZmFjdHVyZXJEYXRhTGVuZ3RoO1xuXG4gICAgbGV0IGFkdmVydGlzZW1lbnREYXRhID0gQnVmZmVyLmFsbG9jKGFkdmVydGlzZW1lbnREYXRhTGVuZ3RoKTtcbiAgICBsZXQgc2NhbkRhdGEgPSBCdWZmZXIuYWxsb2MoMCk7XG5cbiAgICAvLyBmbGFnc1xuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMiwgMCk7XG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OCgweDAxLCAxKTtcbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQ4KDB4MDYsIDIpO1xuXG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OChtYW51ZmFjdHVyZXJEYXRhTGVuZ3RoICsgMSwgMyk7XG4gICAgYWR2ZXJ0aXNlbWVudERhdGEud3JpdGVVSW50OCgweGZmLCA0KTtcbiAgICBhZHZlcnRpc2VtZW50RGF0YS53cml0ZVVJbnQxNkxFKDB4MDA0YywgNSk7IC8vIEFwcGxlIENvbXBhbnkgSWRlbnRpZmllciBMRSAoMTYgYml0KVxuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoMHgwMiwgNyk7IC8vIHR5cGUsIDIgPT4gaUJlYWNvblxuICAgIGFkdmVydGlzZW1lbnREYXRhLndyaXRlVUludDgoZGF0YUxlbmd0aCwgOCk7XG5cbiAgICBkYXRhLmNvcHkoYWR2ZXJ0aXNlbWVudERhdGEsIDkpO1xuXG4gICAgdGhpcy5zdGFydEFkdmVydGlzaW5nV2l0aEVJUkRhdGEoYWR2ZXJ0aXNlbWVudERhdGEsIHNjYW5EYXRhKTtcbiAgfVxuXG4gIHN0YXJ0QWR2ZXJ0aXNpbmdXaXRoRUlSRGF0YShhZHZlcnRpc2VtZW50RGF0YSwgc2NhbkRhdGEpIHtcbiAgICBhZHZlcnRpc2VtZW50RGF0YSA9IGFkdmVydGlzZW1lbnREYXRhIHx8IEJ1ZmZlci5hbGxvYygwKTtcbiAgICBzY2FuRGF0YSA9IHNjYW5EYXRhIHx8IEJ1ZmZlci5hbGxvYygwKTtcblxuICAgIGRlYnVnKFxuICAgICAgJ3N0YXJ0QWR2ZXJ0aXNpbmdXaXRoRUlSRGF0YTogYWR2ZXJ0aXNlbWVudCBkYXRhID0gJyArXG4gICAgICAgIGFkdmVydGlzZW1lbnREYXRhLnRvU3RyaW5nKCdoZXgnKSArXG4gICAgICAgICcsIHNjYW4gZGF0YSA9ICcgK1xuICAgICAgICBzY2FuRGF0YS50b1N0cmluZygnaGV4JylcbiAgICApO1xuXG4gICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgIGlmIChhZHZlcnRpc2VtZW50RGF0YS5sZW5ndGggPiAzMSkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ0FkdmVydGlzZW1lbnQgZGF0YSBpcyBvdmVyIG1heGltdW0gbGltaXQgb2YgMzEgYnl0ZXMnKTtcbiAgICB9IGVsc2UgaWYgKHNjYW5EYXRhLmxlbmd0aCA+IDMxKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignU2NhbiBkYXRhIGlzIG92ZXIgbWF4aW11bSBsaW1pdCBvZiAzMSBieXRlcycpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5lbWl0KCdhZHZlcnRpc2luZ1N0YXJ0JywgZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZHZlcnRpc2VTdGF0ZSA9ICdzdGFydGluZyc7XG5cbiAgICAgIHRoaXMuX2hjaS5zZXRTY2FuUmVzcG9uc2VEYXRhKHNjYW5EYXRhKTtcbiAgICAgIHRoaXMuX2hjaS5zZXRBZHZlcnRpc2luZ0RhdGEoYWR2ZXJ0aXNlbWVudERhdGEpO1xuXG4gICAgICB0aGlzLl9oY2kuc2V0QWR2ZXJ0aXNlRW5hYmxlKHRydWUpO1xuICAgICAgdGhpcy5faGNpLnNldFNjYW5SZXNwb25zZURhdGEoc2NhbkRhdGEpO1xuICAgICAgdGhpcy5faGNpLnNldEFkdmVydGlzaW5nRGF0YShhZHZlcnRpc2VtZW50RGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcmVzdGFydEFkdmVydGlzaW5nKCkge1xuICAgIHRoaXMuX2FkdmVydGlzZVN0YXRlID0gJ3Jlc3RhcnRpbmcnO1xuXG4gICAgdGhpcy5faGNpLnNldEFkdmVydGlzZUVuYWJsZSh0cnVlKTtcbiAgfVxuXG4gIHN0b3BBZHZlcnRpc2luZygpIHtcbiAgICB0aGlzLl9hZHZlcnRpc2VTdGF0ZSA9ICdzdG9wcGluZyc7XG5cbiAgICB0aGlzLl9oY2kuc2V0QWR2ZXJ0aXNlRW5hYmxlKGZhbHNlKTtcbiAgfVxuXG4gIG9uSGNpRXJyb3IoZXJyb3IpIHt9XG5cbiAgb25IY2lMZUFkdmVydGlzaW5nUGFyYW1ldGVyc1NldChzdGF0dXMpIHt9XG5cbiAgb25IY2lMZUFkdmVydGlzaW5nRGF0YVNldChzdGF0dXMpIHt9XG5cbiAgb25IY2lMZVNjYW5SZXNwb25zZURhdGFTZXQoc3RhdHVzKSB7fVxuXG4gIG9uSGNpTGVBZHZlcnRpc2VFbmFibGVTZXQoc3RhdHVzKSB7XG4gICAgaWYgKHRoaXMuX2FkdmVydGlzZVN0YXRlID09PSAnc3RhcnRpbmcnKSB7XG4gICAgICB0aGlzLl9hZHZlcnRpc2VTdGF0ZSA9ICdzdGFydGVkJztcblxuICAgICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgICBIY2kuU1RBVFVTX01BUFBFUltzdGF0dXNdIHx8ICdVbmtub3duICgnICsgc3RhdHVzICsgJyknXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdCgnYWR2ZXJ0aXNpbmdTdGFydCcsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2FkdmVydGlzZVN0YXRlID09PSAnc3RvcHBpbmcnKSB7XG4gICAgICB0aGlzLl9hZHZlcnRpc2VTdGF0ZSA9ICdzdG9wcGVkJztcblxuICAgICAgdGhpcy5lbWl0KCdhZHZlcnRpc2luZ1N0b3AnKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYXA7XG4iXX0=
