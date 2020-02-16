/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleCharacteristic from "./bleCharacteristic";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
/**
 * @category Use as Peripheral
 */
export default class BleDescriptor extends BleLocalAttributeAbstract<BleCharacteristic, null> {
  public permissions: any;

  constructor(obj: any) {
    super(obj);

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName(): string | null {
    return "characteristic";
  }

  public addPermission(param: any) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  public removePermission(param: any) {
    this.permissions = this.permissions.filter ((elm: any ) => {
      return elm !== param;
    });
  }

  public toJSON() {
    const obj: any = super.toJSON();

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }
}
