var ADT7410 = function() {
  this.keys = [ "vcc", "gnd", "sda", "scl", "addressMode"];
  this.requiredKey = ["addressMode"];
};

ADT7410.prototype.wired = function(obniz) {
  this.obniz = obniz;
  obniz.setVccGnd(this.params.vcc,this.params.gnd, "5v");
  
  if (this.params.addressMode === 8){
    this.address = 0x48;
  }else if(this.params.addressMode === 9){
    this.address = 0x49;
  }

  this.params.clock = 400000;
  this.params.pull = "5v";
  this.params.mode = "master";
 
  this.i2c = obniz.getI2CWithConfig(this.params);

};

  ADT7410.prototype.getTempWait = async function() {
    var ret = await this.i2c.readWait(this.address, 2);
    var tempBin = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if(tempBin & (0x1000)) { //0度以下の時の処理
      tempBin = tempBin  - 8192;
    }

    return (tempBin/16);
  };

let Obniz = require("../../../../obniz/index.js");
Obniz.PartsRegistrate("ADT7410", ADT7410);