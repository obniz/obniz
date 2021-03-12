/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandPWM extends WSCommand {
  public module: any;
  public ModuleNum: any;
  public _CommandInit: any;
  public _CommandDeinit: any;
  public _CommandSetFreq: any;
  public _CommandSetDuty: any;
  public _CommandAMModulate: any;
  public pwms: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 3;
    this.ModuleNum = 6;
    this.resetInternalStatus();

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandSetFreq = 2;
    this._CommandSetDuty = 3;
    this._CommandAMModulate = 4;
  }

  public resetInternalStatus() {
    this.pwms = [];
    for (let i = 0; i < this.ModuleNum; i++) {
      this.pwms.push({});
    }
  }

  // Commands

  public init(params: any, module: any) {
    const buf: any = new Uint8Array(2);
    buf[0] = module;
    buf[1] = params.io;
    this.pwms[module].io = params.io;
    this.sendCommand(this._CommandInit, buf);
  }

  public deinit(params: any, module: any) {
    const buf: any = new Uint8Array(1);
    buf[0] = module;
    this.pwms[module] = {};
    this.sendCommand(this._CommandDeinit, buf);
  }

  public freq(params: any, module: any) {
    const buf: any = new Uint8Array(5);
    buf[0] = module;
    buf[1] = params.freq >> (8 * 3);
    buf[2] = params.freq >> (8 * 2);
    buf[3] = params.freq >> (8 * 1);
    buf[4] = params.freq;
    this.pwms[module].freq = params.freq;
    this.sendCommand(this._CommandSetFreq, buf);
  }

  public pulse(params: any, module: any) {
    const buf: any = new Uint8Array(5);
    const pulseUSec: any = params.pulse * 1000;
    buf[0] = module;
    buf[1] = pulseUSec >> (8 * 3);
    buf[2] = pulseUSec >> (8 * 2);
    buf[3] = pulseUSec >> (8 * 1);
    buf[4] = pulseUSec;
    this.pwms[module].pulseUSec = pulseUSec;
    this.sendCommand(this._CommandSetDuty, buf);
  }

  public amModulate(params: any, module: any) {
    const bitLength: any = params.modulate.data.length;
    const byteLength: any = Math.floor((bitLength + 7) / 8);
    const buf: any = new Uint8Array(5 + byteLength);
    const symbol_length_usec: any = params.modulate.symbol_length * 1000;
    buf[0] = module;
    buf[1] = symbol_length_usec >> (8 * 3);
    buf[2] = symbol_length_usec >> (8 * 2);
    buf[3] = symbol_length_usec >> (8 * 1);
    buf[4] = symbol_length_usec;
    let bitIndex: any = 0;
    for (let byte = 0; byte < byteLength; byte++) {
      buf[5 + byte] = 0;
      for (let bit = 0; bit < 8; bit++) {
        if (params.modulate.data[bitIndex++]) {
          buf[5 + byte] |= 0x80 >>> bit;
        }
      }
    }
    this.sendCommand(this._CommandAMModulate, buf);
  }

  public parseFromJson(json: any) {
    for (let i = 0; i < this.ModuleNum; i++) {
      const module: any = json["pwm" + i];
      if (module === undefined) {
        continue;
      }

      const schemaData: any = [
        { uri: "/request/pwm/init", onValid: this.init },
        { uri: "/request/pwm/freq", onValid: this.freq },
        { uri: "/request/pwm/pulse", onValid: this.pulse },
        { uri: "/request/pwm/modulate", onValid: this.amModulate },
        { uri: "/request/pwm/deinit", onValid: this.deinit },
      ];
      const res: any = this.validateCommandSchema(schemaData, module, "pwm" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[pwm${i}]unknown command`);
        }
      }
    }
  }
}

export default WSCommandPWM;
