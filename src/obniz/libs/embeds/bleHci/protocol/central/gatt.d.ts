// Type definitions for bleHciProtocolCentralGatt
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace Gatt.prototype {
  // Gatt.prototype._queueCommand.!1
  type _queueCommand1 = ((data: any) => void);
}
declare namespace Gatt.prototype {
  // Gatt.prototype._queueCommand.!2
  type _queueCommand2 = (() => void);
}

/**
 * let debug = require('debug')('att');
 */
declare function debug(): void;

/**
 *
 */
export declare var ATT_OP_ERROR: number;

/**
 *
 */
export declare var ATT_OP_MTU_REQ: number;

/**
 *
 */
export declare var ATT_OP_MTU_RESP: number;

/**
 *
 */
export declare var ATT_OP_FIND_INFO_REQ: number;

/**
 *
 */
export declare var ATT_OP_FIND_INFO_RESP: number;

/**
 *
 */
export declare var ATT_OP_READ_BY_TYPE_REQ: number;

/**
 *
 */
export declare var ATT_OP_READ_BY_TYPE_RESP: number;

/**
 *
 */
export declare var ATT_OP_READ_REQ: number;

/**
 *
 */
export declare var ATT_OP_READ_RESP: number;

/**
 *
 */
export declare var ATT_OP_READ_BLOB_REQ: number;

/**
 *
 */
export declare var ATT_OP_READ_BLOB_RESP: number;

/**
 *
 */
export declare var ATT_OP_READ_BY_GROUP_REQ: number;

/**
 *
 */
export declare var ATT_OP_READ_BY_GROUP_RESP: number;

/**
 *
 */
export declare var ATT_OP_WRITE_REQ: number;

/**
 *
 */
export declare var ATT_OP_WRITE_RESP: number;

/**
 *
 */
export declare var ATT_OP_PREPARE_WRITE_REQ: number;

/**
 *
 */
export declare var ATT_OP_PREPARE_WRITE_RESP: number;

/**
 *
 */
export declare var ATT_OP_EXECUTE_WRITE_REQ: number;

/**
 *
 */
export declare var ATT_OP_EXECUTE_WRITE_RESP: number;

/**
 *
 */
export declare var ATT_OP_HANDLE_NOTIFY: number;

/**
 *
 */
export declare var ATT_OP_HANDLE_IND: number;

/**
 *
 */
export declare var ATT_OP_HANDLE_CNF: number;

/**
 *
 */
export declare var ATT_OP_WRITE_CMD: number;

/**
 *
 */
export declare var ATT_ECODE_SUCCESS: number;

/**
 *
 */
export declare var ATT_ECODE_INVALID_HANDLE: number;

/**
 *
 */
export declare var ATT_ECODE_READ_NOT_PERM: number;

/**
 *
 */
export declare var ATT_ECODE_WRITE_NOT_PERM: number;

/**
 *
 */
export declare var ATT_ECODE_INVALID_PDU: number;

/**
 *
 */
export declare var ATT_ECODE_AUTHENTICATION: number;

/**
 *
 */
export declare var ATT_ECODE_REQ_NOT_SUPP: number;

/**
 *
 */
export declare var ATT_ECODE_INVALID_OFFSET: number;

/**
 *
 */
export declare var ATT_ECODE_AUTHORIZATION: number;

/**
 *
 */
export declare var ATT_ECODE_PREP_QUEUE_FULL: number;

/**
 *
 */
export declare var ATT_ECODE_ATTR_NOT_FOUND: number;

/**
 *
 */
export declare var ATT_ECODE_ATTR_NOT_LONG: number;

/**
 *
 */
export declare var ATT_ECODE_INSUFF_ENCR_KEY_SIZE: number;

/**
 *
 */
export declare var ATT_ECODE_INVAL_ATTR_VALUE_LEN: number;

/**
 *
 */
export declare var ATT_ECODE_UNLIKELY: number;

/**
 *
 */
export declare var ATT_ECODE_INSUFF_ENC: number;

/**
 *
 */
export declare var ATT_ECODE_UNSUPP_GRP_TYPE: number;

/**
 *
 */
export declare var ATT_ECODE_INSUFF_RESOURCES: number;

/**
 *
 */
export declare var GATT_PRIM_SVC_UUID: number;

/**
 *
 */
export declare var GATT_INCLUDE_UUID: number;

