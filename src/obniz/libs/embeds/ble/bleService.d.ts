// Type definitions for bleService
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface BleService {

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
  advData: {

    /**
     *
     */
    flags: string[];

    /**
     *
     */
    serviceUuids: any[];
  };

  /**
   *
   * @param obj
   */
  new(obj: any): BleService;

  /**
   *
   */
  end(): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notify(notifyName: any, params: any): void;
}

declare module "bleService" {

  export default bleService;    // es6 style module export
}
