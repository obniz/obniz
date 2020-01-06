// Type definitions for bleHciProtocolPeripheralAclStream
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface AclStream {

  /**
   *
   * @param hci
   * @param handle
   * @param localAddressType
   * @param localAddress
   * @param remoteAddressType
   * @param remoteAddress
   */
  new(hci: any, handle: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any): AclStream;

  /**
   *
   * @param cid
   * @param data
   */
  write(cid: any, data: any): void;

  /**
   *
   * @param cid
   * @param data
   */
  push(cid: any, data: any): void;

  /**
   *
   * @param encrypt
   */
  pushEncrypt(encrypt: any): void;

  /**
   *
   */
  pushLtkNegReply(): void;
}

declare module "bleHciProtocolPeripheralAclStream" {

  export default bleHciProtocolPeripheralAclStream;    // es6 style module export
}
