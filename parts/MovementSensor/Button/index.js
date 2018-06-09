class Button {
  constructor() {
    this.keys = ['signal', 'gnd'];
    this.required = ['signal'];
  }

  static info() {
    return {
      name: 'Button',
    };
  }

  wired(obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    // start input
    this.io_signal.pull('5v');

    let self = this;
    this.io_signal.input(function(value) {
      self.isPressed = value === false;
      if (self.onchange) {
        self.onchange(value === false);
      }
    });
  }

  async isPressedWait() {
    let ret = await this.io_signal.inputWait();
    return ret === false;
  }
}

if (typeof window === 'undefined') {
  module.exports = Button;
}
