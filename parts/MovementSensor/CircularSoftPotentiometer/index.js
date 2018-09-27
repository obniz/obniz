class CircularSoftPot {
  constructor() {
    this.keys = ['outer', 'middle'];
    this.requiredKeys = ['outer', 'middle'];
  }

  static info() {
    return {
      name: 'CircularSoftPot',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.outer);
    this.ad = obniz.getAD(this.params.middle);

    this.io_pwr.drive('5v');
    this.io_pwr.output(true);

    let self = this;

    this.ad.start(function(value) {
      let pressure = value;
      self.press = pressure;
      if (self.onchange) {
        self.onchange(self.press);
      }
    });
  }
}

if (typeof module === 'object') {
  module.exports = CircularSoftPot;
}
