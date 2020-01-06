// Type definitions for bleHciProtocolPeripheralGatt
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace Gatt.prototype {
  // Gatt.prototype.setServices.!0
  type SetServices0 = any[];
}
declare namespace Gatt.prototype {
  // Gatt.prototype.send.!0

  /**
   *
   */
  interface Send0 {
  }
}
declare namespace Gatt.prototype {
  // Gatt.prototype.handleRequest.!0
  type HandleRequest0 = any[];
}
declare namespace Gatt.prototype {
  // Gatt.prototype.handleFindInfoRequest.!ret

  /**
   *
   */
  interface HandleFindInfoRequestRet {
  }
}
declare namespace Gatt.prototype {
  // Gatt.prototype.handleFindByTypeRequest.!ret

  /**
   *
   */
  interface HandleFindByTypeRequestRet {
  }
}
declare namespace Gatt.prototype {
  // Gatt.prototype.handleReadByGroupRequest.!ret

  /**
   *
   */
  interface HandleReadByGroupRequestRet {
  }
}
declare namespace Gatt.prototype {
  // Gatt.prototype.handleReadByTypeRequest.!ret

  /**
   *
   */
  interface HandleReadByTypeRequestRet {
  }
}

/**
 * var debug = require('debug')('gatt');
 */
declare function debug(): void;

/**
 * eslint-disable no-unused-vars
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
export declare var ATT_OP_FIND_BY_TYPE_REQ: number;

/**
 *
 */
export declare var ATT_OP_FIND_BY_TYPE_RESP: number;

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
export declare var ATT_OP_READ_MULTI_REQ: number;

/**
 *
 */
export declare var ATT_OP_READ_MULTI_RESP: number;

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
export declare var ATT_OP_WRITE_CMD: number;

/**
 *
 */
export declare var ATT_OP_PREP_WRITE_REQ: number;

/**
 *
 */
export declare var ATT_OP_PREP_WRITE_RESP: number;

/**
 *
 */
export declare var ATT_OP_EXEC_WRITE_REQ: number;

/**
 *
 */
export declare var ATT_OP_EXEC_WRITE_RESP: number;

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
export declare var ATT_OP_SIGNED_WRITE_CMD: number;

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
 * eslint-enable no-unused-vars
 */
export declare var ATT_CID: number;

/**
 *
 */
declare interface Gatt {

  /**
   *
   */
  new(): Gatt;

  /**
   *
   * @param services
   */
  setServices(services: Gatt.prototype.SetServices0): void;

  /**
   *
   * @param aclStream
   */
  setAclStream(aclStream: any): void;

  /**
   *
   * @param cid
   * @param data
   */
  onAclStreamData(cid: any, data: any): void;

  /**
   *
   */
  onAclStreamEnd(): void;

  /**
   *
   * @param data
   */
  send(data: Gatt.prototype.Send0): void;

  /**
   *
   * @param opcode
   * @param handle
   * @param status
   */
  errorResponse(opcode: number, handle: number, status: number): void;

  /**
   *
   * @param request
   */
  handleRequest(request: Gatt.prototype.HandleRequest0): void;

  /**
   *
   * @param request
   */
  handleMtuRequest(request: any): void;

  /**
   *
   * @param request
   * @return
   */
  handleFindInfoRequest(request: any): Gatt.prototype.HandleFindInfoRequestRet;

  /**
   *
   * @param request
   * @return
   */
  handleFindByTypeRequest(request: any): Gatt.prototype.HandleFindByTypeRequestRet;

  /**
   *
   * @param request
   * @return
   */
  handleReadByGroupRequest(request: any): Gatt.prototype.HandleReadByGroupRequestRet;

  /**
   *
   * @param request
   * @return
   */
  handleReadByTypeRequest(request: any): Gatt.prototype.HandleReadByTypeRequestRet;

  /**
   *
   * @param request
   */
  handleReadOrReadBlobRequest(request: any): void;

  /**
   *
   * @param request
   */
  handleWriteRequestOrCommand(request: any): void;

  /**
   *
   * @param request
   * @return
   */
  handlePrepareWriteRequest(request: any): /* Gatt.prototype.send.!0 */ any;

  /**
   *
   * @param request
   */
  handleExecuteWriteRequest(request: any): void;

  /**
   *
   * @param request
   */
  handleConfirmation(request: any): void;
}

declare module "bleHciProtocolPeripheralGatt" {

  export default bleHciProtocolPeripheralGatt;    // es6 style module export
}
