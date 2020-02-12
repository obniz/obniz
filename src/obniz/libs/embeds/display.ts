/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";

/**
 * Here we will show letters and pictures on OLED display on obniz Board.
 * ![](media://obniz_display_sphere.gif)
 * @category Embeds
 */
export default class Display {

  /**
   * display width size
   * @readonly
   */
  public readonly width: number;

  /**
   * display height size
   * @readonly
   */
  public readonly height: number;

  private autoFlush: boolean = true;
  private fontSize: number = 16;
  private Obniz: Obniz;
  private _canvas?: HTMLCanvasElement;
  private _pos!: { x: number, y: number };

  constructor(obniz: any) {
    this.Obniz = obniz;
    this.width = 128;
    this.height = 64;

    this._canvas = undefined;
    this._reset();
  }

  /**
   * (It does not work with node.js. Please use display.draw())
   *
   * This changes the font.
   * The options for fontFamily and fontSize depend on your browser.
   *
   * The default font is Arial 16px.
   * If you set the parameter to null, you will be using the default font.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.font('Avenir',30)
   * obniz.display.print("Avenir")
   *
   * obniz.display.font(null,30) //default font(Arial) 30px
   * obniz.display.font('Avenir') //Avenir with default size(16px)
   * ```
   * ![](media://obniz_display_samples3.jpg)
   * ![](media://obniz_display_samples2.jpg)
   * ![](media://obniz_display_samples1.jpg)
   *
   * @param font font name
   * @param size size of font
   */
  public font(font: string | null, size?: number) {
    const ctx: any = this._ctx();
    if (typeof size !== "number") {
      size = 16;
    }
    if (typeof font !== "string") {
      font = "Arial";
    }
    this.fontSize = size;
    ctx.font = "" + +" " + size + "px " + font;
  }

