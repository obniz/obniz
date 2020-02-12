/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
import BleCharacteristic from "./bleCharacteristic";
import BleHelper from "./bleHelper";
/**
 * @category Use as Peripheral
 */
export default class BleService extends BleAttributeAbstract {
  public addCharacteristic: any;
  public addChild: any;
  public getCharacteristic: any;
  public getChild: any;
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

  get advData() {
    return {
      flags: ["general_discoverable_mode", "br_edr_not_supported"],
      serviceUuids: [this.uuid],
    };
  }

  public end() {
    this.peripheral.Obniz.send({
      ble: {
        peripheral: {
          stop_service: {
            service_uuid: BleHelper.uuidFilter(this.uuid),
          },
        },
      },
    });
    this.peripheral.removeService(this.uuid);
  }

  public notify(notifyName: any, params: any) {
    // nothing
  }
}
