/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";
import BleRemotePeripheral from "./bleRemotePeripheral";
import {UUID} from "./bleTypes";

/**
 * @category Use as Central
 */
export default class BleRemoteService extends BleRemoteAttributeAbstract<BleRemotePeripheral, BleRemoteCharacteristic> {
  protected peripheral!: BleRemotePeripheral;

  constructor(obj: any) {
    super(obj);
  }

  /**
   * @ignore
   */
  get parentName(): string | null {
    return "peripheral";
  }

  /**
   * @ignore
   */
  get childrenClass(): any {
    return BleRemoteCharacteristic;
  }

  /**
   * @ignore
   */
  get childrenName(): string | null {
    return "characteristics";
  }

  /**
   * It contains characteristics in a service.
   * It was discovered when connection automatically.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *     uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   *  if(!peripheral) {
   *     console.log('no such peripheral')
   *     return;
   * }
   * try {
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   var service = peripheral.getService("1800")
   *   for (var c of service.characteristics) {
   *     console.log(c.uuid)
   *   }
   * } catch(e) {
   *   console.error(e);
   * }
   * ```
   */
  get characteristics(): BleRemoteCharacteristic[] {
    return this.children;
  }

  /**
   * @ignore
   * @param param
   */
  public addCharacteristic(param: { uuid: UUID } | BleRemoteCharacteristic) {
    return this.addChild(param);
  }

  /**
   * It returns a characteristic which having specified uuid in a service.
   * Return value is null when not matched.
   *
   * Case is ignored. So aa00 and AA00 are the same.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(!peripheral) {
   *    console.log('no such peripheral')
   *     return;
   * }
   * try {
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   var service = peripheral.getService("1800")
   *   var c = service.getCharacteristic("fff0")
   *   console.log(c.uuid)
   * } catch(e) {
   *   console.error(e);
   * }
   * ```
   * @param uuid
   */
  public getCharacteristic(uuid: UUID): BleRemoteCharacteristic | null {
    return this.getChild(uuid);
  }

  /**
   * @ignore
   */
  public discoverAllCharacteristics() {
    return this.discoverChildren();
  }

  /**
   * @ignore
   */
  public discoverAllCharacteristicsWait() {
    return this.discoverChildrenWait();
  }

  /**
   * @ignore
   */
  public discoverChildren() {
    this.parent!.obnizBle.centralBindings.discoverCharacteristics(
      this.peripheral.address,
      this.uuid,
    );
  }

  /**
   * @ignore
   * @param characteristic
   */
  public ondiscover(characteristic: any) {
    this.ondiscovercharacteristic(characteristic);
  }

  /**
   * @ignore
   * @param characteristics
   */
  public ondiscoverfinished(characteristics: any) {
    this.ondiscovercharacteristicfinished(characteristics);
  }

  /**
   * @ignore
   * @param characteristic
   */
  public ondiscovercharacteristic(characteristic: any) {
  }

  /**
   * @ignore
   * @param characteristics
   */
  public ondiscovercharacteristicfinished(characteristics: any[]) {
  }
}
