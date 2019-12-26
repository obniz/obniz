const WSCommand = require('./WSCommand_.js');

class WSCommand_PWM extends WSCommand {
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

  resetInternalStatus() {
    this.pwms = [];
    for (let i = 0; i < this.ModuleNum; i++) {
      this.pwms.push({});
    }
  }

  // Commands

  init(params, module) {
    let buf = new Uint8Array(2);
    buf[0] = module;
    buf[1] = params.io;
    this.pwms[module].io = params.io;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    let buf = new Uint8Array(1);
    buf[0] = module;
    this.pwms[module] = {};
    this.sendCommand(this._CommandDeinit, buf);
  }

  freq(params, module) {
    let buf = new Uint8Array(5);
    buf[0] = module;
    buf[1] = params.freq >> (8 * 3);
    buf[2] = params.freq >> (8 * 2);
    buf[3] = params.freq >> (8 * 1);
    buf[4] = params.freq;
    this.pwms[module].freq = params.freq;
    this.sendCommand(this._CommandSetFreq, buf);
  }

  pulse(params, module) {
    let buf = new Uint8Array(5);
    let pulseUSec = params.pulse * 1000;
    buf[0] = module;
    buf[1] = pulseUSec >> (8 * 3);
    buf[2] = pulseUSec >> (8 * 2);
    buf[3] = pulseUSec >> (8 * 1);
    buf[4] = pulseUSec;
    this.pwms[module].pulseUSec = pulseUSec;
    this.sendCommand(this._CommandSetDuty, buf);
  }

  amModulate(params, module) {
    const bitLength = params.modulate.data.length;
    const byteLength = parseInt((bitLength + 7) / 8);
    let buf = new Uint8Array(5 + byteLength);
    let symbol_length_usec = params.modulate.symbol_length * 1000;
    buf[0] = module;
    buf[1] = symbol_length_usec >> (8 * 3);
    buf[2] = symbol_length_usec >> (8 * 2);
    buf[3] = symbol_length_usec >> (8 * 1);
    buf[4] = symbol_length_usec;
    let bitIndex = 0;
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

  parseFromJson(json) {
    for (let i = 0; i < this.ModuleNum; i++) {
      let module = json['pwm' + i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        { uri: '/request/pwm/init', onValid: this.init },
        { uri: '/request/pwm/freq', onValid: this.freq },
        { uri: '/request/pwm/pulse', onValid: this.pulse },
        { uri: '/request/pwm/modulate', onValid: this.amModulate },
        { uri: '/request/pwm/deinit', onValid: this.deinit },
      ];
      let res = this.validateCommandSchema(schemaData, module, 'pwm' + i, i);

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

module.exports = WSCommand_PWM;
