class JoyStick {
  constructor() {
    this.keys = ['sw', 'y', 'x', 'vcc', 'gnd', 'i2c'];
    this.requiredKeys = ['sw', 'y', 'x'];
    this.pins = this.keys || ['sw', 'y', 'x', 'vcc', 'gnd'];
    this.pinname = { sw: 'sw12' };
    this.shortName = 'joyS';
  }

  static info() {
    return {
      name: 'JoyStick',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_sig_sw = obniz.getIO(this.params.sw);
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);

    this.io_sig_sw.pull('5v');

    let self = this;
    this.ad_x.start(function(value) {
      self.positionX = value / 5.0;
      if (self.onchangex) {
        self.onchangex(self.positionX * 2 - 1);
      }
    });

    this.ad_y.start(function(value) {
      self.positionY = value / 5.0;
      if (self.onchangey) {
        self.onchangey(self.positionY * 2 - 1);
      }
    });

    this.io_sig_sw.input(function(value) {
      self.isPressed = value === false;
      if (self.onchangesw) {
        self.onchangesw(value === false);
      }
    });
  }

  async isPressedWait() {
    let ret = await this.io_sig_sw.inputWait();
    return ret === false;
  }

  async getXWait() {
    let value = await this.ad_x.getWait();
    this.positionX = value / 5.0;
    return this.positionX * 2 - 1;
  }

  async getYWait() {
    let value = await this.ad_y.getWait();
    this.positionY = value / 5.0;
    return this.positionY * 2 - 1;
  }
}

if (typeof module === 'object') {
  module.exports = JoyStick;
}
