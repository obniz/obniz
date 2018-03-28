
class PeripheralPWM {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.state = {};
    this.used = false;
  }

  sendWS(obj) {
    var wsObj = {};
    wsObj["pwm"+this.id] = obj;
    this.Obniz.send(wsObj);
  }

  start(params) {
    const err = ObnizUtil._requiredKeys(params,["io"]);
    if(err){ throw new Error("pwm start param '" + err +"' required, but not found ");}
    this.params = ObnizUtil._keyFilter(params,["io", "drive", "pull"]);

    const io = this.params.io;
    const ioObj = this.Obniz.getIO(io);

    ioObj.drive(this.params.drive || '5v');
    ioObj.pull(this.params.pull || null);

    var obj = {};
    this.state.io = io;
    this.sendWS({
      io: io
    });
    this.used = true;
  }

  freq(freq) {
    var obj = {};
    this.state.freq = freq;
    this.sendWS({
      freq: freq
    });
  }

  pulse(pulse_width) {
    var obj = {};
    this.state.pulse = pulse_width;
    this.sendWS({
      pulse: pulse_width
    });
  }

  duty(duty) {
    var obj = {};
    this.state.duty = duty;
    this.sendWS({
      duty: duty
    });
  }

  isUsed() {
    return this.used;
  }

  end() {
    var obj = {};
    this.state = {};
    this.sendWS(null);
    this.used = false;
  }

  modulate(type, symbol_length, data) {
    var obj = {};
    this.sendWS({
      modulate: {
        type: type,
        symbol_length: symbol_length,
        data: data
      }
    });
  }
}