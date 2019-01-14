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
    this.remotePeripherals = [];

    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    this.peripheral = new BlePeripheral(Obniz);

    this.scanTarget = null;

    this.advertisement = new BleAdvertisement(Obniz);
    this.scan = new BleScan(Obniz);
    this.security = new BleSecurity(Obniz);
    this._reset();
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

  notified(obj) {
    if (obj.scan_result) {
      let val = this.findPeripheral(obj.scan_result.address);
      if (!val) {
        val = new BleRemotePeripheral(this.Obniz, obj.scan_result.address);
        this.remotePeripherals.push(val);
      }
      val.discoverdOnRemote = true;
      val.setParams(obj.scan_result);

      this.scan.notifyFromServer('onfind', val);
    }

    if (obj.scan_result_finish) {
      this.scan.notifyFromServer('onfinish');
    }

    let remotePeripheralCallbackFunc = function(val, func, type) {
      let obj = null;
      if (val === undefined) return;
      let p = this.findPeripheral(val.address);
      if (!p) {
        return;
      }
      if (type === 'peripheral') {
        obj = p;
      } else if (type === 'service') {
        obj = p.findService(val);
      } else if (type === 'characteristic') {
        obj = p.findCharacteristic(val);
      } else if (type === 'descriptor') {
        obj = p.findDescriptor(val);
      }
      if (!obj) {
        return;
      }
      func(val, obj);
    }.bind(this);

    const paramList = {
      status_update: { name: 'statusupdate', obj: 'peripheral' },
      get_service_result: { name: 'discover', obj: 'peripheral' },
      get_service_result_finish: {
        name: 'discoverfinished',
        obj: 'peripheral',
      },
      get_characteristic_result: { name: 'discover', obj: 'service' },
      get_characteristic_result_finish: {
        name: 'discoverfinished',
        obj: 'service',
      },
      write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
      read_characteristic_result: { name: 'onread', obj: 'characteristic' },
      register_notify_characteristic_result: {
        name: 'onregisternotify',
        obj: 'characteristic',
      },
      unregister_notify_characteristic_result: {
        name: 'onunregisternotify',
        obj: 'characteristic',
      },
      nofity_characteristic: { name: 'onnotify', obj: 'characteristic' },
      get_descriptor_result: { name: 'discover', obj: 'characteristic' },
      get_descriptor_result_finish: {
        name: 'discoverfinished',
        obj: 'characteristic',
      },
      write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
      read_descriptor_result: { name: 'onread', obj: 'descriptor' },
    };

    for (let key in paramList) {
      remotePeripheralCallbackFunc(
        obj[key],
        function(val, bleobj) {
          bleobj.notifyFromServer(paramList[key].name, val);
        }.bind(this),
        paramList[key].obj
      );
    }

    let callbackFunc = function(val, func, type) {
      let obj = null;
      if (val === undefined) return;
      if (type === 'peripheral') {
        obj = this.peripheral;
      } else if (type === 'service') {
        obj = this.peripheral.getService(val);
      } else if (type === 'characteristic') {
        obj = this.peripheral.findCharacteristic(val);
      } else if (type === 'descriptor') {
        obj = this.peripheral.findDescriptor(val);
      }
      if (!obj) {
        return;
      }
      func(val, obj);
    }.bind(this);

    if (obj.peripheral) {
      callbackFunc(
        obj.peripheral.connection_status,
        function(val) {
          this.peripheral.onconnectionupdates(val);
        }.bind(this),
        'peripheral'
      );

      const paramList = {
        read_characteristic_result: { name: 'onread', obj: 'characteristic' },
        write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
        notify_read_characteristic: {
          name: 'onreadfromremote',
          obj: 'characteristic',
        },
        notify_write_characteristic: {
          name: 'onwritefromremote',
          obj: 'characteristic',
        },
        read_descriptor_result: { name: 'onread', obj: 'descriptor' },
        write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
        notify_read_descriptor: { name: 'onreadfromremote', obj: 'descriptor' },
        notify_write_descriptor: {
          name: 'onwritefromremote',
          obj: 'descriptor',
        },
      };

      for (let key in paramList) {
        callbackFunc(
          obj.peripheral[key],
          function(val, bleobj) {
            bleobj.notifyFromServer(paramList[key].name, val);
          }.bind(this),
          paramList[key].obj
        );
      }
    }

    if (obj.error) {
      let params = obj.error;
      let handled = false;
      let peripheral, target;
      if (!params.address) {
        peripheral = this.peripheral;
      } else {
        peripheral = this.findPeripheral(params.address);
      }

      if (peripheral) {
        if (
          params.service_uuid &&
          params.characteristic_uuid &&
          params.descriptor_uuid
        ) {
          target = peripheral.findDescriptor(params);
        } else if (params.service_uuid && params.characteristic_uuid) {
          target = peripheral.findCharacteristic(params);
        } else if (params.service_uuid) {
          target = peripheral.findService(params);
        }
        if (target) {
          target.notifyFromServer('onerror', params);
          handled = true;
        } else {
          peripheral.onerror(params);
          handled = true;
        }
      }

      if ([35, 36, 37, 38, 39].includes(params.function_code)) {
        this.security.onerror(params);
        handled = true;
      }
      if (!handled) {
        this.Obniz.error(
          `ble ${params.message} service=${
            params.service_uuid
          } characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${
            params.descriptor_uuid
          }`
        );
      }
    }
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
}

module.exports = ObnizBLE;
