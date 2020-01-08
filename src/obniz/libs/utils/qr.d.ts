// Type definitions for qr
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare namespace qrcode {
  // qrcode.stringToBytes.!ret
  type StringToBytesRet = number[];
}
declare namespace qrcode {
  // qrcode.createStringToBytes.!ret
  type CreateStringToBytesRet = ((s: any) => qrcode.createStringToBytes.CreateStringToBytesRetRet);
}
declare namespace qrcode.createStringToBytes {
  // qrcode.createStringToBytes.!ret.!ret
  type CreateStringToBytesRetRet = number[];
}

// qrcode.!ret

/**
 *
 */
declare interface Ret {

  /**
   *
   * @param data
   * @param mode
   */
  addData(data: any, mode: string): void;

  /**
   *
   * @return
   */
  getModules(): QrcodeRet.GetModulesRet;

  /**
   *
   * @param row
   * @param col
   */
  isDark(row: number, col: number): void;

  /**
   *
   * @return
   */
  getModuleCount(): number;

  /**
   *
   */
  make(): void;

  /**
   *
   * @param cellSize
   * @param margin
   * @return
   */
  createTableTag(cellSize: number, margin: number): string;

  /**
   *
   * @param context
   * @param cellSize
   */
  renderTo2dContext(context: QrcodeRet.RenderTo2dContext0, cellSize: number): void;
}

declare namespace QrcodeRet {
  // qrcode.!ret.getModules.!ret
  type GetModulesRet = number[];
}
declare namespace QrcodeRet {
  // qrcode.!ret.renderTo2dContext.!0

  /**
   *
   */
  interface RenderTo2dContext0 {

    /**
     *
     */
    fillStyle: string;
  }
}

/**
 * ---------------------------------------------------------------------
 * @param typeNumber
 * @param errorCorrectionLevel
 * @return
 */
declare function qrcode(typeNumber?: any, errorCorrectionLevel?: any): Ret;

/**
 *
 */
declare namespace qrcode {

  /**
   *
   */
  interface StringToBytesFuncs {

    /**
     *
     * @param s
     * @return
     */
    "UTF-8"(s: any): any;
  }

  /**
   *
   * @param s
   * @return
   */
  function stringToBytes(s: any): qrcode.StringToBytesRet;

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   * @param unicodeData
   * @param numChars
   * @return
   */
  function createStringToBytes(unicodeData: any, numChars: any): qrcode.CreateStringToBytesRet;
}

declare module "qr" {

  export default qr;    // es6 style module export
}
