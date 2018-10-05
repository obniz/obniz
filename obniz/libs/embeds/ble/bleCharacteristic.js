const BleDescriptor = require('./bleDescriptor');
const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleHelper = require('./bleHelper');

class BleCharacteristic extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.addDescriptor = this.addChild;
    this.getDescriptor = this.getChild;

    this.properties = obj.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return 'service';
  }

  get childrenClass() {
    return BleDescriptor;
  }

  get childrenName() {
    return 'descriptors';
  }

  toJSON() {
    let obj = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  addProperty(param) {
    if (!this.properties.includes(param)) {
      this.properties.push(param);
    }
  }

  removeProperty(param) {
    this.properties = this.properties.filter(elm => {
      return elm !== param;
    });
  }

  addPermission(param) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  removePermission(param) {
    this.permissions = this.permissions.filter(elm => {
      return elm !== param;
    });
  }

  write(data) {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
            data: data,
          },
        },
      },
    });
  }

  read() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          },
        },
      },
    });
  }

  notify() {
    this.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          notify_characteristic: {
            service_uuid: BleHelper.uuidFilter(this.service.uuid),
            characteristic_uuid: BleHelper.uuidFilter(this.uuid),
          },
        },
      },
    });
  }
}

module.exports = BleCharacteristic;
