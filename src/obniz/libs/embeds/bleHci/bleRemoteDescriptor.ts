/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";
import BleRemoteValueAttributeAbstract from "./bleRemoteValueAttributeAbstract";

/**
 * @category Use as Central
 */
export default class BleRemoteDescriptor extends BleRemoteValueAttributeAbstract<BleRemoteCharacteristic, null> {
  public characteristic!: BleRemoteCharacteristic;

  constructor(params: any) {
    super(params);
  }

  /**
   * @ignore
   */
  get parentName(): string | null {
    return "characteristic";
  }

  /**
   * Read data from descriptor.
   *
   * The return value appears in the callback function [[onread]].
   * If reading succeeds an Array with data will be returned.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
   *   console.log(dataArray);
   * }
   * ```
   *
   */
  public async readWait(): Promise<number[]> {
    const buf = await this.characteristic.service.peripheral.obnizBle.centralBindings.readValueWait(
      this.characteristic.service.peripheral.address,
      this.characteristic.service.uuid,
      this.characteristic.uuid,
      this.uuid,
    );
    const data = Array.from(buf);
    this._runUserCreatedFunction(this.onread, data);
    return data;
  }

  /**
   * This writes dataArray to descriptor.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral){
   *   await peripheral.connectWait();
   *   console.log("connected");
   *   await obniz.wait(1000);
   *
   *   var dataArray = [0x02, 0xFF];
   *   await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
   *   console.log("write success");
   * }
   * ```
   *
   * @param data
   */
  public async writeWait(data: number[]): Promise<boolean> {
    await this.characteristic.service.peripheral.obnizBle.centralBindings.writeValueWait(
      this.characteristic.service.peripheral.address,
      this.characteristic.service.uuid,
      this.characteristic.uuid,
      this.uuid,
      Buffer.from(data),
    );
    this._runUserCreatedFunction(this.onwrite, "success");
    return true;
  }

  /**
   * @ignore
   */
  public ondiscover(child: any): void {}

  /**
   * @ignore
   * @param children
   */
  public ondiscoverfinished(children: any): void {}
}
