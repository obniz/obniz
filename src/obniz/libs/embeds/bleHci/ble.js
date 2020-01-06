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

  async initWait() {
    if (!this._initialized) {
      this._initialized = true;
      await this.hciProtocol.initWait();
    }
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

  _reset() {
  }

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

  async directConnectWait(uuid, addressType) {
    let peripheral = this.directConnect(uuid, addressType);
    await peripheral.connectWait();
    return peripheral;
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

  onStateChange() {
  }

  onAddressChange() {
  }

  onScanStart() {
  }

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

  async onConnect(peripheralUuid, error) {
    let peripheral = this.findPeripheral(peripheralUuid);
    if (!error) {
      await peripheral.discoverAllHandlesWait();
    }
    peripheral.notifyFromServer('statusupdate', {
      status: error ? 'disconnected' : 'connected',
    });
  }

  onDisconnect(peripheralUuid) {
    let peripheral = this.findPeripheral(peripheralUuid);
    peripheral.notifyFromServer('statusupdate', {status: 'disconnected'});
  }

  onRssiUpdate() {
  }

  onServicesDiscover(peripheralUuid, serviceUuids) {
    let peripheral = this.findPeripheral(peripheralUuid);
    for (let serviceUuid of serviceUuids) {
      peripheral.notifyFromServer('discover', {service_uuid: serviceUuid});
    }
    peripheral.notifyFromServer('discoverfinished', {});
  }

  onIncludedServicesDiscover(
      peripheralUuid,
      serviceUuid,
      includedServiceUuids
  ) {
  }

  onCharacteristicsDiscover(peripheralUuid, serviceUuid, characteristics) {
    let peripheral = this.findPeripheral(peripheralUuid);
    let service = peripheral.findService({service_uuid: serviceUuid});
    for (let char of characteristics) {
      let obj = {
        properties: char.properties.map(e => BleHelper.toSnakeCase(e)),
        characteristic_uuid: char.uuid,
      };
      service.notifyFromServer('discover', obj);
    }
    service.notifyFromServer('discoverfinished', {});
  }

  onRead(
      peripheralUuid,
      serviceUuid,
      characteristicUuid,
      data,
      isNotification,
      isSuccess
  ) {
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
    } else {
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

  onBroadcast(peripheralUuid, serviceUuid, characteristicUuid, state) {
  }

  onNotify(peripheralUuid, serviceUuid, characteristicUuid, state) {
    let peripheral = this.findPeripheral(peripheralUuid);
    let char = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });

    if (state) {
      char.notifyFromServer('onregisternotify', {});
    } else {
      char.notifyFromServer('onunregisternotify', {});
    }
  }

  onDescriptorsDiscover(
      peripheralUuid,
      serviceUuid,
      characteristicUuid,
      descriptors
  ) {
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

  onValueRead(
      peripheralUuid,
      serviceUuid,
      characteristicUuid,
      descriptorUuid,
      data,
      isSuccess
  ) {
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

  onValueWrite(
      peripheralUuid,
      serviceUuid,
      characteristicUuid,
      descriptorUuid,
      isSuccess
  ) {
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

  onHandleRead(peripheralUuid, handle, data) {
  }

  onHandleWrite(peripheralUuid, handle) {
  }

  onHandleNotify(peripheralUuid, handle, data) {
  }

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
    this.centralBindings.on(
        'servicesDiscover',
        this.onServicesDiscover.bind(this)
    );
    this.centralBindings.on(
        'includedServicesDiscover',
        this.onIncludedServicesDiscover.bind(this)
    );
    this.centralBindings.on(
        'characteristicsDiscover',
        this.onCharacteristicsDiscover.bind(this)
    );

    this.centralBindings.on('read', this.onRead.bind(this));
    this.centralBindings.on('write', this.onWrite.bind(this));
    this.centralBindings.on('broadcast', this.onBroadcast.bind(this));
    this.centralBindings.on('notify', this.onNotify.bind(this));
    this.centralBindings.on(
        'descriptorsDiscover',
        this.onDescriptorsDiscover.bind(this)
    );
    this.centralBindings.on('valueRead', this.onValueRead.bind(this));
    this.centralBindings.on('valueWrite', this.onValueWrite.bind(this));
    this.centralBindings.on('handleRead', this.onHandleRead.bind(this));
    this.centralBindings.on('handleWrite', this.onHandleWrite.bind(this));
    this.centralBindings.on('handleNotify', this.onHandleNotify.bind(this));

    this.peripheralBindings.on(
        'stateChange',
        this.onPeripheralStateChange.bind(this)
    );
    this.peripheralBindings.on(
        'addressChange',
        this.onPeripheralAddressChange.bind(this)
    );
    this.peripheralBindings.on(
        'platform',
        this.onPeripheralPlatform.bind(this)
    );
    this.peripheralBindings.on(
        'advertisingStart',
        this.onPeripheralAdvertisingStart.bind(this)
    );
    this.peripheralBindings.on(
        'advertisingStop',
        this.onPeripheralAdvertisingStop.bind(this)
    );
    this.peripheralBindings.on(
        'servicesSet',
        this.onPeripheralServicesSet.bind(this)
    );
    this.peripheralBindings.on('accept', this.onPeripheralAccept.bind(this));
    this.peripheralBindings.on(
        'mtuChange',
        this.onPeripheralMtuChange.bind(this)
    );
    this.peripheralBindings.on(
        'disconnect',
        this.onPeripheralDisconnect.bind(this)
    );

    this.peripheralBindings.on(
        'rssiUpdate',
        this.onPeripheralRssiUpdate.bind(this)
    );
  }
}

module.exports = ObnizBLE;
