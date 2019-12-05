/* eslint-disable */

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
    this.characteristic.service.peripheral.obnizBle._bindings.readValue(
        this.characteristic.service.peripheral.address,
        this.characteristic.service.uuid,
        this.characteristic.uuid,
        this.uuid
    );
  }

  write(array) {

    this.characteristic.service.peripheral.obnizBle._bindings.readValue(
        this.characteristic.service.peripheral.address,
        this.characteristic.service.uuid,
        this.characteristic.uuid,
        this.uuid,
        Buffer.from(array)
    );

  }
}

module.exports = BleRemoteDescriptor;
