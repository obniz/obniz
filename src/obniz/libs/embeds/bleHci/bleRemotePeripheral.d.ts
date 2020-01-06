// Type definitions for bleHciBleRemotePeripheral
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleRemotePeripheral.prototype {
  // BleRemotePeripheral.prototype.searchTypeVal.!ret
  type SearchTypeValRet = any[];
}
declare namespace BleRemotePeripheral.prototype {
  // BleRemotePeripheral.prototype._addServiceUuids.!0
  type _addServiceUuids0 = any[];
}

/**
 *
 */
declare interface BleRemotePeripheral {

  /**
   *
   */
  services: {};

  /**
   *
   */
  connected: boolean;

  /**
   *
   */
  keys: string[];

  /**
   *
   */
  _services: any[];

  /**
   *
   */
  advertise_data_rows: number[];

  /**
   *
   */
  localName: string;

  /**
   *
   */
  iBeacon: {

    /**
     *
     */
    uuid: string;
  };

  /**
   *
   * @param obnizBle
   * @param address
   */
  new(obnizBle: any, address: any): BleRemotePeripheral;

  /**
   *
   * @param dic
   */
  setParams(dic: any): void;

  /**
   *
   */
  analyseAdvertisement(): void;

  /**
   *
   * @param type
   * @return
   */
  searchTypeVal(type: number): BleRemotePeripheral.prototype.SearchTypeValRet;

  /**
   *
   */
  setLocalName(): void;

  /**
   *
   */
  setIBeacon(): void;

  /**
   *
   * @param results
   * @param data
   * @param bit
   */
  _addServiceUuids(results: /* BleRemotePeripheral.prototype._addServiceUuids0 */ any, data: any[], bit: number): void;

  /**
   *
   * @return
   */
  advertisementServiceUuids(): any[];

  /**
   *
   */
  connect(): void;

  /**
   *
   * @return
   */
  connectWait(): /* BleRemotePeripheral.prototype.+Promise */ any;

  /**
   *
   */
  disconnect(): void;

  /**
   *
   * @return
   */
  disconnectWait(): /* BleRemotePeripheral.prototype.+Promise */ any;

  /**
   *
   * @param uuid
   * @return
   */
  getService(uuid: any): /* !this._services.<i> */ any;

  /**
   *
   * @param param
   * @return
   */
  findService(param: any): /* BleRemotePeripheral._services.<i> */ any;

  /**
   *
   * @param param
   */
  findCharacteristic(param: any): void;

  /**
   *
   * @param param
   */
  findDescriptor(param: any): void;

  /**
   *
   */
  discoverAllServices(): void;

  /**
   *
   * @return
   */
  discoverAllServicesWait(): /* BleRemotePeripheral.prototype.+Promise */ any;

  /**
   *
   */
  discoverAllHandlesWait(): void;

  /**
   *
   */
  onconnect(): void;

  /**
   *
   */
  ondisconnect(): void;

  /**
   *
   */
  ondiscoverservice(): void;

  /**
   *
   */
  ondiscoverservicefinished(): void;

  /**
   *
   */
  ondiscover(): void;

  /**
   *
   */
  ondiscoverfinished(): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notifyFromServer(notifyName: any, params: any): void;

  /**
   *
   */
  onerror(): void;
}

declare module "bleHciBleRemotePeripheral" {

  export default bleHciBleRemotePeripheral;    // es6 style module export
}
