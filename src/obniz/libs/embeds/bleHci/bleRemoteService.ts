import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";

class BleRemoteService extends BleRemoteAttributeAbstract {
  public children: any;
  public addChild: any;
  public getChild: any;
  public discoverChildrenWait: any;
  public parent: any;
  public peripheral: any;
  public uuid: any;

  constructor(obj: any) {
    super(obj);
  }

  get parentName() {
    return "peripheral";
  }

  get childrenClass() {
    return BleRemoteCharacteristic;
  }

  get childrenName() {
    return "characteristics";
  }

  get characteristics() {
    return this.children;
  }

  public addCharacteristic(params: any) {
    return this.addChild(params);
  }

  public getCharacteristic(params: any) {
    return this.getChild(params);
  }

  public discoverAllCharacteristics() {
    return this.discoverChildren();
  }

  public discoverAllCharacteristicsWait() {
    return this.discoverChildrenWait();
  }

  public discoverChildren() {
    this.parent.obnizBle.centralBindings.discoverCharacteristics(
      this.peripheral.address,
      this.uuid,
    );
  }

  public ondiscover(characteristic: any) {
    this.ondiscovercharacteristic(characteristic);
  }

  public ondiscoverfinished(characteristics: any) {
    this.ondiscovercharacteristicfinished(characteristics);
  }

  public ondiscovercharacteristic() {
  }

  public ondiscovercharacteristicfinished() {
  }
}

export default BleRemoteService;
