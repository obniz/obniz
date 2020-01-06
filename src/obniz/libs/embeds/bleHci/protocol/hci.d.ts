// Type definitions for bleHciProtocolHci
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * let debug = require('debug')('hci');
 */
declare function debug(): void;

/**
 *
 */
export declare var HCI_COMMAND_PKT: number;

/**
 *
 */
export declare var HCI_ACLDATA_PKT: number;

/**
 *
 */
export declare var HCI_EVENT_PKT: number;

/**
 *
 */
export declare var ACL_START_NO_FLUSH: number;

/**
 *
 */
export declare var ACL_CONT: number;

/**
 *
 */
export declare var ACL_START: number;

/**
 *
 */
export declare var EVT_DISCONN_COMPLETE: number;

/**
 *
 */
export declare var EVT_ENCRYPT_CHANGE: number;

/**
 *
 */
export declare var EVT_CMD_COMPLETE: number;

/**
 *
 */
export declare var EVT_CMD_STATUS: number;

/**
 *
 */
export declare var EVT_NUMBER_OF_COMPLETED_PACKETS: number;

/**
 *
 */
export declare var EVT_LE_META_EVENT: number;

/**
 *
 */
export declare var EVT_LE_CONN_COMPLETE: number;

/**
 *
 */
export declare var EVT_LE_ADVERTISING_REPORT: number;

/**
 *
 */
export declare var EVT_LE_CONN_UPDATE_COMPLETE: number;

/**
 *
 */
export declare var OGF_LINK_CTL: number;

/**
 *
 */
export declare var OCF_DISCONNECT: number;

/**
 *
 */
export declare var OGF_HOST_CTL: number;

/**
 *
 */
export declare var OCF_SET_EVENT_MASK: number;

/**
 *
 */
export declare var OCF_RESET: number;

/**
 *
 */
export declare var OCF_READ_LE_HOST_SUPPORTED: number;

/**
 *
 */
export declare var OCF_WRITE_LE_HOST_SUPPORTED: number;

/**
 *
 */
export declare var OGF_INFO_PARAM: number;

/**
 *
 */
export declare var OCF_READ_LOCAL_VERSION: number;

/**
 *
 */
export declare var OCF_READ_BUFFER_SIZE: number;

/**
 *
 */
export declare var OCF_READ_BD_ADDR: number;

/**
 *
 */
export declare var OGF_STATUS_PARAM: number;

/**
 *
 */
export declare var OCF_READ_RSSI: number;

/**
 *
 */
export declare var OGF_LE_CTL: number;

/**
 *
 */
export declare var OCF_LE_SET_EVENT_MASK: number;

/**
 *
 */
export declare var OCF_LE_READ_BUFFER_SIZE: number;

/**
 *
 */
export declare var OCF_LE_SET_ADVERTISING_PARAMETERS: number;

/**
 *
 */
export declare var OCF_LE_SET_ADVERTISING_DATA: number;

/**
 *
 */
export declare var OCF_LE_SET_SCAN_RESPONSE_DATA: number;

/**
 *
 */
export declare var OCF_LE_SET_ADVERTISE_ENABLE: number;

/**
 *
 */
export declare var OCF_LE_SET_SCAN_PARAMETERS: number;

/**
 *
 */
export declare var OCF_LE_SET_SCAN_ENABLE: number;

/**
 *
 */
export declare var OCF_LE_CREATE_CONN: number;

/**
 *
 */
export declare var OCF_LE_CONN_UPDATE: number;

/**
 *
 */
export declare var OCF_LE_START_ENCRYPTION: number;

/**
 *
 */
export declare var OCF_LE_LTK_NEG_REPLY: number;

/**
 *
 */
export declare var DISCONNECT_CMD: number;

/**
 *
 */
export declare var SET_EVENT_MASK_CMD: number;

/**
 *
 */
export declare var RESET_CMD: number;

/**
 *
 */
export declare var READ_LE_HOST_SUPPORTED_CMD: number;

/**
 *
 */
export declare var WRITE_LE_HOST_SUPPORTED_CMD: number;

/**
 *
 */
export declare var READ_LOCAL_VERSION_CMD: number;

/**
 *
 */
export declare var READ_BUFFER_SIZE_CMD: number;

/**
 *
 */
export declare var READ_BD_ADDR_CMD: number;

/**
 *
 */
export declare var READ_RSSI_CMD: number;

/**
 *
 */
export declare var LE_SET_EVENT_MASK_CMD: number;

/**
 *
 */
export declare var LE_READ_BUFFER_SIZE_CMD: number;

/**
 *
 */
export declare var LE_SET_SCAN_PARAMETERS_CMD: number;

