const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');
const BleHelper = require('./bleHelper');

class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
  constructor(params) {
    super(params);
  }

  get parentName() {
    return 'characteristic';
  }

  read() {
    const obj = {
      ble: {
        read_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
          descriptor_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }

  write(array, needResponse) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    const obj = {
      ble: {
        write_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
          descriptor_uuid: BleHelper.uuidFilter(this.uuid),
          data: array,
          needResponse,
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }
}

module.exports = BleRemoteDescriptor;
