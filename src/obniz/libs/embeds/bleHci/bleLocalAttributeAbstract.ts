/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
import BleHelper from "./bleHelper";
/**
 * @category Use as Peripheral
 */
export default class BleLocalAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<ParentClass, ChildrenClass> {
  public RESULT_SUCCESS: any;
  public RESULT_INVALID_OFFSET: any;
  public RESULT_ATTR_NOT_LONG: any;
  public RESULT_INVALID_ATTRIBUTE_LENGTH: any;
  public RESULT_UNLIKELY_ERROR: any;
  public uuid: any;
  public childrenName: any;
  public children: any;
  public data: any;
  public parentName: any;
  public characteristic: any;
  public service: any;
  public notifyFromServer: any;

  constructor(params: any) {
    super(params);

    this.RESULT_SUCCESS = 0x00;
    this.RESULT_INVALID_OFFSET = 0x07;
    this.RESULT_ATTR_NOT_LONG = 0x0b;
    this.RESULT_INVALID_ATTRIBUTE_LENGTH = 0x0d;
    this.RESULT_UNLIKELY_ERROR = 0x0e;
  }

  public toBufferObj() {
    const obj: any = {
      uuid: BleHelper.uuidFilter(this.uuid),
    };

    if (this.childrenName) {
      const key: any = this.childrenName;
      obj[key] = this.children.map((e: any) => e.toBufferObj());
    }

    obj.emit = this.emit.bind(this);
    return obj;
  }

  public emit(name: any, ...params: any) {
    switch (name) {
      case "readRequest":
        this._onReadRequest(...params as [any, any]);
        return true;
      case "writeRequest":
        this._onWriteRequest(...params as [any, any]);
        return true;
    }
    return false;
  }

  public _onReadRequest(offset: any, callback?: any) {
    if (this.data.length >= offset) {
      callback(this.RESULT_SUCCESS, Buffer.from(this.data.slice(offset)));
      let address: any = null;
      if (this.parentName === "characteristic") {
        address = this.characteristic.service.peripheral
          .currentConnectedDeviceAddress;
      } else if (this.parentName === "service") {
        address = this.service.peripheral.currentConnectedDeviceAddress;
      }
      this.notifyFromServer("onreadfromremote", {address});
    } else {
      callback(this.RESULT_UNLIKELY_ERROR, null);
    }
  }

  public _onWriteRequest(data: any, offset?: any, withoutResponse?: any, callback?: any) {
    // console.log('onWriteRequest');
    this.data = Array.from(data);
    callback(this.RESULT_SUCCESS);
    let address: any = null;
    if (this.parentName === "characteristic") {
      address = this.characteristic.service.peripheral
        .currentConnectedDeviceAddress;
    } else if (this.parentName === "service") {
      address = this.service.peripheral.currentConnectedDeviceAddress;
    }
    this.notifyFromServer("onwritefromremote", {address, data});
  }

  public write(dataArray: any) {
    this.data = dataArray;
    this.notifyFromServer("onwrite", {result: "success"});
  }

  public read() {
    this.notifyFromServer("onread", {data: this.data});
  }
}
