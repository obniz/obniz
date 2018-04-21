
class ENC03R_Module {

  constructor() {
    this.keys = ["vcc", "out1", "out2", "gnd"];
    this.required = ["out1", "out2"];
    this.Sens = 0.00067; //Sensitivity, 0.67mV / deg/sec
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc,this.params.gnd, "5v");
    this.ad0 = obniz.getAD(this.params.out1);
    this.ad1 = obniz.getAD(this.params.out2);
  
    this.ad0.start((value) => {
      this.sens1 = (value - 1.45) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange1) {
        this.onchange1(this.sens1);
      }
    });
  
    this.ad1.start((value) => {
      this.sens2 = (value - 1.35) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange2) {
        this.onchange2(this.sens2);
      }
    });
  }
}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("ENC03R_Module", ENC03R_Module);