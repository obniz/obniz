class Potentiometer {
  constructor() {
    this.keys = ['pin0', 'pin1', 'pin2'];
    this.requiredKeys = ['pin0', 'pin1', 'pin2'];

    this.vcc_voltage = 5.0;
  }

  static info() {
    return {
      name: 'Potentiometer',
    };
  }

  wired(obniz) {
    this.obniz.setVccGnd(this.params.pin0, this.params.pin2, '5v');
    this.ad = obniz.getAD(this.params.pin1);

    let self = this;

    obniz.getAD(this.params.pin0).start(function(value) {
      self.vcc_voltage = value;
    });

    this.ad.start(function(value) {
      self.position = value / self.vcc_voltage;
      if (self.onchange) {
        self.onchange(self.position);
      }
    });
  }
}

if (typeof module === 'object') {
  module.exports = Potentiometer;
}
