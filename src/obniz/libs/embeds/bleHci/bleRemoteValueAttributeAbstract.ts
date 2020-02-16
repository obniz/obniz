/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import ObnizUtil from "../../utils/util";
import BleAttributeAbstract from "./bleAttributeAbstract";

/**
 * @category Use as Central
 */
export default class BleRemoteAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<ParentClass, ChildrenClass> {

  /**
   * Wrapper for [[write]] with data converting from number.
   * @param val
   * @param needResponse
   */
  public writeNumber(val: any, needResponse?: any) {
    return super.writeNumber(val, needResponse);
  }

  /**
   * Wrapper for [[write]] with data converting from text.
   * @param str
   * @param needResponse
   */
  public writeText(str: string, needResponse?: any) {
    return super.writeText(str, needResponse);
  }

  public readWait() {
    return super.readWait();
  }

  public writeWait(data: any, needResponse: any) {
    return super.writeWait(data, needResponse);
  }

  /**
   * Wrapper for [[writeWait]] with data converting from text.
   * @param str
   */
  public writeTextWait(str: string) {
    return super.writeTextWait(str);
  }

  /**
   * Wrapper for [[writeWait]] with data converting from number.
   * @param val
   */
  public writeNumberWait(val: any) {
    return super.writeNumberWait(val);
  }

  public readFromRemoteWait() {
    return super.readFromRemoteWait();
  }

  public writeFromRemoteWait() {
    return super.writeFromRemoteWait();
  }

}