/**
 *
 */
export declare var GATT_CHARAC_UUID: number;

/**
 *
 */
export declare var GATT_CLIENT_CHARAC_CFG_UUID: number;

/**
 *
 */
export declare var GATT_SERVER_CHARAC_CFG_UUID: number;

/**
 *
 */
export declare var ATT_CID: number;

/**
 * eslint-enable no-unused-vars
 */
declare interface Gatt {

  /**
   *
   * @param address
   * @param aclStream
   */
  new(address: any, aclStream: any): Gatt;

  /**
   *
   * @param cid
   * @param data
   */
  onAclStreamData(cid: any, data: any): void;

  /**
   *
   * @param encrypt
   */
  onAclStreamEncrypt(encrypt: any): void;

  /**
   *
   */
  onAclStreamEncryptFail(): void;

  /**
   *
   */
  onAclStreamEnd(): void;

  /**
   *
   * @param data
   */
  writeAtt(data: any): void;

  /**
   *
   * @param opcode
   * @param handle
   * @param status
   */
  errorResponse(opcode: any, handle: number, status: number): void;

  /**
   *
   * @param buffer
   * @param callback
   * @param writeCallback
   */
  _queueCommand(buffer: any, callback: /* Gatt.prototype._queueCommand1 */ any, writeCallback: /* Gatt.prototype._queueCommand2 */ any): void;

  /**
   *
   * @param mtu
   */
  mtuRequest(mtu: any): void;

  /**
   *
   * @param startHandle
   * @param endHandle
   * @param groupUuid
   */
  readByGroupRequest(startHandle: number, endHandle: number, groupUuid: number): void;

  /**
   *
   * @param startHandle
   * @param endHandle
   * @param groupUuid
   */
  readByTypeRequest(startHandle: any, endHandle: number, groupUuid: number): void;

  /**
   *
   * @param handle
   */
  readRequest(handle: any): void;

  /**
   *
   * @param handle
   * @param offset
   */
  readBlobRequest(handle: any, offset: any): void;

  /**
   *
   * @param startHandle
   * @param endHandle
   */
  findInfoRequest(startHandle: any, endHandle: number): void;

  /**
   *
   * @param handle
   * @param data
   * @param withoutResponse
   */
  writeRequest(handle: any, data: any, withoutResponse: boolean): void;

  /**
   *
   * @param handle
   * @param offset
   * @param data
   */
  prepareWriteRequest(handle: any, offset: number, data: any): void;

  /**
   *
   * @param handle
   * @param cancelPreparedWrites
   */
  executeWriteRequest(handle: any, cancelPreparedWrites: any): void;

  /**
   *
   */
  handleConfirmation(): void;

  /**
   *
   * @param mtu
   */
  exchangeMtu(mtu: any): void;

  /**
   *
   * @param uuids
   */
  discoverServices(uuids: any): void;

  /**
   *
   * @param serviceUuid
   * @param uuids
   */
  discoverIncludedServices(serviceUuid: any, uuids: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuids
   */
  discoverCharacteristics(serviceUuid: any, characteristicUuids: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   */
  read(serviceUuid: any, characteristicUuid: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   * @param data
   * @param withoutResponse
   */
  write(serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): void;

  /**
   * Perform a "long write" as described Bluetooth Spec section 4.9.4 "Write Long Characteristic Values"
   * @param serviceUuid
   * @param characteristicUuid
   * @param data
   * @param withoutResponse
   */
  longWrite(serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   * @param broadcast
   */
  broadcast(serviceUuid: any, characteristicUuid: any, broadcast: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   * @param notify
   */
  notify(serviceUuid: any, characteristicUuid: any, notify: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   */
  discoverDescriptors(serviceUuid: any, characteristicUuid: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   */
  readValue(serviceUuid: any, characteristicUuid: any, descriptorUuid: any): void;

  /**
   *
   * @param serviceUuid
   * @param characteristicUuid
   * @param descriptorUuid
   * @param data
   */
  writeValue(serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any): void;

  /**
   *
   * @param handle
   */
  readHandle(handle: any): void;

  /**
   *
   * @param handle
   * @param data
   * @param withoutResponse
   */
  writeHandle(handle: any, data: any, withoutResponse: any): void;
}

declare module "bleHciProtocolCentralGatt" {

  export default bleHciProtocolCentralGatt;    // es6 style module export
}
