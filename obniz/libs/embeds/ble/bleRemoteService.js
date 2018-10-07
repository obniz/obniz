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
    const obj = {
      ble: {
        get_characteristics: {
          address: this.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.parent.Obniz.send(obj);
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
