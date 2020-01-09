const WSCommand: any = require("./WSCommand.js").default;
import qrcode from "../utils/qr";

class WSCommandDisplay extends WSCommand {
  public module: any;
  public _CommandClear: any;
  public _CommandPrint: any;
  public _CommandDrawCampusVerticalBytes: any;
  public _CommandDrawCampusHorizonalBytes: any;
  public _CommandDrawIOState: any;
  public _CommandSetPinName: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

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

  public clear(params: any) {
    this.sendCommand(this._CommandClear, null);
  }

  public print(buf: any) {
    this.sendCommand(this._CommandPrint, buf);
  }

  public printText(text: any) {
    let result: any;
    const buf: any = Buffer.from(text, "utf8");
    result = new Uint8Array(buf);
    this.print(result);
  }

  public text(params: any) {
    this.printText(params.text);
  }

  public raw(params: any) {
    this.drawHorizonally(new Uint8Array(params.raw));
  }

  public qr(params: any) {
    const text: any = params.qr.text;
    const correctionLevel: any = params.qr.correction || "M";

    const typeNumber: any = 0; // auto detect type.
    const qr: any = qrcode(typeNumber, correctionLevel);
    qr.addData(text);
    qr.make();
    let size: any = qr.getModuleCount();
    if (size) {
      size *= 2;
      const modules: any = qr.getModules();
      const vram: any = new Uint8Array(1024);
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

  public pinName(params: any) {
    for (let i = 0; i < 40; i++) {
      if (typeof params.pin_assign[i] === "object") {
        this.setPinName(
          i,
          params.pin_assign[i].module_name || "?",
          params.pin_assign[i].pin_name || "?",
        );
      }
    }
  }

  public drawVertically(buf: any) {
    this.sendCommand(this._CommandDrawCampusVerticalBytes, buf);
  }

  public drawHorizonally(buf: any) {
    this.sendCommand(this._CommandDrawCampusHorizonalBytes, buf);
  }

  public drawIOState(val: any) {
    const buf: any = new Uint8Array([!val]);
    this.sendCommand(this._CommandDrawIOState, buf);
  }

  public setPinName(no: any, moduleName: any, pinName: any) {
    let str: any = moduleName.slice(0, 4) + " " + pinName;
    str = str.slice(0, 9);

    const buf: any = new Uint8Array(1);
    buf[0] = no;

    const stringarray: any = new Uint8Array(Buffer(str, "utf8"));
    const combined: any = new Uint8Array(buf.length + stringarray.length);
    combined.set(buf, 0);
    combined.set(stringarray, 1);

    this.sendCommand(this._CommandSetPinName, combined);
  }

  public parseFromJson(json: any) {
    const module: any = json.display;
    if (module === undefined) {
      return;
    }

    const schemaData: any = [
      {uri: "/request/display/clear", onValid: this.clear},
      {uri: "/request/display/text", onValid: this.text},
      {uri: "/request/display/raw", onValid: this.raw},
      {uri: "/request/display/pin_assign", onValid: this.pinName},
      {uri: "/request/display/qr", onValid: this.qr},
    ];
    const res: any = this.validateCommandSchema(schemaData, module, "display");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[display]unknown command`);
      }
    }
  }
}

export default WSCommandDisplay;
