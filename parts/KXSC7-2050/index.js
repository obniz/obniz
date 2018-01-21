var KXSC7_2050 = function() {
  
};


KXSC7_2050.prototype.wired = async function(obniz, pwr, sig_x, sig_y, sig_z, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad_x = obniz.getAD(sig_x);
  this.ad_y = obniz.getAD(sig_y);
  this.ad_z = obniz.getAD(sig_z);
  
  this.io_pwr.input();
  this.io_pwr.outputType("push-pull3v");
  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }
  

  await obniz.wait(500);
  var ad = obniz.getAD(pwr);
  var pwrVoltage = await ad.getWait();
  console.log(pwrVoltage);
  var horizontalZ = await this.ad_z.getWait();
  console.log(horizontalZ);
  var sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
  var offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)
      
  var self = this;
  this.ad_x.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangeX) {
      self.onchangeX(self.gravity);
    }
  });
  
  this.ad_y.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangeY) {
      self.onchangeY(self.gravity);
    }
  });
  
  this.ad_z.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangeZ) {
      self.onchangeZ(self.gravity);
    }
  });
  
};

// Module functions
KXSC7_2050.prototype.onChangeX = function(callback) {
  this.onchangeX = callback;
};

KXSC7_2050.prototype.onChangeY = function(callback) {
  this.onchangeY = callback;
};

KXSC7_2050.prototype.onChangeZ = function(callback) {
  this.onchangeZ = callback;
};


if (PartsRegistrate) {
  PartsRegistrate("KXSC7_2050", KXSC7_2050);
}