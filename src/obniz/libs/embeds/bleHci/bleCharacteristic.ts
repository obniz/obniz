/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleDescriptor from "./bleDescriptor";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
import BleLocalValueAttributeAbstract from "./bleLocalValueAttributeAbstract";
import BleRemoteService from "./bleRemoteService";
import BleService from "./bleService";
import { BleAttributePropery, BleCharacteristicDefine, BleDescriptorDefine, BleDeviceAddress, UUID } from "./bleTypes";

/**
 * @category Use as Peripheral
 */
export default class BleCharacteristic extends BleLocalValueAttributeAbstract<BleService, BleDescriptor> {
  /**
   * This is a callback function used when characteristic is read by an external device.
   *
   * ```javascript
   * characteristic.onwritefromremote = function(address, newvalue){
   *    console.log("remote address :",address);
   *    console.log("remote data :",newvalue);
   * }
   * ```
   *
   * @param onwritefromremote.address central device address
   * @param onwritefromremote.data written data
   */
  public onwritefromremote?: (address: BleDeviceAddress, data: number[]) => void;

  /**
   * This is a callback function used when characteristic is read by an external device.
   *
   * ```javascript
   * characteristic.onreadfromremote = function(address){
   *   console.log("remote address :",address);
   * }
   * ```
   *
   * @param onreadfromremote.address central device address
   */
  public onreadfromremote?: (address: BleDeviceAddress) => void;

  /**
   * @ignore
   */
  get parentName(): string | null {
    return "service";
  }

  /**
   * @ignore
   */
  get childrenClass(): any {
    return BleDescriptor;
  }

  /**
   * @ignore
   */
  get childrenName(): string | null {
    return "descriptors";
  }

  /**
   * Service instance
   */
  public service!: BleService;

  /**
   * Get descriptor array
   */
  get descriptors(): BleDescriptor[] {
    return this.children;
  }

  /**
   * @ignore
   */
  public properties: BleAttributePropery[];
  // public permissions: any;
  private _maxValueSize: any;
  private _updateValueCallback: any;

  /**
   * Create Characteristics
   *
   * ```javascript
   * await obniz.ble.initWait();
   * var characteristic = new obniz.ble.characteristic({
   *      "uuid" : "FFF1",
   *      "properties" : ["read","write"],  // read, write, notify
   *      "data" : [0x0e, 0x00, ...],     //data for dataArray or  text for string
   *      "descriptors" : [{
   *          "uuid" : "2901",   //Characteristic User Description
   *          "text" : "hello world characteristic",    //data for dataArray or  text for string
   *      }]
   * });
   *
   * var service = new obniz.ble.service({
   *                "uuid" : "fff0",
   *                "characteristics" : [ characteristic ]
   * });
   * obniz.ble.peripheral.addService(service);
   * ```
   *
   * @param obj
   */
  constructor(obj: BleCharacteristicDefine) {
    super(obj);

    this._maxValueSize = null;
    this._updateValueCallback = null;

    if (!Array.isArray(obj.properties) && typeof obj.properties === "string") {
      this.properties = [obj.properties as BleAttributePropery];
    } else {
      this.properties = obj.properties || [];
    }
  }

  /**
   * Add new descriptor
   * @param desc
   */
  public addDescriptor(desc: BleDescriptorDefine | BleDescriptor): BleDescriptor {
    return this.addChild(desc);
  }

  /**
   * Get descriptor
   * @param uuid
   */
  public getDescriptor(uuid: UUID): BleDescriptor | null {
    return this.getChild(uuid);
  }

  /**
   * @ignore
   */
  public toJSON() {
    const obj: any = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }

    // if (this.permissions.length > 0) {
    //   obj.permissions = this.permissions;
    // }
    return obj;
  }

  /**
   * @ignore
   */
  public toBufferObj() {
    const obj: any = super.toBufferObj();

    obj.properties = this.properties;
    obj.secure = [];

    return obj;
  }

  /**
   * Add property
   * @param param
   */
  public addProperty(param: BleAttributePropery) {
    if (!this.properties.includes(param)) {
      this.properties.push(param);
    }
  }

  /**
   * Remove property
   * @param param
   */
  public removeProperty(param: BleAttributePropery) {
    this.properties = this.properties.filter((elm: any) => {
      return elm !== param;
    });
  }

  /**
   * @ignore
   * @param param
   */
  public addPermission(param: any) {}

  /**
   * @ignore
   * @param param
   */
  public removePermission(param: any) {}

  /**
   * @ignore
   * @param name
   * @param params
   */
  public emit(name: any, ...params: any) {
    const result: any = super.emit(name, ...params);
    if (result) {
      return result;
    }
    switch (name) {
      case "subscribe":
        this._onSubscribe(...(params as [any, any]));
        return true;
      case "unsubscribe":
        this._onUnsubscribe();
        return true;
      case "notify":
        this._onNotify();
        return true;
      case "indicate":
        this._onIndicate();
        return true;
      default:
        throw new Error("unknown emit");
    }
  }

  /**
   * @ignore
   * @param maxValueSize
   * @param updateValueCallback
   * @private
   */
  public _onSubscribe(maxValueSize: any, updateValueCallback?: any) {
    // console.log('_onSubscribe');
    this._maxValueSize = maxValueSize;
    this._updateValueCallback = updateValueCallback;
  }

  /**
   * @ignore
   * @private
   */
  public _onUnsubscribe() {
    this._maxValueSize = null;
    this._updateValueCallback = null;
  }

  /**
   * @ignore
   * @private
   */
  public _onNotify() {}

  /**
   * @ignore
   * @private
   */
  public _onIndicate() {}

  /**
   * This sends notify to the connected central.
   *
   * ```javascript
   * var characteristic = new obniz.ble.characteristic({
   *   uuid: 'FFF1',
   *   data: [0x0e, 0x00],
   *   properties : ["read","write","notify"],  // add notify properties
   * });
   *
   *  var service = new obniz.ble.service({
   *   uuid: 'FFF0',
   *   characteristics: [characteristic],
   * });
   * obniz.ble.peripheral.addService(service);
   *
   *
   * // after central connected
   * characteristic.notify();
   * ```
   */
  public notify() {
    if (this._updateValueCallback) {
      this._updateValueCallback(Buffer.from(this.data));
    }
  }
}
