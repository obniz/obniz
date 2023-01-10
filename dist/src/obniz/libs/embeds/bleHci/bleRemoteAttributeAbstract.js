"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleRemoteAttributeAbstract = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleAttributeAbstract_1 = require("./bleAttributeAbstract");
/**
 * @category Use as Central
 */
class BleRemoteAttributeAbstract extends bleAttributeAbstract_1.BleAttributeAbstract {
    constructor(params) {
        super(params);
        this.isRemote = false;
        this.discoverdOnRemote = false;
    }
    /**
     * @ignore
     */
    get wsChildUuidName() {
        const childrenName = this.childrenName;
        if (!childrenName) {
            return null;
        }
        const childName = childrenName.slice(0, -1);
        return childName + '_uuid';
    }
}
exports.BleRemoteAttributeAbstract = BleRemoteAttributeAbstract;
