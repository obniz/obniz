var JoyStick = function() {
    this.keys = ["sw", "y", "x", "vcc", "gnd","i2c"];
    this.requiredKeys = ["sw", "y", "x"];
    this.pins  =  this.keys || ["sw", "y", "x", "vcc", "gnd"];
    this.pinname = { "sw": "sw12" };
    this.shortName = "joyS";
};

JoyStick.prototype.wired = function(obniz) {
  this.obniz = obniz;
  
  obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  
  this.io_sig_sw = obniz.getIO(this.params.sw);
  this.ad_x = obniz.getAD(this.params.x);
  this.ad_y = obniz.getAD(this.params.y);
  
  this.io_sig_sw.pull("5v");
  
      
  var self = this;
  this.ad_x.start(function(value){
    self.positionX = value/ 5.0;
    if (self.onchangex) {
      self.onchangex(self.positionX * 2 - 1);
    }
  });
  
  this.ad_y.start(function(value){
    self.positionY = value/ 5.0;
    if (self.onchangey) {
      self.onchangey(self.positionY * 2 - 1);
    }
  });
  
  this.io_sig_sw.input(function(value) {
    self.isPressed = (value === false);
    if (self.onchangesw) {
      self.onchangesw(value === false);
    }
  });
};

JoyStick.prototype.isPressedWait = async function() {
  var ret = await this.io_sig_sw.inputWait();
  return ret === false;
};

  
  if (PartsRegistrate) {
  PartsRegistrate("JoyStick", JoyStick);
  }