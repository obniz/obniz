const ObnizUtil: any = require("../utils/util");

class ObnizMeasure {
  public obniz: any;
  public observers: any;
  public params: any;

  constructor(obniz: any) {
    this.obniz = obniz;
    this._reset();
  }

  public _reset() {
    this.observers = [];
  }

  public echo(params: any) {
    const err: any = ObnizUtil._requiredKeys(params, [
      "io_pulse",
      "pulse",
      "pulse_width",
      "io_echo",
      "measure_edges",
    ]);
    if (err) {
      throw new Error(
        "Measure start param '" + err + "' required, but not found ",
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      "io_pulse",
      "pulse",
      "pulse_width",
      "io_echo",
      "measure_edges",
      "timeout",
      "callback",
    ]);

    const echo: any = {};
    echo.io_pulse = this.params.io_pulse;
    echo.pulse = this.params.pulse;
    echo.pulse_width = this.params.pulse_width;
    echo.io_echo = this.params.io_echo;
    echo.measure_edges = this.params.measure_edges;
    if (typeof this.params.timeout === "number") {
      echo.timeout = this.params.timeout;
    }

    this.obniz.send({
      measure: {
        echo,
      },
    });

    if (this.params.callback) {
      this.observers.push(this.params.callback);
    }
  }

  public notified(obj: any) {
    const callback: any = this.observers.shift();
    if (callback) {
      callback(obj.echo);
    }
  }
}

module.exports = ObnizMeasure;
