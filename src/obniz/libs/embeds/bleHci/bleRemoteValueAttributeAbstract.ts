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
   * Wrapper for [[write]] with data converting from number.
   * @param val
   * @param needResponse
   */
  public writeNumber(val: number, needResponse?: boolean) {
    return super.writeNumber(val, needResponse);
  }

  /**
   * Wrapper for [[write]] with data converting from text.
   * It convert string to UTF-8 and write binary array.
   *
   * @param str
   * @param needResponse
   */
  public writeText(str: string, needResponse?: boolean) {
    return super.writeText(str, needResponse);
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
