class LM60 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'output'];
    this.requiredKeys = ['output'];
  }

  static info() {
    return {
      name: 'LM60',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.ad = obniz.getAD(this.params.output);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    let self = this;
    this.ad.start(function(value) {
      self.temp = Math.round(((value - 0.424) / 0.00625) * 10) / 10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
      if (self.onchange) {
        self.onchange(self.temp);
      }
    });
  }
}

if (typeof module === 'object') {
  module.exports = LM60;
}
