/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleRemoteAttributeAbstract } from './bleRemoteAttributeAbstract';
/**
 * @category Use as Central
 */
export declare abstract class BleRemoteValueAttributeAbstract<ParentClass, ChildrenClass> extends BleRemoteAttributeAbstract<ParentClass, ChildrenClass> {
    /**
     * Callback function when write value finished.
     */
    onwrite?: (result: any) => void;
    /**
     * Callback function when read value.
     */
    onread?: (data: any) => void;
    /**
     * Wrapper for [[readWait]] with data converting to text.
     * It convert  UTF-8 and write binary array to string.
     *
     * It throws an error when failed.
     */
    readTextWait(): Promise<string | null>;
    /**
     * Wrapper for [[writeWait]] with data converting from number.
     * It writes data as 1byte.
     *
     * It throws an error when failed.
     *
     * @return val
     */
    readNumberWait(): Promise<number | null>;
    /**
     * Wrapper for [[writeWait]] with data converting from text.
     * It convert string to UTF-8 and write binary array.
     *
     * It throws an error when failed.
     *
     * @param str
     * @param needResponse
     */
    writeTextWait(str: string, needResponse?: boolean): Promise<boolean>;
    /**
     * Wrapper for [[writeWait]] with data converting from number.
     * It writes data as 1byte.
     *
     * It throws an error when failed.
     *
     * @param val
     * @param needResponse
     */
    writeNumberWait(val: number, needResponse?: boolean): Promise<boolean>;
}
