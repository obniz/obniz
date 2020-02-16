/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";
/**
 * @category Use as Central
 */
export default class BleRemoteDescriptor extends BleRemoteAttributeAbstract<BleRemoteCharacteristic, null> {
  public characteristic: any;
  public uuid: any;

  constructor(params: any) {
    super(params);
  }

  get parentName(): string | null {
    return "characteristic";
  }

  public read() {
    this.characteristic.service.peripheral.obnizBle.centralBindings.readValue(
      this.characteristic.service.peripheral.address,
      this.characteristic.service.uuid,
      this.characteristic.uuid,
      this.uuid,
    );
  }

  public write(array: any) {
    this.characteristic.service.peripheral.obnizBle.centralBindings.writeValue(
      this.characteristic.service.peripheral.address,
      this.characteristic.service.uuid,
      this.characteristic.uuid,
      this.uuid,
      Buffer.from(array),
    );
  }
}
