// Type definitions for bleHciBleAttributeAbstract
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleAttributeAbstract.prototype {
  // BleAttributeAbstract.prototype.addChild.!ret

  /**
   *
   */
  interface AddChildRet {
  }
}
declare namespace BleAttributeAbstract.prototype {
  // BleAttributeAbstract.prototype.toJSON.!ret

  /**
   *
   */
  interface ToJSONRet {

    /**
     *
     */
    data: /* BleAttributeAbstract.data */ any;
  }
}
declare namespace BleAttributeAbstract {
  // BleAttributeAbstract.children.<i>

  /**
   *
   */
  interface ChildrenI {

    /**
     *
     */
    parent: BleAttributeAbstract;
  }
}
declare namespace BleAttributeAbstract.prototype {
  // BleAttributeAbstract.prototype.getChild.!ret

  /**
   *
   */
  interface GetChildRet {

    /**
     *
     */
    parent: BleAttributeAbstract;
  }
}

/**
 *
 */
declare interface BleAttributeAbstract {

  /**
   *
   */
  childrenClass: object;

  /**
   *
   */
  getChild: /*no type*/{};

  /**
   *
   */
  children: BleAttributeAbstract.ChildrenI[];

  /**
   *
   */
  isRemote: boolean;

  /**
   *
   */
  discoverdOnRemote: boolean;

  /**
   *
   */
  data: any[];

  /**
   *
   * @param params
   */
  new(params: any): BleAttributeAbstract;

  /**
   *
   */
  setFunctions(): void;

  /**
   *
   * @param child
   * @return
   */
  addChild(child: any): BleAttributeAbstract.prototype.AddChildRet;

  /**
   *
   * @return
   */
  toJSON(): BleAttributeAbstract.prototype.ToJSONRet;

  /**
   * WS COMMANDS
   */
  read(): void;

  /**
   *
   */
  write(): void;

  /**
   *
   * @param val
   * @param needResponse
   */
  writeNumber(val: any, needResponse: any): void;

  /**
   *
   * @param str
   * @param needResponse
   */
  writeText(str: any, needResponse: any): void;

  /**
   *
   * @return
   */
  readWait(): /* BleAttributeAbstract.prototype.+Promise */ any;

  /**
   *
   * @param data
   * @param needResponse
   * @return
   */
  writeWait(data: any, needResponse: any): /* BleAttributeAbstract.prototype.+Promise */ any;

  /**
   *
   * @param data
   * @return
   */
  writeTextWait(data: any): /* BleAttributeAbstract.prototype.+Promise */ any;

  /**
   *
   * @param data
   * @return
   */
  writeNumberWait(data: any): /* BleAttributeAbstract.prototype.+Promise */ any;

  /**
   *
   * @return
   */
  readFromRemoteWait(): /* BleAttributeAbstract.prototype.+Promise */ any;

  /**
   *
   * @return
   */
  writeFromRemoteWait(): /* BleAttributeAbstract.prototype.+Promise */ any;

  /**
   * CALLBACKS
   */
  onwrite(): void;

  /**
   *
   */
  onread(): void;

  /**
   *
   */
  onwritefromremote(): void;

  /**
   *
   */
  onreadfromremote(): void;

  /**
   *
   * @param err
   */
  onerror(err: any): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notifyFromServer(notifyName: any, params: any): void;
}

/**
 *
 */
declare namespace bleHciBleAttributeAbstract {

}

declare module "bleHciBleAttributeAbstract" {

  export default bleHciBleAttributeAbstract;    // es6 style module export
}
