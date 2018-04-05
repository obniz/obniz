const WSCommand = require("./WSCommand_.js");

class WSCommand_PWM extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 3;
    this.ModuleNum = 6;
    this.resetInternalStatus();

    this._CommandInit     = 0
    this._CommandDeinit   = 1
    this._CommandSetFreq  = 2
    this._CommandSetDuty  = 3
    this._CommandAMModulate = 4
  }

  resetInternalStatus() {
    this.pwms = [];
    for (var i=0; i<this.ModuleNum; i++) {
      this.pwms.push({});
    }
  }

  // Commands

  init(params, module) {
    var buf = new Uint8Array(2);
    buf[0] = module;
    buf[1] = params.io;
    this.pwms[module].io = params.io;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params, module) {
    var buf = new Uint8Array(1);
    buf[0] = module;
    this.pwms[module] = {};
    this.sendCommand(this._CommandDeinit, buf);
  }

  freq(params, module) {
    var buf = new Uint8Array(5);
    buf[0] = module;
    buf[1] = params.freq >> (8*3);
    buf[2] = params.freq >> (8*2);
    buf[3] = params.freq >> (8*1);
    buf[4] = params.freq;
    this.pwms[module].freq = params.freq;
    this.sendCommand(this._CommandSetFreq, buf);
  }

  pulse(params, module){
    let buf = new Uint8Array(5);
    let pulseUSec = params.pulse * 1000;
    buf[0] = module;
    buf[1] = pulseUSec >> (8*3);
    buf[2] = pulseUSec >> (8*2);
    buf[3] = pulseUSec >> (8*1);
    buf[4] = pulseUSec;
    this.pwms[module].pulseUSec = pulseUSec;
    this.sendCommand(this._CommandSetDuty, buf);
  }

  duty(params, module) {
    let buf = new Uint8Array(5);
    let pulseUSec = 1.0 / this.pwms[module].freq * params.duty * 0.01 * 1000000;
    pulseUSec = parseInt(pulseUSec);
    buf[0] = module;
    buf[1] = pulseUSec >> (8*3);
    buf[2] = pulseUSec >> (8*2);
    buf[3] = pulseUSec >> (8*1);
    buf[4] = pulseUSec;
    this.pwms[module].pulseUSec = pulseUSec;
    this.sendCommand(this._CommandSetDuty, buf);
  }

  amModulate(params, module) {
    var buf = new Uint8Array(5 + params.modulate.data.length);
    let symbol_length_usec =  params.modulate.symbol_length * 1000;
    buf[0] = module;
    buf[1] = symbol_length_usec >> (8*3);
    buf[2] = symbol_length_usec >> (8*2);
    buf[3] = symbol_length_usec >> (8*1);
    buf[4] = symbol_length_usec;
    for (var i=0; i<params.modulate.data.length; i++) {
      buf[5 + i] = params.modulate.data[i];
    }
    this.sendCommand(this._CommandAMModulate, buf);
  }

  parseFromJson(json) {
    for (var i=0; i<this.ModuleNum;i++) {
      var module = json["pwm"+i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        {uri : "/request/pwm/init",           onValid: this.init},
        {uri : "/request/pwm/freq",         onValid: this.freq},
        {uri : "/request/pwm/pulse",        onValid: this.pulse},
        {uri : "/request/pwm/duty",         onValid: this.duty},
        {uri : "/request/pwm/modulate",     onValid: this.amModulate},
        {uri : "/request/pwm/deinit",         onValid: this.deinit},
      ];
      let res = this.validateCommandSchema(schemaData, module, "pwm"+i, i);

      if(res.valid === 0){
        if(res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        }else{
          throw new WSCommandNotFoundError(`[pwm${i}]unknown command`);
        }
      }
    }
  }
}

module.exports = WSCommand_PWM;