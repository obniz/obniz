class Solenoid {
  constructor() {
    this.keys = ['gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'Solenoid',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_gnd = obniz.getIO(this.params.gnd);
      this.io_gnd.output(false);
    }

    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.output(false);
  }

  on() {
    this.io_signal.output(true);
  }

  off() {
    this.io_signal.output(false);
  }

  click(time_msec) {
    this.on();
    if (typeof time_msec !== 'number') {
      time_msec = 100;
    }
    this.obniz.wait(time_msec);
    this.off();
  }

  doubleClick(time_msec) {
    if (typeof time_msec !== 'number') {
      time_msec = 100;
    }
    this.click(time_msec);
    this.obniz.wait(time_msec);
    this.click(time_msec);
  }
}

if (typeof module === 'object') {
  module.exports = Solenoid;
}
