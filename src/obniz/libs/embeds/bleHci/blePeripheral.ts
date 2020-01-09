import BleHelper from "./bleHelper";
import BleService from "./bleService";

class BlePeripheral {
  public obnizBle: any;
  public _services: any;
  public currentConnectedDeviceAddress: any;

  constructor(obnizBle: any) {
    this.obnizBle = obnizBle;
    this._services = [];
    this.currentConnectedDeviceAddress = null;
  }

  public _updateServices() {
    const bufData: any = this._services.map((e) => e.toBufferObj());
    this.obnizBle.peripheralBindings.setServices(bufData);
  }

  public addService(obj: any) {
    this.obnizBle.warningIfNotInitialize();
    if (!(obj instanceof BleService)) {
      obj = new BleService(obj);
    }
    this._services.push(obj);
    obj.peripheral = this;

    this._updateServices();
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
      .filter((element) => {
        return BleHelper.uuidFilter(element.uuid) === uuid;
      })
      .shift();
  }

  public removeService(uuid: any) {
    this._services = this._services.filter((element) => {
      return BleHelper.uuidFilter(element.uuid) !== uuid;
    });

    this._updateServices();
  }

  public stopAllService() {
    this._services = [];
    this._updateServices();
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
    this.stopAllService();
  }

  public onconnectionupdates() {
  }

  public onerror() {
  }
}

export default BlePeripheral;
