// Type definitions for ble
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace ObnizBLE.prototype {
  // ObnizBLE.prototype.findPeripheral.!ret

  /**
   *
   */
  interface FindPeripheralRet {

    /**
     *
     */
    discoverdOnRemote: boolean;
  }
}

/**
 *
 */
declare interface ObnizBLE {

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): ObnizBLE;

  /**
   * dummy
   */
  initWait(): void;

  /**
   *
   */
  _reset(): void;

  /**
   *
   * @param uuid
   * @param addressType
   */
  directConnect(uuid: any, addressType: any): void;

  /**
   *
   * @param uuid
   * @param addressType
   */
  directConnectWait(uuid: any, addressType: any): void;

  /**
   *
   * @param address
   * @return
   */
  findPeripheral(address: any): ObnizBLE.prototype.FindPeripheralRet;

  /**
   *
   * @param obj
   */
  notified(obj: any): void;

  /**
   *
   * @param data
   * @param reverse
   * @return
   */
  _dataArray2uuidHex(data: any, reverse: any): string;
}

declare module "ble" {

  export default ble;    // es6 style module export
}
