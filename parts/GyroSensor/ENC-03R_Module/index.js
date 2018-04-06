var ENC03R_Module = function() {

  this.keys = ["vcc", "out1", "out2", "gnd"];
  this.required = ["out1", "out2"];
  this.Sens = 0.00067; //Sensitivity, 0.67mV / deg/sec
};


ENC03R_Module.prototype.wired = function(obniz) {
  this.obniz = obniz;
  obniz.setVccGnd(this.params.vcc,this.params.gnd, "5v");
  this.ad0 = obniz.getAD(this.params.out1);
  this.ad1 = obniz.getAD(this.params.out2);

  this.io_pwr.output(true);


  var self = this;
  this.ad0.start(function(value){
    self.sens1 = (value - 1.45) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
    //console.log('raw='+value);
    if (self.onchange1) {
      self.onchange1(self.sens1);
    }
  });

  this.ad1.start(function(value){
    self.sens2 = (value - 1.35) / this.Sens; //[Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
    if (self.onchange2) {
      self.onchange2(self.sens2);
    }
  });

};

ENC03R_Module.prototype.onChangeSens1 = function(callback) {
  this.onchange1 = callback;
};
ENC03R_Module.prototype.onChangeSens2 = function(callback) {
  this.onchange2 = callback;
};

ENC03R_Module.prototype.getValueSens1 = async function() {
  return (this.ad0.value - 1.47) / Sens;
};

ENC03R_Module.prototype.getValueSens2 = async function() {
  return (this.ad1.value - 1.35) / Sens;
};

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("ENC03R_Module", ENC03R_Module);