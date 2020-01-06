// Type definitions for WSCommandBle
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandBle.prototype {
  // WSCommandBle.prototype.parseFromJson.!0

  /**
   *
   */
  interface ParseFromJson0 {

    /**
     *
     */
    breder: number;

    /**
     *
     */
    ble: number;

    /**
     *
     */
    dumo: number;
  }
}

/**
 *
 */
declare interface WSCommandBle {

  /**
   *
   */
  new(): WSCommandBle;

  /**
   * CENTRAL
   * @param params
   */
  centralScanStart(params: any): void;

  /**
   *
   * @param params
   */
  centralScanStop(params: any): void;

  /**
   *
   * @param params
   */
  centralConnect(params: any): void;

  /**
   *
   * @param params
   */
  centralDisconnect(params: any): void;

  /**
   *
   * @param params
   */
  centralServiceGet(params: any): void;

  /**
   *
   * @param params
   */
  centralCharacteristicGet(params: any): void;

  /**
   *
   * @param params
   */
  centralCharacteristicRead(params: any): void;

  /**
   *
   * @param params
   */
  centralCharacteristicWrite(params: any): void;

  /**
   *
   * @param params
   */
  centralCharacteristicRegisterNotify(params: any): void;

  /**
   *
   * @param params
   */
  centralCharacteristicUnregisterNotify(params: any): void;

  /**
   *
   * @param params
   */
  centralDescriptorGet(params: any): void;

  /**
   *
   * @param params
   */
  centralDescriptorRead(params: any): void;

  /**
   *
   * @param params
   */
  centralDescriptorWrite(params: any): void;

  /**
   * PERIPHERAL
   * @param params
   */
  peripheralAdvertisementStart(params: any): void;

  /**
   *
   * @param params
   */
  peripheralAdvertisementStop(params: any): void;

  /**
   *
   * @param params
   */
  peripheralServiceStart(params: any): void;

  /**
   *
   * @param params
   */
  peripheralServiceStop(params: any): void;

  /**
   *
   */
  peripheralServiceStopAll(): void;

  /**
   *
   * @param params
   */
  peripheralCharacteristicRead(params: any): void;

  /**
   *
   * @param params
   */
  peripheralCharacteristicWrite(params: any): void;

  /**
   *
   * @param params
   */
  peripheralCharacteristicNotify(params: any): void;

  /**
   *
   * @param params
   */
  peripheralDescriptorRead(params: any): void;

  /**
   *
   * @param params
   */
  peripheralDescriptorWrite(params: any): void;

  /**
   *
   * @param params
   */
  securityAuth(params: any): void;

  /**
   *
   * @param params
   */
  securityIndicateLevel(params: any): void;

  /**
   *
   * @param params
   */
  securityKeyType(params: any): void;

  /**
   *
   * @param params
   */
  securityKeySize(params: any): void;

  /**
   *
   * @param params
   */
  clearBondingDevicesList(params: any): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: WSCommandBle.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  notifyFromBinary(objToSend: any, func: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryScanResponse(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryConnect(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServices(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryChacateristics(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryReadChacateristics(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryWriteChacateristics(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryRegisterNotifyChacateristic(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryUnregisterNotifyChacateristic(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryNotifyChacateristic(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryDescriptors(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryReadDescriptor(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryWriteDescriptor(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerConnectionState(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerWriteCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerReadCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerReadDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerWriteDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerNotifyReadDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  notifyFromBinaryError(objToSend: any, payload: any): void;

  /**
   *
   * @param sendObj
   * @param path
   * @param row
   */
  _addRowForPath(sendObj: /* WSCommandBle.prototype._addRowForPath0 */ any, path: string, row: any): void;
}

declare module "WSCommandBle" {

  export default WSCommandBle;    // es6 style module export
}
