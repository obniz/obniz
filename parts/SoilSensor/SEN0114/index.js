class SEN0114 {
  constructor() {
    this.keys = ['vcc', 'output', 'gnd'];
    this.requiredKeys = ['output'];
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.ad = obniz.getAD(this.params.output);

    this.ad.start(value => {
      this.value = value;
      if (this.onchange) {
        this.onchange(this.value);
      }
    });
  }

  async getHumidityWait() {
    this.value = await this.ad.getWait();
    return this.value;
  }
}

let Obniz = require('../../../obniz/index.js');
Obniz.PartsRegistrate('SEN0114', SEN0114);