  /**
   * Clear the display.
   * ```javascript
   * // Javascript Example
   * obniz.display.clear();
   * ```
   */
  public clear() {
    const ctx: any = this._ctx();
    this._pos.x = 0;
    this._pos.y = 0;
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#FFF";
      ctx.strokeStyle = "#FFF";
      this.draw(ctx);
    } else {
      const obj: any = {};
      obj.display = {
        clear: true,
      };
      this.Obniz.send(obj);
    }
  }

  /**
   * (This does not work with node.js. Please use display.draw())
   * It changes the display position of a text. If you are using print() to display a text, position it to top left.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.pos(0,30);
   * obniz.display.print("YES. こんにちは");
   * ```
   * ![](media://obniz_display_pos.jpg)
   *  @param x
   *  @param y
   */
  public pos(x: number, y: number) {
    this._ctx(); // crete first
    if (typeof x === "number") {
      this._pos.x = x;
    }
    if (typeof y === "number") {
      this._pos.y = y;
    }
    return this._pos;
  }

  /**
   * Print text on display.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.print("Hello!");
   * ```
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.font('Serif',18)
   * obniz.display.print("Hello World🧡")
   * ```
   * ![](media://obniz_display_print.jpg)
   *
   *  @param text Text to display. With browser, UTF8 string is available. (It does not work with node.js. Please use display.draw())
   */
  public print(text: string) {
    const ctx: any = this._ctx();
    if (ctx) {
      ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
      this.draw(ctx);
      this._pos.y += this.fontSize;
    } else {
      const obj: any = {};
      obj.display = {
        text: "" + text,
      };
      this.Obniz.send(obj);
    }
  }

  /**
   * (It does not work with node.js. Please use display.draw())
   *
   *
   * Now we draw a line between two points.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.line(30, 30, 100, 30);
   * obniz.display.rect(20, 20, 20, 20);
   * obniz.display.circle(100, 30, 20);
   *
   * obniz.display.line(60, 50, 100, 30);
   * obniz.display.rect(50, 40, 20, 20, true);
   * obniz.display.line(50, 10, 100, 30);
   * obniz.display.circle(50, 10, 10, true);
   * ```
   *
   * ![](media://obniz_display_draws.jpg)
   *
   * @param x_0
   * @param y_0
   * @param x_1
   * @param y_1
   */
  public line(x_0: number, y_0: number, x_1: number, y_1: number) {
    const ctx: any = this._ctx();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x_0, y_0);
      ctx.lineTo(x_1, y_1);
      ctx.stroke();
      this.draw(ctx);
    } else {
      this.warnCanvasAvailability();
    }
  }

  /**
   * (It does not work with node.js. Please use display.draw())
   *
   *
   * This draws a rectangle.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.rect(10, 10, 20, 20);
   * obniz.display.rect(20, 20, 20, 20, true); // filled rect
   * ```
   *
   * @param x
   * @param y
   * @param width
   * @param height
   * @param mustFill
   */
  public rect(x: number, y: number, width: number, height: number, mustFill?: boolean) {
    const ctx: any = this._ctx();
    if (ctx) {
      if (mustFill) {
        ctx.fillRect(x, y, width, height);
      } else {
        ctx.strokeRect(x, y, width, height);
      }
      this.draw(ctx);
    } else {
      this.warnCanvasAvailability();
    }
  }

  /**
   * (It does not work with node.js. Please use display.draw())
   *
   * This draws a circle.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.circle(40, 30, 20);
   * obniz.display.circle(90, 30, 20, true); // filled circle
   * ```
   *
   * @param x
   * @param y
   * @param r
   * @param mustFill
   */
  public circle(x: number, y: number, r: number, mustFill?: boolean) {
    const ctx: any = this._ctx();
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (mustFill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      this.draw(ctx);
    } else {
      this.warnCanvasAvailability();
    }
  }

  /**
   * This shows QR code with given text and correction level.
   * The correction level can be
   *
   * - L
   * - M(default)
   * - Q
   * - H
   *
   * H is the strongest error correction.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.qr("https://obniz.io")
   * ```
   * @param text
   * @param correction
   */
  public qr(text: string, correction?: "L" | "M" | "Q" | "H") {
    const obj: any = {};
    obj.display = {
      qr: {
        text,
      },
    };
    if (correction) {
      obj.display.qr.correction = correction;
    }
    this.Obniz.send(obj);
  }

  /**
   * Draw BMP image
   *
   * ```javascript
   * obniz.display.raw([255, 255,,,,,])// must be 128*64 bits(=1024byte)
   * ```
   *
   * @param data data array. 1 bit represents 1 dot. 1=white, 0=black.
   * 1 byte is part of one line.
   * The order is as below.
   * {1byte} {2byte} {3byte}...{16byte}
   * {17byte} {18byte} {19byte}...
   * .....
   * .....................{1024byte}
   */
  public raw(data: number[]) {
    const obj: any = {};
    obj.display = {
      raw: data,
    };
    this.Obniz.send(obj);
  }

  /**
   * @ignore
   * @param io
   * @param moduleName
   * @param funcName
   */
  public setPinName(io: number, moduleName: string, funcName: string) {
    const obj: any = {};
    obj.display = {};
    obj.display.pin_assign = {};
    obj.display.pin_assign[io] = {
      module_name: moduleName,
      pin_name: funcName,
    };

    this.Obniz.send(obj);
  }

  /**
   * @ignore
   * @param moduleName
   * @param data
   */
  public setPinNames(moduleName: string, data: any) {
    const obj: any = {};
    obj.display = {};
    obj.display.pin_assign = {};
    let noAssignee: any = true;
    for (const key in data) {
      noAssignee = false;
      obj.display.pin_assign[key] = {
        module_name: moduleName,
        pin_name: data[key],
      };
    }
    if (!noAssignee) {
      this.Obniz.send(obj);
    }
  }

  /**
   * Draw OLED from HTML5 Canvas context.
   * With node-canvas, this works with node.js.
   *
   * - on HTML, load ctx from existing
   *
   * ```javascript
   * let ctx = $("#canvas")[0].getContext('2d');
   *
   * ctx.fillStyle = "white";
   * ctx.font = "30px Avenir";
   * ctx.fillText('Avenir', 0, 40);
   *
   * obniz.display.draw(ctx);
   * ```
   *
   * - on HTML, create new canvas dom and load it.
   *
   * ```javascript
   *
   * let ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);
   *
   * ctx.fillStyle = "white";
   * ctx.font = "30px Avenir";
   * ctx.fillText('Avenir', 0, 40);
   *
   * obniz.display.draw(ctx);
   * ```
   *
   * - running with node.js
   *
   * ```javascript
   * //    npm install canvas. ( version 2.0.0 or later required )
   * const { createCanvas } = require('canvas');
   * const canvas = createCanvas(128, 64);
   * const ctx = canvas.getContext('2d');
   *
   * ctx.fillStyle = "white";
   * ctx.font = "30px Avenir";
   * ctx.fillText('Avenir', 0, 40);
   *
   * obniz.display.draw(ctx);
   * ```
   *
   *
   * @param ctx
   */
  public draw(ctx: CanvasRenderingContext2D) {
    if (this.autoFlush) {
      this._draw(ctx);
    }
  }

  /**
   * You can specify to transfer the displayed data or not.
   * This affects only the functions that use canvas like clear/print/line/rect/circle/draw.
   *
   * Use false to stop updating OLED and true to restart updating.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.drawing(false);
   * for (var i=0;i<100; i++) {
   *   var x0 = Math.random() * 128;
   *   var y0 = Math.random() * 64;
   *   var x1 = Math.random() * 128;
   *   var y1 = Math.random() * 64;
   *   obniz.display.clear();
   *   obniz.display.line(x0, y0, x1, y1);
   * }
   * obniz.display.drawing(true);
   * ```
   * @param autoFlush
   */
  public drawing(autoFlush: boolean) {
    this.autoFlush = !!autoFlush;
    const ctx: any = this._ctx();
    if (ctx) {
      this.draw(ctx);
    }
  }

  private warnCanvasAvailability() {
    if (this.Obniz.isNode) {
      throw new Error(
        "obniz.js require node-canvas to draw rich contents. see more detail on docs",
      );
    } else {
      throw new Error("obniz.js cant create canvas element to body");
    }
  }

  private _reset() {
    this._pos = {x: 0, y: 0};
    this.autoFlush = true;
  }

  private _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.Obniz.isNode) {
      try {
        const {createCanvas} = require("canvas");
        this._canvas = createCanvas(this.width, this.height);
      } catch (e) {
        // this.warnCanvasAvailability();
        return null;
      }
    } else {
      const identifier: any = "obnizcanvas-" + this.Obniz.id;
      let canvas: any = document.getElementById(identifier);
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.setAttribute("id", identifier);
        canvas.style.visibility = "hidden";
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style["-webkit-font-smoothing"] = "none";
        const body: any = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
      }
      this._canvas = canvas;
    }
    const ctx: any = this._canvas!.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FFF";
    this._pos.x = 0;
    this._pos.y = 0;
    this.fontSize = 16;
    ctx.font = `${this.fontSize}px Arial`;
    return this._canvas;
  }

  private _ctx() {
    const canvas: any = this._preparedCanvas();
    if (canvas) {
      return canvas.getContext("2d");
    }
  }

  private _draw(ctx: CanvasRenderingContext2D) {
    const stride: any = this.width / 8;
    const vram: any = new Array(stride * 64);
    const imageData: any = ctx.getImageData(0, 0, this.width, this.height);
    const data: any = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness: any = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      const index: any = Math.floor(i / 4);
      const line: any = Math.floor(index / this.width);
      const col: any = Math.floor((index - line * this.width) / 8);
      const bits: any = Math.floor(index - line * this.width) % 8;
      if (bits === 0) {
        vram[line * stride + col] = 0x00;
      }
      if (brightness > 0x7f) {
        vram[line * stride + col] |= 0x80 >> bits;
      }
    }
    this.raw(vram);
  }
}
