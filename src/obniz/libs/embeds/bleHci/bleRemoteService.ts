/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleHelper from "./bleHelper";
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
import BleRemoteCharacteristic from "./bleRemoteCharacteristic";
import BleRemotePeripheral from "./bleRemotePeripheral";
import { UUID } from "./bleTypes";

/**
 * @category Use as Central
 */
export default class BleRemoteService extends BleRemoteAttributeAbstract<BleRemotePeripheral, BleRemoteCharacteristic> {
  /**
   * Peripheral instance
   */
  public peripheral!: BleRemotePeripheral;

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
    this.discoverAllCharacteristicsWait(); // background
  }

  /**
   * Discover services.
   *
   * If connect setting param 'autoDiscovery' is true(default),
   * services are automatically disvocer on connection established.
   *
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait({});
   * obniz.ble.scan.onfind = function(peripheral){
   * if(peripheral.localName == "my peripheral"){
   *      peripheral.onconnect = async function(){
   *          console.log("success");
   *          await peripheral.discoverAllServicesWait(); //manually discover
   *          let service = peripheral.getService("1800");
   *          await service.discoverAllCharacteristicsWait(); //manually discover
   *          let characteristics = service.getCharacteristic("ff00")
   *      }
   *      peripheral.connect({autoDiscovery:false});
   *     }
   * }
   * await obniz.ble.scan.startWait();
   * ```
   */
  public async discoverAllCharacteristicsWait(): Promise<BleRemoteCharacteristic[]> {
    const chars = await this.parent!.obnizBle.centralBindings.discoverCharacteristicsWait(
      this.peripheral.address,
      this.uuid,
    );

    for (const char of chars) {
      const uuid = char.uuid;
      const properties = char.properties.map((e: any) => BleHelper.toSnakeCase(e));
      let child: any = this.getChild(uuid);
      if (!child) {
        child = this.addChild({ uuid });
      }
      child.discoverdOnRemote = true;
      child.properties = properties || [];
      this.ondiscover(child);
    }
    return this.characteristics.filter((elm: any) => {
      return elm.discoverdOnRemote;
    });
  }

  /**
   * @ignore
   * @param characteristic
   */
  public ondiscover(characteristic: any) {
    this._runUserCreatedFunction(this.ondiscovercharacteristic, characteristic);
  }

  /**
   * @ignore
   * @param characteristics
   */
  public ondiscoverfinished(characteristics: any) {
    this._runUserCreatedFunction(this.ondiscovercharacteristicfinished, characteristics);
  }

  /**
   * @ignore
   * @param characteristic
   */
  public ondiscovercharacteristic(characteristic: any) {}

  /**
   * @ignore
   * @param characteristics
   */
  public ondiscovercharacteristicfinished(characteristics: any[]) {}

  /**
   * @ignore
   */
  public async readWait(): Promise<number[]> {
    throw new Error("cannot read service");
  }

  /**
   * @ignore
   */
  public async writeWait(): Promise<boolean> {
    throw new Error("cannot write service");
  }
}
