// Type definitions for bleHciBleRemoteDescriptor
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface BleRemoteDescriptor {

  /**
   *
   */
  parentName: string;

  /**
   *
   * @param params
   */
  new(params: any): BleRemoteDescriptor;

  /**
   *
   */
  read(): void;

  /**
   *
   * @param array
   */
  write(array: any): void;
}

declare module "bleHciBleRemoteDescriptor" {

  export default bleHciBleRemoteDescriptor;    // es6 style module export
}
