const BleDescriptor = require('./bleDescriptor');
const BleLocalAttributeAbstract = require('./bleLocalAttributeAbstract');

class BleCharacteristic extends BleLocalAttributeAbstract {
  constructor(obj) {
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
    return 'service';
  }

  get childrenClass() {
    return BleDescriptor;
  }

  get childrenName() {
    return 'descriptors';
  }

  toJSON() {
    let obj = super.toJSON();

    if (this.properties.length > 0) {
      obj.properties = this.properties;
    }

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  toBufferObj() {
    let obj = super.toBufferObj();

    obj.properties = this.properties;
    obj.secure = [];

    return obj;
  }

  addProperty(param) {
    if (!this.properties.includes(param)) {
      this.properties.push(param);
    }
  }

  removeProperty(param) {
    this.properties = this.properties.filter(elm => {
      return elm !== param;
    });
  }

  addPermission(param) {
    if (!this.permissions.includes(param)) {
      this.permissions.push(param);
    }
  }

  removePermission(param) {
    this.permissions = this.permissions.filter(elm => {
      return elm !== param;
    });
  }

  emit(name, ...params) {
    let result = super.emit(name, ...params);
    if (result) {
      return result;
    }
    switch (name) {
      case 'subscribe':
        this._onSubscribe(...params);
        return true;
      case 'unsubscribe':
        this._onUnsubscribe(...params);
        return true;
      case 'notify':
        this._onNotify(...params);
        return true;
      case 'indicate':
        this._onIndicate(...params);
        return true;
      default:
        throw new Error('unknown emit');
    }
  }

  _onSubscribe(maxValueSize, updateValueCallback) {
    console.log('_onSubscribe');
    this._maxValueSize = maxValueSize;
    this._updateValueCallback = updateValueCallback;
  }

  _onUnsubscribe() {
    this._maxValueSize = null;
    this._updateValueCallback = null;
  }

  _onNotify() {}

  _onIndicate() {}

  notify() {
    if (this._updateValueCallback) {
      this._updateValueCallback(Buffer.from(this.data));
    }
  }
}

module.exports = BleCharacteristic;
