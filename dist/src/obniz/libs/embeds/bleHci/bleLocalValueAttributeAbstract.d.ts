/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleLocalAttributeAbstract } from './bleLocalAttributeAbstract';
/**
 * @category Use as Peripheral
 */
export declare class BleLocalValueAttributeAbstract<ParentClass, ChildrenClass> extends BleLocalAttributeAbstract<ParentClass, ChildrenClass> {
    constructor(params: any);
    /**
     * This writes dataArray.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * await attr.writeWait([0xf0,0x27]);
     * console.log("write success");
     * ```
     *
     * @param data
     */
    writeWait(data: any): Promise<boolean>;
    /**
     * It reads data.
     *
     * Even you wrote string or number, it returns binary array.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * let data =  await attr.readWait()
     *  console.log("data: " , data );
     * ```
     */
    readWait(): Promise<number[]>;
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName: any, params: any): void;
}
