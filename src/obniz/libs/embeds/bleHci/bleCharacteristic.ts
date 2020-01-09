import BleDescriptor from "./bleDescriptor";
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";

class BleCharacteristic extends BleLocalAttributeAbstract {
  public _maxValueSize: any;
  public _updateValueCallback: any;
  public addDescriptor: any;
  public addChild: any;
  public getDescriptor: any;
  public getChild: any;
  public properties: any;
  public permissions: any;
  public children: any;
  public data: any;

  constructor(obj: any) {
    super(obj);

    this._maxValueSize = null;
    this._updateValueCallback = null;

    this.addDescriptor = this.addChild;
    this.getDescriptor = this.getChild;

    this.properties = obj.properties || [];
    if (!Array.isArray(this.properties)) {
      this.properties = [this.properties];
    }

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return "service";
  }

  get childrenClass() {
    return BleDescriptor;
  }

  get childrenName() {
    return "descriptors";
  }

  get descriptors() {
    return this.children;
  }

  public toJSON() {
    const obj: any = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  public toBufferObj() {
    const obj: any = super.toBufferObj();

    obj.properties = this.properties;
    obj.secure = [];

    return obj;
  }

  public addProperty(param: any) {
    if (!this.properties.includes(param)) {
      this.properties.push(param);
    }
  }

  public removeProperty(param: any) {
    this.properties = this.properties.filter((elm) => {
      return elm !== param;
    });
  }

  public addPermission(param: any) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  public removePermission(param: any) {
    this.permissions = this.permissions.filter((elm) => {
      return elm !== param;
    });
  }

  public emit(name: any, ...params: any) {
    const result: any = super.emit(name, ...params);
    if (result) {
      return result;
    }
    switch (name) {
      case "subscribe":
        this._onSubscribe(...params);
        return true;
      case "unsubscribe":
        this._onUnsubscribe(...params);
        return true;
      case "notify":
        this._onNotify(...params);
        return true;
      case "indicate":
        this._onIndicate(...params);
        return true;
      default:
        throw new Error("unknown emit");
    }
  }

  public _onSubscribe(maxValueSize: any, updateValueCallback?: any) {
    // console.log('_onSubscribe');
    this._maxValueSize = maxValueSize;
    this._updateValueCallback = updateValueCallback;
  }

  public _onUnsubscribe() {
    this._maxValueSize = null;
    this._updateValueCallback = null;
  }

  public _onNotify() {
  }

  public _onIndicate() {
  }

  public notify() {
    if (this._updateValueCallback) {
      this._updateValueCallback(Buffer.from(this.data));
    }
  }
}

export default BleCharacteristic;
