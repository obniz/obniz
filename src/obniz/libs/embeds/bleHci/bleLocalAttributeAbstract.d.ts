// Type definitions for bleHciBleLocalAttributeAbstract
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleLocalAttributeAbstract.prototype {
  // BleLocalAttributeAbstract.prototype.toBufferObj.!ret

  /**
   *
   */
  interface ToBufferObjRet {

    /**
     *
     * @param name
     * @param ...params
     * @return
     */
    emit(name: any, ...params: any): boolean;
  }
}
/**
 *
 */
declare interface BleLocalAttributeAbstract {

  /**
   *
   * @param params
   */
  new(params: any): BleLocalAttributeAbstract;

  /**
   *
   * @return
   */
  toBufferObj(): BleLocalAttributeAbstract.prototype.ToBufferObjRet;

  /**
   *
   * @param name
   * @param ...params
   * @return
   */
  emit(name: any, ...params: any): boolean;

  /**
   *
   * @param offset
   * @param callback
   */
  _onReadRequest(offset: any, callback: any): void;

  /**
   *
   * @param data
   * @param offset
   * @param withoutResponse
   * @param callback
   */
  _onWriteRequest(data: any, offset: any, withoutResponse: any, callback: any): void;

  /**
   *
   * @param dataArray
   */
  write(dataArray: number[]): void;

  /**
   *
   */
  read(): void;
}

declare module "bleHciBleLocalAttributeAbstract" {

  export default bleHciBleLocalAttributeAbstract;    // es6 style module export
}
