class Display {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.width = 128;
    this.height = 64;

    this._canvas = null;
    this._reset();
  }

  _reset() {
    this._pos = { x: 0, y: 0 };
    this.autoFlush = true;
  }

  warnCanvasAvailability() {
    if (this.Obniz.isNode) {
      throw new Error(
        'obniz.js require node-canvas to draw rich contents. see more detail on docs'
      );
    } else {
      throw new Error('obniz.js cant create canvas element to body');
    }
  }

  _preparedCanvas() {
    if (this._canvas) {
      return this._canvas;
    }
    if (this.Obniz.isNode) {
      try {
        const { createCanvas } = require('canvas');
        this._canvas = createCanvas(this.width, this.height);
      } catch (e) {
        // this.warnCanvasAvailability();
        return null;
      }
    } else {
      const identifier = 'obnizcanvas-' + this.Obniz.id;
      let canvas = document.getElementById(identifier);
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', identifier);
        canvas.style.visibility = 'hidden';
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style['-webkit-font-smoothing'] = 'none';
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(canvas);
      }
      this._canvas = canvas;
    }
    const ctx = this._canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#FFF';
    this._pos.x = 0;
    this._pos.y = 0;
    this.fontSize = 16;
    ctx.font = `${this.fontSize}px Arial`;
    return this._canvas;
  }

  _ctx() {
    const canvas = this._preparedCanvas();
    if (canvas) {
      return canvas.getContext('2d');
    }
  }

  font(font, size) {
    const ctx = this._ctx();
    if (typeof size !== 'number') {
      size = 16;
    }
    if (typeof font !== 'string') {
      font = 'Arial';
    }
    this.fontSize = size;
    ctx.font = '' + +' ' + size + 'px ' + font;
  }

  clear() {
    const ctx = this._ctx();
    this._pos.x = 0;
    this._pos.y = 0;
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#FFF';
      this.draw(ctx);
    } else {
      let obj = {};
      obj['display'] = {
        clear: true,
      };
      this.Obniz.send(obj);
    }
  }

  pos(x, y) {
    this._ctx(); //crete first
    if (typeof x == 'number') {
      this._pos.x = x;
    }
    if (typeof y == 'number') {
      this._pos.y = y;
    }
    return this._pos;
  }

  print(text) {
    const ctx = this._ctx();
    if (ctx) {
      ctx.fillText(text, this._pos.x, this._pos.y + this.fontSize);
      this.draw(ctx);
      this._pos.y += this.fontSize;
    } else {
      let obj = {};
      obj['display'] = {
        text: '' + text,
      };
      this.Obniz.send(obj);
    }
  }

  line(x_0, y_0, x_1, y_1) {
    const ctx = this._ctx();
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

  rect(x, y, width, height, mustFill) {
    const ctx = this._ctx();
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

  circle(x, y, r, mustFill) {
    const ctx = this._ctx();
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

  qr(text, correction) {
    let obj = {};
    obj['display'] = {
      qr: {
        text,
      },
    };
    if (correction) {
      obj['display'].qr.correction = correction;
    }
    this.Obniz.send(obj);
  }

  raw(data) {
    let obj = {};
    obj['display'] = {
      raw: data,
    };
    this.Obniz.send(obj);
  }

  setPinName(io, moduleName, funcName) {
    let obj = {};
    obj['display'] = {};
    obj['display']['pin_assign'] = {};
    obj['display']['pin_assign'][io] = {
      module_name: moduleName,
      pin_name: funcName,
    };

    this.Obniz.send(obj);
  }

  setPinNames(moduleName, data) {
    let obj = {};
    obj['display'] = {};
    obj['display']['pin_assign'] = {};
    let noAssignee = true;
    for (let key in data) {
      noAssignee = false;
      obj['display']['pin_assign'][key] = {
        module_name: moduleName,
        pin_name: data[key],
      };
    }
    if (!noAssignee) {
      this.Obniz.send(obj);
    }
  }

  _draw(ctx) {
    const stride = this.width / 8;
    let vram = new Array(stride * 64);
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      let index = parseInt(i / 4);
      let line = parseInt(index / this.width);
      let col = parseInt((index - line * this.width) / 8);
      let bits = parseInt(index - line * this.width) % 8;
      if (bits == 0) vram[line * stride + col] = 0x00;
      if (brightness > 0x7f) vram[line * stride + col] |= 0x80 >> bits;
    }
    this.raw(vram);
  }

  draw(ctx) {
    if (this.autoFlush) {
      this._draw(ctx);
    }
  }

  drawing(autoFlush) {
    this.autoFlush = autoFlush == true;
    const ctx = this._ctx();
    if (ctx) {
      this.draw(ctx);
    }
  }
}

module.exports = Display;
