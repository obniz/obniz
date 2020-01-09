class SharpMemoryTFT {

  public static info() {
    return {
      name: "SharpMemoryTFT",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public commands: any;
  public _canvas: any;
  public obniz: any;
  public io_cs: any;
  public params: any;
  public io_disp: any;
  public io_extcomin: any;
  public io_extmode: any;
  public spi: any;
  public width: any;
  public height: any;
  public _pos: any;
  public autoFlush: any;
  public fontSize: any;
  public createCanvas: any;

  constructor() {
    this.keys = [
      "vcc",
      "gnd",
      "vcc_a",
      "gnd_a",
      "sclk",
      "mosi",
      "cs",
      "disp",
      "extcomin",
      "extmode",
      "width",
      "height",
    ];

    this.requiredKeys = ["sclk", "mosi", "cs", "width", "height"];

    this.commands = {};
    this.commands.write = 0x80;
    this.commands.clear = 0x20;
    this.commands.vcom = 0x40;

    this._canvas = null;
    this._reset();
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    this.io_cs = obniz.getIO(this.params.cs);

    if (this.params.disp && this.params.extcomin && this.params.extmode) {
      this.io_disp = obniz.getIO(this.params.disp);
      this.io_extcomin = obniz.getIO(this.params.extcomin);
      this.io_extmode = obniz.getIO(this.params.extmode);
      this.io_disp.output(true);
      this.io_extcomin.output(false);
      this.io_extmode.output(false);
    }

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    obniz.setVccGnd(this.params.vcc_a, this.params.gnd_a, "5v");

    this.params.mode = "master";
    this.params.frequency = 1000 * 1000;
    this.params.clk = this.params.sclk;
    this.params.drive = "5v"; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.width = this.params.width;
    this.height = this.params.height;

    this.obniz.wait(100);
  }

  public _reverseBits(data: any) {
    let revData: any = 0;
    for (let i: any = 0; i < 8; i++) {
      revData += data & 0x01;
      data >>= 1;
      if (i < 7) {
        revData <<= 1;
      }
    }
    return revData;
  }

  public sendLSB(data: any) {
    this.spi.write([this._reverseBits(data)]);
  }

  public sendClear() {
    this.io_cs.output(true);
    this.spi.write([this.commands.clear | 0x00, 0x00]);
    this.io_cs.output(false);
  }

  public raw(rawData: any) {
    let oldline: any; let  currentline: any;
    const totalbytes: any = (this.width * this.height) / 8;
    let array: any = new Array(1024);
    let index: any = 0;
    array[index++] = this.commands.write | this.commands.vcom;
    oldline = currentline = 1;
    array[index++] = this._reverseBits(currentline);
    this.io_cs.output(true);
    for (let i = 0; i < totalbytes; i++) {
      array[index++] = rawData[i]; // lsb
      currentline = Math.floor((i + 1) / (this.width / 8) + 1);
      if (currentline !== oldline) {
        array[index++] = 0x00;
        if (currentline <= this.height) {
          array[index++] = this._reverseBits(currentline);
        }
        oldline = currentline;
      }
      if (index >= 1021) {
        // regarding SPI max.
        this.spi.write(array.slice(0, index));
        array = new Array(1024);
        index = 0;
      }
    }
    if (index > 0) {
      this.spi.write(array.slice(0, index));
    }
    this.spi.write([0x00]);
    this.io_cs.output(false);
  }

  // copy from display.js

  public _reset() {
    this._pos = {x: 0, y: 0};
    this.autoFlush = true;
  }

  public warnCanvasAvailability() {
    if (this.obniz.isNode) {
      throw new Error(
        "MemoryDisplay require node-canvas to draw rich contents. see more detail on docs",
      );
    } else {
      throw new Error("MemoryDisplay cant create canvas element to body");
    }
  }

  public _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.obniz.isNode) {
      try {
        const {createCanvas} = require("canvas");
        this._canvas = createCanvas(this.width, this.height);
      } catch (e) {
        // this.warnCanvasAvailability();
        return null;
      }
    } else {
      const identifier: any = "MemoryDispCanvas-" + this.obniz.id;
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
    const ctx: any = this._canvas.getContext("2d");
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    this._pos.x = 0;
    this._pos.y = 0;
    this.fontSize = 16;
    ctx.font = `${this.fontSize}px Arial`;
    return this._canvas;
  }

  public _ctx() {
    const canvas: any = this._preparedCanvas();
    if (canvas) {
      return canvas.getContext("2d");
    }
  }

  public font(font: any, size: any) {
    const ctx: any = this._ctx();
    if (typeof size !== "number") {
      size = 16;
    }
    if (typeof font !== "string") {
      font = "Arial";
    }
    this.fontSize = size;
    ctx.font = "" + size + "px " + font;
  }

  public clear() {
    const ctx: any = this._ctx();
    this._pos.x = 0;
    this._pos.y = 0;
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#000";
      this.draw(ctx);
    } else {
      this.sendClear();
    }
  }

  public pos(x: any, y: any) {
    this._ctx(); // crete first
    if (typeof x === "number") {
      this._pos.x = x;
    }
    if (typeof y === "number") {
      this._pos.y = y;
    }
    return this._pos;
  }

  public print(text: any) {
    const ctx: any = this._ctx();
    if (ctx) {
      ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
      this.draw(ctx);
      this._pos.y += this.fontSize;
    } else {
      /*
      let obj = {};
      obj['display'] = {
        text: '' + text,
      };
      this.obniz.send(obj);
      */
    }
  }

  public line(x_0: any, y_0: any, x_1: any, y_1: any) {
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

  public rect(x: any, y: any, width: any, height: any, mustFill: any) {
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

  public circle(x: any, y: any, r: any, mustFill: any) {
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

  public _draw(ctx: any) {
    const stride: any = this.width / 8;
    const vram: any = new Array(stride * 64);
    const imageData: any = ctx.getImageData(0, 0, this.width, this.height);
    const data: any = imageData.data;

    for (let i: any = 0; i < data.length; i += 4) {
      const brightness: any = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      const index: any = Math.floor(i / 4);
      const line: any = Math.floor(index / this.width);
      const col: any = Math.floor((index - line * this.width) / 8);
      const bits: any = Math.floor(index - line * this.width) % 8;
      if (bits === 0) {
        vram[line * stride + col] = 0x00;
      }
      if (brightness > 0x73) {
        vram[line * stride + col] |= 0x80 >> bits;
      }
    }
    this.raw(vram);
  }

  public draw(ctx: any) {
    if (this.autoFlush) {
      this._draw(ctx);
    }
  }

  public drawing(autoFlush: any) {
    this.autoFlush = autoFlush === true;
    const ctx: any = this._ctx();
    if (ctx) {
      this.draw(ctx);
    }
  }
}

if (typeof module === "object") {
  module.exports = SharpMemoryTFT;
}
