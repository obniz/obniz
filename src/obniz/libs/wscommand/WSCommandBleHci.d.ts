// Type definitions for WSCommandBleHci
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandBleHci.prototype {
  // WSCommandBleHci.prototype.schemaData.!ret
  type SchemaDataRet = WSCommandBleHci.prototype.schemaData.SchemaDataRetI[];
}
declare namespace WSCommandBleHci.prototype.schemaData {
  // WSCommandBleHci.prototype.schemaData.!ret.<i>

  /**
   *
   */
  interface SchemaDataRetI {

    /**
     *
     */
    uri: string;

    /**
     *
     * @param params
     * @param module
     */
    onValid(params: WSCommandBleHci.prototype.schemaData.RetI.OnValid0, module: any): void;
  }
}
declare namespace WSCommandBleHci.prototype {
  // WSCommandBleHci.prototype.notifyFunctionList.!ret

  /**
   *
   */
  interface NotifyFunctionListRet {
  }
}
declare namespace WSCommandBleHci.prototype {
  // WSCommandBleHci.prototype.send.!0

  /**
   *
   */
  interface Send0 {

    /**
     *
     */
    hci: {

      /**
       *
       */
      read: {

        /**
         *
         */
        data: any[];
      },
    };
  }
}
declare namespace WSCommandBleHci.prototype {
  // WSCommandBleHci.prototype.recv.!0

  /**
   *
   */
  interface Recv0 {

    /**
     *
     */
    ble: /* WSCommandBleHci.prototype.send.!0 */ any;
  }
}
declare namespace WSCommandBleHci.prototype.NotifyFunctionListRet {
  // WSCommandBleHci.prototype.notifyFunctionList.!ret.<i>.!0

  /**
   *
   */
  interface NotifyFunctionListRetI0 {

    /**
     *
     */
    ble: /* WSCommandBleHci.prototype.send.!0 */ any;
  }
}
declare namespace WSCommandBleHci.prototype.schemaData.RetI {
  // WSCommandBleHci.prototype.schemaData.!ret.<i>.onValid.!0

  /**
   *
   */
  interface OnValid0 {

    /**
     *
     */
    hci: {

      /**
       *
       */
      read: {

        /**
         *
         */
        data: /* WSCommandBleHci.prototype.send.!0.hci.read.data */ any;
      },
    };
  }
}

/**
 *
 */
declare interface WSCommandBleHci {

  /**
   *
   * @param delegate
   */
  new(delegate: any): WSCommandBleHci;

  /**
   *
   * @return
   */
  schemaData(): WSCommandBleHci.prototype.SchemaDataRet;

  /**
   *
   * @return
   */
  notifyFunctionList(): WSCommandBleHci.prototype.NotifyFunctionListRet;

  /**
   *
   * @param params
   * @param module
   */
  send(params: WSCommandBleHci.prototype.Send0, module: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  recv(objToSend: WSCommandBleHci.prototype.Recv0, payload: any): void;
}

declare module "WSCommandBleHci" {

  export default WSCommandBleHci;    // es6 style module export
}
