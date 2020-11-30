/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";

/**
 * @category Use as Central
 */
export default abstract class BleRemoteValueAttributeAbstract<
  ParentClass,
  ChildrenClass
> extends BleRemoteAttributeAbstract<ParentClass, ChildrenClass> {
  /**
   * Callback function when write value finished.
   */
  public onwrite?: (result: any) => void;

  /**
   * Callback function when read value.
   */
  public onread?: (data: any) => void;

  /**
   * Wrapper for [[readWait]] with data converting to text.
   * It convert  UTF-8 and write binary array to string.
   *
   * It throws an error when failed.
   */
  public readTextWait(): Promise<string | null> {
    return super.readTextWait();
  }

  /**
   * Wrapper for [[writeWait]] with data converting from number.
   * It writes data as 1byte.
   *
   * It throws an error when failed.
   *
   * @param val
   */
  public readNumberWait(): Promise<number | null> {
    return super.readNumberWait();
  }

  /**
   * Wrapper for [[writeWait]] with data converting from text.
   * It convert string to UTF-8 and write binary array.
   *
   * It throws an error when failed.
   * @param str
   */
  public writeTextWait(str: string, needResponse?: boolean): Promise<boolean> {
    return super.writeTextWait(str, needResponse);
  }

  /**
   * Wrapper for [[writeWait]] with data converting from number.
   * It writes data as 1byte.
   *
   * It throws an error when failed.
   *
   * @param val
   */
  public writeNumberWait(val: number, needResponse?: boolean): Promise<boolean> {
    return super.writeNumberWait(val, needResponse);
  }
}
