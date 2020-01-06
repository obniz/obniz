// Type definitions for bleRemoteCharacteristic
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleRemoteCharacteristic.prototype {
  // BleRemoteCharacteristic.prototype.toJSON.!ret

  /**
   *
   */
  interface ToJSONRet {

    /**
     *
     */
    properties: {};
  }
}
declare namespace BleRemoteCharacteristic.prototype {
  // BleRemoteCharacteristic.prototype.notifyFromServer.!1

  /**
   *
   */
  interface NotifyFromServer1 {

    /**
     *
     */
    needResponse: boolean;
  }
}

/**
 *
 */
declare interface BleRemoteCharacteristic {

  /**
   *
   */
  parentName: string;

  /**
   *
   */
  childrenName: string;

  /**
   *
   */
  properties: any[];

  /**
   *
   * @param params
   */
  new(params: any): BleRemoteCharacteristic;

  /**
   *
   * @param params
   */
  addDescriptor(params: any): void;

  /**
   * getCharacteristic(params) {
   *   return this.getChild(params)
   * }
   * @param uuid
   */
  getDescriptor(uuid: string): void;

  /**
   *
   * @param callback
   */
  registerNotify(callback: any): void;

  /**
   *
   * @param callback
   * @return
   */
  registerNotifyWait(callback: any): /* BleRemoteCharacteristic.prototype.+Promise */ any;

  /**
   *
   */
  unregisterNotify(): void;

  /**
   *
   * @return
   */
  unregisterNotifyWait(): /* BleRemoteCharacteristic.prototype.+Promise */ any;

  /**
   *
   */
  read(): void;

  /**
   *
   * @param array
   * @param needResponse
   */
  write(array: any, needResponse: boolean): void;

  /**
   *
   */
  discoverChildren(): void;

  /**
   *
   */
  discoverAllDescriptors(): void;

  /**
   *
   */
  discoverAllDescriptorsWait(): void;

  /**
   *
   * @return
   */
  toJSON(): BleRemoteCharacteristic.prototype.ToJSONRet;

  /**
   *
   * @return
   */
  canBroadcast(): boolean;

  /**
   *
   * @return
   */
  canNotify(): boolean;

  /**
   *
   * @return
   */
  canRead(): boolean;

  /**
   *
   * @return
   */
  canWrite(): boolean;

  /**
   *
   * @return
   */
  canWriteWithoutResponse(): boolean;

  /**
   *
   * @return
   */
  canIndicate(): boolean;

  /**
   *
   * @param descriptor
   */
  ondiscover(descriptor: any): void;

  /**
   *
   * @param descriptors
   */
  ondiscoverfinished(descriptors: any): void;

  /**
   *
   */
  ondiscoverdescriptor(): void;

  /**
   *
   */
  ondiscoverdescriptorfinished(): void;

  /**
   *
   */
  onregisternotify(): void;

  /**
   *
   */
  onunregisternotify(): void;

  /**
   *
   */
  onnotify(): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notifyFromServer(notifyName: any, params: BleRemoteCharacteristic.prototype.NotifyFromServer1): void;
}

declare module "bleRemoteCharacteristic" {

  export default bleRemoteCharacteristic;    // es6 style module export
}
