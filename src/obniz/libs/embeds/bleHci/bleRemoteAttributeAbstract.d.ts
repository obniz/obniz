// Type definitions for bleHciBleRemoteAttributeAbstract
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleRemoteAttributeAbstract.prototype {
  // BleRemoteAttributeAbstract.prototype.notifyFromServer.!1

  /**
   *
   */
  interface NotifyFromServer1 {

    /**
     *
     */
    discoverdOnRemote: boolean;

    /**
     *
     */
    properties: any[];
  }
}

/**
 *
 */
declare interface BleRemoteAttributeAbstract {

  /**
   *
   */
  wsChildUuidName: string;

  /**
   *
   * @param params
   */
  new(params: any): BleRemoteAttributeAbstract;

  /**
   *
   */
  discoverChildren(): void;

  /**
   *
   * @return
   */
  discoverChildrenWait(): /* BleRemoteAttributeAbstract.prototype.+Promise */ any;

  /**
   * CALLBACKS
   */
  ondiscover(): void;

  /**
   *
   */
  ondiscoverfinished(): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notifyFromServer(notifyName: any, params: BleRemoteAttributeAbstract.prototype.NotifyFromServer1): void;
}

declare module "bleHciBleRemoteAttributeAbstract" {

  export default bleHciBleRemoteAttributeAbstract;    // es6 style module export
}
