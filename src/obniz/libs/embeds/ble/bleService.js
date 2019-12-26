const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleCharacteristic = require('./bleCharacteristic');
const BleHelper = require('./bleHelper');

class BleService extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.addCharacteristic = this.addChild;
    this.getCharacteristic = this.getChild;
  }

  get parentName() {
    return 'peripheral';
  }

  get childrenName() {
    return 'characteristics';
  }

  get childrenClass() {
    return BleCharacteristic;
  }

  get advData() {
    return {
      flags: ['general_discoverable_mode', 'br_edr_not_supported'],
      serviceUuids: [this.uuid],
    };
  }

  end() {
    this.peripheral.Obniz.send({
      ble: {
        peripheral: {
          stop_service: {
            service_uuid: BleHelper.uuidFilter(this.uuid),
          },
        },
      },
    });
    this.peripheral.removeService(this.uuid);
  }

  notify(notifyName, params) {
    //nothing
  }
}

module.exports = BleService;
