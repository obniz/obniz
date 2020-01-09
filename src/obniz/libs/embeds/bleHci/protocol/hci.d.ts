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
export declare var HCI_COMMAND_PKT: any;

/**
 *
 */
export declare var HCI_ACLDATA_PKT: any;

/**
 *
 */
export declare var HCI_EVENT_PKT: any;

/**
 *
 */
export declare var ACL_START_NO_FLUSH: any;

/**
 *
 */
export declare var ACL_CONT: any;

/**
 *
 */
export declare var ACL_START: any;

/**
 *
 */
export declare var EVT_DISCONN_COMPLETE: any;

/**
 *
 */
export declare var EVT_ENCRYPT_CHANGE: any;

/**
 *
 */
export declare var EVT_CMD_COMPLETE: any;

/**
 *
 */
export declare var EVT_CMD_STATUS: any;

/**
 *
 */
export declare var EVT_NUMBER_OF_COMPLETED_PACKETS: any;

/**
 *
 */
export declare var EVT_LE_META_EVENT: any;

/**
 *
 */
export declare var EVT_LE_CONN_COMPLETE: any;

/**
 *
 */
export declare var EVT_LE_ADVERTISING_REPORT: any;

/**
 *
 */
export declare var EVT_LE_CONN_UPDATE_COMPLETE: any;

/**
 *
 */
export declare var OGF_LINK_CTL: any;

/**
 *
 */
export declare var OCF_DISCONNECT: any;

/**
 *
 */
export declare var OGF_HOST_CTL: any;

/**
 *
 */
export declare var OCF_SET_EVENT_MASK: any;

/**
 *
 */
export declare var OCF_RESET: any;

/**
 *
 */
export declare var OCF_READ_LE_HOST_SUPPORTED: any;

/**
 *
 */
export declare var OCF_WRITE_LE_HOST_SUPPORTED: any;

/**
 *
 */
export declare var OGF_INFO_PARAM: any;

/**
 *
 */
export declare var OCF_READ_LOCAL_VERSION: any;

/**
 *
 */
export declare var OCF_READ_BUFFER_SIZE: any;

/**
 *
 */
export declare var OCF_READ_BD_ADDR: any;

/**
 *
 */
export declare var OGF_STATUS_PARAM: any;

/**
 *
 */
export declare var OCF_READ_RSSI: any;

/**
 *
 */
export declare var OGF_LE_CTL: any;

/**
 *
 */
export declare var OCF_LE_SET_EVENT_MASK: any;

/**
 *
 */
export declare var OCF_LE_READ_BUFFER_SIZE: any;

/**
 *
 */
export declare var OCF_LE_SET_ADVERTISING_PARAMETERS: any;

/**
 *
 */
export declare var OCF_LE_SET_ADVERTISING_DATA: any;

/**
 *
 */
export declare var OCF_LE_SET_SCAN_RESPONSE_DATA: any;

/**
 *
 */
export declare var OCF_LE_SET_ADVERTISE_ENABLE: any;

/**
 *
 */
export declare var OCF_LE_SET_SCAN_PARAMETERS: any;

/**
 *
 */
export declare var OCF_LE_SET_SCAN_ENABLE: any;

/**
 *
 */
export declare var OCF_LE_CREATE_CONN: any;

/**
 *
 */
export declare var OCF_LE_CONN_UPDATE: any;

/**
 *
 */
export declare var OCF_LE_START_ENCRYPTION: any;

/**
 *
 */
export declare var OCF_LE_LTK_NEG_REPLY: any;

/**
 *
 */
export declare var DISCONNECT_CMD: any;

/**
 *
 */
export declare var SET_EVENT_MASK_CMD: any;

/**
 *
 */
export declare var RESET_CMD: any;

/**
 *
 */
export declare var READ_LE_HOST_SUPPORTED_CMD: any;

/**
 *
 */
export declare var WRITE_LE_HOST_SUPPORTED_CMD: any;

/**
 *
 */
export declare var READ_LOCAL_VERSION_CMD: any;

/**
 *
 */
export declare var READ_BUFFER_SIZE_CMD: any;

/**
 *
 */
export declare var READ_BD_ADDR_CMD: any;

/**
 *
 */
export declare var READ_RSSI_CMD: any;

/**
 *
 */
export declare var LE_SET_EVENT_MASK_CMD: any;

/**
 *
 */
export declare var LE_READ_BUFFER_SIZE_CMD: any;

/**
 *
 */
export declare var LE_SET_SCAN_PARAMETERS_CMD: any;

/**
 *
 */
export declare var LE_SET_SCAN_ENABLE_CMD: any;

/**
 *
 */
export declare var LE_CREATE_CONN_CMD: any;

/**
 *
 */
export declare var LE_CONN_UPDATE_CMD: any;

/**
 *
 */
export declare var LE_START_ENCRYPTION_CMD: any;

/**
 *
 */
export declare var LE_SET_ADVERTISING_PARAMETERS_CMD: any;

/**
 *
 */
export declare var LE_SET_ADVERTISING_DATA_CMD: any;

/**
 *
 */
export declare var LE_SET_SCAN_RESPONSE_DATA_CMD: any;

/**
 *
 */
export declare var LE_SET_ADVERTISE_ENABLE_CMD: any;

/**
 *
 */
export declare var LE_LTK_NEG_REPLY_CMD: any;

/**
 *
 */
export declare var HCI_OE_USER_ENDED_CONNECTION: any;

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
