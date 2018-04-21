class SEN0114 {
  constructor() {
    this.keys = ["vcc", "output", "gnd"];
    this.requiredKeys = [ "output" ];
  };

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad = obniz.getAD(this.params.output);

    var self = this;
    this.ad.start(function(value){
      self.temp = value; //Temp(Celsius) = [AD Voltage] * 100
      if (self.onchange) {
        self.onchange(self.temp);
      }
    });
  };

  async getHumidityWait() {
    return await this.ad.getWait();
  };
}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("SEN0114", SEN0114);
