/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleCharacteristic from "./bleCharacteristic";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
import BleLocalValueAttributeAbstract from "./bleLocalValueAttributeAbstract";
import BleService from "./bleService";
import { BleDescriptorDefine } from "./bleTypes";

/**
 * @category Use as Peripheral
 */
export default class BleDescriptor extends BleLocalValueAttributeAbstract<BleCharacteristic, null> {
  /**
   * Characteristic instance
   */
  public characteristic!: BleCharacteristic;

  // public permissions: any;

  /**
   * Create descriptor.
   *
   * ```javascript
   * await obniz.ble.initWait();
   * var descriptor = new obniz.ble.characteristic({
   *                     "uuid" : "2901",   //Characteristic User Description
   *                     "text" : "hello world characteristic",
   *                 });
   *
   *  var characteristic = new obniz.ble.characteristic({
   *                  "uuid" : "FFF1",
   *                  "text" : "Hi",
   *                  "descriptors" : [ descriptor ]
   *                });
   *
   * var service = new obniz.ble.service({
   *                "uuid" : "fff0",
   *                "characteristics" : [ characteristic ]
   * });
   * obniz.ble.peripheral.addService(service);
   *
   * ```
   *
   * @param obj
   */
  constructor(obj: BleDescriptorDefine) {
    super(obj);

    // this.permissions = obj.permissions || [];
    // if (!Array.isArray(this.permissions)) {
    //   this.permissions = [this.permissions];
    // }
  }

  /**
   * @ignore
   */
  get parentName(): string | null {
    return "characteristic";
  }

  // public addPermission(param: any) {
  //   if (!this.permissions.includes(param)) {
  //     this.permissions.push(param);
  //   }
  // }

  // public removePermission(param: any) {
  //   this.permissions = this.permissions.filter ((elm: any ) => {
  //     return elm !== param;
  //   });
  // }

  /**
   * @ignore
   */
  public toJSON() {
    const obj: any = super.toJSON();

    // if (this.permissions.length > 0) {
    //   obj.permissions = this.permissions;
    // }
    return obj;
  }
}
