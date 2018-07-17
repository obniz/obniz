const ObnizUtil = require('../utils/util');

class PeripheralPWM {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.state = {};
    this.used = false;
  }

  sendWS(obj) {
    let wsObj = {};
    wsObj['pwm' + this.id] = obj;
    this.Obniz.send(wsObj);
  }

  start(params) {
    const err = ObnizUtil._requiredKeys(params, ['io']);
    if (err) {
      throw new Error("pwm start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ['io', 'drive', 'pull']);

    const io = this.params.io;
    const ioObj = this.Obniz.getIO(io);

    ioObj.drive(this.params.drive || '5v');
    ioObj.pull(this.params.pull || null);

    this.state = {
      io: io,
      freq: 1000,
    };
    this.sendWS({
      io: io,
    });
    this.used = true;
  }

  freq(freq) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    freq *= 1;
    if (typeof freq !== 'number') {
      throw new Error('please provide freq in number');
    }
    this.state.freq = freq;
    this.sendWS({
      freq: freq,
    });
    if (typeof this.state.duty === 'number') {
      this.duty(this.state.duty);
    }
  }

  pulse(pulse_width) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }

    this.state.pulse = pulse_width;
    delete this.state.duty;
    this.sendWS({
      pulse: pulse_width,
    });
  }

  duty(duty) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    duty *= 1;
    if (typeof this.state.freq !== 'number' || this.state.freq <= 0) {
      throw new Error('please provide freq first.');
    }
    if (typeof duty !== 'number') {
      throw new Error('please provide duty in number');
    }
    if (duty < 0) {
      duty = 0;
    }
    if (duty > 100) {
      duty = 100;
    }
    const pulse_width = (1.0 / this.state.freq) * 1000 * duty * 0.01;
    this.state.duty = duty;
    this.sendWS({
      pulse: pulse_width,
    });
  }

  isUsed() {
    return this.used;
  }

  end() {
    this.state = {};
    this.sendWS(null);
    this.used = false;
  }

  modulate(type, symbol_length, data) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    this.sendWS({
      modulate: {
        type: type,
        symbol_length: symbol_length,
        data: data,
      },
    });
  }
}
module.exports = PeripheralPWM;
