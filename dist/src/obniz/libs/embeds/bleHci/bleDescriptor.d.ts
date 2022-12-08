/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleCharacteristic } from './bleCharacteristic';
import { BleLocalValueAttributeAbstract } from './bleLocalValueAttributeAbstract';
import { BleDescriptorDefine } from './bleTypes';
/**
 * @category Use as Peripheral
 */
export declare class BleDescriptor extends BleLocalValueAttributeAbstract<BleCharacteristic, null> {
    /**
     * Characteristic instance
     */
    characteristic: BleCharacteristic;
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
    constructor(obj: BleDescriptorDefine);
    /**
     * @ignore
     */
    get parentName(): "characteristic";
    /**
     * @ignore
     */
    toJSON(): any;
}
