"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleDescriptor = void 0;
const bleLocalValueAttributeAbstract_1 = require("./bleLocalValueAttributeAbstract");
/**
 * @category Use as Peripheral
 */
class BleDescriptor extends bleLocalValueAttributeAbstract_1.BleLocalValueAttributeAbstract {
    // public permissions: any;
    /**
     * Create descriptor.
     *
     * ```javascript
     * await obniz.ble.initWait();
     * var descriptor = new obniz.ble.characteristic({
     *                     "uuid" : "2901",   //Characteristic User Description
     *                     "text" : "hello world characteristic",
     *                 });
     *
     *  var characteristic = new obniz.ble.characteristic({
     *                  "uuid" : "FFF1",
     *                  "text" : "Hi",
     *                  "descriptors" : [ descriptor ]
     *                });
     *
     * var service = new obniz.ble.service({
     *                "uuid" : "fff0",
     *                "characteristics" : [ characteristic ]
     * });
     * obniz.ble.peripheral.addService(service);
     *
     * ```
     *
     * @param obj
     */
    constructor(obj) {
        super(obj);
        // this.permissions = obj.permissions || [];
        // if (!Array.isArray(this.permissions)) {
        //   this.permissions = [this.permissions];
        // }
    }
    /**
     * @ignore
     */
    get parentName() {
        return 'characteristic';
    }
    // public addPermission(param: any) {
    //   if (!this.permissions.includes(param)) {
    //     this.permissions.push(param);
    //   }
    // }
    // public removePermission(param: any) {
    //   this.permissions = this.permissions.filter ((elm: any ) => {
    //     return elm !== param;
    //   });
    // }
    /**
     * @ignore
     */
    toJSON() {
        const obj = super.toJSON();
        // if (this.permissions.length > 0) {
        //   obj.permissions = this.permissions;
        // }
        return obj;
    }
}
exports.BleDescriptor = BleDescriptor;