/**
 *
 */
export declare var LE_SET_SCAN_ENABLE_CMD: number;

/**
 *
 */
export declare var LE_CREATE_CONN_CMD: number;

/**
 *
 */
export declare var LE_CONN_UPDATE_CMD: number;

/**
 *
 */
export declare var LE_START_ENCRYPTION_CMD: number;

/**
 *
 */
export declare var LE_SET_ADVERTISING_PARAMETERS_CMD: number;

/**
 *
 */
export declare var LE_SET_ADVERTISING_DATA_CMD: number;

/**
 *
 */
export declare var LE_SET_SCAN_RESPONSE_DATA_CMD: number;

/**
 *
 */
export declare var LE_SET_ADVERTISE_ENABLE_CMD: number;

/**
 *
 */
export declare var LE_LTK_NEG_REPLY_CMD: number;

/**
 *
 */
export declare var HCI_OE_USER_ENDED_CONNECTION: number;

/**
 *
 */
declare interface Hci {

  /**
   *
   * @param obnizHci
   */
  new(obnizHci: any): Hci;

  /**
   *
   * @return
   */
  initWait(): /* Hci.prototype.+Promise */ any;

  /**
   *
   */
  setEventMask(): void;

  /**
   *
   */
  reset(): void;

  /**
   *
   */
  resetBuffers(): void;

  /**
   *
   */
  readLocalVersion(): void;

  /**
   *
   */
  readBdAddr(): void;

  /**
   *
   */
  setLeEventMask(): void;

  /**
   *
   */
  readLeHostSupported(): void;

  /**
   *
   */
  writeLeHostSupported(): void;

  /**
   *
   */
  setScanParameters(): void;

  /**
   *
   * @param enabled
   * @param filterDuplicates
   */
  setScanEnabled(enabled: boolean, filterDuplicates: boolean): void;

  /**
   *
   * @param address
   * @param addressType
   */
  createLeConn(address: any, addressType: any): void;

  /**
   *
   * @param handle
   * @param minInterval
   * @param maxInterval
   * @param latency
   * @param supervisionTimeout
   */
  connUpdateLe(handle: any, minInterval: any, maxInterval: any, latency: any, supervisionTimeout: any): void;

  /**
   *
   * @param handle
   * @param random
   * @param diversifier
   * @param key
   */
  startLeEncryption(handle: any, random: any, diversifier: any, key: any): void;

  /**
   *
   * @param handle
   * @param reason
   */
  disconnect(handle: any, reason: number): void;

  /**
   *
   * @param handle
   */
  readRssi(handle: any): void;

  /**
   *
   * @param handle
   * @param cid
   * @param data
   */
  writeAclDataPkt(handle: any, cid: any, data: any): void;

  /**
   *
   */
  setAdvertisingParameters(): void;

  /**
   *
   * @param data
   */
  setAdvertisingData(data: any): void;

  /**
   *
   * @param data
   */
  setScanResponseData(data: any): void;

  /**
   *
   * @param enabled
   */
  setAdvertiseEnable(enabled: any): void;

  /**
   *
   */
  leReadBufferSize(): void;

  /**
   *
   */
  readBufferSize(): void;

  /**
   *
   * @param handle
   * @param cid
   * @param data
   */
  queueAclDataPkt(handle: any, cid: any, data: any): void;

  /**
   *
   */
  pushAclOutQueue(): void;

  /**
   *
   */
  writeOneAclDataPkt(): void;

  /**
   *
   * @param array
   */
  onSocketData(array: any): void;

  /**
   *
   * @param error
   */
  onSocketError(error: any): void;

  /**
   *
   * @param cmd
   * @param status
   * @param result
   */
  processCmdCompleteEvent(cmd: any, status: any, result: any): void;

  /**
   *
   * @param eventType
   * @param status
   * @param data
   */
  processLeMetaEvent(eventType: any, status: any, data: any): void;

  /**
   *
   * @param status
   * @param data
   */
  processLeConnComplete(status: any, data: any): void;

  /**
   *
   * @param count
   * @param data
   */
  processLeAdvertisingReport(count: any, data: any): void;

  /**
   *
   * @param status
   * @param data
   */
  processLeConnUpdateComplete(status: any, data: any): void;

  /**
   *
   * @param cmd
   * @param status
   */
  processCmdStatusEvent(cmd: any, status: any): void;

  /**
   *
   * @param result
   */
  processLeReadBufferSize(result: any): void;

  /**
   *
   * @param state
   */
  onStateChange(state: any): void;
}

declare module "bleHciProtocolHci" {

  export default bleHciProtocolHci;    // es6 style module export
}
