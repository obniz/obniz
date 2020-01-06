// Type definitions for bleHciProtocolPeripheralBindings
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * var debug = require('debug')('bindings');
 */
declare function debug(): void;

/**
 *
 */
declare interface BlenoBindings {

  /**
   *
   * @param hciProtocol
   */
  new(hciProtocol: any): BlenoBindings;

  /**
   *
   * @param name
   * @param serviceUuids
   */
  startAdvertising(name: any, serviceUuids: any): void;

  /**
   *
   * @param data
   */
  startAdvertisingIBeacon(data: any): void;

  /**
   *
   * @param advertisementData
   * @param scanData
   */
  startAdvertisingWithEIRData(advertisementData: any, scanData: any): void;

  /**
   *
   */
  stopAdvertising(): void;

  /**
   *
   * @param services
   */
  setServices(services: any): void;

  /**
   *
   */
  disconnect(): void;

  /**
   *
   */
  updateRssi(): void;

  /**
   *
   */
  init(): void;

  /**
   *
   * @param state
   */
  onStateChange(state: any): void;

  /**
   *
   * @param address
   */
  onAddressChange(address: any): void;

  /**
   *
   * @param hciVer
   * @param hciRev
   * @param lmpVer
   * @param manufacturer
   * @param lmpSubVer
   */
  onReadLocalVersion(hciVer: any, hciRev: any, lmpVer: any, manufacturer: any, lmpSubVer: any): void;

  /**
   *
   * @param error
   */
  onAdvertisingStart(error: any): void;

  /**
   *
   */
  onAdvertisingStop(): void;

  /**
   *
   * @param status
   * @param handle
   * @param role
   * @param addressType
   * @param address
   * @param interval
   * @param latency
   * @param supervisionTimeout
   * @param masterClockAccuracy
   */
  onLeConnComplete(status: any, handle: any, role: any, addressType: any, address: any, interval: any, latency: any, supervisionTimeout: any, masterClockAccuracy: any): void;

  /**
   *
   * @param handle
   * @param interval
   * @param latency
   * @param supervisionTimeout
   */
  onLeConnUpdateComplete(handle: any, interval: any, latency: any, supervisionTimeout: any): void;

  /**
   *
   * @param handle
   * @param reason
   */
  onDisconnComplete(handle: any, reason: any): void;

  /**
   *
   * @param handle
   * @param encrypt
   */
  onEncryptChange(handle: any, encrypt: any): void;

  /**
   *
   * @param handle
   */
  onLeLtkNegReply(handle: any): void;

  /**
   *
   * @param mtu
   */
  onMtuChange(mtu: any): void;

  /**
   *
   * @param handle
   * @param rssi
   */
  onRssiRead(handle: any, rssi: any): void;

  /**
   *
   * @param handle
   * @param cid
   * @param data
   */
  onAclDataPkt(handle: any, cid: any, data: any): void;
}

declare module "bleHciProtocolPeripheralBindings" {

  export default bleHciProtocolPeripheralBindings;    // es6 style module export
}
