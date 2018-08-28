const BleRemoteAttributeAbstract = require('./bleRemoteAttributeAbstract');

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
          service_uuid: this.characteristic.service.uuid.toLowerCase(),
          characteristic_uuid: this.characteristic.uuid.toLowerCase(),
          descriptor_uuid: this.uuid.toLowerCase(),
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }

  write(array) {
    const obj = {
      ble: {
        write_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: this.characteristic.service.uuid.toLowerCase(),
          characteristic_uuid: this.characteristic.uuid.toLowerCase(),
          descriptor_uuid: this.uuid.toLowerCase(),
          data: array,
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }
}

module.exports = BleRemoteDescriptor;
