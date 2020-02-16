/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleCharacteristic from "./bleCharacteristic";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
/**
 * @category Use as Peripheral
 */
export default class BleService extends BleLocalAttributeAbstract<null, BleCharacteristic> {
  public addCharacteristic: any;
  public addChild: any;
  public getCharacteristic: any;
  public getChild: any;
  public children: any;
  public uuid: any;
  public peripheral: any;

  constructor(obj: any) {
    super(obj);

    this.addCharacteristic = this.addChild;
    this.getCharacteristic = this.getChild;
  }

  get parentName(): string | null {
    return "peripheral";
  }

  get childrenName(): string | null {
    return "characteristics";
  }

  get childrenClass(): any {
    return BleCharacteristic;
  }

  get characteristics() {
    return this.children;
  }

  get advData() {
    return {
      flags: ["general_discoverable_mode", "br_edr_not_supported"],
      serviceUuids: [this.uuid],
    };
  }

  public end() {
    this.peripheral.removeService(this.uuid);
  }

  public emit(name: any, ...params: any): any {
  }

  public notify(notifyName: any, params: any) {
    // nothing
  }
}
