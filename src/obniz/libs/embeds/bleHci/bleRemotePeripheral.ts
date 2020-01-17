import emitter = require("eventemitter3");
import BleHelper from "./bleHelper";
import BleRemoteService from "./bleRemoteService";

class BleRemotePeripheral {
  public obnizBle: any;
  public address: any;
  public connected: any;
  public device_type: any;
  public address_type: any;
  public ble_event_type: any;
  public rssi: any;
  public adv_data: any;
  public scan_resp: any;
  public keys: any;
  public _services: any;
  public emitter: any;
  public advertise_data_rows: any;
  public localName: any;
  public iBeacon: any;

  constructor(obnizBle: any, address: any) {
    this.obnizBle = obnizBle;
    this.address = address;
    this.connected = false;

    this.device_type = null;
    this.address_type = null;
    this.ble_event_type = null;
    this.rssi = null;
    this.adv_data = null;
    this.scan_resp = null;

    this.keys = [
      "device_type",
      "address_type",
      "ble_event_type",
      "rssi",
      "adv_data",
      "scan_resp",
    ];

    this._services = [];
    this.emitter = new emitter();
  }

  /**
   *
   * @return {String} json value
   */
  public toString() {
    return JSON.stringify({
      address: this.address,
      addressType: this.address_type,
      advertisement: this.adv_data,
      scanResponse: this.scan_resp,
      rssi: this.rssi,
    });
  }

  public setParams(dic: any) {
    this.advertise_data_rows = null;
    for (const key in dic) {
      if (dic.hasOwnProperty(key) && this.keys.includes(key)) {
        (this as any)[key] = dic[key];
      }
    }
    this.analyseAdvertisement();
  }

