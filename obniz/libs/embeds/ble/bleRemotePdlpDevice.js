const BleRemotePeripheral = require('./bleRemotePeripheral');
const BlePdlpParameter = require('./blePdlpParameter');
const BleHelper = require('./bleHelper');
const HEADER_SRC_CLIENT = 1;
const HEADER_RESERVED_BIT = 0;
const HEADER_MULTIPLE_PACKET = 0;
const HEADER_SINGLE_PACKET = 1;
const UUID_128BIT = 'b3b36901-50d3-4044-808d-50835b13a6cd';
const UUID_16BIT = 'fe4e';
const LINK_SERVICE_UUID = 'b3b3690150d34044808d50835b13a6cd';
const LINK_WRITE_UUID = 'b3b3910150d34044808d50835b13a6cd';
const LINK_INDICATE_UUID = 'b3b39102-50d3-4044-808d-50835b13a6cd';
const SERVICE_ID_MASK = 0xf000;
const SERVICE_VAL_MASK = 0x0fff;

const SERVICES = [
  {
    name: 'Available services',
    sensor: false,
    parse: function(raw) {
      return raw;
    },
  },
  {
    name: 'Temperature',
    mask: 0x0800,
    sensor: true,
    parse: function(raw) {
      return BleHelper.ieee754Converter(raw, 1, 4, 7);
    },
  },
  {
    name: 'Humidity',
    mask: 0x0400,
    sensor: true,
    parse: function(raw) {
      return BleHelper.ieee754Converter(raw, 0, 4, 8);
    },
  },
  {
    name: 'Atmospheric pressure',
    mask: 0x0200,
    sensor: true,
    parse: function(raw) {
      return BleHelper.ieee754Converter(raw, 0, 5, 7);
    },
  },
  {
    name: 'Battery',
    mask: 0x0100,
    sensor: false,
    parse: function(raw) {
      let state = (raw & 0x800) >> 11;
      if (state === 0) return 'ok';
      else return 'low';
    },
  },
  {
    name: 'Button',
    mask: 0x0080,
    sensor: true,
    parse: function(raw) {
      return raw;
    },
  },
  {
    name: 'Open/Close information',
    mask: 0x0040,
    sensor: true,
    parse: function(raw) {
      let st = (raw & 0x800) >> 11;
      let val = raw & 0x7ff;
      let obj = {};
      if (st === 0) obj['state'] = 'closed';
      else obj['state'] = 'open';
      obj['count'] = val;
      return obj;
    },
  },
  {
    name: 'Motion sensor',
    mask: 0x0020,
    sensor: true,
    parse: function(raw) {
      let st = (raw & 0x800) >> 11;
      let val = raw & 0x7ff;
      let obj = {};
      if (st === 0) obj['state'] = 'off';
      else obj['state'] = 'on';
      obj['count'] = val;
      return obj;
    },
  },
  {
    name: 'Vibration',
    mask: 0x0010,
    sensor: true,
    parse: function(raw) {
      let st = (raw & 0x800) >> 11;
      let val = raw & 0x7ff;
      let obj = {};
      if (st === 0) obj['state'] = 'off';
      else obj['state'] = 'on';
      obj['count'] = val;
      return obj;
    },
  },
  {
    name: 'Brigthness',
    mask: 0x0008,
    sensor: true,
    parse: function(raw) {
      let range = (raw & 0x800) >> 11;
      let val = raw & 0x7ff;
      if (range === 0) return val;
      else return val * 50;
    },
  },
];

class BleRemotePdlpDevice extends BleRemotePeripheral {
  constructor(Obniz, address) {
    super(Obniz, address);
    this.sequenceNumber = 0;
    this.functions = {
      PROPERTY_INFORMATION: 0,
      NOTIFICATION: 1,
      OPERATION: 2,
      SENSOR_INFORMATION: 3,
      SETTING_OPERATION: 4,
    };
    this.sensorData = {};
    this.localServices = [];
    console.log('PDLP BLE', this);
  }

  _getHeader(lastPacket) {
    let header = [HEADER_SRC_CLIENT, HEADER_RESERVED_BIT, this.sequenceNumber];
    if (lastPacket) {
      header.push(HEADER_SINGLE_PACKET);
    } else {
      header.push(HEADER_MULTIPLE_PACKET);
    }
    return header;
  }

  static get UUID_128BIT() {
    return UUID_128BIT;
  }

  static get UUID_16BIT() {
    return UUID_16BIT;
  }

  static get SERVICES() {
    return SERVICES;
  }

  static get LINK_SERVICE_UUID() {
    return LINK_SERVICE_UUID;
  }

  static get LINK_WRITE_UUID() {
    return LINK_WRITE_UUID;
  }

  static get LINK_INDICATE_UUID() {
    return LINK_INDICATE_UUID;
  }

  async setLocalServices(list) {
    if (Array.isArray(list)) {
      this.localServices = list;
    }
    let services = await this.discoverAllServicesWait();
    Array.from(services).forEach(service => {
      if (service.uuid === LINK_SERVICE_UUID) {
        this.linkService = service;
      }
    });
    if (this.linkService) {
      let characteristics = await this.linkService.discoverAllCharacteristicsWait();
      Array.from(characteristics).forEach(chara => {
        if (chara.uuid === LINK_WRITE_UUID) this.writeCharacteristic = chara;
        else if (chara.uuid === LINK_INDICATE_UUID)
          this.indicateCharacteristic = chara;
      });
    }
  }

  setParams(dic) {
    super.setParams(dic);
    let serviceData = this.advertise_data_rows[2];
    serviceData.shift();
    for (let i = 0; i < serviceData.length / 2 + 1; i++) {
      let val = (serviceData[2 * i] << 8) + serviceData[2 * i + 1];
      let service = SERVICES[(val & SERVICE_ID_MASK) >> 12];
      if (service) {
        console.log(
          this.localName,
          service.name,
          service.parse(val & SERVICE_VAL_MASK)
        );
      }
      if (service && service.sensor) {
        if (
          this.localServices.length > 0 &&
          this.localServices.includes(service.name)
        )
          this.sensorData[service.name] = service.parse(val & SERVICE_VAL_MASK);
      }
    }
    this.onSensorData(this.sensorData);
  }

  updateSensorData() {
    this.Obniz.ble.scan.start(this);
  }

  registerNotify(callback) {
    if (this.indicateCharacteristic) {
      this.indicateCharacteristic.registerNotify(callback);
    }
  }

  onSensorData() {}

  writeFinal(fnId, msgId, params) {
    let header = this._getHeader(true);
    let message = [];
    if (Array.isArray(params)) {
      message = [fnId, msgId, params.length];
      params.forEach(param => {
        if (param instanceof BlePdlpParameter) {
          message.concat(param.toArray());
        }
      });
    } else {
      message = [fnId, msgId, 0];
    }
    let payload = header.concat(message);
    this.writeCharacteristic.write(payload);
    this.sequenceNumber++;
  }

  notifyFromServer(notifyName, params) {
    super.notifyFromServer(notifyName, params);
  }
}

module.exports = BleRemotePdlpDevice;
