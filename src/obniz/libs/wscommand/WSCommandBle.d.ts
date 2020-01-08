// Type definitions for WSCommandBle
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

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
export default class WSCommandBle extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandBle;

  /**
   * CENTRAL
   * @param params
   */
  public centralScanStart(params: any): void;

  /**
   *
   * @param params
   */
  public centralScanStop(params: any): void;

  /**
   *
   * @param params
   */
  public centralConnect(params: any): void;

  /**
   *
   * @param params
   */
  public centralDisconnect(params: any): void;

  /**
   *
   * @param params
   */
  public centralServiceGet(params: any): void;

  /**
   *
   * @param params
   */
  public centralCharacteristicGet(params: any): void;

  /**
   *
   * @param params
   */
  public centralCharacteristicRead(params: any): void;

  /**
   *
   * @param params
   */
  public centralCharacteristicWrite(params: any): void;

  /**
   *
   * @param params
   */
  public centralCharacteristicRegisterNotify(params: any): void;

  /**
   *
   * @param params
   */
  public centralCharacteristicUnregisterNotify(params: any): void;

  /**
   *
   * @param params
   */
  public centralDescriptorGet(params: any): void;

  /**
   *
   * @param params
   */
  public centralDescriptorRead(params: any): void;

  /**
   *
   * @param params
   */
  public centralDescriptorWrite(params: any): void;

  /**
   * PERIPHERAL
   * @param params
   */
  public peripheralAdvertisementStart(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralAdvertisementStop(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralServiceStart(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralServiceStop(params: any): void;

  /**
   *
   */
  public peripheralServiceStopAll(): void;

  /**
   *
   * @param params
   */
  public peripheralCharacteristicRead(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralCharacteristicWrite(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralCharacteristicNotify(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralDescriptorRead(params: any): void;

  /**
   *
   * @param params
   */
  public peripheralDescriptorWrite(params: any): void;

  /**
   *
   * @param params
   */
  public securityAuth(params: any): void;

  /**
   *
   * @param params
   */
  public securityIndicateLevel(params: any): void;

  /**
   *
   * @param params
   */
  public securityKeyType(params: any): void;

  /**
   *
   * @param params
   */
  public securityKeySize(params: any): void;

  /**
   *
   * @param params
   */
  public clearBondingDevicesList(params: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: WSCommandBle.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: any, func: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryScanResponse(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryConnect(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServices(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryChacateristics(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryReadChacateristics(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryWriteChacateristics(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryRegisterNotifyChacateristic(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryUnregisterNotifyChacateristic(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryNotifyChacateristic(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryDescriptors(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryReadDescriptor(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryWriteDescriptor(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerConnectionState(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerWriteCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerReadCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public  notifyFromBinaryServerReadDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerWriteDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerNotifyReadDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend: any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public notifyFromBinaryError(objToSend: any, payload: any): void;

  /**
   *
   * @param sendObj
   * @param path
   * @param row
   */
  private _addRowForPath(sendObj: /* WSCommandBle.prototype._addRowForPath0 */ any, path: string, row: any): void;
}
