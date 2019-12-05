/* eslint-disable */

const ObnizBLEHci = require('./hci');
const Bindings = require('./protocol/bindings');
const BleHelper = require("./bleHelper");

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
    this._bindings = new Bindings(this.hci);


    this._initialized = false;

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

  init() {
    if(!this._initialized){
      this._initialized = true;

      this._bindings.init();
    }
  }

  notified(obj) {
    if (obj.hci) {
      this.hci.notified(obj.hci);
    }
  }

  _reset() {}

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


  onStateChange(){}
  onAddressChange(){}

  onScanStart(){}

  onScanStop (){
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
      'device_type': "ble",
      'address_type': addressType,
      'ble_event_type': connectable ? "connectable_advertisemnt" : "non_connectable_advertising",
      'rssi': rssi,
      'adv_data': advertisement.raw,
      'scan_resp': [],
    };

    val.setParams(peripheralData);

    this.scan.notifyFromServer('onfind', val);
  }

  onConnect(peripheralUuid, error){
    let peripheral = this.findPeripheral(peripheralUuid);
    peripheral.notifyFromServer("statusupdate", {status: error ? "disconnected" : "connected"})
  }

  onDisconnect(peripheralUuid){
    let peripheral = this.findPeripheral(peripheralUuid);
    peripheral.notifyFromServer("statusupdate", {status: "disconnected"})
  }

  onRssiUpdate(){}


  onServicesDiscover(peripheralUuid, serviceUuids){
    let peripheral = this.findPeripheral(peripheralUuid);
    for( let serviceUuid of serviceUuids){
      peripheral.notifyFromServer("discover", {service_uuid: serviceUuid})
    }
    peripheral.notifyFromServer("discoverfinished", {});
  }
  onIncludedServicesDiscover(peripheralUuid, serviceUuid, includedServiceUuids){

  }
  onCharacteristicsDiscover(peripheralUuid, serviceUuid, characteristics){

    let peripheral = this.findPeripheral(peripheralUuid);
    let service = peripheral.findService({service_uuid: serviceUuid});
    for( let char of characteristics){
      let obj = {
        properties : char.properties.map(e=>BleHelper.toSnakeCase(e)),
        characteristic_uuid : char.uuid
      };
      service.notifyFromServer("discover", obj)
    }
    service.notifyFromServer("discoverfinished", {});
  }



  onRead(peripheralUuid, serviceUuid, characteristicUuid, data, isNotification) {
    let peripheral = this.findPeripheral(peripheralUuid);
    let service = peripheral.findService({service_uuid: serviceUuid});
    let characteristic = service.findCharacteristic({characteristic_uuid: characteristicUuid});

    if(isNotification){
      let obj = {
        data : Array.from(data)
      };
      characteristic.notifyFromServer("onnotify", obj)
    }else {
      let obj = {
        result : "success",
        data : Array.from(data)
      };
      characteristic.notifyFromServer("onread", obj)
    }
  }

  onWrite(peripheralUuid, serviceUuid, characteristicUuid){
    let peripheral = this.findPeripheral(peripheralUuid);
    let service = peripheral.findService({service_uuid: serviceUuid});
    let characteristic = service.findCharacteristic({characteristic_uuid: characteristicUuid});
    characteristic.notifyFromServer("onwrite", {result : "success"})
  }

  // todo
  onBroadcast(peripheralUuid, serviceUuid, characteristicUuid, state){

  }

  // notify when my device is peripheral?
  onNotify(peripheralUuid, serviceUuid, characteristicUuid, state){}


  onDescriptorsDiscover(peripheralUuid, serviceUuid, characteristicUuid,  descriptors){}


  onValueRead(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid, data){}
  onValueWrite(peripheralUuid, serviceUuid, characteristicUuid, descriptorUuid){}
  onHandleRead(peripheralUuid, handle, data){}
  onHandleWrite(peripheralUuid, handle){}
  onHandleNotify(peripheralUuid, handle, data){}

  _bind() {


    this._bindings.on('stateChange', this.onStateChange.bind(this));
    this._bindings.on('addressChange', this.onAddressChange.bind(this));
    this._bindings.on('scanStart', this.onScanStart.bind(this));
    this._bindings.on('scanStop', this.onScanStop.bind(this));
    this._bindings.on('discover', this.onDiscover.bind(this));
    this._bindings.on('connect', this.onConnect.bind(this));
    this._bindings.on('disconnect', this.onDisconnect.bind(this));
    this._bindings.on('rssiUpdate', this.onRssiUpdate.bind(this));
    this._bindings.on('servicesDiscover', this.onServicesDiscover.bind(this));
    this._bindings.on('includedServicesDiscover', this.onIncludedServicesDiscover.bind(this));
    this._bindings.on('characteristicsDiscover', this.onCharacteristicsDiscover.bind(this));


    this._bindings.on('read', this.onRead.bind(this));
    this._bindings.on('write', this.onWrite.bind(this));
    this._bindings.on('broadcast', this.onBroadcast.bind(this));
    this._bindings.on('notify', this.onNotify.bind(this));
    this._bindings.on('descriptorsDiscover', this.onDescriptorsDiscover.bind(this));
    this._bindings.on('valueRead', this.onValueRead.bind(this));
    this._bindings.on('valueWrite', this.onValueWrite.bind(this));
    this._bindings.on('handleRead', this.onHandleRead.bind(this));
    this._bindings.on('handleWrite', this.onHandleWrite.bind(this));
    this._bindings.on('handleNotify', this.onHandleNotify.bind(this));
  }
}

module.exports = ObnizBLE;
