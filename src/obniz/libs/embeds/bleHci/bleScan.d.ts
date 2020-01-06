// Type definitions for bleHciBleScan
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleScan.prototype {
  // BleScan.prototype.start.!0

  /**
   *
   */
  interface Start0 {
  }
}
declare namespace BleScan.prototype {
  // BleScan.prototype.start.!1

  /**
   *
   */
  interface Start1 {

    /**
     *
     */
    duplicate: boolean;
  }
}

/**
 *
 */
declare interface BleScan {

  /**
   *
   * @param obnizBle
   */
  new(obnizBle: any): BleScan;

  /**
   *
   * @param target
   * @param settings
   */
  start(target: BleScan.prototype.Start0, settings: BleScan.prototype.Start1): void;

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

  /**
   *
   */
  clearTimeoutTimer(): void;
}

declare module "bleHciBleScan" {

  export default bleHciBleScan;    // es6 style module export
}
