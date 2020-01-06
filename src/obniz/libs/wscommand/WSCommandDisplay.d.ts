// Type definitions for WSCommandDisplay
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface WSCommandDisplay {

  /**
   *
   */
  module: number;

  /**
   *
   */
  _CommandClear: number;

  /**
   *
   */
  _CommandPrint: number;

  /**
   *
   */
  _CommandDrawCampusVerticalBytes: number;

  /**
   *
   */
  _CommandDrawCampusHorizonalBytes: number;

  /**
   *
   */
  _CommandDrawIOState: number;

  /**
   *
   */
  _CommandSetPinName: number;

  /**
   *
   */
  Float32Array: {

    /**
     *
     */
    new(): WSCommandDisplay;

    /**
     * Commands
     * @param params
     */
    clear(params: any): void;

    /**
     *
     * @param buf
     */
    print(buf: Float32Array): void;

    /**
     *
     * @param text
     */
    printText(text: any): void;

    /**
     *
     * @param params
     */
    text(params: /* WSCommandDisplay.prototype.+WSCommandDisplay */ any): void;

    /**
     *
     * @param params
     */
    raw(params: any): void;

    /**
     *
     * @param params
     */
    qr(params: any): void;

    /**
     *
     * @param params
     */
    pinName(params: any): void;

    /**
     *
     * @param buf
     */
    drawVertically(buf: any): void;

    /**
     *
     * @param buf
     */
    drawHorizonally(buf: Float32Array): void;

    /**
     *
     * @param val
     */
    drawIOState(val: any): void;

    /**
     *
     * @param no
     * @param moduleName
     * @param pinName
     */
    setPinName(no: number, moduleName: string, pinName: string): void;

    /**
     *
     * @param json
     */
    parseFromJson(json: any): void;

  };
}

declare module "WSCommandDisplay" {

  export default WSCommandDisplay;    // es6 style module export
}