  public analyseAdvertisement() {
    if (!this.advertise_data_rows) {
      this.advertise_data_rows = [];
      if (this.adv_data) {
        for (let i = 0; i < this.adv_data.length; i++) {
          const length: any = this.adv_data[i];
          const arr: any = new Array(length);
          for (let j = 0; j < length; j++) {
            arr[j] = this.adv_data[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      if (this.scan_resp) {
        for (let i = 0; i < this.scan_resp.length; i++) {
          const length: any = this.scan_resp[i];
          const arr: any = new Array(length);
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

  public searchTypeVal(type: any) {
    this.analyseAdvertisement();
    for (let i = 0; i < this.advertise_data_rows.length; i++) {
      if (this.advertise_data_rows[i][0] === type) {
        const results: any = [].concat(this.advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  public setLocalName() {
    let data: any = this.searchTypeVal(0x09);
    if (!data) {
      data = this.searchTypeVal(0x08);
    }
    if (!data) {
      this.localName = null;
    } else {
      this.localName = String.fromCharCode.apply(null, data);
    }
  }

  public setIBeacon() {
    const data: any = this.searchTypeVal(0xff);
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
    const uuidData: any = data.slice(4, 20);
    let uuid: any = "";
    for (let i = 0; i < uuidData.length; i++) {
      uuid = uuid + ("00" + uuidData[i].toString(16)).slice(-2);
      if (
        i === 4 - 1 ||
        i === 4 + 2 - 1 ||
        i === 4 + 2 * 2 - 1 ||
        i === 4 + 2 * 3 - 1
      ) {
        uuid += "-";
      }
    }

    const major: any = (data[20] << 8) + data[21];
    const minor: any = (data[22] << 8) + data[23];
    const power: any = data[24];

    this.iBeacon = {
      uuid,
      major,
      minor,
      power,
      rssi: this.rssi,
    };
  }

  public _addServiceUuids(results: any, data: any, bit: any) {
    if (!data) {
      return;
    }
    const uuidLength: any = bit / 4;
    for (let i = 0; i < data.length; i = i + uuidLength) {
      const one: any = data.slice(i, i + uuidLength);
      results.push(this.obnizBle.constructor._dataArray2uuidHex(one, true));
    }
  }

  public advertisementServiceUuids() {
    const results: any = [];
    this._addServiceUuids(results, this.searchTypeVal(0x02), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x03), 16);
    this._addServiceUuids(results, this.searchTypeVal(0x04), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x05), 32);
    this._addServiceUuids(results, this.searchTypeVal(0x06), 64);
    this._addServiceUuids(results, this.searchTypeVal(0x07), 64);
    return results;
  }

  public connect() {
    this.obnizBle.scan.end();
    this.obnizBle.centralBindings.connect(this.address);
  }

  public connectWait() {
    return new Promise((resolve: any, reject: any) => {
      // if (this.connected) {
      //   resolve();
      //   return;
      // }
      this.emitter.once("statusupdate", (params: any ) => {
        if (params.status === "connected") {
          resolve(true); // for compatibility
        } else {
          reject(
            new Error(
              `connection to peripheral name=${this.localName} address=${
                this.address
              } can't be established`,
            ),
          );
        }
      });
      this.connect();
    });
  }

  public disconnect() {
    this.obnizBle.centralBindings.disconnect(this.address);
  }

  public disconnectWait() {
    return new Promise((resolve: any, reject: any) => {
      // if (!this.connected) {
      //   resolve();
      //   return;
      // }
      this.emitter.once("statusupdate", (params: any ) => {
        if (params.status === "disconnected") {
          resolve(true); // for compatibility
        } else {
          reject(
            new Error(
              `cutting connection to peripheral name=${
                this.localName
              } address=${this.address} was failed`,
            ),
          );
        }
      });
      this.disconnect();
    });
  }

  get services() {
    return this._services;
  }

  public getService(uuid: any) {
    uuid = BleHelper.uuidFilter(uuid);
    for (const key in this._services) {
      if (this._services[key].uuid === uuid) {
        return this._services[key];
      }
    }
    return undefined;
  }

  public findService(param: any) {
    const serviceUuid: any = BleHelper.uuidFilter(param.service_uuid);
    return this.getService(serviceUuid);
  }

  public findCharacteristic(param: any) {
    const serviceUuid: any = BleHelper.uuidFilter(param.service_uuid);
    const characteristicUuid: any = BleHelper.uuidFilter(param.characteristic_uuid);
    const s: any = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  public findDescriptor(param: any) {
    const descriptorUuid: any = BleHelper.uuidFilter(param.descriptor_uuid);
    const c: any = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
  }

  public discoverAllServices() {
    this.obnizBle.centralBindings.discoverServices(this.address);
  }

  public discoverAllServicesWait() {
    return new Promise ((resolve: any ) => {
      this.emitter.once("discoverfinished", () => {
        const children: any = this._services.filter ((elm: any ) => {
          return elm.discoverdOnRemote;
        });
        resolve(children);
      });
      this.discoverAllServices();
    });
  }

  public async discoverAllHandlesWait() {
    const ArrayFlat: any = (array: any, depth: any) => {
      const flattend: any = [];
      (function flat(_array: any, _depth: any) {
        for (const el of _array) {
          if (Array.isArray(el) && _depth > 0) {
            flat(el, _depth - 1);
          } else {
            flattend.push(el);
          }
        }
      })(array, Math.floor(depth) || 1);
      return flattend;
    };

    const services: any = await this.discoverAllServicesWait();
    const charsNest: any = await Promise.all(
      services.map((s: any) => s.discoverAllCharacteristicsWait()),
    );
    const chars: any = ArrayFlat(charsNest);
    const descriptorsNest: any = await Promise.all(
      chars.map((c: any) => c.discoverAllDescriptorsWait()),
    );

    // eslint-disable-next-line no-unused-vars
    const descriptors: any = ArrayFlat(descriptorsNest);
  }

  public onconnect() {
  }

  public ondisconnect() {
  }

  public ondiscoverservice(child: any) {
  }

  public ondiscoverservicefinished(children: any) {
  }

  public ondiscover() {
  }

  public ondiscoverfinished() {
  }

  public notifyFromServer(notifyName: any, params: any) {
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case "statusupdate": {
        if (params.status === "connected") {
          this.connected = true;
          this.onconnect();
        }
        if (params.status === "disconnected") {
          this.connected = false;
          this.ondisconnect();
        }
        break;
      }
      case "discover": {
        const uuid: any = params.service_uuid;
        let child: any = this.getService(uuid);
        if (!child) {
          const newService: any = new BleRemoteService({uuid});
          newService.parent = this;
          this._services.push(newService);
          child = newService;
        }
        child.discoverdOnRemote = true;
        this.ondiscoverservice(child);
        break;
      }
      case "discoverfinished": {
        const children: any = this._services.filter((elm: any) => {
          return elm.discoverdOnRemote;
        });
        this.ondiscoverservicefinished(children);
        break;
      }
    }
  }

  public onerror() {
  }
}

export default BleRemotePeripheral;
