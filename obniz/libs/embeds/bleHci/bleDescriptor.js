/* eslint-disable */

const BleAttributeAbstract = require('./bleAttributeAbstract');
const BleHelper = require('./bleHelper');

class BleDescriptor extends BleAttributeAbstract {
  constructor(obj) {
    super(obj);

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return 'characteristic';
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

  toJSON() {
    let obj = super.toJSON();

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }

  write(dataArray) {
    // todo
  }

  read() {
    // todo
  }
}

module.exports = BleDescriptor;
