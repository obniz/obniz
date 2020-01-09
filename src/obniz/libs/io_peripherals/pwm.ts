import ObnizUtil from "../utils/util";

class PeripheralPWM {
  public Obniz: any;
  public id: any;
  public state: any;
  public used: any;
  public params: any;

  constructor(Obniz: any, id: any) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  public _reset() {
    this.state = {};
    this.used = false;
  }

  public sendWS(obj: any) {
    const wsObj: any = {};
    wsObj["pwm" + this.id] = obj;
    this.Obniz.send(wsObj);
  }

  public start(params: any) {
    const err: any = ObnizUtil._requiredKeys(params, ["io"]);
    if (err) {
      throw new Error("pwm start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, ["io", "drive", "pull"]);

    const io: any = this.params.io;
    const ioObj: any = this.Obniz.getIO(io);

    ioObj.drive(this.params.drive || "5v");
    ioObj.pull(this.params.pull || null);

    this.state = {
      io,
      freq: 1000,
    };
    this.sendWS({
      io,
    });
    this.used = true;
  }

  public freq(freq: any) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    freq *= 1;
    if (typeof freq !== "number") {
      throw new Error("please provide freq in number");
    }
    this.state.freq = freq;
    this.sendWS({
      freq,
    });
    if (typeof this.state.duty === "number") {
      this.duty(this.state.duty);
    }
  }

  public pulse(pulse_width: any) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }

    this.state.pulse = pulse_width;
    delete this.state.duty;
    this.sendWS({
      pulse: pulse_width,
    });
  }

  public duty(duty: any) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    duty *= 1;
    if (typeof this.state.freq !== "number" || this.state.freq <= 0) {
      throw new Error("please provide freq first.");
    }
    if (typeof duty !== "number") {
      throw new Error("please provide duty in number");
    }
    if (duty < 0) {
      duty = 0;
    }
    if (duty > 100) {
      duty = 100;
    }
    const pulse_width: any = (1.0 / this.state.freq) * 1000 * duty * 0.01;
    this.state.duty = duty;
    this.sendWS({
      pulse: pulse_width,
    });
  }

  public isUsed() {
    return this.used;
  }

  public end() {
    this.state = {};
    this.sendWS(null);
    this.used = false;
  }

  public modulate(type: any, symbol_length: any, data: any) {
    if (!this.used) {
      throw new Error(`pwm${this.id} is not started`);
    }
    this.sendWS({
      modulate: {
        type,
        symbol_length,
        data,
      },
    });
  }
}

export default PeripheralPWM;
