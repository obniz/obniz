"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
/**
 * @category Use as Central
 */
class BleRemoteAttributeAbstract extends bleAttributeAbstract_1.default {
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
        return childName + "_uuid";
    }
}
exports.default = BleRemoteAttributeAbstract;
