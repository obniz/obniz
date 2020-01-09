class Display {
  public Obniz: any;
  public width: any;
  public height: any;
  public _canvas: any;
  public _pos: any;
  public autoFlush: any;
  public fontSize: any;
  public createCanvas: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this.width = 128;
    this.height = 64;

    this._canvas = null;
    this._reset();
  }

  public _reset() {
    this._pos = {x: 0, y: 0};
    this.autoFlush = true;
  }

  public warnCanvasAvailability() {
    if (this.Obniz.isNode) {
      throw new Error(
        "obniz.js require node-canvas to draw rich contents. see more detail on docs",
      );
    } else {
      throw new Error("obniz.js cant create canvas element to body");
    }
  }

  public _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.Obniz.isNode) {
      try {
        const {createCanvas} = require("canvas");
        this._canvas = createCanvas(this.width, this.height);
      } catch (e: any) {
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
    const ctx: any = this._canvas.getContext("2d");
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
    ctx.font = "" + +" " + size + "px " + font;
  }

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
      const obj: any = {};
      obj.display = {
        text: "" + text,
      };
      this.Obniz.send(obj);
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

  public qr(text: any, correction: any) {
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

  public raw(data: any) {
    const obj: any = {};
    obj.display = {
      raw: data,
    };
    this.Obniz.send(obj);
  }

  public setPinName(io: any, moduleName: any, funcName: any) {
    const obj: any = {};
    obj.display = {};
    obj.display.pin_assign = {};
    obj.display.pin_assign[io] = {
      module_name: moduleName,
      pin_name: funcName,
    };

    this.Obniz.send(obj);
  }

  public setPinNames(moduleName: any, data: any) {
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

  public _draw(ctx: any) {
    const stride: any = this.width / 8;
    const vram: any = new Array(stride * 64);
    const imageData: any = ctx.getImageData(0, 0, this.width, this.height);
    const data: any = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness: any = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      const index: any = parseInt(i / 4);
      const line: any = parseInt(index / this.width);
      const col: any = parseInt((index - line * this.width) / 8);
      const bits: any = parseInt(index - line * this.width) % 8;
      if (bits === 0) {
        vram[line * stride + col] = 0x00;
      }
      if (brightness > 0x7f) {
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

module.exports = Display;
