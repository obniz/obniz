const BleLocalAttributeAbstract: any = require("./bleLocalAttributeAbstract");

class BleDescriptor extends BleLocalAttributeAbstract {
  public permissions: any;

  constructor(obj: any) {
    super(obj);

    this.permissions = obj.permissions || [];
    if (!Array.isArray(this.permissions)) {
      this.permissions = [this.permissions];
    }
  }

  get parentName() {
    return "characteristic";
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

  public toJSON() {
    const obj: any = super.toJSON();

    if (this.permissions.length > 0) {
      obj.permissions = this.permissions;
    }
    return obj;
  }
}

module.exports = BleDescriptor;
