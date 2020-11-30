/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleCharacteristic from "./bleCharacteristic";
import BleHelper from "./bleHelper";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
import BleService from "./bleService";

/**
 * @category Use as Peripheral
 */
export default class BleLocalValueAttributeAbstract<ParentClass, ChildrenClass> extends BleLocalAttributeAbstract<
  ParentClass,
  ChildrenClass
> {
  constructor(params: any) {
    super(params);
  }

  /**
   * This writes dataArray.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * await attr.writeWait([0xf0,0x27]);
   * console.log("write success");
   * ```
   *
   * @param data
   */
  public async writeWait(data: any): Promise<boolean> {
    this.data = data;
    this.notifyFromServer("onwrite", { result: "success" });
    return true;
  }

  /**
   * It reads data.
   *
   * Even you wrote string or number, it returns binary array.
   * It throws an error when failed.
   *
   * ```javascript
   * // Javascript Example
   * let data =  await attr.readWait()
   *  console.log("data: " , data );
   * ```
   */
  public async readWait(): Promise<number[]> {
    this.notifyFromServer("onread", { data: this.data });
    return this.data;
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: any, params: any) {
    super.notifyFromServer(notifyName, params);
    this.emitter.emit(notifyName, params);
    switch (notifyName) {
      case "onwritefromremote": {
        this._runUserCreatedFunction(this.onwritefromremote, params.address, params.data);
        break;
      }
      case "onreadfromremote": {
        this._runUserCreatedFunction(this.onreadfromremote, params.address);
        break;
      }
    }
  }
}
