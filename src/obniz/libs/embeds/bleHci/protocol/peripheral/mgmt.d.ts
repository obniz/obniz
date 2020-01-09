// Type definitions for bleHciProtocolPeripheralMgmt
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * let debug = require('debug')('mgmt');
 */
declare function debug(): void;

/**
 *
 */
export declare var LTK_INFO_SIZE: any;

/**
 *
 */
export declare var MGMT_OP_LOAD_LONG_TERM_KEYS: any;

/**
 *
 */
declare interface Mgmt {

  /**
   *
   * @param hciProtocol
   */
  new(hciProtocol: any): Mgmt;

  /**
   *
   * @param data
   */
  onSocketData(data: any): void;

  /**
   *
   * @param error
   */
  onSocketError(error: any): void;

  /**
   *
   * @param address
   * @param addressType
   * @param authenticated
   * @param master
   * @param ediv
   * @param rand
   * @param key
   */
  addLongTermKey(address: any, addressType: any, authenticated: any, master: any, ediv: any, rand: any, key: any): void;

  /**
   *
   */
  clearLongTermKeys(): void;

  /**
   *
   */
  loadLongTermKeys(): void;

  /**
   *
   * @param opcode
   * @param index
   * @param data
   */
  write(opcode: number, index: number, data: any): void;
}

declare module "bleHciProtocolPeripheralMgmt" {

  export default bleHciProtocolPeripheralMgmt;    // es6 style module export
}
