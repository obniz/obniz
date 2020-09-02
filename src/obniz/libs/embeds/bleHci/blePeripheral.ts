/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { ObnizOfflineError } from "../../../ObnizError";
import ObnizBLE from "./ble";
import BleHelper from "./bleHelper";
import BleService from "./bleService";
import { BleDeviceAddress, BleServiceDefine, UUID } from "./bleTypes";

export type BleConnectionState = "connected" | "disconnected";

export interface BleConnectionUpdateParam {
  address: BleDeviceAddress;
  status: BleConnectionState;
  reason?: string | Error;
}

/**
 * @category Use as Peripheral
 */
export default class BlePeripheral {
  /**
   * Current connected device address
   */
  public currentConnectedDeviceAddress: BleDeviceAddress | null;

  /**
   * This is a callback function used when an external device gets connected or disconnected.
   *
   * ```javascript
   * await obniz.ble.initWait();
   * obniz.ble.peripheral.onconnectionupdates = function(data){
   *   console.log("remote device ", data.address, data.status)
   * };
   * ```
   *
   */
  public onconnectionupdates?: (param: BleConnectionUpdateParam) => void;
  private obnizBle: ObnizBLE;
  private _services: BleService[];

  constructor(obnizBle: ObnizBLE) {
    this.obnizBle = obnizBle;
    this._services = [];
    this.currentConnectedDeviceAddress = null;
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    if (this.currentConnectedDeviceAddress) {
      const address = this.currentConnectedDeviceAddress;
      this.currentConnectedDeviceAddress = null;
      this.obnizBle.Obniz._runUserCreatedFunction(this.onconnectionupdates, {
        address,
        status: "disconnected",
        reason: new ObnizOfflineError(),
      });
    }
  }

  /**
   * @ignore
   * @private
   */
  public _updateServices() {
    const bufData = this._services.map((e) => e.toBufferObj());
    this.obnizBle.peripheralBindings.setServices(bufData);
  }

  /**
   * This starts a service as peripheral.
   *
   *
   * ```javascript
   *
   * await obniz.ble.initWait();
   * // Service without characteristics
   * var service1 = new obniz.ble.service({"uuid" : "fff0"});
   * obniz.ble.peripheral.addService(service1);
   *
   * // Service with characteristics/descriptor
   * var service2 = new obniz.ble.service({"uuid" : "fff0"});
   * var characteristic = new obniz.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
   * var descriptor = new obniz.ble.descriptor({"uuid" : "2901", "text" : "hello world characteristic"});
   *
   * service2.addCharacteristic(characteristic);
   * characteristic.addDescriptor(descriptor);
   *
   * obniz.ble.peripheral.addService(service2); // call this after all descriptors and characteristics added to service.
   * ```
   *
   * @param service
   */
  public addService(service: BleServiceDefine | BleService) {
    this.obnizBle.warningIfNotInitialize();
    if (!(service instanceof BleService)) {
      service = new BleService(service);
    }
    this._services.push(service as BleService);
    (service as BleService).peripheral = this;

    this._updateServices();
  }
  /**
   * @ignore
   * @private
   * @param json
   */
  public setJson(json: any) {
    if (json.services) {
      for (const service of json.services) {
        this.addService(service);
      }
    }
  }

  /**
   * Get service by UUID
   * @param uuid
   */
  public getService(uuid: UUID): BleService | null {
    uuid = BleHelper.uuidFilter(uuid);
    const result = this._services
      .filter((element: any) => {
        return BleHelper.uuidFilter(element.uuid) === uuid;
      })
      .shift();

    if (!result) {
      return null;
    }
    return result;
  }

  /**
   * Terminate service by UUID
   * @param uuid
   */
  public removeService(uuid: UUID) {
    this._services = this._services.filter((element: any) => {
      return BleHelper.uuidFilter(element.uuid) !== uuid;
    });

    this._updateServices();
  }

  /**
   * @ignore
   */
  public stopAllService() {
    this._services = [];
    this._updateServices();
  }

  /**
   * @ignore
   */
  public toJSON() {
    return {
      services: this._services,
    };
  }

  /**
   * @ignore
   * @param param
   */
  public findCharacteristic(param: any) {
    const serviceUuid: any = BleHelper.uuidFilter(param.service_uuid);
    const characteristicUuid: any = BleHelper.uuidFilter(param.characteristic_uuid);
    const s: any = this.getService(serviceUuid);
    if (s) {
      return s.getCharacteristic(characteristicUuid);
    }
    return null;
  }

  /**
   * @ignore
   * @param param
   */
  public findDescriptor(param: any) {
    const descriptorUuid: any = BleHelper.uuidFilter(param.descriptor_uuid);
    const c: any = this.findCharacteristic(param);
    if (c) {
      return c.getDescriptor(descriptorUuid);
    }
    return null;
  }

  /**
   * This ends all the peripheral service
   *
   * ```javascript
   * obniz.ble.peripheral.addService(setting);
   * obniz.ble.peripheral.end();
   * ```
   */
  public end() {
    this.stopAllService();
  }

  /**
   * @ignore
   * @param error
   */
  public onerror(error: any) {}
}
