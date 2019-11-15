class Grove_Button {
  constructor() {
    this.keys = ['signal', 'gnd', 'vcc'];
    this.requiredKeys = ['signal'];

    this.onChangeForStateWait = function() {};
  }

  static info() {
    return {
      name: 'Grove_Button',
    };
  }

  wired(obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
      this.io_vcc.output(true);
    }

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    this.io_signal.pull('5v');

    let self = this;
    this.io_signal.input(function(value) {
      self.isPressed = value;
      if (self.onchange) {
        self.onchange(value);
      }
      self.onChangeForStateWait(value);
    });
  }

  async isPressedWait() {
    let ret = await this.io_signal.inputWait();
    return ret;
  }

  stateWait(isPressed) {
    return new Promise((resolve, reject) => {
      this.onChangeForStateWait = pressed => {
        if (isPressed == pressed) {
          this.onChangeForStateWait = function() {};
          resolve();
        }
      };
    });
  }
}

if (typeof module === 'object') {
  module.exports = Grove_Button;
}
