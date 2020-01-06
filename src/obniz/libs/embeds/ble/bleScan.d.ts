// Type definitions for bleScan
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface BleScan {

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): BleScan;

  /**
   *
   * @param target
   * @param settings
   */
  start(target: any, settings: any): void;

  /**
   *
   * @param target
   * @param settings
   * @return
   */
  startOneWait(target: any, settings: any): /* BleScan.prototype.+Promise */ any;

  /**
   *
   * @param target
   * @param settings
   * @return
   */
  startAllWait(target: any, settings: any): /* BleScan.prototype.+Promise */ any;

  /**
   *
   */
  end(): void;

  /**
   *
   * @param peripheral
   * @return
   */
  isTarget(peripheral: any): boolean;

  /**
   *
   */
  onfinish(): void;

  /**
   *
   */
  onfind(): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notifyFromServer(notifyName: any, params: any): void;
}

declare module "bleScan" {

  export default bleScan;    // es6 style module export
}
