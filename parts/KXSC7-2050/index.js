var KXSC7_2050 = function() {
  this.keys = [ "x", "y", "z", "vcc", "gnd"];
  this.requiredKeys = [ "x", "y", "z"];
};


KXSC7_2050.prototype.wired = async function(obniz) {
  this.obniz = obniz;
  
  obniz.setVccGnd(this.params.vcc,this.params.gnd, "3v");
  this.ad_x = obniz.getAD(this.params.x);
  this.ad_y = obniz.getAD(this.params.y);
  this.ad_z = obniz.getAD(this.params.z);
  
  await obniz.wait(500);
  var ad = obniz.getAD(this.params.vcc);
  var pwrVoltage = await ad.getWait();
  var horizontalZ = await this.ad_z.getWait();
  var sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
  var offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)
      
  var self = this;
  this.ad_x.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangex) {
      self.onchangex(self.gravity);
    }
  });
  
  this.ad_y.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangey) {
      self.onchangey(self.gravity);
    }
  });
  
  this.ad_z.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangez) {
      self.onchangez(self.gravity);
    }
  });
  
};


if (PartsRegistrate) {
  PartsRegistrate("KXSC7_2050", KXSC7_2050);
}