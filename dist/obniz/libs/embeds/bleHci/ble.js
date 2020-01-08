"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ObnizBLEHci = require('./hci');
const CentralBindings = require('./protocol/central/bindings');
const PeripheralBindings = require('./protocol/peripheral/bindings');
const HciProtocol = require('./protocol/hci');
const BleHelper = require('./bleHelper');
const BlePeripheral = require('./blePeripheral');
const BleService = require('./bleService');
const BleCharacteristic = require('./bleCharacteristic');
const BleDescriptor = require('./bleDescriptor');
const BleRemotePeripheral = require('./bleRemotePeripheral');
const BleAdvertisement = require('./bleAdvertisement');
const BleScan = require('./bleScan');
const BleSecurity = require('./bleSecurity');
class ObnizBLE {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.hci = new ObnizBLEHci(Obniz);
        this.hciProtocol = new HciProtocol(this.hci);
        this.centralBindings = new CentralBindings(this.hciProtocol);
        this.peripheralBindings = new PeripheralBindings(this.hciProtocol);
        // let dummy = {write : ()=>{}, on:()=>{}}
        // this.centralBindings = new CentralBindings( dummy );
        // this.peripheralBindings = new PeripheralBindings( dummy );
        this.centralBindings.init();
        this.peripheralBindings.init();
        this._initialized = false;
        this._initializeWarning = true;
        this.remotePeripherals = [];
        this.service = BleService;
        this.characteristic = BleCharacteristic;
        this.descriptor = BleDescriptor;
        this.peripheral = new BlePeripheral(this);
        this.scanTarget = null;
        this.advertisement = new BleAdvertisement(this);
        this.scan = new BleScan(this);
        this.security = new BleSecurity(this);
        this._bind();
        this._reset();
    }
    initWait() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._initialized) {
                this._initialized = true;
                yield this.hciProtocol.initWait();
            }
        });
    }
    warningIfNotInitialize() {
        if (!this._initialized && this._initializeWarning) {
            this._initializeWarning = true;
            this.Obniz.warning({
                alert: 'warning',
                message: `BLE is not initialized. Please call 'await obniz.ble.initWait()'`,
            });
        }
    }
    notified(obj) {
        if (obj.hci) {
            this.hci.notified(obj.hci);
        }
    }
    _reset() { }
    directConnect(uuid, addressType) {
        let peripheral = this.findPeripheral(uuid);
        if (!peripheral) {
            peripheral = new BleRemotePeripheral(this, uuid);
            this.remotePeripherals.push(peripheral);
        }
        if (!this.centralBindings._addresses[uuid]) {
            let address = uuid.match(/.{1,2}/g).join(':');
            this.centralBindings._addresses[uuid] = address;
            this.centralBindings._addresseTypes[uuid] = addressType;
            this.centralBindings._connectable[uuid] = true;
        }
        peripheral.connect();
        return peripheral;
    }
    directConnectWait(uuid, addressType) {
        return __awaiter(this, void 0, void 0, function* () {
            let peripheral = this.directConnect(uuid, addressType);
            yield peripheral.connectWait();
            return peripheral;
        });
    }
    findPeripheral(address) {
        for (let key in this.remotePeripherals) {
            if (this.remotePeripherals[key].address === address) {
                return this.remotePeripherals[key];
            }
        }
        return null;
    }
    static _dataArray2uuidHex(data, reverse) {
        let uuid = [];
        for (let i = 0; i < data.length; i++) {
            uuid.push(('00' + data[i].toString(16).toLowerCase()).slice(-2));
        }
        if (reverse) {
            uuid = uuid.reverse();
        }
        let str = uuid.join('');
        if (uuid.length >= 16) {
            str =
                str.slice(0, 8) +
                    '-' +
                    str.slice(8, 12) +
                    '-' +
                    str.slice(12, 16) +
                    '-' +
                    str.slice(16, 20) +
                    '-' +
                    str.slice(20);
        }
        return str;
    }
    onStateChange() { }
    onAddressChange() { }
    onScanStart() { }
    onScanStop() {
        this.scan.notifyFromServer('onfinish');
    }
    onDiscover(uuid, address, addressType, connectable, advertisement, rssi) {
        let val = this.findPeripheral(uuid);
        if (!val) {
            val = new BleRemotePeripheral(this, uuid);
            this.remotePeripherals.push(val);
        }
        val.discoverdOnRemote = true;
        let peripheralData = {
            device_type: 'ble',
            address_type: addressType,
            ble_event_type: connectable
                ? 'connectable_advertisemnt'
                : 'non_connectable_advertising',
            rssi: rssi,
            adv_data: advertisement.advertisementRaw,
            scan_resp: advertisement.scanResponseRaw,
        };
        val.setParams(peripheralData);
        val._adv_data_filtered = advertisement;
        this.scan.notifyFromServer('onfind', val);
    }
    onConnect(peripheralUuid, error) {
        return __awaiter(this, void 0, void 0, function* () {
            let peripheral = this.findPeripheral(peripheralUuid);
            if (!error) {
                yield peripheral.discoverAllHandlesWait();
            }
            peripheral.notifyFromServer('statusupdate', {
                status: error ? 'disconnected' : 'connected',
            });
        });
    }
    onDisconnect(peripheralUuid) {
        let peripheral = this.findPeripheral(peripheralUuid);
        peripheral.notifyFromServer('statusupdate', { status: 'disconnected' });
    }
    onRssiUpdate() { }
    onServicesDiscover(peripheralUuid, serviceUuids) {
        let peripheral = this.findPeripheral(peripheralUuid);
        for (let serviceUuid of serviceUuids) {
            peripheral.notifyFromServer('discover', { service_uuid: serviceUuid });
        }
        peripheral.notifyFromServer('discoverfinished', {});
    }
    onIncludedServicesDiscover(peripheralUuid, serviceUuid, includedServiceUuids) { }
    onCharacteristicsDiscover(peripheralUuid, serviceUuid, characteristics) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let service = peripheral.findService({ service_uuid: serviceUuid });
        for (let char of characteristics) {
            let obj = {
                properties: char.properties.map(e => BleHelper.toSnakeCase(e)),
                characteristic_uuid: char.uuid,
            };
            service.notifyFromServer('discover', obj);
        }
        service.notifyFromServer('discoverfinished', {});
    }
    onRead(peripheralUuid, serviceUuid, characteristicUuid, data, isNotification, isSuccess) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let characteristic = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        if (isNotification) {
            let obj = {
                data: Array.from(data),
            };
            characteristic.notifyFromServer('onnotify', obj);
        }
        else {
            let obj = {
                result: isSuccess ? 'success' : 'failed',
                data: Array.from(data),
            };
            characteristic.notifyFromServer('onread', obj);
        }
    }
    onWrite(peripheralUuid, serviceUuid, characteristicUuid, isSuccess) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let characteristic = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        characteristic.notifyFromServer('onwrite', {
            result: isSuccess ? 'success' : 'failed',
        });
    }
    onBroadcast(peripheralUuid, serviceUuid, characteristicUuid, state) { }
    onNotify(peripheralUuid, serviceUuid, characteristicUuid, state) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let char = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        if (state) {
            char.notifyFromServer('onregisternotify', {});
        }
        else {
            char.notifyFromServer('onunregisternotify', {});
        }
    }
    onDescriptorsDiscover(peripheralUuid, serviceUuid, characteristicUuid, descriptors) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let char = peripheral.findCharacteristic({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
        });
        for (let descr of descriptors) {
            let obj = {
                descriptor_uuid: descr,
            };
            char.notifyFromServer('discover', obj);
        }
        char.notifyFromServer('discoverfinished', {});
    }
    onValueRead(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let descriptor = peripheral.findDescriptor({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
            descriptor_uuid: descriptorUuid,
        });
        let obj = {
            result: isSuccess ? 'success' : 'failed',
            data: Array.from(data),
        };
        descriptor.notifyFromServer('onread', obj);
    }
    onValueWrite(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, isSuccess) {
        let peripheral = this.findPeripheral(peripheralUuid);
        let descriptor = peripheral.findDescriptor({
            service_uuid: serviceUuid,
            characteristic_uuid: characteristicUuid,
            descriptor_uuid: descriptorUuid,
        });
        let obj = {
            result: isSuccess ? 'success' : 'failed',
        };
        descriptor.notifyFromServer('onwrite', obj);
    }
    onHandleRead(peripheralUuid, handle, data) { }
    onHandleWrite(peripheralUuid, handle) { }
    onHandleNotify(peripheralUuid, handle, data) { }
    onPeripheralStateChange(state) {
        // console.error("onPeripheralStateChange")
    }
    onPeripheralAddressChange(address) {
        // console.error("onPeripheralAddressChange")
    }
    onPeripheralPlatform(platform) {
        // console.error("onPeripheralPlatform")
    }
    onPeripheralAdvertisingStart(error) {
        // console.error("onPeripheralAdvertisingStart")
    }
    onPeripheralAdvertisingStop() {
        // console.error("onPeripheralAdvertisingStop")
    }
    onPeripheralServicesSet(error) {
        // console.error("onPeripheralServicesSet")
    }
    onPeripheralAccept(clientAddress) {
        this.peripheral.currentConnectedDeviceAddress = clientAddress;
        this.peripheral.onconnectionupdates({
            address: clientAddress,
            status: 'connected',
        });
    }
    onPeripheralMtuChange(mtu) {
        // console.error("onPeripheralMtuChange")
    }
    onPeripheralDisconnect(clientAddress) {
        this.peripheral.currentConnectedDeviceAddress = null;
        this.peripheral.onconnectionupdates({
            address: clientAddress,
            status: 'disconnected',
        });
    }
    onPeripheralRssiUpdate(rssi) {
        // console.error("onPeripheralRssiUpdate")
    }
    _bind() {
        this.centralBindings.on('stateChange', this.onStateChange.bind(this));
        this.centralBindings.on('addressChange', this.onAddressChange.bind(this));
        this.centralBindings.on('scanStart', this.onScanStart.bind(this));
        this.centralBindings.on('scanStop', this.onScanStop.bind(this));
        this.centralBindings.on('discover', this.onDiscover.bind(this));
        this.centralBindings.on('connect', this.onConnect.bind(this));
        this.centralBindings.on('disconnect', this.onDisconnect.bind(this));
        this.centralBindings.on('rssiUpdate', this.onRssiUpdate.bind(this));
        this.centralBindings.on('servicesDiscover', this.onServicesDiscover.bind(this));
        this.centralBindings.on('includedServicesDiscover', this.onIncludedServicesDiscover.bind(this));
        this.centralBindings.on('characteristicsDiscover', this.onCharacteristicsDiscover.bind(this));
        this.centralBindings.on('read', this.onRead.bind(this));
        this.centralBindings.on('write', this.onWrite.bind(this));
        this.centralBindings.on('broadcast', this.onBroadcast.bind(this));
        this.centralBindings.on('notify', this.onNotify.bind(this));
        this.centralBindings.on('descriptorsDiscover', this.onDescriptorsDiscover.bind(this));
        this.centralBindings.on('valueRead', this.onValueRead.bind(this));
        this.centralBindings.on('valueWrite', this.onValueWrite.bind(this));
        this.centralBindings.on('handleRead', this.onHandleRead.bind(this));
        this.centralBindings.on('handleWrite', this.onHandleWrite.bind(this));
        this.centralBindings.on('handleNotify', this.onHandleNotify.bind(this));
        this.peripheralBindings.on('stateChange', this.onPeripheralStateChange.bind(this));
        this.peripheralBindings.on('addressChange', this.onPeripheralAddressChange.bind(this));
        this.peripheralBindings.on('platform', this.onPeripheralPlatform.bind(this));
        this.peripheralBindings.on('advertisingStart', this.onPeripheralAdvertisingStart.bind(this));
        this.peripheralBindings.on('advertisingStop', this.onPeripheralAdvertisingStop.bind(this));
        this.peripheralBindings.on('servicesSet', this.onPeripheralServicesSet.bind(this));
        this.peripheralBindings.on('accept', this.onPeripheralAccept.bind(this));
        this.peripheralBindings.on('mtuChange', this.onPeripheralMtuChange.bind(this));
        this.peripheralBindings.on('disconnect', this.onPeripheralDisconnect.bind(this));
        this.peripheralBindings.on('rssiUpdate', this.onPeripheralRssiUpdate.bind(this));
    }
}
module.exports = ObnizBLE;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDL0QsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUNyRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFekMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDakQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzNDLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDakQsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM3RCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFN0MsTUFBTSxRQUFRO0lBQ1osWUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENB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QUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQ3JCLHFCQUFxQixFQUNyQixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN0QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FDeEIsYUFBYSxFQUNiLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3hDLENBQUM7UUFDRixJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUN4QixlQUFlLEVBQ2YsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDMUMsQ0FBQztRQUNGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQ3hCLFVBQVUsRUFDVixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNyQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FDeEIsa0JBQWtCLEVBQ2xCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQzdDLENBQUM7UUFDRixJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUN4QixpQkFBaUIsRUFDakIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDNUMsQ0FBQztRQUNGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQ3hCLGFBQWEsRUFDYixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN4QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQ3hCLFdBQVcsRUFDWCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN0QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FDeEIsWUFBWSxFQUNaLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3ZDLENBQUM7UUFFRixJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUN4QixZQUFZLEVBQ1osSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDdkMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9ibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBPYm5pekJMRUhjaSA9IHJlcXVpcmUoJy4vaGNpJyk7XG5jb25zdCBDZW50cmFsQmluZGluZ3MgPSByZXF1aXJlKCcuL3Byb3RvY29sL2NlbnRyYWwvYmluZGluZ3MnKTtcbmNvbnN0IFBlcmlwaGVyYWxCaW5kaW5ncyA9IHJlcXVpcmUoJy4vcHJvdG9jb2wvcGVyaXBoZXJhbC9iaW5kaW5ncycpO1xuY29uc3QgSGNpUHJvdG9jb2wgPSByZXF1aXJlKCcuL3Byb3RvY29sL2hjaScpO1xuY29uc3QgQmxlSGVscGVyID0gcmVxdWlyZSgnLi9ibGVIZWxwZXInKTtcblxuY29uc3QgQmxlUGVyaXBoZXJhbCA9IHJlcXVpcmUoJy4vYmxlUGVyaXBoZXJhbCcpO1xuY29uc3QgQmxlU2VydmljZSA9IHJlcXVpcmUoJy4vYmxlU2VydmljZScpO1xuY29uc3QgQmxlQ2hhcmFjdGVyaXN0aWMgPSByZXF1aXJlKCcuL2JsZUNoYXJhY3RlcmlzdGljJyk7XG5jb25zdCBCbGVEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9ibGVEZXNjcmlwdG9yJyk7XG5jb25zdCBCbGVSZW1vdGVQZXJpcGhlcmFsID0gcmVxdWlyZSgnLi9ibGVSZW1vdGVQZXJpcGhlcmFsJyk7XG5jb25zdCBCbGVBZHZlcnRpc2VtZW50ID0gcmVxdWlyZSgnLi9ibGVBZHZlcnRpc2VtZW50Jyk7XG5jb25zdCBCbGVTY2FuID0gcmVxdWlyZSgnLi9ibGVTY2FuJyk7XG5jb25zdCBCbGVTZWN1cml0eSA9IHJlcXVpcmUoJy4vYmxlU2VjdXJpdHknKTtcblxuY2xhc3MgT2JuaXpCTEUge1xuICBjb25zdHJ1Y3RvcihPYm5peikge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmhjaSA9IG5ldyBPYm5pekJMRUhjaShPYm5peik7XG4gICAgdGhpcy5oY2lQcm90b2NvbCA9IG5ldyBIY2lQcm90b2NvbCh0aGlzLmhjaSk7XG5cbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncyA9IG5ldyBDZW50cmFsQmluZGluZ3ModGhpcy5oY2lQcm90b2NvbCk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3MgPSBuZXcgUGVyaXBoZXJhbEJpbmRpbmdzKHRoaXMuaGNpUHJvdG9jb2wpO1xuXG4gICAgLy8gbGV0IGR1bW15ID0ge3dyaXRlIDogKCk9Pnt9LCBvbjooKT0+e319XG4gICAgLy8gdGhpcy5jZW50cmFsQmluZGluZ3MgPSBuZXcgQ2VudHJhbEJpbmRpbmdzKCBkdW1teSApO1xuICAgIC8vIHRoaXMucGVyaXBoZXJhbEJpbmRpbmdzID0gbmV3IFBlcmlwaGVyYWxCaW5kaW5ncyggZHVtbXkgKTtcblxuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLmluaXQoKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5pbml0KCk7XG5cbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuX2luaXRpYWxpemVXYXJuaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMucmVtb3RlUGVyaXBoZXJhbHMgPSBbXTtcblxuICAgIHRoaXMuc2VydmljZSA9IEJsZVNlcnZpY2U7XG4gICAgdGhpcy5jaGFyYWN0ZXJpc3RpYyA9IEJsZUNoYXJhY3RlcmlzdGljO1xuICAgIHRoaXMuZGVzY3JpcHRvciA9IEJsZURlc2NyaXB0b3I7XG4gICAgdGhpcy5wZXJpcGhlcmFsID0gbmV3IEJsZVBlcmlwaGVyYWwodGhpcyk7XG5cbiAgICB0aGlzLnNjYW5UYXJnZXQgPSBudWxsO1xuXG4gICAgdGhpcy5hZHZlcnRpc2VtZW50ID0gbmV3IEJsZUFkdmVydGlzZW1lbnQodGhpcyk7XG4gICAgdGhpcy5zY2FuID0gbmV3IEJsZVNjYW4odGhpcyk7XG4gICAgdGhpcy5zZWN1cml0eSA9IG5ldyBCbGVTZWN1cml0eSh0aGlzKTtcblxuICAgIHRoaXMuX2JpbmQoKTtcbiAgICB0aGlzLl9yZXNldCgpO1xuICB9XG5cbiAgYXN5bmMgaW5pdFdhaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgYXdhaXQgdGhpcy5oY2lQcm90b2NvbC5pbml0V2FpdCgpO1xuICAgIH1cbiAgfVxuXG4gIHdhcm5pbmdJZk5vdEluaXRpYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCAmJiB0aGlzLl9pbml0aWFsaXplV2FybmluZykge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZVdhcm5pbmcgPSB0cnVlO1xuICAgICAgdGhpcy5PYm5pei53YXJuaW5nKHtcbiAgICAgICAgYWxlcnQ6ICd3YXJuaW5nJyxcbiAgICAgICAgbWVzc2FnZTogYEJMRSBpcyBub3QgaW5pdGlhbGl6ZWQuIFBsZWFzZSBjYWxsICdhd2FpdCBvYm5pei5ibGUuaW5pdFdhaXQoKSdgLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZpZWQob2JqKSB7XG4gICAgaWYgKG9iai5oY2kpIHtcbiAgICAgIHRoaXMuaGNpLm5vdGlmaWVkKG9iai5oY2kpO1xuICAgIH1cbiAgfVxuXG4gIF9yZXNldCgpIHt9XG5cbiAgZGlyZWN0Q29ubmVjdCh1dWlkLCBhZGRyZXNzVHlwZSkge1xuICAgIGxldCBwZXJpcGhlcmFsID0gdGhpcy5maW5kUGVyaXBoZXJhbCh1dWlkKTtcbiAgICBpZiAoIXBlcmlwaGVyYWwpIHtcbiAgICAgIHBlcmlwaGVyYWwgPSBuZXcgQmxlUmVtb3RlUGVyaXBoZXJhbCh0aGlzLCB1dWlkKTtcbiAgICAgIHRoaXMucmVtb3RlUGVyaXBoZXJhbHMucHVzaChwZXJpcGhlcmFsKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNlbnRyYWxCaW5kaW5ncy5fYWRkcmVzc2VzW3V1aWRdKSB7XG4gICAgICBsZXQgYWRkcmVzcyA9IHV1aWQubWF0Y2goLy57MSwyfS9nKS5qb2luKCc6Jyk7XG4gICAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5fYWRkcmVzc2VzW3V1aWRdID0gYWRkcmVzcztcbiAgICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLl9hZGRyZXNzZVR5cGVzW3V1aWRdID0gYWRkcmVzc1R5cGU7XG4gICAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5fY29ubmVjdGFibGVbdXVpZF0gPSB0cnVlO1xuICAgIH1cbiAgICBwZXJpcGhlcmFsLmNvbm5lY3QoKTtcbiAgICByZXR1cm4gcGVyaXBoZXJhbDtcbiAgfVxuXG4gIGFzeW5jIGRpcmVjdENvbm5lY3RXYWl0KHV1aWQsIGFkZHJlc3NUeXBlKSB7XG4gICAgbGV0IHBlcmlwaGVyYWwgPSB0aGlzLmRpcmVjdENvbm5lY3QodXVpZCwgYWRkcmVzc1R5cGUpO1xuICAgIGF3YWl0IHBlcmlwaGVyYWwuY29ubmVjdFdhaXQoKTtcbiAgICByZXR1cm4gcGVyaXBoZXJhbDtcbiAgfVxuXG4gIGZpbmRQZXJpcGhlcmFsKGFkZHJlc3MpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5yZW1vdGVQZXJpcGhlcmFscykge1xuICAgICAgaWYgKHRoaXMucmVtb3RlUGVyaXBoZXJhbHNba2V5XS5hZGRyZXNzID09PSBhZGRyZXNzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbW90ZVBlcmlwaGVyYWxzW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc3RhdGljIF9kYXRhQXJyYXkydXVpZEhleChkYXRhLCByZXZlcnNlKSB7XG4gICAgbGV0IHV1aWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHV1aWQucHVzaCgoJzAwJyArIGRhdGFbaV0udG9TdHJpbmcoMTYpLnRvTG93ZXJDYXNlKCkpLnNsaWNlKC0yKSk7XG4gICAgfVxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICB1dWlkID0gdXVpZC5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGxldCBzdHIgPSB1dWlkLmpvaW4oJycpO1xuICAgIGlmICh1dWlkLmxlbmd0aCA+PSAxNikge1xuICAgICAgc3RyID1cbiAgICAgICAgc3RyLnNsaWNlKDAsIDgpICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgc3RyLnNsaWNlKDgsIDEyKSArXG4gICAgICAgICctJyArXG4gICAgICAgIHN0ci5zbGljZSgxMiwgMTYpICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgc3RyLnNsaWNlKDE2LCAyMCkgK1xuICAgICAgICAnLScgK1xuICAgICAgICBzdHIuc2xpY2UoMjApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgb25TdGF0ZUNoYW5nZSgpIHt9XG5cbiAgb25BZGRyZXNzQ2hhbmdlKCkge31cblxuICBvblNjYW5TdGFydCgpIHt9XG5cbiAgb25TY2FuU3RvcCgpIHtcbiAgICB0aGlzLnNjYW4ubm90aWZ5RnJvbVNlcnZlcignb25maW5pc2gnKTtcbiAgfVxuXG4gIG9uRGlzY292ZXIodXVpZCwgYWRkcmVzcywgYWRkcmVzc1R5cGUsIGNvbm5lY3RhYmxlLCBhZHZlcnRpc2VtZW50LCByc3NpKSB7XG4gICAgbGV0IHZhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwodXVpZCk7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIHZhbCA9IG5ldyBCbGVSZW1vdGVQZXJpcGhlcmFsKHRoaXMsIHV1aWQpO1xuICAgICAgdGhpcy5yZW1vdGVQZXJpcGhlcmFscy5wdXNoKHZhbCk7XG4gICAgfVxuICAgIHZhbC5kaXNjb3ZlcmRPblJlbW90ZSA9IHRydWU7XG5cbiAgICBsZXQgcGVyaXBoZXJhbERhdGEgPSB7XG4gICAgICBkZXZpY2VfdHlwZTogJ2JsZScsXG4gICAgICBhZGRyZXNzX3R5cGU6IGFkZHJlc3NUeXBlLFxuICAgICAgYmxlX2V2ZW50X3R5cGU6IGNvbm5lY3RhYmxlXG4gICAgICAgID8gJ2Nvbm5lY3RhYmxlX2FkdmVydGlzZW1udCdcbiAgICAgICAgOiAnbm9uX2Nvbm5lY3RhYmxlX2FkdmVydGlzaW5nJyxcbiAgICAgIHJzc2k6IHJzc2ksXG4gICAgICBhZHZfZGF0YTogYWR2ZXJ0aXNlbWVudC5hZHZlcnRpc2VtZW50UmF3LFxuICAgICAgc2Nhbl9yZXNwOiBhZHZlcnRpc2VtZW50LnNjYW5SZXNwb25zZVJhdyxcbiAgICB9O1xuXG4gICAgdmFsLnNldFBhcmFtcyhwZXJpcGhlcmFsRGF0YSk7XG4gICAgdmFsLl9hZHZfZGF0YV9maWx0ZXJlZCA9IGFkdmVydGlzZW1lbnQ7XG5cbiAgICB0aGlzLnNjYW4ubm90aWZ5RnJvbVNlcnZlcignb25maW5kJywgdmFsKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ29ubmVjdChwZXJpcGhlcmFsVXVpZCwgZXJyb3IpIHtcbiAgICBsZXQgcGVyaXBoZXJhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIGF3YWl0IHBlcmlwaGVyYWwuZGlzY292ZXJBbGxIYW5kbGVzV2FpdCgpO1xuICAgIH1cbiAgICBwZXJpcGhlcmFsLm5vdGlmeUZyb21TZXJ2ZXIoJ3N0YXR1c3VwZGF0ZScsIHtcbiAgICAgIHN0YXR1czogZXJyb3IgPyAnZGlzY29ubmVjdGVkJyA6ICdjb25uZWN0ZWQnLFxuICAgIH0pO1xuICB9XG5cbiAgb25EaXNjb25uZWN0KHBlcmlwaGVyYWxVdWlkKSB7XG4gICAgbGV0IHBlcmlwaGVyYWwgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKHBlcmlwaGVyYWxVdWlkKTtcbiAgICBwZXJpcGhlcmFsLm5vdGlmeUZyb21TZXJ2ZXIoJ3N0YXR1c3VwZGF0ZScsIHsgc3RhdHVzOiAnZGlzY29ubmVjdGVkJyB9KTtcbiAgfVxuXG4gIG9uUnNzaVVwZGF0ZSgpIHt9XG5cbiAgb25TZXJ2aWNlc0Rpc2NvdmVyKHBlcmlwaGVyYWxVdWlkLCBzZXJ2aWNlVXVpZHMpIHtcbiAgICBsZXQgcGVyaXBoZXJhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGZvciAobGV0IHNlcnZpY2VVdWlkIG9mIHNlcnZpY2VVdWlkcykge1xuICAgICAgcGVyaXBoZXJhbC5ub3RpZnlGcm9tU2VydmVyKCdkaXNjb3ZlcicsIHsgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCB9KTtcbiAgICB9XG4gICAgcGVyaXBoZXJhbC5ub3RpZnlGcm9tU2VydmVyKCdkaXNjb3ZlcmZpbmlzaGVkJywge30pO1xuICB9XG5cbiAgb25JbmNsdWRlZFNlcnZpY2VzRGlzY292ZXIoXG4gICAgcGVyaXBoZXJhbFV1aWQsXG4gICAgc2VydmljZVV1aWQsXG4gICAgaW5jbHVkZWRTZXJ2aWNlVXVpZHNcbiAgKSB7fVxuXG4gIG9uQ2hhcmFjdGVyaXN0aWNzRGlzY292ZXIocGVyaXBoZXJhbFV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY3MpIHtcbiAgICBsZXQgcGVyaXBoZXJhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGxldCBzZXJ2aWNlID0gcGVyaXBoZXJhbC5maW5kU2VydmljZSh7IHNlcnZpY2VfdXVpZDogc2VydmljZVV1aWQgfSk7XG4gICAgZm9yIChsZXQgY2hhciBvZiBjaGFyYWN0ZXJpc3RpY3MpIHtcbiAgICAgIGxldCBvYmogPSB7XG4gICAgICAgIHByb3BlcnRpZXM6IGNoYXIucHJvcGVydGllcy5tYXAoZSA9PiBCbGVIZWxwZXIudG9TbmFrZUNhc2UoZSkpLFxuICAgICAgICBjaGFyYWN0ZXJpc3RpY191dWlkOiBjaGFyLnV1aWQsXG4gICAgICB9O1xuICAgICAgc2VydmljZS5ub3RpZnlGcm9tU2VydmVyKCdkaXNjb3ZlcicsIG9iaik7XG4gICAgfVxuICAgIHNlcnZpY2Uubm90aWZ5RnJvbVNlcnZlcignZGlzY292ZXJmaW5pc2hlZCcsIHt9KTtcbiAgfVxuXG4gIG9uUmVhZChcbiAgICBwZXJpcGhlcmFsVXVpZCxcbiAgICBzZXJ2aWNlVXVpZCxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgZGF0YSxcbiAgICBpc05vdGlmaWNhdGlvbixcbiAgICBpc1N1Y2Nlc3NcbiAgKSB7XG4gICAgbGV0IHBlcmlwaGVyYWwgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKHBlcmlwaGVyYWxVdWlkKTtcbiAgICBsZXQgY2hhcmFjdGVyaXN0aWMgPSBwZXJpcGhlcmFsLmZpbmRDaGFyYWN0ZXJpc3RpYyh7XG4gICAgICBzZXJ2aWNlX3V1aWQ6IHNlcnZpY2VVdWlkLFxuICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgIH0pO1xuXG4gICAgaWYgKGlzTm90aWZpY2F0aW9uKSB7XG4gICAgICBsZXQgb2JqID0ge1xuICAgICAgICBkYXRhOiBBcnJheS5mcm9tKGRhdGEpLFxuICAgICAgfTtcbiAgICAgIGNoYXJhY3RlcmlzdGljLm5vdGlmeUZyb21TZXJ2ZXIoJ29ubm90aWZ5Jywgb2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgcmVzdWx0OiBpc1N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbGVkJyxcbiAgICAgICAgZGF0YTogQXJyYXkuZnJvbShkYXRhKSxcbiAgICAgIH07XG4gICAgICBjaGFyYWN0ZXJpc3RpYy5ub3RpZnlGcm9tU2VydmVyKCdvbnJlYWQnLCBvYmopO1xuICAgIH1cbiAgfVxuXG4gIG9uV3JpdGUocGVyaXBoZXJhbFV1aWQsIHNlcnZpY2VVdWlkLCBjaGFyYWN0ZXJpc3RpY1V1aWQsIGlzU3VjY2Vzcykge1xuICAgIGxldCBwZXJpcGhlcmFsID0gdGhpcy5maW5kUGVyaXBoZXJhbChwZXJpcGhlcmFsVXVpZCk7XG4gICAgbGV0IGNoYXJhY3RlcmlzdGljID0gcGVyaXBoZXJhbC5maW5kQ2hhcmFjdGVyaXN0aWMoe1xuICAgICAgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICB9KTtcbiAgICBjaGFyYWN0ZXJpc3RpYy5ub3RpZnlGcm9tU2VydmVyKCdvbndyaXRlJywge1xuICAgICAgcmVzdWx0OiBpc1N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbGVkJyxcbiAgICB9KTtcbiAgfVxuXG4gIG9uQnJvYWRjYXN0KHBlcmlwaGVyYWxVdWlkLCBzZXJ2aWNlVXVpZCwgY2hhcmFjdGVyaXN0aWNVdWlkLCBzdGF0ZSkge31cblxuICBvbk5vdGlmeShwZXJpcGhlcmFsVXVpZCwgc2VydmljZVV1aWQsIGNoYXJhY3RlcmlzdGljVXVpZCwgc3RhdGUpIHtcbiAgICBsZXQgcGVyaXBoZXJhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGxldCBjaGFyID0gcGVyaXBoZXJhbC5maW5kQ2hhcmFjdGVyaXN0aWMoe1xuICAgICAgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICB9KTtcblxuICAgIGlmIChzdGF0ZSkge1xuICAgICAgY2hhci5ub3RpZnlGcm9tU2VydmVyKCdvbnJlZ2lzdGVybm90aWZ5Jywge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGFyLm5vdGlmeUZyb21TZXJ2ZXIoJ29udW5yZWdpc3Rlcm5vdGlmeScsIHt9KTtcbiAgICB9XG4gIH1cblxuICBvbkRlc2NyaXB0b3JzRGlzY292ZXIoXG4gICAgcGVyaXBoZXJhbFV1aWQsXG4gICAgc2VydmljZVV1aWQsXG4gICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgIGRlc2NyaXB0b3JzXG4gICkge1xuICAgIGxldCBwZXJpcGhlcmFsID0gdGhpcy5maW5kUGVyaXBoZXJhbChwZXJpcGhlcmFsVXVpZCk7XG4gICAgbGV0IGNoYXIgPSBwZXJpcGhlcmFsLmZpbmRDaGFyYWN0ZXJpc3RpYyh7XG4gICAgICBzZXJ2aWNlX3V1aWQ6IHNlcnZpY2VVdWlkLFxuICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgIH0pO1xuICAgIGZvciAobGV0IGRlc2NyIG9mIGRlc2NyaXB0b3JzKSB7XG4gICAgICBsZXQgb2JqID0ge1xuICAgICAgICBkZXNjcmlwdG9yX3V1aWQ6IGRlc2NyLFxuICAgICAgfTtcbiAgICAgIGNoYXIubm90aWZ5RnJvbVNlcnZlcignZGlzY292ZXInLCBvYmopO1xuICAgIH1cbiAgICBjaGFyLm5vdGlmeUZyb21TZXJ2ZXIoJ2Rpc2NvdmVyZmluaXNoZWQnLCB7fSk7XG4gIH1cblxuICBvblZhbHVlUmVhZChcbiAgICBwZXJpcGhlcmFsVXVpZCxcbiAgICBzZXJ2aWNlVXVpZCxcbiAgICBjaGFyYWN0ZXJpc3RpY1V1aWQsXG4gICAgZGVzY3JpcHRvclV1aWQsXG4gICAgZGF0YSxcbiAgICBpc1N1Y2Nlc3NcbiAgKSB7XG4gICAgbGV0IHBlcmlwaGVyYWwgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKHBlcmlwaGVyYWxVdWlkKTtcbiAgICBsZXQgZGVzY3JpcHRvciA9IHBlcmlwaGVyYWwuZmluZERlc2NyaXB0b3Ioe1xuICAgICAgc2VydmljZV91dWlkOiBzZXJ2aWNlVXVpZCxcbiAgICAgIGNoYXJhY3RlcmlzdGljX3V1aWQ6IGNoYXJhY3RlcmlzdGljVXVpZCxcbiAgICAgIGRlc2NyaXB0b3JfdXVpZDogZGVzY3JpcHRvclV1aWQsXG4gICAgfSk7XG5cbiAgICBsZXQgb2JqID0ge1xuICAgICAgcmVzdWx0OiBpc1N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbGVkJyxcbiAgICAgIGRhdGE6IEFycmF5LmZyb20oZGF0YSksXG4gICAgfTtcbiAgICBkZXNjcmlwdG9yLm5vdGlmeUZyb21TZXJ2ZXIoJ29ucmVhZCcsIG9iaik7XG4gIH1cblxuICBvblZhbHVlV3JpdGUoXG4gICAgcGVyaXBoZXJhbFV1aWQsXG4gICAgc2VydmljZVV1aWQsXG4gICAgY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgIGRlc2NyaXB0b3JVdWlkLFxuICAgIGlzU3VjY2Vzc1xuICApIHtcbiAgICBsZXQgcGVyaXBoZXJhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGVyaXBoZXJhbFV1aWQpO1xuICAgIGxldCBkZXNjcmlwdG9yID0gcGVyaXBoZXJhbC5maW5kRGVzY3JpcHRvcih7XG4gICAgICBzZXJ2aWNlX3V1aWQ6IHNlcnZpY2VVdWlkLFxuICAgICAgY2hhcmFjdGVyaXN0aWNfdXVpZDogY2hhcmFjdGVyaXN0aWNVdWlkLFxuICAgICAgZGVzY3JpcHRvcl91dWlkOiBkZXNjcmlwdG9yVXVpZCxcbiAgICB9KTtcblxuICAgIGxldCBvYmogPSB7XG4gICAgICByZXN1bHQ6IGlzU3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdmYWlsZWQnLFxuICAgIH07XG4gICAgZGVzY3JpcHRvci5ub3RpZnlGcm9tU2VydmVyKCdvbndyaXRlJywgb2JqKTtcbiAgfVxuXG4gIG9uSGFuZGxlUmVhZChwZXJpcGhlcmFsVXVpZCwgaGFuZGxlLCBkYXRhKSB7fVxuXG4gIG9uSGFuZGxlV3JpdGUocGVyaXBoZXJhbFV1aWQsIGhhbmRsZSkge31cblxuICBvbkhhbmRsZU5vdGlmeShwZXJpcGhlcmFsVXVpZCwgaGFuZGxlLCBkYXRhKSB7fVxuXG4gIG9uUGVyaXBoZXJhbFN0YXRlQ2hhbmdlKHN0YXRlKSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihcIm9uUGVyaXBoZXJhbFN0YXRlQ2hhbmdlXCIpXG4gIH1cblxuICBvblBlcmlwaGVyYWxBZGRyZXNzQ2hhbmdlKGFkZHJlc3MpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwib25QZXJpcGhlcmFsQWRkcmVzc0NoYW5nZVwiKVxuICB9XG5cbiAgb25QZXJpcGhlcmFsUGxhdGZvcm0ocGxhdGZvcm0pIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwib25QZXJpcGhlcmFsUGxhdGZvcm1cIilcbiAgfVxuXG4gIG9uUGVyaXBoZXJhbEFkdmVydGlzaW5nU3RhcnQoZXJyb3IpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwib25QZXJpcGhlcmFsQWR2ZXJ0aXNpbmdTdGFydFwiKVxuICB9XG5cbiAgb25QZXJpcGhlcmFsQWR2ZXJ0aXNpbmdTdG9wKCkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJvblBlcmlwaGVyYWxBZHZlcnRpc2luZ1N0b3BcIilcbiAgfVxuXG4gIG9uUGVyaXBoZXJhbFNlcnZpY2VzU2V0KGVycm9yKSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihcIm9uUGVyaXBoZXJhbFNlcnZpY2VzU2V0XCIpXG4gIH1cblxuICBvblBlcmlwaGVyYWxBY2NlcHQoY2xpZW50QWRkcmVzcykge1xuICAgIHRoaXMucGVyaXBoZXJhbC5jdXJyZW50Q29ubmVjdGVkRGV2aWNlQWRkcmVzcyA9IGNsaWVudEFkZHJlc3M7XG4gICAgdGhpcy5wZXJpcGhlcmFsLm9uY29ubmVjdGlvbnVwZGF0ZXMoe1xuICAgICAgYWRkcmVzczogY2xpZW50QWRkcmVzcyxcbiAgICAgIHN0YXR1czogJ2Nvbm5lY3RlZCcsXG4gICAgfSk7XG4gIH1cblxuICBvblBlcmlwaGVyYWxNdHVDaGFuZ2UobXR1KSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihcIm9uUGVyaXBoZXJhbE10dUNoYW5nZVwiKVxuICB9XG5cbiAgb25QZXJpcGhlcmFsRGlzY29ubmVjdChjbGllbnRBZGRyZXNzKSB7XG4gICAgdGhpcy5wZXJpcGhlcmFsLmN1cnJlbnRDb25uZWN0ZWREZXZpY2VBZGRyZXNzID0gbnVsbDtcbiAgICB0aGlzLnBlcmlwaGVyYWwub25jb25uZWN0aW9udXBkYXRlcyh7XG4gICAgICBhZGRyZXNzOiBjbGllbnRBZGRyZXNzLFxuICAgICAgc3RhdHVzOiAnZGlzY29ubmVjdGVkJyxcbiAgICB9KTtcbiAgfVxuXG4gIG9uUGVyaXBoZXJhbFJzc2lVcGRhdGUocnNzaSkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJvblBlcmlwaGVyYWxSc3NpVXBkYXRlXCIpXG4gIH1cblxuICBfYmluZCgpIHtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbignc3RhdGVDaGFuZ2UnLCB0aGlzLm9uU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbignYWRkcmVzc0NoYW5nZScsIHRoaXMub25BZGRyZXNzQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oJ3NjYW5TdGFydCcsIHRoaXMub25TY2FuU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oJ3NjYW5TdG9wJywgdGhpcy5vblNjYW5TdG9wLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKCdkaXNjb3ZlcicsIHRoaXMub25EaXNjb3Zlci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbignY29ubmVjdCcsIHRoaXMub25Db25uZWN0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKCdkaXNjb25uZWN0JywgdGhpcy5vbkRpc2Nvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oJ3Jzc2lVcGRhdGUnLCB0aGlzLm9uUnNzaVVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbihcbiAgICAgICdzZXJ2aWNlc0Rpc2NvdmVyJyxcbiAgICAgIHRoaXMub25TZXJ2aWNlc0Rpc2NvdmVyLmJpbmQodGhpcylcbiAgICApO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFxuICAgICAgJ2luY2x1ZGVkU2VydmljZXNEaXNjb3ZlcicsXG4gICAgICB0aGlzLm9uSW5jbHVkZWRTZXJ2aWNlc0Rpc2NvdmVyLmJpbmQodGhpcylcbiAgICApO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFxuICAgICAgJ2NoYXJhY3RlcmlzdGljc0Rpc2NvdmVyJyxcbiAgICAgIHRoaXMub25DaGFyYWN0ZXJpc3RpY3NEaXNjb3Zlci5iaW5kKHRoaXMpXG4gICAgKTtcblxuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKCdyZWFkJywgdGhpcy5vblJlYWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oJ3dyaXRlJywgdGhpcy5vbldyaXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKCdicm9hZGNhc3QnLCB0aGlzLm9uQnJvYWRjYXN0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKCdub3RpZnknLCB0aGlzLm9uTm90aWZ5LmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKFxuICAgICAgJ2Rlc2NyaXB0b3JzRGlzY292ZXInLFxuICAgICAgdGhpcy5vbkRlc2NyaXB0b3JzRGlzY292ZXIuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oJ3ZhbHVlUmVhZCcsIHRoaXMub25WYWx1ZVJlYWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jZW50cmFsQmluZGluZ3Mub24oJ3ZhbHVlV3JpdGUnLCB0aGlzLm9uVmFsdWVXcml0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbignaGFuZGxlUmVhZCcsIHRoaXMub25IYW5kbGVSZWFkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2VudHJhbEJpbmRpbmdzLm9uKCdoYW5kbGVXcml0ZScsIHRoaXMub25IYW5kbGVXcml0ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNlbnRyYWxCaW5kaW5ncy5vbignaGFuZGxlTm90aWZ5JywgdGhpcy5vbkhhbmRsZU5vdGlmeS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMucGVyaXBoZXJhbEJpbmRpbmdzLm9uKFxuICAgICAgJ3N0YXRlQ2hhbmdlJyxcbiAgICAgIHRoaXMub25QZXJpcGhlcmFsU3RhdGVDaGFuZ2UuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICAnYWRkcmVzc0NoYW5nZScsXG4gICAgICB0aGlzLm9uUGVyaXBoZXJhbEFkZHJlc3NDaGFuZ2UuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICAncGxhdGZvcm0nLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxQbGF0Zm9ybS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcbiAgICAgICdhZHZlcnRpc2luZ1N0YXJ0JyxcbiAgICAgIHRoaXMub25QZXJpcGhlcmFsQWR2ZXJ0aXNpbmdTdGFydC5iaW5kKHRoaXMpXG4gICAgKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbihcbiAgICAgICdhZHZlcnRpc2luZ1N0b3AnLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxBZHZlcnRpc2luZ1N0b3AuYmluZCh0aGlzKVxuICAgICk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICAnc2VydmljZXNTZXQnLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxTZXJ2aWNlc1NldC5iaW5kKHRoaXMpXG4gICAgKTtcbiAgICB0aGlzLnBlcmlwaGVyYWxCaW5kaW5ncy5vbignYWNjZXB0JywgdGhpcy5vblBlcmlwaGVyYWxBY2NlcHQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICAnbXR1Q2hhbmdlJyxcbiAgICAgIHRoaXMub25QZXJpcGhlcmFsTXR1Q2hhbmdlLmJpbmQodGhpcylcbiAgICApO1xuICAgIHRoaXMucGVyaXBoZXJhbEJpbmRpbmdzLm9uKFxuICAgICAgJ2Rpc2Nvbm5lY3QnLFxuICAgICAgdGhpcy5vblBlcmlwaGVyYWxEaXNjb25uZWN0LmJpbmQodGhpcylcbiAgICApO1xuXG4gICAgdGhpcy5wZXJpcGhlcmFsQmluZGluZ3Mub24oXG4gICAgICAncnNzaVVwZGF0ZScsXG4gICAgICB0aGlzLm9uUGVyaXBoZXJhbFJzc2lVcGRhdGUuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYm5pekJMRTtcbiJdfQ==
