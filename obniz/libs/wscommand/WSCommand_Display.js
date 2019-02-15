const WSCommand = require('./WSCommand_.js');
const qrcode = require('../utils/qr');

class WSCommand_Display extends WSCommand {
  constructor() {
    super();
    this.module = 8;

    this._CommandClear = 0;
    this._CommandPrint = 1;
    this._CommandDrawCampusVerticalBytes = 2;
    this._CommandDrawCampusHorizonalBytes = 3;
    this._CommandDrawIOState = 4;
    this._CommandSetPinName = 5;
  }

  // Commands

  clear(params) {
    this.sendCommand(this._CommandClear, null);
  }

  print(buf) {
    this.sendCommand(this._CommandPrint, buf);
  }

  printText(text) {
    let result;
    const buf = Buffer.from(text, 'utf8');
    result = new Uint8Array(buf);
    this.print(result);
  }

  text(params) {
    this.printText(params.text);
  }

  raw(params) {
    this.drawHorizonally(new Uint8Array(params.raw));
  }

  qr(params) {
    const text = params.qr.text;
    const correctionLevel = params.qr.correction || 'M';

    const typeNumber = 0; // auto detect type.
    const qr = qrcode(typeNumber, correctionLevel);
    qr.addData(text);
    qr.make();
    let size = qr.getModuleCount();
    if (size) {
      size *= 2;
      const modules = qr.getModules();
      let vram = new Uint8Array(1024);
      vram.fill(0);

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < size + 4; col++) {
          vram[parseInt(row * 16 + col / 8)] |= 0x80 >> col % 8;
          vram[parseInt((row + size + 2) * 16 + col / 8)] |= 0x80 >> col % 8;
        }
      }
      for (let row = 2; row < size + 2; row++) {
        for (let col = 0; col < 2; col++) {
          vram[parseInt(row * 16 + col / 8)] |= 0x80 >> col % 8;
        }
        for (let col = size + 2; col < size + 4; col++) {
          vram[parseInt(row * 16 + col / 8)] |= 0x80 >> col % 8;
        }
      }

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (!modules[parseInt(row / 2)][parseInt(col / 2)]) {
            vram[parseInt((row + 2) * 16 + (col + 2) / 8)] |=
              0x80 >> (col + 2) % 8;
          }
        }
      }
      this.drawHorizonally(vram);
    }
  }

  pinName(params) {
    for (let i = 0; i < 12; i++) {
      if (typeof params.pin_assign[i] === 'object') {
        this.setPinName(
          i,
          params.pin_assign[i].module_name || '?',
          params.pin_assign[i].pin_name || '?'
        );
      }
    }
  }

  drawVertically(buf) {
    this.sendCommand(this._CommandDrawCampusVerticalBytes, buf);
  }

  drawHorizonally(buf) {
    this.sendCommand(this._CommandDrawCampusHorizonalBytes, buf);
  }

  drawIOState(val) {
    let buf = new Uint8Array([!val]);
    this.sendCommand(this._CommandDrawIOState, buf);
  }

  setPinName(no, moduleName, pinName) {
    let str = moduleName.slice(0, 4) + ' ' + pinName;
    str = str.slice(0, 9);

    let buf = new Uint8Array(1);
    buf[0] = no;

    let stringarray = new Uint8Array(Buffer(str, 'utf8'));
    let combined = new Uint8Array(buf.length + stringarray.length);
    combined.set(buf, 0);
    combined.set(stringarray, 1);

    this.sendCommand(this._CommandSetPinName, combined);
  }

  parseFromJson(json) {
    let module = json['display'];
    if (module === undefined) {
      return;
    }

    let schemaData = [
      { uri: '/request/display/clear', onValid: this.clear },
      { uri: '/request/display/text', onValid: this.text },
      { uri: '/request/display/raw', onValid: this.raw },
      { uri: '/request/display/pin_assign', onValid: this.pinName },
      { uri: '/request/display/qr', onValid: this.qr },
    ];
    let res = this.validateCommandSchema(schemaData, module, 'display');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[display]unknown command`);
      }
    }
  }
}

module.exports = WSCommand_Display;
