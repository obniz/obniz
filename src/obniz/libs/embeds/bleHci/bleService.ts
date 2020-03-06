/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleCharacteristic from "./bleCharacteristic";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
import BlePeripheral from "./blePeripheral";
import { BleCharacteristicDefine, BleServiceDefine, UUID } from "./bleTypes";

/**
 * @category Use as Peripheral
 */
export default class BleService extends BleLocalAttributeAbstract<null, BleCharacteristic> {
  /**
   * Peripheral instance.
   *
   * This is same as obniz.ble.peripheral
   */
  public peripheral!: BlePeripheral;

  constructor(obj: BleServiceDefine) {
    super(obj);

    this.addCharacteristic = this.addChild;
    this.getCharacteristic = this.getChild;
  }

  /**
   * Add new Characteristic
   * @param child
   */
  public addCharacteristic(child: BleCharacteristicDefine | BleCharacteristic): BleCharacteristic {
    return this.addChild(child);
  }

  /**
   * Get Characteristic
   * @param uuid
   */
  public getCharacteristic(uuid: UUID): BleCharacteristic | null {
    return this.getChild(uuid);
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
  get childrenName(): string | null {
    return "characteristics";
  }

  /**
   * @ignore
   */
  get childrenClass(): any {
    return BleCharacteristic;
  }

  get characteristics() {
    return this.children;
  }

  /**
   * advertisment object for [[BleAdvertisement.setAdvData]]
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * var service = new obniz.ble.service({ uuid : "1234" });
   * var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
   * service.addCharacteristic(characteristic);
   * obniz.ble.peripheral.addService(service);
   *
   * obniz.ble.advertisement.setAdvData(service.advData);
   * obniz.ble.advertisement.setScanRespData({
   *    localName : "obniz BLE",
   * });
   * obniz.ble.advertisement.start();
   * ```
   */
  get advData() {
    return {
      flags: ["general_discoverable_mode", "br_edr_not_supported"],
      serviceUuids: [this.uuid],
    };
  }

  /**
   * Terminate created service
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * var service = new obniz.ble.service({ uuid : "1234" });
   * var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
   * service.addCharacteristic(characteristic);
   * obniz.ble.peripheral.addService(service);
   *
   * service.end();
   * ```
   */
  public end() {
    this.peripheral.removeService(this.uuid);
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notify(notifyName: any, params: any) {
    // nothing
  }
}
