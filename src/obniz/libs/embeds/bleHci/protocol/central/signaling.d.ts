// Type definitions for bleHciProtocolCentralSignaling
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * let debug = require('debug')('signaling');
 */
declare function debug(): void;

/**
 *
 */
export declare var CONNECTION_PARAMETER_UPDATE_REQUEST: number;

/**
 *
 */
export declare var CONNECTION_PARAMETER_UPDATE_RESPONSE: number;

/**
 *
 */
export declare var SIGNALING_CID: number;

/**
 *
 */
declare interface Signaling {

  /**
   *
   * @param handle
   * @param aclStream
   */
  new(handle: any, aclStream: any): Signaling;

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
   * @param identifier
   * @param data
   */
  processConnectionParameterUpdateRequest(identifier: any, data: any): void;
}

declare module "bleHciProtocolCentralSignaling" {

  export default bleHciProtocolCentralSignaling;    // es6 style module export
}
