class AE_MICAMP {
  constructor() {
    this.keys = ['vcc', 'gnd', 'out'];
    this.requiredKeys = ['out'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      out: 'out',
    };
  }

  static info() {
    return {
      name: 'AE_MICAMP',
    };
  }

  async wired(obniz) {
    this.obniz = obniz;

    this.ad = obniz.getAD(this.params.out);

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    let self = this;
    this.ad.start(function(value) {
      self.voltage = value;
      if (self.onchange) {
        self.onchange(self.voltage);
      }
    });
  }
}

if (typeof window === 'undefined') {
  module.exports = AE_MICAMP;
}

/*
  var self = this;
  var analogin = [];
  var cnt = 0;
  while(true){
    var sum = 0;
    if (cnt == 10) {
      cnt = 0;
    }
    analogin[cnt] = this.ad.value;
    cnt++;
    for (var i = 0; i < 10; i++) {
      if (typeof(analogin[i])=="number") {sum += analogin[i];}
    }
    var average = sum / 10;
    //console.log('average='+average);
    await obniz.wait(1);
  }
  self.voltage_ave = average;
  if (self.average) {
    self.average(self.voltage_ave);
  }
  */

/*
AE_MICAMP.prototype.Average = function(callback) {
  this.average = callback;
};
*/
