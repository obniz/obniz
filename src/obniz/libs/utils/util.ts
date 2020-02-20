/**
 * @packageDocumentation
 * @module ObnizCore
 */
class ObnizUtil {

  /**
   * @ignore
   * @param params
   * @param keys
   * @private
   */
  public static _keyFilter(params: any, keys: any) {
    let filterdParams: any = {};
    if (typeof params !== "object") {
      return filterdParams;
    }
    filterdParams = Object.keys(params)
      .filter((key) => keys.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    return filterdParams;
  }

  /**
   * @ignore
   * @return {String} key name of not found.
   */
  public static _requiredKeys(params: any, keys: any) {
    if (typeof params !== "object") {
      return keys[0];
    }

    for (const index in keys) {
      if (!(keys[index] in params)) {
        return keys[index];
      }
    }
    return null;
  }

  /**
   * convert from data array to string
   * @param data
   */
  public static dataArray2string(data: number[]): string | null {
    let string: any = null;
    try {
      const StringDecoder: any = require("string_decoder").StringDecoder;
      if (StringDecoder) {
        string = new StringDecoder("utf8").write(Buffer.from(data));
      }
    } catch (e) {
      // this.obniz.error(e);
    }
    return string;
  }

  /**
   * convert from string to data array
   * @param str
   */
  public static string2dataArray(str: string) {
    const buf: any = Buffer.from(str);
    return [...buf];
  }

  private obniz: any;
  private width: any;
  private height: any;
  private createCanvas: any;

  constructor(obniz: any) {
    this.obniz = obniz;
  }

  /**
   * This creates a Canvas context.
   * It will add a canvas dom to body(in html).
   *
   * ```javascript
   * // Example
   * const ctx = obniz.util.createCanvasContext(128, 64);
   * ctx.font = "9px sans-serif";
   * ctx.fillText('Hello', 0, 7);
   * ```
   *
   * @param width
   * @param height
   */
  public createCanvasContext(width: number, height: number) {
    if (this.obniz.isNode) {
      try {
        const {createCanvas} = require("canvas");
        return createCanvas(this.width, this.height);
      } catch (e) {
        throw new Error(
          "obniz.js require node-canvas to draw rich contents. see more detail on docs",
        );
      }
    } else {
      const canvas: any = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      (canvas.style as any)["-webkit-font-smoothing"] = "none";
      const body: any = document.getElementsByTagName("body")[0];
      body.appendChild(canvas);

      const ctx: any = canvas.getContext("2d");
      return ctx;
    }
  }
}

export default ObnizUtil;
