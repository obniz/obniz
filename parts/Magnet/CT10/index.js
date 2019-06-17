class CT10 {
  constructor() {
    this.keys = ['signal', 'gnd', 'vcc'];
    this.requiredKeys = ['signal', 'vcc'];

    this.onChangeForStateWait = function() {};
  }

  static info() {
    return {
      name: 'CT10',
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

    this.io_signal.pull('0v');

    let self = this;
    this.io_signal.input(function(value) {
      self.isNear = value;
      if (self.onchange) {
        self.onchange(value);
      }
      self.onChangeForStateWait(value);
    });
  }

  async isNearWait() {
    let ret = await this.io_signal.inputWait();
    return ret;
  }

  stateWait(isNear) {
    return new Promise((resolve, reject) => {
      this.onChangeForStateWait = near => {
        if (isNear == near) {
          this.onChangeForStateWait = function() {};
          resolve();
        }
      };
    });
  }
}

if (typeof module === 'object') {
  module.exports = CT10;
}
