/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleRemoteCharacteristic } from './bleRemoteCharacteristic';
import { BleRemoteValueAttributeAbstract } from './bleRemoteValueAttributeAbstract';
/**
 * @category Use as Central
 */
export declare class BleRemoteDescriptor extends BleRemoteValueAttributeAbstract<BleRemoteCharacteristic, null> {
    characteristic: BleRemoteCharacteristic;
    constructor(params: any);
    /**
     * @ignore
     */
    get parentName(): "characteristic";
    /**
     * Read data from descriptor.
     *
     * The return value appears in the callback function [[onread]].
     * If reading succeeds an Array with data will be returned.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral){
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await obniz.wait(1000);
     *
     *   var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
     *   console.log(dataArray);
     * }
     * ```
     *
     */
    readWait(): Promise<number[]>;
    /**
     * This writes dataArray to descriptor.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral){
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await obniz.wait(1000);
     *
     *   var dataArray = [0x02, 0xFF];
     *   await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
     *   console.log("write success");
     * }
     * ```
     *
     * @param data
     */
    writeWait(data: number[]): Promise<boolean>;
    /**
     * @ignore
     */
    ondiscover(child: any): void;
    /**
     * @ignore
     * @param children
     */
    ondiscoverfinished(children: any): void;
}
