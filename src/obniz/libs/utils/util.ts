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

  /**
   * @ignore
   * @param data
   * @param schema
   */
  public static hexToBinary(data: string, reverse: boolean = false): number[] {
    const array: number[] = [];
    const hex: string = data.toLowerCase().replace(/[^0-9abcdef]/g, "");
    for (let i = 0; i < hex.length / 2; i++) {
      array[i] = parseInt(hex[i * 2] + hex[i * 2 + 1], 16);
    }
    if (reverse) {
      array.reverse();
    }
    return array;
  }

  /**
   * @ignore
   * @param min
   * @param max
   * @param variable_name
   * @param variable
   */
  public static assertNumber(min: number, max: number, variable_name: string, variable: number) {
    if (!(min <= variable && variable <= max)) {
      throw new Error(
        `${variable_name} is out of range.Input value : ${variable} .value range [ ${min} <= ${variable_name} <= ${max} ]`,
      );
    }
  }

  public obniz: any;
  public width: any;
  public height: any;
  public createCanvas: any;

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
        const { createCanvas } = require("canvas");
        return createCanvas(this.width, this.height);
      } catch (e) {
        throw new Error("obniz.js require node-canvas to draw rich contents. see more detail on docs");
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
