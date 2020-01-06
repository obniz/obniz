const BleService = require("./bleService");
const BleHelper = require("./bleHelper");

class BlePeripheral {
  constructor(obnizBle) {
    this.obnizBle = obnizBle;
    this._services = [];
    this.currentConnectedDeviceAddress = null;
  }

  _updateServices() {
    let bufData = this._services.map(e => e.toBufferObj());
    this.obnizBle.peripheralBindings.setServices(bufData);
  }

  addService(obj) {
    this.obnizBle.warningIfNotInitialize();
    if (!(obj instanceof BleService)) {
      obj = new BleService(obj);
    }
    this._services.push(obj);
    obj.peripheral = this;

    this._updateServices();
  }

  setJson(json) {
    if (json.services) {
      for (let service of json.services) {
        this.addService(service);
      }
    }
  }

  getService(uuid) {
    uuid = BleHelper.uuidFilter(uuid);
    return this._services
        .filter(function(element) {
          return BleHelper.uuidFilter(element.uuid) === uuid;
        })
        .shift();
  }

  removeService(uuid) {
    this._services = this._services.filter(function(element) {
      return BleHelper.uuidFilter(element.uuid) !== uuid;
    });

    this._updateServices();
  }

  stopAllService() {
    this._services = [];
    this._updateServices();
  }

  toJSON() {
    return {
      services: this._services,
    };
  }

  findCharacteristic(param) {
    let serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    let characteristicUuid = BleHelper.uuidFilter(param.characteristic_uuid);
    let s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  findDescriptor(param) {
    let descriptorUuid = BleHelper.uuidFilter(param.descriptor_uuid);
    let c = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
  }

  end() {
    this.stopAllService();
  }

  onconnectionupdates() {
  }

  onerror() {
  }
}

module.exports = BlePeripheral;
