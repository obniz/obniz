// Type definitions for bleHciBleHelper
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare namespace BleHelper {

  /**
   *
   * @param uuid
   */
  function uuidFilter(uuid: any): void;

  /**
   *
   * @param str
   */
  function toCamelCase(str: any): void;

  /**
   *
   * @param str
   */
  function toSnakeCase(str: any): void;
}

declare module "bleHciBleHelper" {

  export default bleHciBleHelper;    // es6 style module export
}
