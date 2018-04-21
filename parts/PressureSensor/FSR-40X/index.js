//Todo:抵抗を追加して圧力(kg)を求められるように改造する

class FSR40X {
  constructor() {
    this.keys = ["pin0", "pin1"];
    this.requiredKeys = ["pin0", "pin1"];
  };

  wired(obniz) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.pin0);
    this.ad = obniz.getAD(this.params.pin1);

    this.io_pwr.drive("5v");
    this.io_pwr.output(true);

    var self = this;
    this.ad.start(function(value){
      var pressure = value * 100;
      self.press = pressure;
      if (self.onchange) {
        self.onchange(self.press);
      }
    });
  };

}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("FSR40X", FSR40X);
