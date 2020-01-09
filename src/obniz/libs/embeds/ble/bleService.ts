import BleAttributeAbstract from "./bleAttributeAbstract";
import BleCharacteristic from "./bleCharacteristic";
import BleHelper from "./bleHelper";

class BleService extends BleAttributeAbstract {
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

  get parentName() {
    return "peripheral";
  }

  get childrenName() {
    return "characteristics";
  }

  get childrenClass() {
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

export default BleService;
