/**
 * @packageDocumentation
 * @ignore
 */
class ObnizUtil {

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
   *
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

  public static dataArray2string(data: any) {
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

  public static string2dataArray(str: any) {
    const buf: any = Buffer.from(str);
    return [...buf];
  }

  public obniz: any;
  public width: any;
  public height: any;
  public createCanvas: any;

  constructor(obniz: any) {
    this.obniz = obniz;
  }

  public createCanvasContext(width: any, height: any) {
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
