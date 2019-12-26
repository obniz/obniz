const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleHelper = require('./bleHelper');

class BleDescriptor extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return 'characteristic';
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

  toJSON() {
    let obj = super.toJSON();

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  write(dataArray) {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          write_descriptor: {
            service_uuid: BleHelper.uuidFilter(
              this.characteristic.service.uuid
            ),
            characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
            descriptor_uuid: this.uuid,
            data: dataArray,
          },
        },
      },
    });
  }

  read() {
    this.characteristic.service.peripheral.Obniz.send({
      ble: {
        peripheral: {
          read_descriptor: {
            service_uuid: BleHelper.uuidFilter(
              this.characteristic.service.uuid
            ),
            characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
            descriptor_uuid: this.uuid,
          },
        },
      },
    });
  }
}

module.exports = BleDescriptor;
