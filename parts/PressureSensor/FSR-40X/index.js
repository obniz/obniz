//Todo: add weight and calc pressure(kg)

class FSR40X {
  constructor() {
    this.keys = ['pin0', 'pin1'];
    this.requiredKeys = ['pin0', 'pin1'];
  }

  static info() {
    return {
      name: 'FSR40X',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.pin0);
    this.ad = obniz.getAD(this.params.pin1);

    this.io_pwr.drive('5v');
    this.io_pwr.output(true);

    let self = this;
    this.ad.start(function(value) {
      let pressure = value * 100;
      self.press = pressure;
      if (self.onchange) {
        self.onchange(self.press);
      }
    });
  }

  async getWait() {
    let value = await this.ad.getWait();
    let pressure = value * 100;
    this.press = pressure;
    return this.press;
  }
}

if (typeof module === 'object') {
  module.exports = FSR40X;
}
