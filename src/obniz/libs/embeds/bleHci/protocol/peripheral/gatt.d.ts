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
export declare var ATT_OP_ERROR: any;

/**
 *
 */
export declare var ATT_OP_MTU_REQ: any;

/**
 *
 */
export declare var ATT_OP_MTU_RESP: any;

/**
 *
 */
export declare var ATT_OP_FIND_INFO_REQ: any;

/**
 *
 */
export declare var ATT_OP_FIND_INFO_RESP: any;

/**
 *
 */
export declare var ATT_OP_FIND_BY_TYPE_REQ: any;

/**
 *
 */
export declare var ATT_OP_FIND_BY_TYPE_RESP: any;

/**
 *
 */
export declare var ATT_OP_READ_BY_TYPE_REQ: any;

/**
 *
 */
export declare var ATT_OP_READ_BY_TYPE_RESP: any;

/**
 *
 */
export declare var ATT_OP_READ_REQ: any;

/**
 *
 */
export declare var ATT_OP_READ_RESP: any;

/**
 *
 */
export declare var ATT_OP_READ_BLOB_REQ: any;

/**
 *
 */
export declare var ATT_OP_READ_BLOB_RESP: any;

/**
 *
 */
export declare var ATT_OP_READ_MULTI_REQ: any;

/**
 *
 */
export declare var ATT_OP_READ_MULTI_RESP: any;

/**
 *
 */
export declare var ATT_OP_READ_BY_GROUP_REQ: any;

/**
 *
 */
export declare var ATT_OP_READ_BY_GROUP_RESP: any;

/**
 *
 */
export declare var ATT_OP_WRITE_REQ: any;

/**
 *
 */
export declare var ATT_OP_WRITE_RESP: any;

/**
 *
 */
export declare var ATT_OP_WRITE_CMD: any;

/**
 *
 */
export declare var ATT_OP_PREP_WRITE_REQ: any;

/**
 *
 */
export declare var ATT_OP_PREP_WRITE_RESP: any;

/**
 *
 */
export declare var ATT_OP_EXEC_WRITE_REQ: any;

/**
 *
 */
export declare var ATT_OP_EXEC_WRITE_RESP: any;

/**
 *
 */
export declare var ATT_OP_HANDLE_NOTIFY: any;

/**
 *
 */
export declare var ATT_OP_HANDLE_IND: any;

/**
 *
 */
export declare var ATT_OP_HANDLE_CNF: any;

/**
 *
 */
export declare var ATT_OP_SIGNED_WRITE_CMD: any;

/**
 *
 */
export declare var GATT_PRIM_SVC_UUID: any;

/**
 *
 */
export declare var GATT_INCLUDE_UUID: any;

/**
 *
 */
export declare var GATT_CHARAC_UUID: any;

/**
 *
 */
export declare var GATT_CLIENT_CHARAC_CFG_UUID: any;

/**
 *
 */
export declare var GATT_SERVER_CHARAC_CFG_UUID: any;

/**
 *
 */
export declare var ATT_ECODE_SUCCESS: any;

/**
 *
 */
export declare var ATT_ECODE_INVALID_HANDLE: any;

/**
 *
 */
export declare var ATT_ECODE_READ_NOT_PERM: any;

/**
 *
 */
export declare var ATT_ECODE_WRITE_NOT_PERM: any;

/**
 *
 */
export declare var ATT_ECODE_INVALID_PDU: any;

/**
 *
 */
export declare var ATT_ECODE_AUTHENTICATION: any;

/**
 *
 */
export declare var ATT_ECODE_REQ_NOT_SUPP: any;

/**
 *
 */
export declare var ATT_ECODE_INVALID_OFFSET: any;

/**
 *
 */
export declare var ATT_ECODE_AUTHORIZATION: any;

/**
 *
 */
export declare var ATT_ECODE_PREP_QUEUE_FULL: any;

/**
 *
 */
export declare var ATT_ECODE_ATTR_NOT_FOUND: any;

/**
 *
 */
export declare var ATT_ECODE_ATTR_NOT_LONG: any;

/**
 *
 */
export declare var ATT_ECODE_INSUFF_ENCR_KEY_SIZE: any;

/**
 *
 */
export declare var ATT_ECODE_INVAL_ATTR_VALUE_LEN: any;

/**
 *
 */
export declare var ATT_ECODE_UNLIKELY: any;

/**
 *
 */
export declare var ATT_ECODE_INSUFF_ENC: any;

/**
 *
 */
export declare var ATT_ECODE_UNSUPP_GRP_TYPE: any;

/**
 *
 */
export declare var ATT_ECODE_INSUFF_RESOURCES: any;

/**
 * eslint-enable no-unused-vars
 */
export declare var ATT_CID: any;

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
