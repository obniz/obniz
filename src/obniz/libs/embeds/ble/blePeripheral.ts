/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleHelper from "./bleHelper";
import BleService from "./bleService";

/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Peripheral
 */
export default class BlePeripheral {
  public Obniz: any;
  public _services: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this._services = [];
  }

  get services() {
    return this._services;
  }

  public addService(obj: any) {
    if (!(obj instanceof BleService)) {
      obj = new BleService(obj);
    }
    this._services.push(obj);
    obj.peripheral = this;
    this.Obniz.send({ ble: { peripheral: { services: [obj] } } });
  }

  public setJson(json: any) {
    if (json.services) {
      for (const service of json.services) {
        this.addService(service);
      }
    }
  }

  public getService(uuid: any) {
    uuid = BleHelper.uuidFilter(uuid);
    return this._services
      .filter((element: any) => {
        return BleHelper.uuidFilter(element.uuid) === uuid;
      })
      .shift();
  }

  public removeService(uuid: any) {
    this._services = this._services.filter((element: any) => {
      return BleHelper.uuidFilter(element.uuid) !== uuid;
    });
  }

  public stopAllService() {
    this.Obniz.send({
      ble: {
        peripheral: null,
      },
    });
    this._services = [];
  }

  public toJSON() {
    return {
      services: this._services,
    };
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

  public end() {
    this.Obniz.send({ ble: { peripheral: null } });
  }

  public onconnectionupdates() {}

  public onerror() {}
}
