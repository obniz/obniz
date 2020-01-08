"use strict";
// var debug = require('debug')('bindings');
let events = require('events');
let AclStream = require('./acl-stream');
let Gatt = require('./gatt');
let Gap = require('./gap');
let Signaling = require('./signaling');
let Hci = require('../hci');
class NobleBindings extends events.EventEmitter {
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
        this._gap = new Gap(this._hci);
    }
    startScanning(serviceUuids, allowDuplicates) {
        this._scanServiceUuids = serviceUuids || [];
        this._gap.startScanning(allowDuplicates);
    }
    stopScanning() {
        this._gap.stopScanning();
    }
    connect(peripheralUuid) {
        let address = this._addresses[peripheralUuid];
        let addressType = this._addresseTypes[peripheralUuid];
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
        this._gap.on('scanStart', this.onScanStart.bind(this));
        this._gap.on('scanStop', this.onScanStop.bind(this));
        this._gap.on('discover', this.onDiscover.bind(this));
        this._hci.on('stateChange', this.onStateChange.bind(this));
        this._hci.on('addressChange', this.onAddressChange.bind(this));
        this._hci.on('leConnComplete', this.onLeConnComplete.bind(this));
        this._hci.on('leConnUpdateComplete', this.onLeConnUpdateComplete.bind(this));
        this._hci.on('rssiRead', this.onRssiRead.bind(this));
        this._hci.on('disconnComplete', this.onDisconnComplete.bind(this));
        this._hci.on('encryptChange', this.onEncryptChange.bind(this));
        this._hci.on('aclDataPkt', this.onAclDataPkt.bind(this));
    }
    onStateChange(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        if (state === 'unauthorized') {
            console.log('noble warning: adapter state unauthorized, please run as root or with sudo');
            console.log('               or see README for information on running without root/sudo:');
            console.log('               https://github.com/sandeepmistry/noble#running-on-linux');
        }
        else if (state === 'unsupported') {
            console.log('noble warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).');
            console.log('               Try to run with environment variable:');
            console.log('               [sudo] NOBLE_HCI_DEVICE_ID=x node ...');
        }
        this.emit('stateChange', state);
    }
    onAddressChange(address) {
        this.emit('addressChange', address);
    }
    onScanStart(filterDuplicates) {
        this.emit('scanStart', filterDuplicates);
    }
    onScanStop() {
        this.emit('scanStop');
    }
    onDiscover(status, address, addressType, connectable, advertisement, rssi) {
        if (this._scanServiceUuids === undefined) {
            return;
        }
        let serviceUuids = advertisement.serviceUuids || [];
        let serviceData = advertisement.serviceData || [];
        let hasScanServiceUuids = this._scanServiceUuids.length === 0;
        if (!hasScanServiceUuids) {
            let i;
            serviceUuids = serviceUuids.slice();
            for (i in serviceData) {
                serviceUuids.push(serviceData[i].uuid);
            }
            for (i in serviceUuids) {
                hasScanServiceUuids =
                    this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1;
                if (hasScanServiceUuids) {
                    break;
                }
            }
        }
        if (hasScanServiceUuids) {
            let uuid = address.split(':').join('');
            this._addresses[uuid] = address;
            this._addresseTypes[uuid] = addressType;
            this._connectable[uuid] = connectable;
            this.emit('discover', uuid, address, addressType, connectable, advertisement, rssi);
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
                .split(':')
                .join('')
                .toLowerCase();
            let aclStream = new AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
            let gatt = new Gatt(address, aclStream);
            let signaling = new Signaling(handle, aclStream);
            this._gatts[uuid] = this._gatts[handle] = gatt;
            this._signalings[uuid] = this._signalings[handle] = signaling;
            this._aclStreams[handle] = aclStream;
            this._handles[uuid] = handle;
            this._handles[handle] = uuid;
            this._gatts[handle].on('mtu', this.onMtu.bind(this));
            this._gatts[handle].on('servicesDiscover', this.onServicesDiscovered.bind(this));
            this._gatts[handle].on('includedServicesDiscover', this.onIncludedServicesDiscovered.bind(this));
            this._gatts[handle].on('characteristicsDiscover', this.onCharacteristicsDiscovered.bind(this));
            this._gatts[handle].on('read', this.onRead.bind(this));
            this._gatts[handle].on('write', this.onWrite.bind(this));
            this._gatts[handle].on('broadcast', this.onBroadcast.bind(this));
            this._gatts[handle].on('notify', this.onNotify.bind(this));
            this._gatts[handle].on('notification', this.onNotification.bind(this));
            this._gatts[handle].on('descriptorsDiscover', this.onDescriptorsDiscovered.bind(this));
            this._gatts[handle].on('valueRead', this.onValueRead.bind(this));
            this._gatts[handle].on('valueWrite', this.onValueWrite.bind(this));
            this._gatts[handle].on('handleRead', this.onHandleRead.bind(this));
            this._gatts[handle].on('handleWrite', this.onHandleWrite.bind(this));
            this._gatts[handle].on('handleNotify', this.onHandleNotify.bind(this));
            this._signalings[handle].on('connectionParameterUpdateRequest', this.onConnectionParameterUpdateRequest.bind(this));
            this._gatts[handle].exchangeMtu(256);
        }
        else {
            uuid = this._pendingConnectionUuid;
            let statusMessage = Hci.STATUS_MAPPER[status] || 'HCI Error: Unknown';
            let errorCode = ' (0x' + status.toString(16) + ')';
            statusMessage = statusMessage + errorCode;
            error = new Error(statusMessage);
        }
        this.emit('connect', uuid, error);
        if (this._connectionQueue.length > 0) {
            let peripheralUuid = this._connectionQueue.shift();
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
        let uuid = this._handles[handle];
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
            this.emit('disconnect', uuid); // TODO: handle reason?
        }
        else {
            // maybe disconnect as peripheral
            // console.warn(
            //   'noble warning: unknown handle ' + handle + ' disconnected!'
            // );
        }
    }
    onEncryptChange(handle, encrypt) {
        let aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.pushEncrypt(encrypt);
        }
    }
    onMtu(address, mtu) { }
    onRssiRead(handle, rssi) {
        this.emit('rssiUpdate', this._handles[handle], rssi);
    }
    onAclDataPkt(handle, cid, data) {
        let aclStream = this._aclStreams[handle];
        if (aclStream) {
            aclStream.push(cid, data);
        }
    }
    discoverServices(peripheralUuid, uuids) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverServices(uuids || []);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onServicesDiscovered(address, serviceUuids) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('servicesDiscover', uuid, serviceUuids);
    }
    discoverIncludedServices(peripheralUuid, serviceUuid, serviceUuids) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverIncludedServices(serviceUuid, serviceUuids || []);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onIncludedServicesDiscovered(address, serviceUuid, includedServiceUuids) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('includedServicesDiscover', uuid, serviceUuid, includedServiceUuids);
    }
    discoverCharacteristics(peripheralUuid, serviceUuid, characteristicUuids) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverCharacteristics(serviceUuid, characteristicUuids || []);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onCharacteristicsDiscovered(address, serviceUuid, characteristics) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('characteristicsDiscover', uuid, serviceUuid, characteristics);
    }
    read(peripheralUuid, serviceUuid, characteristicUuid) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.read(serviceUuid, characteristicUuid);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onRead(address, serviceUuid, characteristicUuid, data, isSuccess) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('read', uuid, serviceUuid, characteristicUuid, data, false, isSuccess);
    }
    write(peripheralUuid, serviceUuid, characteristicUuid, data, withoutResponse) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.write(serviceUuid, characteristicUuid, data, withoutResponse);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onWrite(address, serviceUuid, characteristicUuid, isSuccess) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('write', uuid, serviceUuid, characteristicUuid, isSuccess);
    }
    broadcast(peripheralUuid, serviceUuid, characteristicUuid, broadcast) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.broadcast(serviceUuid, characteristicUuid, broadcast);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onBroadcast(address, serviceUuid, characteristicUuid, state) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('broadcast', uuid, serviceUuid, characteristicUuid, state);
    }
    notify(peripheralUuid, serviceUuid, characteristicUuid, notify) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.notify(serviceUuid, characteristicUuid, notify);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onNotify(address, serviceUuid, characteristicUuid, state) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('notify', uuid, serviceUuid, characteristicUuid, state);
    }
    onNotification(address, serviceUuid, characteristicUuid, data) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('read', uuid, serviceUuid, characteristicUuid, data, true, true);
    }
    discoverDescriptors(peripheralUuid, serviceUuid, characteristicUuid) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.discoverDescriptors(serviceUuid, characteristicUuid);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onDescriptorsDiscovered(address, serviceUuid, characteristicUuid, descriptorUuids) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('descriptorsDiscover', uuid, serviceUuid, characteristicUuid, descriptorUuids);
    }
    readValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.readValue(serviceUuid, characteristicUuid, descriptorUuid);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onValueRead(address, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('valueRead', uuid, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess);
    }
    writeValue(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.writeValue(serviceUuid, characteristicUuid, descriptorUuid, data);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onValueWrite(address, serviceUuid, characteristicUuid, descriptorUuid, isSuccess) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('valueWrite', uuid, serviceUuid, characteristicUuid, descriptorUuid, isSuccess);
    }
    readHandle(peripheralUuid, attHandle) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.readHandle(attHandle);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onHandleRead(address, handle, data) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('handleRead', uuid, handle, data);
    }
    writeHandle(peripheralUuid, attHandle, data, withoutResponse) {
        let handle = this._handles[peripheralUuid];
        let gatt = this._gatts[handle];
        if (gatt) {
            gatt.writeHandle(attHandle, data, withoutResponse);
        }
        else {
            console.warn('noble warning: unknown peripheral ' + peripheralUuid);
        }
    }
    onHandleWrite(address, handle) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('handleWrite', uuid, handle);
    }
    onHandleNotify(address, handle, data) {
        let uuid = address
            .split(':')
            .join('')
            .toLowerCase();
        this.emit('handleNotify', uuid, handle, data);
    }
    onConnectionParameterUpdateRequest(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        this._hci.connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout);
    }
}
module.exports = NobleBindings;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvcHJvdG9jb2wvY2VudHJhbC9iaW5kaW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQTRDO0FBRTVDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdkMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sYUFBYyxTQUFRLE1BQU0sQ0FBQyxZQUFZO0lBQzdDLFlBQVksV0FBVztRQUNyQixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBRW5CLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElB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LElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQ3BCLHFCQUFxQixFQUNyQixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN4QyxDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUks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SCxDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQzNCLElBQUksSUFBSSxHQUFHLE9BQU87YUFDZixLQUFLLENBQUMsR0FBRyxDQUFDO2FBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUNSLFdBQVcsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSTtRQUNsQyxJQUFJLElBQUksR0FBRyxPQUFPO2FBQ2YsS0FBSyxDQUFDLEdBQUcsQ0FBQzthQUNWLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDUixXQUFXLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxrQ0FBa0MsQ0FDaEMsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUFXLEVBQ1gsT0FBTyxFQUNQLGtCQUFrQjtRQUVsQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FDcEIsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUFXLEVBQ1gsT0FBTyxFQUNQLGtCQUFrQixDQUNuQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL3Byb3RvY29sL2NlbnRyYWwvYmluZGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdiaW5kaW5ncycpO1xuXG5sZXQgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmxldCBBY2xTdHJlYW0gPSByZXF1aXJlKCcuL2FjbC1zdHJlYW0nKTtcbmxldCBHYXR0ID0gcmVxdWlyZSgnLi9nYXR0Jyk7XG5sZXQgR2FwID0gcmVxdWlyZSgnLi9nYXAnKTtcbmxldCBTaWduYWxpbmcgPSByZXF1aXJlKCcuL3NpZ25hbGluZycpO1xubGV0IEhjaSA9IHJlcXVpcmUoJy4uL2hjaScpO1xuXG5jbGFzcyBOb2JsZUJpbmRpbmdzIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGhjaVByb3RvY29sKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl9hZGRyZXNzZXMgPSB7fTtcbiAgICB0aGlzLl9hZGRyZXNzZVR5cGVzID0ge307XG4gICAgdGhpcy5fY29ubmVjdGFibGUgPSB7fTtcblxuICAgIHRoaXMuX3BlbmRpbmdDb25uZWN0aW9uVXVpZCA9IG51bGw7XG4gICAgdGhpcy5fY29ubmVjdGlvblF1ZXVlID0gW107XG5cbiAgICB0aGlzLl9oYW5kbGVzID0ge307XG4gICAgdGhpcy5fZ2F0dHMgPSB7fTtcbiAgICB0aGlzLl9hY2xTdHJlYW1zID0ge307XG4gICAgdGhpcy5fc2lnbmFsaW5ncyA9IHt9O1xuXG4gICAgdGhpcy5faGNpID0gaGNpUHJvdG9jb2w7XG4gICAgdGhpcy5fZ2FwID0gbmV3IEdhcCh0aGlzLl9oY2kpO1xuICB9XG5cbiAgc3RhcnRTY2FubmluZyhzZXJ2aWNlVXVpZHMsIGFsbG93RHVwbGljYXRlcykge1xuICAgIHRoaXMuX3NjYW5TZXJ2aWNlVXVpZHMgPSBzZXJ2aWNlVXVpZHMgfHwgW107XG5cbiAgICB0aGlzLl9nYXAuc3RhcnRTY2FubmluZyhhbGxvd0R1cGxpY2F0ZXMpO1xuICB9XG5cbiAgc3RvcFNjYW5uaW5nKCkge1xuICAgIHRoaXMuX2dhcC5zdG9wU2Nhbm5pbmcoKTtcbiAgfVxuXG4gIGNvbm5lY3QocGVyaXBoZXJhbFV1aWQpIHtcbiAgICBsZXQgYWRkcmVzcyA9IHRoaXMuX2FkZHJlc3Nlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgbGV0IGFkZHJlc3NUeXBlID0gdGhpcy5fYWRkcmVzc2VUeXBlc1twZXJpcGhlcmFsVXVpZF07XG5cbiAgICBpZiAoIXRoaXMuX3BlbmRpbmdDb25uZWN0aW9uVXVpZCkge1xuICAgICAgdGhpcy5fcGVuZGluZ0Nvbm5lY3Rpb25VdWlkID0gcGVyaXBoZXJhbFV1aWQ7XG5cbiAgICAgIHRoaXMuX2hjaS5jcmVhdGVMZUNvbm4oYWRkcmVzcywgYWRkcmVzc1R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uUXVldWUucHVzaChwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdChwZXJpcGhlcmFsVXVpZCkge1xuICAgIHRoaXMuX2hjaS5kaXNjb25uZWN0KHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdKTtcbiAgfVxuXG4gIHVwZGF0ZVJzc2kocGVyaXBoZXJhbFV1aWQpIHtcbiAgICB0aGlzLl9oY2kucmVhZFJzc2kodGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9nYXAub24oJ3NjYW5TdGFydCcsIHRoaXMub25TY2FuU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fZ2FwLm9uKCdzY2FuU3RvcCcsIHRoaXMub25TY2FuU3RvcC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9nYXAub24oJ2Rpc2NvdmVyJywgdGhpcy5vbkRpc2NvdmVyLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5faGNpLm9uKCdzdGF0ZUNoYW5nZScsIHRoaXMub25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oJ2FkZHJlc3NDaGFuZ2UnLCB0aGlzLm9uQWRkcmVzc0NoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oJ2xlQ29ubkNvbXBsZXRlJywgdGhpcy5vbkxlQ29ubkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2hjaS5vbihcbiAgICAgICdsZUNvbm5VcGRhdGVDb21wbGV0ZScsXG4gICAgICB0aGlzLm9uTGVDb25uVXBkYXRlQ29tcGxldGUuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5faGNpLm9uKCdyc3NpUmVhZCcsIHRoaXMub25Sc3NpUmVhZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9oY2kub24oJ2Rpc2Nvbm5Db21wbGV0ZScsIHRoaXMub25EaXNjb25uQ29tcGxldGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdlbmNyeXB0Q2hhbmdlJywgdGhpcy5vbkVuY3J5cHRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5faGNpLm9uKCdhY2xEYXRhUGt0JywgdGhpcy5vbkFjbERhdGFQa3QuYmluZCh0aGlzKSk7XG4gIH1cblxuICBvblN0YXRlQ2hhbmdlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSBzdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuXG4gICAgaWYgKHN0YXRlID09PSAndW5hdXRob3JpemVkJykge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdub2JsZSB3YXJuaW5nOiBhZGFwdGVyIHN0YXRlIHVuYXV0aG9yaXplZCwgcGxlYXNlIHJ1biBhcyByb290IG9yIHdpdGggc3VkbydcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJyAgICAgICAgICAgICAgIG9yIHNlZSBSRUFETUUgZm9yIGluZm9ybWF0aW9uIG9uIHJ1bm5pbmcgd2l0aG91dCByb290L3N1ZG86J1xuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnICAgICAgICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3NhbmRlZXBtaXN0cnkvbm9ibGUjcnVubmluZy1vbi1saW51eCdcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ3Vuc3VwcG9ydGVkJykge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdub2JsZSB3YXJuaW5nOiBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgQmx1ZXRvb3RoIExvdyBFbmVyZ3kgKEJMRSwgQmx1ZXRvb3RoIFNtYXJ0KS4nXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coJyAgICAgICAgICAgICAgIFRyeSB0byBydW4gd2l0aCBlbnZpcm9ubWVudCB2YXJpYWJsZTonKTtcbiAgICAgIGNvbnNvbGUubG9nKCcgICAgICAgICAgICAgICBbc3Vkb10gTk9CTEVfSENJX0RFVklDRV9JRD14IG5vZGUgLi4uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCdzdGF0ZUNoYW5nZScsIHN0YXRlKTtcbiAgfVxuXG4gIG9uQWRkcmVzc0NoYW5nZShhZGRyZXNzKSB7XG4gICAgdGhpcy5lbWl0KCdhZGRyZXNzQ2hhbmdlJywgYWRkcmVzcyk7XG4gIH1cblxuICBvblNjYW5TdGFydChmaWx0ZXJEdXBsaWNhdGVzKSB7XG4gICAgdGhpcy5lbWl0KCdzY2FuU3RhcnQnLCBmaWx0ZXJEdXBsaWNhdGVzKTtcbiAgfVxuXG4gIG9uU2NhblN0b3AoKSB7XG4gICAgdGhpcy5lbWl0KCdzY2FuU3RvcCcpO1xuICB9XG5cbiAgb25EaXNjb3ZlcihzdGF0dXMsIGFkZHJlc3MsIGFkZHJlc3NUeXBlLCBjb25uZWN0YWJsZSwgYWR2ZXJ0aXNlbWVudCwgcnNzaSkge1xuICAgIGlmICh0aGlzLl9zY2FuU2VydmljZVV1aWRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2VydmljZVV1aWRzID0gYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlVXVpZHMgfHwgW107XG4gICAgbGV0IHNlcnZpY2VEYXRhID0gYWR2ZXJ0aXNlbWVudC5zZXJ2aWNlRGF0YSB8fCBbXTtcbiAgICBsZXQgaGFzU2NhblNlcnZpY2VVdWlkcyA9IHRoaXMuX3NjYW5TZXJ2aWNlVXVpZHMubGVuZ3RoID09PSAwO1xuXG4gICAgaWYgKCFoYXNTY2FuU2VydmljZVV1aWRzKSB7XG4gICAgICBsZXQgaTtcblxuICAgICAgc2VydmljZVV1aWRzID0gc2VydmljZVV1aWRzLnNsaWNlKCk7XG5cbiAgICAgIGZvciAoaSBpbiBzZXJ2aWNlRGF0YSkge1xuICAgICAgICBzZXJ2aWNlVXVpZHMucHVzaChzZXJ2aWNlRGF0YVtpXS51dWlkKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpIGluIHNlcnZpY2VVdWlkcykge1xuICAgICAgICBoYXNTY2FuU2VydmljZVV1aWRzID1cbiAgICAgICAgICB0aGlzLl9zY2FuU2VydmljZVV1aWRzLmluZGV4T2Yoc2VydmljZVV1aWRzW2ldKSAhPT0gLTE7XG5cbiAgICAgICAgaWYgKGhhc1NjYW5TZXJ2aWNlVXVpZHMpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNTY2FuU2VydmljZVV1aWRzKSB7XG4gICAgICBsZXQgdXVpZCA9IGFkZHJlc3Muc3BsaXQoJzonKS5qb2luKCcnKTtcbiAgICAgIHRoaXMuX2FkZHJlc3Nlc1t1dWlkXSA9IGFkZHJlc3M7XG4gICAgICB0aGlzLl9hZGRyZXNzZVR5cGVzW3V1aWRdID0gYWRkcmVzc1R5cGU7XG4gICAgICB0aGlzLl9jb25uZWN0YWJsZVt1dWlkXSA9IGNvbm5lY3RhYmxlO1xuXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICdkaXNjb3ZlcicsXG4gICAgICAgIHV1aWQsXG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFkZHJlc3NUeXBlLFxuICAgICAgICBjb25uZWN0YWJsZSxcbiAgICAgICAgYWR2ZXJ0aXNlbWVudCxcbiAgICAgICAgcnNzaVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBvbkxlQ29ubkNvbXBsZXRlKFxuICAgIHN0YXR1cyxcbiAgICBoYW5kbGUsXG4gICAgcm9sZSxcbiAgICBhZGRyZXNzVHlwZSxcbiAgICBhZGRyZXNzLFxuICAgIGludGVydmFsLFxuICAgIGxhdGVuY3ksXG4gICAgc3VwZXJ2aXNpb25UaW1lb3V0LFxuICAgIG1hc3RlckNsb2NrQWNjdXJhY3lcbiAgKSB7XG4gICAgaWYgKHJvbGUgIT09IDApIHtcbiAgICAgIC8vIG5vdCBtYXN0ZXIsIGlnbm9yZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB1dWlkID0gbnVsbDtcblxuICAgIGxldCBlcnJvciA9IG51bGw7XG5cbiAgICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICB1dWlkID0gYWRkcmVzc1xuICAgICAgICAuc3BsaXQoJzonKVxuICAgICAgICAuam9pbignJylcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGxldCBhY2xTdHJlYW0gPSBuZXcgQWNsU3RyZWFtKFxuICAgICAgICB0aGlzLl9oY2ksXG4gICAgICAgIGhhbmRsZSxcbiAgICAgICAgdGhpcy5faGNpLmFkZHJlc3NUeXBlLFxuICAgICAgICB0aGlzLl9oY2kuYWRkcmVzcyxcbiAgICAgICAgYWRkcmVzc1R5cGUsXG4gICAgICAgIGFkZHJlc3NcbiAgICAgICk7XG4gICAgICBsZXQgZ2F0dCA9IG5ldyBHYXR0KGFkZHJlc3MsIGFjbFN0cmVhbSk7XG4gICAgICBsZXQgc2lnbmFsaW5nID0gbmV3IFNpZ25hbGluZyhoYW5kbGUsIGFjbFN0cmVhbSk7XG5cbiAgICAgIHRoaXMuX2dhdHRzW3V1aWRdID0gdGhpcy5fZ2F0dHNbaGFuZGxlXSA9IGdhdHQ7XG4gICAgICB0aGlzLl9zaWduYWxpbmdzW3V1aWRdID0gdGhpcy5fc2lnbmFsaW5nc1toYW5kbGVdID0gc2lnbmFsaW5nO1xuICAgICAgdGhpcy5fYWNsU3RyZWFtc1toYW5kbGVdID0gYWNsU3RyZWFtO1xuICAgICAgdGhpcy5faGFuZGxlc1t1dWlkXSA9IGhhbmRsZTtcbiAgICAgIHRoaXMuX2hhbmRsZXNbaGFuZGxlXSA9IHV1aWQ7XG5cbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oJ210dScsIHRoaXMub25NdHUuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKFxuICAgICAgICAnc2VydmljZXNEaXNjb3ZlcicsXG4gICAgICAgIHRoaXMub25TZXJ2aWNlc0Rpc2NvdmVyZWQuYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oXG4gICAgICAgICdpbmNsdWRlZFNlcnZpY2VzRGlzY292ZXInLFxuICAgICAgICB0aGlzLm9uSW5jbHVkZWRTZXJ2aWNlc0Rpc2NvdmVyZWQuYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oXG4gICAgICAgICdjaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlcicsXG4gICAgICAgIHRoaXMub25DaGFyYWN0ZXJpc3RpY3NEaXNjb3ZlcmVkLmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKCdyZWFkJywgdGhpcy5vblJlYWQuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKCd3cml0ZScsIHRoaXMub25Xcml0ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oJ2Jyb2FkY2FzdCcsIHRoaXMub25Ccm9hZGNhc3QuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLm9uKCdub3RpZnknLCB0aGlzLm9uTm90aWZ5LmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbignbm90aWZpY2F0aW9uJywgdGhpcy5vbk5vdGlmaWNhdGlvbi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oXG4gICAgICAgICdkZXNjcmlwdG9yc0Rpc2NvdmVyJyxcbiAgICAgICAgdGhpcy5vbkRlc2NyaXB0b3JzRGlzY292ZXJlZC5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbigndmFsdWVSZWFkJywgdGhpcy5vblZhbHVlUmVhZC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oJ3ZhbHVlV3JpdGUnLCB0aGlzLm9uVmFsdWVXcml0ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oJ2hhbmRsZVJlYWQnLCB0aGlzLm9uSGFuZGxlUmVhZC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2dhdHRzW2hhbmRsZV0ub24oJ2hhbmRsZVdyaXRlJywgdGhpcy5vbkhhbmRsZVdyaXRlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5vbignaGFuZGxlTm90aWZ5JywgdGhpcy5vbkhhbmRsZU5vdGlmeS5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5fc2lnbmFsaW5nc1toYW5kbGVdLm9uKFxuICAgICAgICAnY29ubmVjdGlvblBhcmFtZXRlclVwZGF0ZVJlcXVlc3QnLFxuICAgICAgICB0aGlzLm9uQ29ubmVjdGlvblBhcmFtZXRlclVwZGF0ZVJlcXVlc3QuYmluZCh0aGlzKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5fZ2F0dHNbaGFuZGxlXS5leGNoYW5nZU10dSgyNTYpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1dWlkID0gdGhpcy5fcGVuZGluZ0Nvbm5lY3Rpb25VdWlkO1xuICAgICAgbGV0IHN0YXR1c01lc3NhZ2UgPSBIY2kuU1RBVFVTX01BUFBFUltzdGF0dXNdIHx8ICdIQ0kgRXJyb3I6IFVua25vd24nO1xuICAgICAgbGV0IGVycm9yQ29kZSA9ICcgKDB4JyArIHN0YXR1cy50b1N0cmluZygxNikgKyAnKSc7XG4gICAgICBzdGF0dXNNZXNzYWdlID0gc3RhdHVzTWVzc2FnZSArIGVycm9yQ29kZTtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKHN0YXR1c01lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdCgnY29ubmVjdCcsIHV1aWQsIGVycm9yKTtcblxuICAgIGlmICh0aGlzLl9jb25uZWN0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHBlcmlwaGVyYWxVdWlkID0gdGhpcy5fY29ubmVjdGlvblF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgIGFkZHJlc3MgPSB0aGlzLl9hZGRyZXNzZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgICAgYWRkcmVzc1R5cGUgPSB0aGlzLl9hZGRyZXNzZVR5cGVzW3BlcmlwaGVyYWxVdWlkXTtcblxuICAgICAgdGhpcy5fcGVuZGluZ0Nvbm5lY3Rpb25VdWlkID0gcGVyaXBoZXJhbFV1aWQ7XG5cbiAgICAgIHRoaXMuX2hjaS5jcmVhdGVMZUNvbm4oYWRkcmVzcywgYWRkcmVzc1R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wZW5kaW5nQ29ubmVjdGlvblV1aWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG9uTGVDb25uVXBkYXRlQ29tcGxldGUoaGFuZGxlLCBpbnRlcnZhbCwgbGF0ZW5jeSwgc3VwZXJ2aXNpb25UaW1lb3V0KSB7XG4gICAgLy8gbm8tb3BcbiAgfVxuXG4gIG9uRGlzY29ubkNvbXBsZXRlKGhhbmRsZSwgcmVhc29uKSB7XG4gICAgbGV0IHV1aWQgPSB0aGlzLl9oYW5kbGVzW2hhbmRsZV07XG5cbiAgICBpZiAodXVpZCkge1xuICAgICAgdGhpcy5fYWNsU3RyZWFtc1toYW5kbGVdLnB1c2gobnVsbCwgbnVsbCk7XG4gICAgICB0aGlzLl9nYXR0c1toYW5kbGVdLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgdGhpcy5fc2lnbmFsaW5nc1toYW5kbGVdLnJlbW92ZUFsbExpc3RlbmVycygpO1xuXG4gICAgICBkZWxldGUgdGhpcy5fZ2F0dHNbdXVpZF07XG4gICAgICBkZWxldGUgdGhpcy5fZ2F0dHNbaGFuZGxlXTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zaWduYWxpbmdzW3V1aWRdO1xuICAgICAgZGVsZXRlIHRoaXMuX3NpZ25hbGluZ3NbaGFuZGxlXTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9hY2xTdHJlYW1zW2hhbmRsZV07XG4gICAgICBkZWxldGUgdGhpcy5faGFuZGxlc1t1dWlkXTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9oYW5kbGVzW2hhbmRsZV07XG5cbiAgICAgIHRoaXMuZW1pdCgnZGlzY29ubmVjdCcsIHV1aWQpOyAvLyBUT0RPOiBoYW5kbGUgcmVhc29uP1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtYXliZSBkaXNjb25uZWN0IGFzIHBlcmlwaGVyYWxcbiAgICAgIC8vIGNvbnNvbGUud2FybihcbiAgICAgIC8vICAgJ25vYmxlIHdhcm5pbmc6IHVua25vd24gaGFuZGxlICcgKyBoYW5kbGUgKyAnIGRpc2Nvbm5lY3RlZCEnXG4gICAgICAvLyApO1xuICAgIH1cbiAgfVxuXG4gIG9uRW5jcnlwdENoYW5nZShoYW5kbGUsIGVuY3J5cHQpIHtcbiAgICBsZXQgYWNsU3RyZWFtID0gdGhpcy5fYWNsU3RyZWFtc1toYW5kbGVdO1xuXG4gICAgaWYgKGFjbFN0cmVhbSkge1xuICAgICAgYWNsU3RyZWFtLnB1c2hFbmNyeXB0KGVuY3J5cHQpO1xuICAgIH1cbiAgfVxuXG4gIG9uTXR1KGFkZHJlc3MsIG10dSkge31cblxuICBvblJzc2lSZWFkKGhhbmRsZSwgcnNzaSkge1xuICAgIHRoaXMuZW1pdCgncnNzaVVwZGF0ZScsIHRoaXMuX2hhbmRsZXNbaGFuZGxlXSwgcnNzaSk7XG4gIH1cblxuICBvbkFjbERhdGFQa3QoaGFuZGxlLCBjaWQsIGRhdGEpIHtcbiAgICBsZXQgYWNsU3RyZWFtID0gdGhpcy5fYWNsU3RyZWFtc1toYW5kbGVdO1xuXG4gICAgaWYgKGFjbFN0cmVhbSkge1xuICAgICAgYWNsU3RyZWFtLnB1c2goY2lkLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBkaXNjb3ZlclNlcnZpY2VzKHBlcmlwaGVyYWxVdWlkLCB1dWlkcykge1xuICAgIGxldCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBsZXQgZ2F0dCA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5kaXNjb3ZlclNlcnZpY2VzKHV1aWRzIHx8IFtdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgJyArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBvblNlcnZpY2VzRGlzY292ZXJlZChhZGRyZXNzLCBzZXJ2aWNlVXVpZHMpIHtcbiAgICBsZXQgdXVpZCA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdCgnOicpXG4gICAgICAuam9pbignJylcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KCdzZXJ2aWNlc0Rpc2NvdmVyJywgdXVpZCwgc2VydmljZVV1aWRzKTtcbiAgfVxuXG4gIGRpc2NvdmVySW5jbHVkZWRTZXJ2aWNlcyhwZXJpcGhlcmFsVXVpZCwgc2VydmljZVV1aWQsIHNlcnZpY2VVdWlkcykge1xuICAgIGxldCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBsZXQgZ2F0dCA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5kaXNjb3ZlckluY2x1ZGVkU2VydmljZXMoc2VydmljZVV1aWQsIHNlcnZpY2VVdWlkcyB8fCBbXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2Fybignbm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsICcgKyBwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgb25JbmNsdWRlZFNlcnZpY2VzRGlzY292ZXJlZChhZGRyZXNzLCBzZXJ2aWNlVXVpZCwgaW5jbHVkZWRTZXJ2aWNlVXVpZHMpIHtcbiAgICBsZXQgdXVpZCA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdCgnOicpXG4gICAgICAuam9pbignJylcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ2luY2x1ZGVkU2VydmljZXNEaXNjb3ZlcicsXG4gICAgICB1dWlkLFxuICAgICAgc2VydmljZVV1aWQsXG4gICAgICBpbmNsdWRlZFNlcnZpY2VVdWlkc1xuICAgICk7XG4gIH1cblxuICBkaXNjb3ZlckNoYXJhY3RlcmlzdGljcyhwZXJpcGhlcmFsVXVpZCwgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZHMpIHtcbiAgICBsZXQgaGFuZGxlID0gdGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgbGV0IGdhdHQgPSB0aGlzLl9nYXR0c1toYW5kbGVdO1xuXG4gICAgaWYgKGdhdHQpIHtcbiAgICAgIGdhdHQuZGlzY292ZXJDaGFyYWN0ZXJpc3RpY3Moc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZHMgfHwgW10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCAnICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2hhcmFjdGVyaXN0aWNzRGlzY292ZXJlZChhZGRyZXNzLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNzKSB7XG4gICAgbGV0IHV1aWQgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoJzonKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdCgnY2hhcmFjdGVyaXN0aWNzRGlzY292ZXInLCB1dWlkLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNzKTtcbiAgfVxuXG4gIHJlYWQocGVyaXBoZXJhbFV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQpIHtcbiAgICBsZXQgaGFuZGxlID0gdGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgbGV0IGdhdHQgPSB0aGlzLl9nYXR0c1toYW5kbGVdO1xuXG4gICAgaWYgKGdhdHQpIHtcbiAgICAgIGdhdHQucmVhZChzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgJyArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBvblJlYWQoYWRkcmVzcywgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGF0YSwgaXNTdWNjZXNzKSB7XG4gICAgbGV0IHV1aWQgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoJzonKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgICdyZWFkJyxcbiAgICAgIHV1aWQsXG4gICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRhdGEsXG4gICAgICBmYWxzZSxcbiAgICAgIGlzU3VjY2Vzc1xuICAgICk7XG4gIH1cblxuICB3cml0ZShcbiAgICBwZXJpcGhlcmFsVXVpZCxcbiAgICBzZXJ2aWNlVXVpZCxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgZGF0YSxcbiAgICB3aXRob3V0UmVzcG9uc2VcbiAgKSB7XG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGxldCBnYXR0ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LndyaXRlKHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIGRhdGEsIHdpdGhvdXRSZXNwb25zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2Fybignbm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsICcgKyBwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgb25Xcml0ZShhZGRyZXNzLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBpc1N1Y2Nlc3MpIHtcbiAgICBsZXQgdXVpZCA9IGFkZHJlc3NcbiAgICAgIC5zcGxpdCgnOicpXG4gICAgICAuam9pbignJylcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbWl0KCd3cml0ZScsIHV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIGlzU3VjY2Vzcyk7XG4gIH1cblxuICBicm9hZGNhc3QocGVyaXBoZXJhbFV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIGJyb2FkY2FzdCkge1xuICAgIGxldCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBsZXQgZ2F0dCA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5icm9hZGNhc3Qoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgYnJvYWRjYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgJyArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBvbkJyb2FkY2FzdChhZGRyZXNzLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBzdGF0ZSkge1xuICAgIGxldCB1dWlkID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KCc6JylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoJ2Jyb2FkY2FzdCcsIHV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIHN0YXRlKTtcbiAgfVxuXG4gIG5vdGlmeShwZXJpcGhlcmFsVXVpZCwgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgbm90aWZ5KSB7XG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGxldCBnYXR0ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0Lm5vdGlmeShzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBub3RpZnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCAnICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIG9uTm90aWZ5KGFkZHJlc3MsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIHN0YXRlKSB7XG4gICAgbGV0IHV1aWQgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoJzonKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdCgnbm90aWZ5JywgdXVpZCwgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgc3RhdGUpO1xuICB9XG5cbiAgb25Ob3RpZmljYXRpb24oYWRkcmVzcywgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGF0YSkge1xuICAgIGxldCB1dWlkID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KCc6JylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoJ3JlYWQnLCB1dWlkLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBkYXRhLCB0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIGRpc2NvdmVyRGVzY3JpcHRvcnMocGVyaXBoZXJhbFV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQpIHtcbiAgICBsZXQgaGFuZGxlID0gdGhpcy5faGFuZGxlc1twZXJpcGhlcmFsVXVpZF07XG4gICAgbGV0IGdhdHQgPSB0aGlzLl9nYXR0c1toYW5kbGVdO1xuXG4gICAgaWYgKGdhdHQpIHtcbiAgICAgIGdhdHQuZGlzY292ZXJEZXNjcmlwdG9ycyhzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgJyArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBvbkRlc2NyaXB0b3JzRGlzY292ZXJlZChcbiAgICBhZGRyZXNzLFxuICAgIHNlcnZpY2VVdWlkLFxuICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICBkZXNjcmlwdG9yVXVpZHNcbiAgKSB7XG4gICAgbGV0IHV1aWQgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoJzonKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgICdkZXNjcmlwdG9yc0Rpc2NvdmVyJyxcbiAgICAgIHV1aWQsXG4gICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRlc2NyaXB0b3JVdWlkc1xuICAgICk7XG4gIH1cblxuICByZWFkVmFsdWUocGVyaXBoZXJhbFV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIGRlc2NyaXB0b3JVdWlkKSB7XG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGxldCBnYXR0ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LnJlYWRWYWx1ZShzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBkZXNjcmlwdG9yVXVpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2Fybignbm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsICcgKyBwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgb25WYWx1ZVJlYWQoXG4gICAgYWRkcmVzcyxcbiAgICBzZXJ2aWNlVXVpZCxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgZGVzY3JpcHRvclV1aWQsXG4gICAgZGF0YSxcbiAgICBpc1N1Y2Nlc3NcbiAgKSB7XG4gICAgbGV0IHV1aWQgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoJzonKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgICd2YWx1ZVJlYWQnLFxuICAgICAgdXVpZCxcbiAgICAgIHNlcnZpY2VVdWlkLFxuICAgICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgZGVzY3JpcHRvclV1aWQsXG4gICAgICBkYXRhLFxuICAgICAgaXNTdWNjZXNzXG4gICAgKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUoXG4gICAgcGVyaXBoZXJhbFV1aWQsXG4gICAgc2VydmljZVV1aWQsXG4gICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgIGRhdGFcbiAgKSB7XG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGxldCBnYXR0ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LndyaXRlVmFsdWUoc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgZGVzY3JpcHRvclV1aWQsIGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vYmxlIHdhcm5pbmc6IHVua25vd24gcGVyaXBoZXJhbCAnICsgcGVyaXBoZXJhbFV1aWQpO1xuICAgIH1cbiAgfVxuXG4gIG9uVmFsdWVXcml0ZShcbiAgICBhZGRyZXNzLFxuICAgIHNlcnZpY2VVdWlkLFxuICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICBkZXNjcmlwdG9yVXVpZCxcbiAgICBpc1N1Y2Nlc3NcbiAgKSB7XG4gICAgbGV0IHV1aWQgPSBhZGRyZXNzXG4gICAgICAuc3BsaXQoJzonKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW1pdChcbiAgICAgICd2YWx1ZVdyaXRlJyxcbiAgICAgIHV1aWQsXG4gICAgICBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgICAgaXNTdWNjZXNzXG4gICAgKTtcbiAgfVxuXG4gIHJlYWRIYW5kbGUocGVyaXBoZXJhbFV1aWQsIGF0dEhhbmRsZSkge1xuICAgIGxldCBoYW5kbGUgPSB0aGlzLl9oYW5kbGVzW3BlcmlwaGVyYWxVdWlkXTtcbiAgICBsZXQgZ2F0dCA9IHRoaXMuX2dhdHRzW2hhbmRsZV07XG5cbiAgICBpZiAoZ2F0dCkge1xuICAgICAgZ2F0dC5yZWFkSGFuZGxlKGF0dEhhbmRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2Fybignbm9ibGUgd2FybmluZzogdW5rbm93biBwZXJpcGhlcmFsICcgKyBwZXJpcGhlcmFsVXVpZCk7XG4gICAgfVxuICB9XG5cbiAgb25IYW5kbGVSZWFkKGFkZHJlc3MsIGhhbmRsZSwgZGF0YSkge1xuICAgIGxldCB1dWlkID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KCc6JylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoJ2hhbmRsZVJlYWQnLCB1dWlkLCBoYW5kbGUsIGRhdGEpO1xuICB9XG5cbiAgd3JpdGVIYW5kbGUocGVyaXBoZXJhbFV1aWQsIGF0dEhhbmRsZSwgZGF0YSwgd2l0aG91dFJlc3BvbnNlKSB7XG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZXNbcGVyaXBoZXJhbFV1aWRdO1xuICAgIGxldCBnYXR0ID0gdGhpcy5fZ2F0dHNbaGFuZGxlXTtcblxuICAgIGlmIChnYXR0KSB7XG4gICAgICBnYXR0LndyaXRlSGFuZGxlKGF0dEhhbmRsZSwgZGF0YSwgd2l0aG91dFJlc3BvbnNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdub2JsZSB3YXJuaW5nOiB1bmtub3duIHBlcmlwaGVyYWwgJyArIHBlcmlwaGVyYWxVdWlkKTtcbiAgICB9XG4gIH1cblxuICBvbkhhbmRsZVdyaXRlKGFkZHJlc3MsIGhhbmRsZSkge1xuICAgIGxldCB1dWlkID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KCc6JylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoJ2hhbmRsZVdyaXRlJywgdXVpZCwgaGFuZGxlKTtcbiAgfVxuXG4gIG9uSGFuZGxlTm90aWZ5KGFkZHJlc3MsIGhhbmRsZSwgZGF0YSkge1xuICAgIGxldCB1dWlkID0gYWRkcmVzc1xuICAgICAgLnNwbGl0KCc6JylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVtaXQoJ2hhbmRsZU5vdGlmeScsIHV1aWQsIGhhbmRsZSwgZGF0YSk7XG4gIH1cblxuICBvbkNvbm5lY3Rpb25QYXJhbWV0ZXJVcGRhdGVSZXF1ZXN0KFxuICAgIGhhbmRsZSxcbiAgICBtaW5JbnRlcnZhbCxcbiAgICBtYXhJbnRlcnZhbCxcbiAgICBsYXRlbmN5LFxuICAgIHN1cGVydmlzaW9uVGltZW91dFxuICApIHtcbiAgICB0aGlzLl9oY2kuY29ublVwZGF0ZUxlKFxuICAgICAgaGFuZGxlLFxuICAgICAgbWluSW50ZXJ2YWwsXG4gICAgICBtYXhJbnRlcnZhbCxcbiAgICAgIGxhdGVuY3ksXG4gICAgICBzdXBlcnZpc2lvblRpbWVvdXRcbiAgICApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9ibGVCaW5kaW5ncztcbiJdfQ==
