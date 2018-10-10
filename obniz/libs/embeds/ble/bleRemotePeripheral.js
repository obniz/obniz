const BleRemoteService = require('./bleRemoteService');
const emitter = require('eventemitter3');
const BleHelper = require('./bleHelper');

class BleRemotePeripheral {
  constructor(Obniz, address) {
    this.Obniz = Obniz;
    this.address = address;
    this.connected = false;

    this.device_type = null;
    this.address_type = null;
    this.ble_event_type = null;
    this.rssi = null;
    this.adv_data = null;
    this.scan_resp = null;

    this.keys = [
      'device_type',
      'address_type',
      'ble_event_type',
      'rssi',
      'adv_data',
      'scan_resp',
    ];

    this.services = [];
    this.emitter = new emitter();
  }

  /**
   *
   * @return {String} json value
   */
  toString() {
    return JSON.stringify({
      address: this.address,
      addressType: this.address_type,
      advertisement: this.adv_data,
      scanResponse: this.scan_resp,
      rssi: this.rssi,
    });
  }

  setParams(dic) {
    this.advertise_data_rows = null;
    for (let key in dic) {
      if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
        this[key] = dic[key];
      }
    }
    this.analyseAdvertisement();
  }

  analyseAdvertisement() {
    if (!this.advertise_data_rows) {
      this.advertise_data_rows = [];
      if (this.adv_data) {
        for (let i = 0; i < this.adv_data.length; i++) {
          let length = this.adv_data[i];
          let arr = new Array(length);
          for (let j = 0; j < length; j++) {
            arr[j] = this.adv_data[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      if (this.scan_resp) {
        for (let i = 0; i < this.scan_resp.length; i++) {
          let length = this.scan_resp[i];
          let arr = new Array(length);
          for (let j = 0; j < length; j++) {
            arr[j] = this.scan_resp[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      this.setLocalName();
      this.setIBeacon();
    }
  }

  searchTypeVal(type) {
    this.analyseAdvertisement();
    for (let i = 0; i < this.advertise_data_rows.length; i++) {
      if (this.advertise_data_rows[i][0] === type) {
        let results = [].concat(this.advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  setLocalName() {
    let data = this.searchTypeVal(0x09);
    if (!data) {
      data = this.searchTypeVal(0x08);
    }
    if (!data) {
      this.localName = null;
    } else {
      this.localName = String.fromCharCode.apply(null, data);
    }
  }

  setIBeacon() {
    let data = this.searchTypeVal(0xff);
    if (
      !data ||
      data[0] !== 0x4c ||
      data[1] !== 0x00 ||
      data[2] !== 0x02 ||
      data[3] !== 0x15 ||
      data.length !== 25
    ) {
      this.iBeacon = null;
      return;
    }
    let uuidData = data.slice(4, 20);
    let uuid = '';
    for (let i = 0; i < uuidData.length; i++) {
      uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
      if (
        i === 4 - 1 ||
        i === 4 + 2 - 1 ||
        i === 4 + 2 * 2 - 1 ||
        i === 4 + 2 * 3 - 1
      ) {
        uuid += '-';
      }
    }

    let major = (data[20] << 8) + data[21];
    let minor = (data[22] << 8) + data[23];
    let power = data[24];

    this.iBeacon = {
      uuid: uuid,
      major: major,
      minor: minor,
      power: power,
      rssi: this.rssi,
    };
  }

  _addServiceUuids(results, data, bit) {
    if (!data) return;
    let uuidLength = bit / 4;
    for (let i = 0; i < data.length; i = i + uuidLength) {
      let one = data.slice(i, i + uuidLength);
      results.push(this.Obniz.ble.constructor._dataArray2uuidHex(one, true));
    }
  }

  advertisementServiceUuids() {
    let results = [];
    this._addServiceUuids(results, this.searchTypeVal(0x02), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x03), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x04), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x05), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x06), 64);
    this._addServiceUuids(results, this.searchTypeVal(0x07), 64);
    return results;
  }

  connect() {
    let obj = {
      ble: {
        connect: {
          address: this.address,
        },
      },
    };
    this.Obniz.send(obj);
  }

  connectWait() {
    return new Promise(resolve => {
      this.emitter.once('statusupdate', params => {
        resolve(params.status === 'connected');
      });
      this.connect();
    });
  }

  disconnect() {
    let obj = {
      ble: {
        disconnect: {
          address: this.address,
        },
      },
    };
    this.Obniz.send(obj);
  }

  disconnectWait() {
    return new Promise(resolve => {
      this.emitter.once('statusupdate', params => {
        resolve(params.status === 'disconnected');
      });
      this.disconnect();
    });
  }

  getService(uuid) {
    uuid = BleHelper.uuidFilter(uuid);
    for (let key in this.services) {
      if (this.services[key].uuid === uuid) {
        return this.services[key];
      }
    }
    let newService = new BleRemoteService({ uuid });
    newService.parent = this;
    this.services.push(newService);
    return newService;
  }

  findService(param) {
    let serviceUuid = BleHelper.uuidFilter(param.service_uuid);
    return this.getService(serviceUuid);
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

  discoverAllServices() {
    let obj = {
      ble: {
        get_services: {
          address: this.address,
        },
      },
    };
    this.Obniz.send(obj);
  }

  discoverAllServicesWait() {
    return new Promise(resolve => {
      this.emitter.once('discoverfinished', () => {
        let children = this.services.filter(elm => {
          return elm.discoverdOnRemote;
        });
        resolve(children);
      });
      this.discoverAllServices();
    });
  }

  onconnect() {}

  ondisconnect() {}

  ondiscoverservice() {}

  ondiscoverservicefinished() {}

  ondiscover() {}

  ondiscoverfinished() {}

  notifyFromServer(notifyName, params) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case 'statusupdate': {
        if (params.status === 'connected') {
          this.connected = true;
          this.onconnect();
        }
        if (params.status === 'disconnected') {
          this.connected = false;
          this.ondisconnect();
        }
        break;
      }
      case 'discover': {
        let child = this.getService(params.service_uuid);
        child.discoverdOnRemote = true;
        this.ondiscoverservice(child);
        break;
      }
      case 'discoverfinished': {
        let children = this.services.filter(elm => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverservicefinished(children);
        break;
      }
    }
  }

  onerror() {}
}

module.exports = BleRemotePeripheral;
