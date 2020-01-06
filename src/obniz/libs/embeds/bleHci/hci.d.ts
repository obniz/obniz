// Type definitions for bleHciHci
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface ObnizBLEHci {

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): ObnizBLEHci;

  /**
   *
   * @param hciCommand
   */
  write(hciCommand: any): void;

  /**
   *
   * @param obj
   */
  notified(obj: any): void;

  /**
   *
   */
  onread(): void;
}

declare module "bleHciHci" {

  export default bleHciHci;    // es6 style module export
}
