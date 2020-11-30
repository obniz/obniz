/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
import BleCharacteristic from "./bleCharacteristic";
import BleHelper from "./bleHelper";
import BleService from "./bleService";

/**
 * @ignore
 */
enum BleResponseResult {
  SUCCESS = 0x00,
  INVALID_OFFSET = 0x07,
  ATTR_NOT_LONG = 0x0b,
  INVALID_ATTRIBUTE_LENGTH = 0x0d,
  UNLIKELY_ERROR = 0x0e,
}

/**
 * @category Use as Peripheral
 */
export default class BleLocalAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<
  ParentClass,
  ChildrenClass
> {
  /**
   * @ignore
   */
  protected characteristic!: BleCharacteristic;

  /**
   * @ignore
   */
  protected service!: BleService;

  constructor(params: any) {
    super(params);
  }

  /**
   * @ignore
   */
  public toBufferObj() {
    const obj: any = {
      uuid: BleHelper.uuidFilter(this.uuid),
      emit: this.emit.bind(this),
    };

    if (this.childrenName) {
      const key = this.childrenName;
      obj[key] = this.children.map((e: any) => e.toBufferObj());
    }

    return obj;
  }

  /**
   * @ignore
   * @param name
   * @param params
   */
  public emit(name: any, ...params: any) {
    switch (name) {
      case "readRequest":
        this._onReadRequest(...(params as [any, any]));
        return true;
      case "writeRequest":
        this._onWriteRequest(...(params as [any, any]));
        return true;
    }
    return false;
  }

  /**
   * @ignore
   * @param offset
   * @param callback
   * @private
   */
  public _onReadRequest(offset: any, callback?: any) {
    if (this.data.length >= offset) {
      callback(BleResponseResult.SUCCESS, Buffer.from(this.data.slice(offset)));
      let address: any = null;
      if (this.parentName === "characteristic") {
        address = this.characteristic!.service.peripheral.currentConnectedDeviceAddress;
      } else if (this.parentName === "service") {
        address = this.service!.peripheral.currentConnectedDeviceAddress;
      }
      this.notifyFromServer("onreadfromremote", { address });
    } else {
      callback(BleResponseResult.UNLIKELY_ERROR, null);
    }
  }

  /**
   * @ignore
   * @param data
   * @param offset
   * @param withoutResponse
   * @param callback
   * @private
   */
  public _onWriteRequest(data: any, offset?: any, withoutResponse?: any, callback?: any) {
    // console.log('onWriteRequest');
    this.data = Array.from(data);
    callback(BleResponseResult.SUCCESS);
    let address: any = null;
    if (this.parentName === "characteristic") {
      address = this.characteristic.service.peripheral.currentConnectedDeviceAddress;
    } else if (this.parentName === "service") {
      address = this.service.peripheral.currentConnectedDeviceAddress;
    }
    this.notifyFromServer("onwritefromremote", { address, data });
  }

  /**
   * @ignore
   * @param dataArray
   */
  public async writeWait(dataArray: number[]): Promise<boolean> {
    this.data = dataArray;
    this.notifyFromServer("onwrite", { result: "success" });
    return true;
  }

  /**
   * @ignore
   * @param dataArray
   */
  public async readWait(): Promise<number[]> {
    this.notifyFromServer("onread", { data: this.data });
    return this.data;
  }
}
