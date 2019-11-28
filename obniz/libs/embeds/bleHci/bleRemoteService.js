/* eslint-disable */

const BleRemoteCharacteristic = require('./bleRemoteCharacteristic');
const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
const BleHelper = require('./bleHelper');

class BleRemoteService extends BleRemoteAttributeAbstract {
  constructor(obj) {
    super(obj);
  }

  get parentName() {
    return 'peripheral';
  }

  get childrenClass() {
    return BleRemoteCharacteristic;
  }

  get childrenName() {
    return 'characteristics';
  }

  addCharacteristic(params) {
    return this.addChild(params);
  }

  getCharacteristic(params) {
    return this.getChild(params);
  }

  discoverAllCharacteristics() {
    return this.discoverChildren();
  }

  discoverAllCharacteristicsWait() {
    return this.discoverChildrenWait();
  }

  discoverChildren() {
    this.parent.obnizBle._bindings.discoverCharacteristics(this.peripheral.address,this.uuid);
  }

  ondiscover(characteristic) {
    this.ondiscovercharacteristic(characteristic);
  }

  ondiscoverfinished(characteristics) {
    this.ondiscovercharacteristicfinished(characteristics);
  }

  ondiscovercharacteristic() {}

  ondiscovercharacteristicfinished() {}
}

module.exports = BleRemoteService;
