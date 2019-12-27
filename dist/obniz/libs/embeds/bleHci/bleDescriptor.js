"use strict";
const BleLocalAttributeAbstract = require('./bleLocalAttributeAbstract');
class BleDescriptor extends BleLocalAttributeAbstract {
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
}
module.exports = BleDescriptor;
