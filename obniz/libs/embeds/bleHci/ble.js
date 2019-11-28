/* eslint-disable */

const ObnizBLEHci = require('./hci');
const Bindings = require('./protocol/bindings');

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
}

module.exports = ObnizBLE;
