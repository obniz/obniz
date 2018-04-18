const BleService = require("./bleService");

class BlePeripheral {

  constructor(Obniz) {
    this.Obniz = Obniz;
    this.services = [];
  }

  addService(obj) {
    if (!(obj instanceof BleService)) {
      obj = new BleService(obj);
    }
    this.services.push(obj);
    obj.peripheral = this;
    this.Obniz.send({ble: {peripheral: {services: [obj]}}});
  }

  setJson(json) {
    if (json["services"]) {
      for (let service of json["services"]) {
        this.addService(service);
      }
    }
  }

  getService(uuid) {
    uuid = uuid.toLowerCase();
    return this.services.filter(function (element) {
      return element.uuid.toLowerCase() === uuid;
    }).shift();
  }

  removeService(uuid) {
    this.services = this.services.filter(function (element) {
      return element.uuid.toLowerCase() !== uuid;
    });
  }

  stopAllService() {
    this.Obniz.send(
        {
          ble: {
            peripheral: null

          }
        }
    );
    this.services = [];
  }

  toJSON() {
    return {
      services: this.services
    };
  }


  findCharacteristic(param) {
    let serviceUuid = param.service_uuid.toLowerCase();
    let characteristicUuid = param.characteristic_uuid.toLowerCase();
    let s = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  findDescriptor(param) {
    let descriptorUuid = param.descriptor_uuid.toLowerCase();
    let c = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
  }

  end() {
    this.Obniz.send({ble: {peripheral: null}});
  }

  onconnectionupdates() {
  };

  onerror() {
  };
}


module.exports = BlePeripheral;